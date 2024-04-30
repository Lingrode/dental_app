import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Alert, Animated, View, Platform, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import _ from "lodash";
import axios, * as others from 'axios';
import Swipeable from 'react-native-swipeable-row';
import moment from "moment";

import { Appointment, SectionTitle, PlusButton } from "../components";
import { appointmentsApi } from "../utils/api";

function HomeScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      header: () =>
      (
        <View style={styles.header}>
          <View>
            <Text style={[{ color: '#2A86FF' }, styles.headerText]}>Журнал прийомів</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Patients')}>
            <MaterialCommunityIcons name="account-supervisor" size={32} color="#2A86FF" />
          </TouchableOpacity>
        </View>

      ),
    });
  }, [navigation])

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearestAppointment, setNearestAppointment] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: 'clamp'
  });

  const fetchAppointments = () => {
    setIsLoading(true);
    appointmentsApi
      .get()
      .then(({ data }) => {
        let appointments = data.data;
        appointments.sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate))

        appointments.forEach(section => {
          section.data.sort((a, b) => {
            const timeA = moment(a.time, 'HH:mm');
            const timeB = moment(b.time, 'HH:mm');
            return timeA - timeB;
          });
        });

        setNearestAppointment(appointments[0].data[0]);

        setData(appointments);
      }).finally(e => {
        setIsLoading(false);
      });
  };

  useEffect(fetchAppointments, []);

  useEffect(fetchAppointments, [route.params]);

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
              fetchAppointments();
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
    <Container>
      {data && (
        <Animated.SectionList
          sections={data}
          keyExtractor={item => item._id}
          onRefresh={fetchAppointments}
          refreshing={isLoading}
          renderItem={({ item }) => {

            const rightButtons = [
              <SwipeViewButton
                onPress={() => navigation.navigate('EditAppointment', { appointment: item })}
                style={{ backgroundColor: '#B4C1CB' }}>
                <MaterialCommunityIcons style={{ position: 'relative', left: 30 }} name="pencil" size={32} color="white" />
              </SwipeViewButton>,
              <SwipeViewButton onPress={removeAppointment.bind(this, item._id)} style={{ backgroundColor: '#F85A5A', height: '100%' }}>
                <MaterialCommunityIcons style={{ position: 'relative', left: 30 }} name="close" size={32} color="white" />
              </SwipeViewButton>
            ];

            return (
              <Swipeable
                style={{ display: 'flex' }}
                rightButtons={rightButtons}
                rightButtonWidth={90}
                rightActionActivationDistance={110}
              >

                <Appointment
                  active={item._id === nearestAppointment._id}
                  onPress={() => navigation.navigate("Patient", {
                    patient: item.patient,
                  })} item={item}
                />
              </Swipeable>
            );
          }
          }
          renderSectionHeader={({ section: { title } }) => (
            <SectionTitle>{title}</SectionTitle>
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <PlusButton onPress={() => navigation.navigate("AddPatient")} />
      </Animated.View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 2,
    ...Platform.select({
      ios: {
        height: 120,
      },
      android: {
        height: 110,
      }
    })
  },
  headerText: {
    fontFamily: 'SFUIText-Heavy',
    color: '#2A86FF',
    marginLeft: 25,
    ...Platform.select({
      ios: {
        fontSize: 24,
        marginTop: 65
      },
      android: {
        fontSize: 32,
        marginTop: 45
      }
    })
  },
  headerIcon: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        right: 30,
        top: 66
      },
      android: {
        right: 30,
        top: 52,
      }
    })
  },
});

const SwipeViewButton = styled.TouchableHighlight`
  justify-content: center;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default HomeScreen;