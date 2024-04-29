import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import styled from 'styled-components';

import { Select, Box, Center, NativeBaseProvider } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons';

import { appointmentsApi } from "../utils/api";

import { Button, Input } from "../components";
import { TouchableOpacity } from "react-native-gesture-handler";

function EditAppointmentScreen({ route, navigation }) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Редагувати прийом',
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

  const { appointment } = route.params;

  const [values, setValues] = useState({
    diagnosis: appointment.diagnosis || 'Пульпіт',
    toothNumber: appointment.toothNumber,
    price: appointment.price,
    date: appointment.date || null,
    time: appointment.time || null,
    appointment: route.params.appointment
  });

  const fieldsName = {
    toothNumber: 'Номер зуба',
    price: 'Ціна',
    diagnosis: 'Діагноз',
    date: 'Дата',
    time: 'Час',
  }

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleInputChange = (name, e) => {
    const text = e.nativeEvent.text;
    setFieldValue(name, text);
  };

  const onSubmit = () => {
    appointmentsApi
      .update(appointment._id, values)
      .then(() => {
        navigation.navigate('Home', { lastUpdate: new Date() });
      })
      .catch(e => {
        if (e.response && e.response.data) {
          console.log(e.response.data.data);
          e.response.data.data.forEach(err => {
            console.log(err);
            const fieldName = err.path;
            alert(`Помилка! Поле "${fieldsName[fieldName]}" вказано невірно!`);
          });
        }
        // alert('Bad')
      });
  };

  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showTimepicker, setShowTimepicker] = useState(false);
  const [date, setDate] = useState(new Date(appointment.date));
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const newDate = new Date(appointment.date);
    setDate(newDate);
  }, [appointment.date]);


  React.useEffect(() => {
    const timeParts = appointment.time.split(":");
    const newTime = new Date();
    newTime.setHours(timeParts[0], timeParts[1]);
    setTime(newTime);
  }, [appointment.time]);

  const toggleDatepicker = () => {
    setShowDatepicker(!showDatepicker);
  };

  const toggleTimepicker = () => {
    setShowTimepicker(!showTimepicker);
  };

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = formatDate(currentDate);
      setFieldValue('date', formattedDate);
      setShowDatepicker(false);
    } else {
      toggleDatepicker();
    }
  };

  const onChangeTime = ({ type }, selectedTime) => {
    if (type === 'set') {
      const currentTime = new Date(selectedTime);
      setTime(currentTime);
      const formattedTime = formatTime(currentTime)
      setFieldValue('time', formattedTime)
      setShowTimepicker(false);
    } else {
      toggleTimepicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfAppointment(formatDate(currentDate));
    toggleDatepicker();
  }

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const formatTime = (rawTime) => {
    let time = new Date(rawTime);

    let hours = time.getHours();
    let minutes = time.getMinutes();

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: 'center' }}>
        <Input
          name='toothNumber'
          placeholder={'Номер зуба'}
          onChange={handleInputChange.bind(this, 'toothNumber')}
          value={appointment.toothNumber.toString()}
          defaultValue={appointment.toothNumber}
          keyboardType='numeric'
        />

        <NativeBaseProvider>
          <Center flex={1} style={{ marginBottom: 20 }}>

            <Box width='100%'>
              <Select
                style={{}}
                maxWidth='360px'
                accessibilityLabel="Choose Service"
                placeholder="Оберіть діагноз"
                minWidth='container'
                borderColor='#F0F0F0'
                placeholderTextColor='#A0A2A4'
                fontSize='20px'
                borderLeftWidth='0'
                borderTopWidth='0'
                borderRightWidth='0'
                _selectedItem={{
                  bg: 'amber.100',
                }}
                mt={5}
                defaultValue={appointment.diagnosis}
                onValueChange={setFieldValue.bind(this, 'diagnosis')}>
                <Select.Item label="Пульпіт" value="Пульпіт" />
                <Select.Item label="Періодонтит" value="Періодонтит" />
                <Select.Item label="Пародонтит" value="Пародонтит" />
                <Select.Item label="Періостит" value="Періостит" />
                <Select.Item label="Флюороз" value="Флюороз" />
              </Select>
            </Box>

          </Center>
        </NativeBaseProvider>

        <Input
          name='phoneNumber'
          placeholder={'Ціна'}
          onChange={handleInputChange.bind(this, 'price')}
          value={values.price.toString()}
          defaultValue={appointment.price}
          keyboardType='numeric'
        />

        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 30 }}>
          <DateView>
            <LabelDate>Дата</LabelDate>

            {showDatepicker && (
              <DateTimePicker
                mode='date'
                display='spinner'
                value={date}
                textColor="#000"
                is24Hour={true}
                onChange={onChangeDate}
                style={{ fontWeight: 700 }}
              />
            )}

            {showDatepicker && Platform.OS === 'ios' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={toggleDatepicker}>
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={confirmIOSDate}>
                  <Text>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}

            {!showDatepicker && (
              <Pressable onPress={toggleDatepicker}>
                <TextInput
                  placeholder={'Sat Aug 21 2004'}
                  editable={false}
                  value={formatDate(date)}
                  onChangeText={setFieldValue.bind(this, 'date')}
                  style={{ fontSize: 20, color: '#000' }}
                />
              </Pressable>
            )}
          </DateView>

          <TimeView>
            <LabelDate>Час</LabelDate>

            {showTimepicker && (
              <DateTimePicker
                mode='time'
                display='spinner'
                value={time}
                is24Hour={true}
                onChange={onChangeTime}
              />
            )}

            {showTimepicker && Platform.OS === 'ios' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={toggleTimepicker}>
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={confirmIOSDate}>
                  <Text>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}

            {!showTimepicker && (
              <Pressable onPress={toggleTimepicker}>
                <TextInput
                  placeholder={'12:00'}
                  editable={false}
                  value={formatTime(time)}
                  onChangeText={setFieldValue.bind(this, 'time')}
                  style={{ fontSize: 20, color: '#000' }}

                />
              </Pressable>
            )}
          </TimeView>

        </View>

      </View>
      <View style={{ marginTop: 20, }}>
        <Button onPress={onSubmit} color='#2A86FF'>
          <Ionicons name="checkmark-sharp" size={24} color="white" />
          Зберегти
        </Button>
      </View>
    </ScrollView >
  )
}

const TimeView = styled.View`
border-bottom-width: 1px;
border-bottom-color: #F0F0F0;
width: 50%;
padding-left: 10px;
`;

const DateView = styled.View`
border-bottom-width: 1px;
border-bottom-color: #F0F0F0;
width: 50%;
margin-right: 30px;
padding-left: 10px;
`;

const LabelDate = styled.Text`
  font-size: 16px;
  color: #A0A2A4;
  margin-bottom: 5px;
`;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 18
  },
  container: {
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    height: '100%'
  },
  datePicker: {
    height: 120,
    marginTop: -10,
    fontSize: 18,
    color: '#000'
  }
});

export default EditAppointmentScreen;