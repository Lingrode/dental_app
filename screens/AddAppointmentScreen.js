import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { appointmentsApi } from "../utils/api";
import { Button, Input } from "../components";

function AddAppointmentScreen({ route, navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      title: "Додати прийом",
      headerTintColor: "#2A86FF",
      headerTitleStyle: {
        fontFamily: "SFUIText-Bold",
        fontSize: 24,
        letterSpacing: 10,
        color: "#2A86FF",
      },
      headerStyle: {
        borderBottomColor: "#F3F3F3",
        borderBottomWidth: 50,
        elevation: 0.8,
      },
      headerShadowVisible: false,
    });
  }, [navigation]);

  const fieldsName = {
    toothNumber: "Номер зуба",
    price: "Ціна",
    diagnosis: "Діагноз",
    date: "Дата",
    time: "Час",
  };

  const [values, setValues] = React.useState({
    diagnosis: "Пульпіт",
    toothNumber: "",
    price: "",
    date: null,
    time: null,
    patient: route.params.patientId,
  });

  const [date, setDate] = React.useState(new Date());
  const [showDatepicker, setShowDatepicker] = React.useState(false);
  const [showTimepicker, setShowTimepicker] = React.useState(false);
  const [dateOfAppointment, setDateOfAppointment] = React.useState("");
  const [timeOfAppointment, setTimeOfAppointment] = React.useState("");

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleInputChange = (name, e) => {
    const text = e.nativeEvent.text;
    setFieldValue(name, text);
  };

  const onSubmit = () => {
    appointmentsApi
      .add(values)
      .then(() => {
        navigation.navigate("Home", { lastUpdate: new Date().toISOString() });
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.data);
          e.response.data.data.forEach((err) => {
            console.log(err);
            const fieldName = err.path;
            alert(`Помилка! Поле "${fieldsName[fieldName]}" вказано невірно!`);
          });
        }
      });
  };

  const toggleDatepicker = () => {
    setShowDatepicker(!showDatepicker);
  };

  const toggleTimepicker = () => {
    setShowTimepicker(!showTimepicker);
  };

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = formatDate(currentDate);
      setDateOfAppointment(formattedDate);
      setFieldValue("date", formattedDate);
      setShowDatepicker(false);
    } else {
      toggleDatepicker();
    }
  };

  const onChangeTime = ({ type }, selecteTime) => {
    if (type === "set") {
      const currentTime = selecteTime || date;
      setDate(currentTime);
      const formattedTime = formatTime(currentTime);
      setTimeOfAppointment(formattedTime);
      setFieldValue("time", formattedTime);
      setShowTimepicker(false);
    } else {
      toggleTimepicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfAppointment(formatDate(currentDate));
    toggleDatepicker();
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

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

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [selectedValue, setSelectedValue] = React.useState("");

  React.useEffect(() => {
    setSelectedValue(values.diagnosis);
  }, [values.diagnosis]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <Input
          name="fullname"
          placeholder={"Номер зуба"}
          onChange={handleInputChange.bind(this, "toothNumber")}
          value={values.toothNumber}
          keyboardType="numeric"
        />
        {Platform.OS === "ios" ? (
          <>
            <TouchableOpacity onPress={handleOpenModal} style={styles.input}>
              <Text style={styles.inputText}>{values.diagnosis}</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleCloseModal}
            >
              <View style={styles.modalView}>
                <View>
                  <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValue(itemValue);
                      setFieldValue("diagnosis", itemValue);
                    }}
                    style={{ width: 350 }}
                  >
                    <Picker.Item label="Пульпіт" value="Пульпіт" />
                    <Picker.Item label="Періодонтит" value="Періодонтит" />
                    <Picker.Item label="Пародонтит" value="Пародонтит" />
                    <Picker.Item label="Періостит" value="Періостит" />
                    <Picker.Item label="Флюороз" value="Флюороз" />
                  </Picker>
                  <View style={{ marginTop: 20 }}>
                    <Button onPress={handleCloseModal} color="#2A86FF">
                      <Ionicons
                        name="checkmark-sharp"
                        size={24}
                        color="white"
                      />
                      Зберегти
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.select}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedValue(itemValue);
                  setFieldValue("diagnosis", itemValue);
                }}
                mode="dropdown"
                itemStyle='color: "#f0f0f0"'
                style={{ borderRadius: 10 }}
              >
                <Picker.Item
                  label="Пульпіт"
                  value="Пульпіт"
                  style={styles.selectValues}
                />
                <Picker.Item
                  label="Періодонтит"
                  value="Періодонтит"
                  style={styles.selectValues}
                />
                <Picker.Item
                  label="Пародонтит"
                  value="Пародонтит"
                  style={styles.selectValues}
                />
                <Picker.Item
                  label="Періостит"
                  value="Періостит"
                  style={styles.selectValues}
                />
                <Picker.Item
                  label="Флюороз"
                  value="Флюороз"
                  style={styles.selectValues}
                />
              </Picker>
            </View>
          </TouchableWithoutFeedback>
        )}

        <Input
          name="phoneNumber"
          placeholder={"Ціна"}
          onChange={handleInputChange.bind(this, "price")}
          value={values.price}
          keyboardType="numeric"
        />

        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 30 }}
        >
          <View style={[styles.dateTimeView, { marginRight: 30 }]}>
            <Text style={styles.dateTimeLabel}>Дата</Text>

            {showDatepicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                textColor="#000"
                is24Hour={true}
                onChange={onChangeDate}
                style={{ fontWeight: 700 }}
              />
            )}

            {showDatepicker && Platform.OS === "ios" && (
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
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
                  placeholder={`${formatDate(new Date())}`}
                  editable={false}
                  value={dateOfAppointment}
                  onChangeText={setFieldValue.bind(this, "date")}
                  style={{ fontSize: 20, color: "#000" }}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.dateTimeView}>
            <Text style={styles.dateTimeLabel}>Час</Text>

            {showTimepicker && (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={new Date()}
                is24Hour={true}
                onChange={onChangeTime}
              />
            )}

            {showTimepicker && Platform.OS === "ios" && (
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
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
                  placeholder={"12:00"}
                  editable={false}
                  value={timeOfAppointment}
                  onChangeText={setFieldValue.bind(this, "time")}
                  style={{ fontSize: 20, color: "#000" }}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button onPress={onSubmit} color="#87CC6F">
          <Ionicons style={{ height: 24 }} name="add" size={20} color="white" />
          Додати прийом
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginTop: 6,
    marginBottom: 12,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#F0F0F0",
    borderRadius: 5,
  },
  select: {
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
    marginBottom: 20,
    marginLeft: -5,
    marginRight: -5,
  },
  selectValues: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 20,
        borderBottomWidth: 1,
      },
    }),
  },
  container: {
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    height: "100%",
  },
  datePicker: {
    height: 120,
    marginTop: -10,
    fontSize: 18,
    color: "#000",
  },
  dateTimeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width: "50%",
    paddingLeft: 10,
  },
  dateTimeLabel: {
    fontSize: 16,
    color: "#a0a2a4",
    marginBottom: 5,
  },
});

export default AddAppointmentScreen;
