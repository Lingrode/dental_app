import React, { useEffect, useState, useRef } from "react";
import { Alert, TextInput, View, Keyboard, Animated, ScrollView, RefreshControl } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
// import axios from 'axios;'
import axios, * as others from 'axios';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Appointment, SectionTitle, PlusButton } from "../components";
import { phoneFormat, patientsApi } from "../utils";


function PatientsScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Пацієнти',
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
      },
      headerTitleContainerStyle: {
        paddingVertical: 10
      },
      headerShadowVisible: false,
    });
  }, [navigation])

  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPatients().then(() => setRefreshing(false));
  }, []);

  const swipeListViewRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const inputRef = useRef();

  const fetchPatients = () => {
    setIsLoading(true);
    return patientsApi
      .get()
      .then(({ data }) => {
        let appointments = data.data;
        appointments.sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));
        swipeListViewRef.current?.closeAllOpenRows();
        setData(appointments);
      }).finally(e => {
        setIsLoading(false);
      });
  };
  useEffect(fetchPatients, []);
  useEffect(fetchPatients, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPatients);

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchPatients();
  }, [patientData]);

  const updatePatientData = (newData) => {
    setPatientData(newData);
  };



  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidHide = () => {
    inputRef.current.blur();
  };

  const onSearch = e => {
    setSearchValue(e.nativeEvent.text);
  };

  // const handleRef = (ref, index) => {
  //   swipeableRefs.current[index] = ref;
  // };

  // const handleSwipe = (isOpen, currentIndex) => {
  //   if (isOpen) {
  //     swipeableRefs.current.forEach((ref, index) => {
  //       if (index !== currentIndex && ref) {
  //         ref.close();
  //       }
  //     });
  //   }
  // };

  // const onRowDidOpen = (rowKey, rowMap) => {
  //   if (openRow && openRow !== rowKey) {
  //     rowMap[openRow]?.closeRow();
  //   }
  //   setOpenRow(rowKey);
  // };

  const removePatient = id => {
    Alert.alert(
      'Видалення пацієнта',
      'Ви дійсно хочете видалити пацієнта?',
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
            patientsApi.remove(id).then(() => {
              fetchPatients();
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
        <>
          <View style={{ marginLeft: 25, marginRight: 25, marginTop: 15, marginBottom: 20 }}>
            <InputWrapper>
              <TextInput onChange={onSearch} ref={inputRef} placeholder="Пошук пацієнта" style={{ fontSize: 20, color: '#000', fontFamily: 'SFUIText-Regular' }}></TextInput>
            </InputWrapper>
          </View>

          <SwipeListView
            rightOpenValue={-180}
            closeOnScroll={true}
            closeOnRowPress={true}
            // closeOnRowBeginSwipe={true}
            disableRightSwipe={true}
            keyExtractor={item => item._id}
            ref={swipeListViewRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={data.filter(
              item =>
                item.fullname
                  .toLowerCase()
                  .indexOf(searchValue.toLowerCase()) >= 0
            )}
            renderItem={({ item }) => (
              <Appointment onPress={() => navigation.navigate("Patient", {
                patient: item,
              })} item={{
                patient: item,
                diagnosis: phoneFormat(item.phone)
              }} />
            )}
            renderHiddenItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <SwipeViewButton
                  onPress={() => {
                    navigation.navigate('EditPatient', { patient: item });
                    console.log(item);
                  }}
                  style={{ backgroundColor: '#B4C1CB', width: 90, height: '100%' }}>
                  <MaterialCommunityIcons style={{ position: 'relative', left: 30 }} name="pencil" size={32} color="white" />
                </SwipeViewButton>
                <SwipeViewButton
                  onPress={removePatient.bind(this, item._id)}
                  style={{ backgroundColor: '#F85A5A', height: '100%', width: 90 }}>
                  <MaterialCommunityIcons style={{ position: 'relative', left: 30 }} name="close" size={32} color="white" />
                </SwipeViewButton>
              </View>
            )}
          />
        </>
      )}
      {isButtonVisible && (
        <Animated.View style={{ opacity: buttonOpacity }}>
          <PlusButton onPress={() => navigation.navigate("AddPatient")} />
        </Animated.View>
      )}
    </Container>
  );
}

const InputWrapper = styled.View`
  padding: 10px 25px;
  border-width: 1px;
  border-color: #f0f0f0;
  border-radius: 50px;
`;

const SwipeViewButton = styled.TouchableHighlight`
  justify-content: center;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default PatientsScreen;