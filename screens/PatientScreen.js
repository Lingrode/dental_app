import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Linking, StyleSheet, Alert, Platform } from 'react-native';
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
        color: '#2A86FF',
        ...Platform.select({
          ios: {
            fontSize: 22,
          }
        })
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
        <PatientFullName style={styles.patientFullName}>{fullname}</PatientFullName>
        <GrayText>{phoneFormat(phone)}</GrayText>

        <PatientButtons>
          <FormulaButtonView>
            <Button onPress={() => navigation.navigate("TeethChart", { teeth: teeth, appointments: appointments })}>Формула зубів</Button>
          </FormulaButtonView>
          <PhoneButtonView>
            <Button onPress={() => Linking.openURL('tel:' + phone)} color="#84D269">
              <FontAwesome name="phone" size={23} color="white" style={styles.buttonIcon} />
            </Button>
          </PhoneButtonView>
        </PatientButtons>
      </PatientDetails>

      <PatientAppointments>
        <Container>

          <Text style={styles.appointmentsTitle}>Прийоми</Text>

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
                      <Text style={styles.menuText}>Редагувати</Text>
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
                      <Text style={styles.menuText}>Видалити</Text>
                      <MaterialCommunityIcons name="delete" size={23} color="black" />
                    </MenuOption>
                  </MenuOptions>
                </Menu>

                <View style={styles.appointmentCardRow}>
                  <Ionicons name="medical" size={18} color="#A3A3A3" />
                  <Text style={styles.appointmentCardLabel}>
                    Зуб: <Text style={styles.appointmentCardText}>{appointment.toothNumber}</Text>
                  </Text>
                </View>

                <View style={styles.appointmentCardRow}>
                  <MaterialCommunityIcons name="clipboard-text" size={18} color="#A3A3A3" />
                  <Text style={styles.appointmentCardLabel}>
                    Діагноз: <Text style={styles.appointmentCardText}>{appointment.diagnosis}</Text>
                  </Text>
                </View>

                <View style={[styles.appointmentCardRow, { marginTop: 20, justifyContent: "space-between" }]}>
                  <Badge style={{ width: 195 }} active>{appointment.date} - {appointment.time}</Badge>
                  <Badge style={{ width: 92 }} color="green">{appointment.price} ₴</Badge>
                </View>
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
    top: 5,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        right: -17,
      }
    })
  },
  menuText: {
    fontFamily: 'SFUIText-Regular',
    paddingTop: 6,
    paddingBottom: 6,
    ...Platform.select({
      ios: {
        fontSize: 13,
      },
      android: {
        fontSize: 16,
      }
    })
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
  patientFullName: {
    ...Platform.select({
      ios: {
        fontSize: 26,
        marginBottom: 5
      }
    })
  },
  buttonIcon: {
    ...Platform.select({
      ios: {
        lineHeight: 48,
        width: 20
      },
      android: {
        lineHeight: 40,
        width: 23
      }
    })
  },
  appointmentsTitle: {
    fontFamily: 'SFUIText-Bold',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        fontSize: 20,
      },
      android: {
        fontSize: 24,
      }
    })
  },
  appointmentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: 6,
        marginBottom: 6
      },
      android: {
        marginTop: 7.5,
        marginBottom: 7.5
      }
    })
  },
  appointmentCardLabel: {
    fontFamily: 'SFUIText-Regular',
    marginLeft: 14.5,
    lineHeight: 21,
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 18,
      }
    })
  },
  appointmentCardText: {
    fontFamily: 'SFUIText-Bold',
    ...Platform.select({
      ios: {
        fontSize: 14,
      }
    })
  }
});

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