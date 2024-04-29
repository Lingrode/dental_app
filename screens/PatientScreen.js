import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Linking, StyleSheet, Alert, Animated } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import moment from 'moment-timezone';

import { GrayText, Button, Badge, PlusButton } from "../components";

import { patientsApi, appointmentsApi, phoneFormat } from "../utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function PatientScreen({ route, navigation }) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Карта пацієнта',
      headerTintColor: "#2A86FF",
      headerTitleStyle: {
        fontFamily: 'SFUIText-Bold',
        fontSize: 24,
        letterSpacing: 10,
        color: '#2A86FF',
      },
      headerStyle: {
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 50,
        elevation: 0.8
      },
      headerShadowVisible: false,
    });
  }, [navigation])

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teeth, setTeeth] = useState({});

  useEffect(() => {
    const id = route.params.patient._id
    patientsApi.show(id).then(({ data }) => {
      setAppointments(data.data.appointments);

      const newTeeth = {};
      data.data.appointments.forEach(appointment => {
        const appointmentTime = moment.tz(appointment.date + 'T' + appointment.time, 'Europe/Kiev');
        const currentTime = moment.tz('Europe/Kiev');
        if (appointmentTime.isBefore(currentTime)) {
          newTeeth[appointment.toothNumber] = 'green';
        }
      });

      console.log(newTeeth)
      setTeeth(newTeeth);

      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [])

  const { _id, fullname, phone } = route.params.patient;

  const Divider = () => <View style={styles.divider} />;

  const removeAppointment = id => {
    Alert.alert(
      'Видалення прийому',
      'Ви дійсно хочете видалити прийом?',
      [
        {
          text: 'Відміна',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Видалити',
          onPress: () => {
            setIsLoading(true);
            appointmentsApi.remove(id).then(() => {
              const id = route.params.patient._id
              patientsApi.show(id).then(({ data }) => {
                setAppointments(data.data.appointments);
                setIsLoading(false);
              }).catch(() => {
                setIsLoading(false);
              });
            }).catch(() => {
              setIsLoading(false);
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <MenuProvider style={{ flex: 1, backgroundColor: '#F8FAFD', }}>


      <PatientDetails>
        <PatientFullName>{fullname}</PatientFullName>
        <GrayText>{phoneFormat(phone)}</GrayText>

        <PatientButtons>
          <FormulaButtonView>
            <Button onPress={() => navigation.navigate("TeethChart", { teeth: teeth, appointments: appointments })}>Формула зубів</Button>
          </FormulaButtonView>
          <PhoneButtonView>
            <Button onPress={() => Linking.openURL('tel:' + phone)} color="#84D269">
              <FontAwesome name="phone" size={23} color="white" style={{ lineHeight: 60 }} />
            </Button>
          </PhoneButtonView>
        </PatientButtons>
      </PatientDetails>

      <PatientAppointments>
        <Container>

          <AppointmentsTitle>Прийоми</AppointmentsTitle>

          <GestureHandlerRootView>

            {isLoading ? <ActivityIndicator size={"large"} color='#2A86FF' /> : appointments.map(appointment =>
              <AppointmentCard key={appointment._id} style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.4,
                elevation: 2,
                borderRadius: 10
              }}>

                <Menu>
                  <MenuTrigger
                    style={styles.moreButton}
                  >
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="#A3A3A3" />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: {
                        borderRadius: 10,
                        marginTop: -90,
                        marginLeft: 130
                      },
                    }}
                  >
                    <MenuOption
                      onSelect={() => navigation.navigate('EditAppointment', { appointment: appointment })}
                      customStyles={{
                        optionWrapper: {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      }}
                    >
                      <Text style={{ fontFamily: 'SFUIText-Regular', fontSize: 16, paddingTop: 6, paddingBottom: 6 }}>Редагувати</Text>
                      <FontAwesome name="edit" size={24} color="black" />
                    </MenuOption>
                    <Divider />
                    <MenuOption
                      onSelect={() => removeAppointment(appointment._id)}
                      customStyles={{
                        optionWrapper: {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      }}
                    >
                      <Text style={{ fontFamily: 'SFUIText-Regular', fontSize: 16, paddingTop: 6, paddingBottom: 6 }}>Видалити</Text>
                      <MaterialCommunityIcons name="delete" size={23} color="black" />
                    </MenuOption>
                  </MenuOptions>
                </Menu>

                <AppointmentCardRow>
                  <Ionicons name="medical" size={18} color="#A3A3A3" />
                  <AppointmentCardLabel>
                    Зуб: <Text style={{ fontFamily: "SFUIText-Bold" }}>{appointment.toothNumber}</Text>
                  </AppointmentCardLabel>
                </AppointmentCardRow>

                <AppointmentCardRow>
                  <MaterialCommunityIcons name="clipboard-text" size={18} color="#A3A3A3" />
                  <AppointmentCardLabel>
                    Діагноз: <Text style={{ fontFamily: "SFUIText-Bold" }}>{appointment.diagnosis}</Text>
                  </AppointmentCardLabel>
                </AppointmentCardRow>
                <AppointmentCardRow style={{ marginTop: 20, justifyContent: "space-between" }}>
                  <Badge style={{ width: 195 }} active>{appointment.date} - {appointment.time}</Badge>
                  <Badge style={{ width: 92 }} color="green">{appointment.price} ₴</Badge>
                </AppointmentCardRow>
              </AppointmentCard>
            )}
          </GestureHandlerRootView>
        </Container>
      </PatientAppointments>
      <PlusButton onPress={() => navigation.navigate("AddAppointment", { patientId: _id })} />

    </MenuProvider>
  )
}

const styles = StyleSheet.create({
  menuOptions: {
    top: 50,
    left: 40,
  },
  moreButton: {
    position: 'absolute',
    right: -8,
    top: 5
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
});

const AppointmentsTitle = styled.Text`
  font-family: "SFUIText-Bold";
  font-size: 24px;
  margin-bottom: 20px;
`;

const AppointmentCardLabel = styled.Text`
  font-family: "SFUIText-Regular";
  font-size: 18px;
  line-height: 21px;
  margin-left: 14.5px;
`;

const AppointmentCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 7.5px;
  margin-bottom: 7.5px;
`;

const AppointmentCard = styled.View`
  padding: 12.5px 25px 10.5px;
  background-color: #fff;
  margin-bottom: 20px;
  `;

const Container = styled.View`
  background-color: #F8FAFD;
  border-radius: 10px;
`

const PatientDetails = styled.View`
  height: 220px;
  background-color: #fff;
  padding: 25px;
`;

const PatientAppointments = styled.View`
  background-color: #F8FAFD;
  padding: 0 25px;
  margin-top: 35px;
`;

const FormulaButtonView = styled.View`
  flex: 1;
`;

const PhoneButtonView = styled.View`
  margin-left: 15px;
  width: 50px;
`;

const PatientButtons = styled.View`
  flex: 1;
  flex-direction: row;
  margin-top: 25px;
`;

const PatientFullName = styled.Text`
  font-family: 'SFUIText-Heavy';
  font-size: 32px;
  line-height: 34px;
  margin-bottom: 7px;
  margin-top: 10px;
  z-index: 999;
`;

export default PatientScreen;