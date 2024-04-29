import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Alert, Animated, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import _ from "lodash";
import axios, * as others from 'axios';
import Swipeable from 'react-native-swipeable-row';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from "moment";

import { Appointment, SectionTitle, PlusButton } from "../components";
import { appointmentsApi } from "../utils/api";

function HomeScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      header: () =>
      (
        <Header>
          <View>
            <HeaderText style={{ color: '#2A86FF' }}>Журнал прийомів</HeaderText>
          </View>
          <TouchableOpacity style={{ marginRight: 10, position: 'absolute', right: 20, top: 52 }} onPress={() => navigation.navigate('Patients')}>
            <MaterialCommunityIcons name="account-supervisor" size={32} color="#2A86FF" />
          </TouchableOpacity>
        </Header>

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

        // Сортуємо прийоми за часом 
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

  // TODO: Продумати видалення прийомів
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

const HeaderText = styled.Text`
  font-family: 'SFUIText-Heavy';
  font-size: 32px;
  color: '#2A86FF';
  margin-top: 45px;
  margin-left: 25px
`;

const Header = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: #F3F3F3;
  height: 110px;
`;

const SwipeViewButton = styled.TouchableHighlight`
  justify-content: center;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default HomeScreen;