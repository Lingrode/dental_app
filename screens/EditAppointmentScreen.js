import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";

import { appointmentsApi } from "../utils/api";

import { Button, Input } from "../components";

function EditAppointmentScreen({ route, navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      title: "Редагувати прийом",
      headerTintColor: "#2A86FF",
      headerTitleStyle: {
        fontFamily: "SFUIText-Bold",
        fontSize: 24,
        letterSpacing: 10,
        color: "#2A86FF",
        ...Platform.select({
          ios: {
            fontSize: 22,
          },
        }),
      },
      headerStyle: {
        borderBottomColor: "#F3F3F3",
        borderBottomWidth: 50,
        elevation: 0.8,
      },
      headerShadowVisible: false,
    });
  }, [navigation]);

  const { appointment } = route.params;

  const [selectedValue, setSelectedValue] = React.useState(
    appointment.diagnosis || "Пульпіт"
  );

  const [values, setValues] = React.useState({
    diagnosis: appointment.diagnosis || "Пульпіт",
    toothNumber: appointment.toothNumber,
    price: appointment.price,
    date: appointment.date || null,
    time: appointment.time || null,
    appointment: route.params.appointment,
  });

  const fieldsName = {
    toothNumber: "Номер зуба",
    price: "Ціна",
    diagnosis: "Діагноз",
    date: "Дата",
    time: "Час",
  };

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
      .update(appointment._id, values)
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

  const [showDatepicker, setShowDatepicker] = React.useState(false);
  const [showTimepicker, setShowTimepicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date(appointment.date));
  const [time, setTime] = React.useState(new Date());

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
    if (type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = formatDate(currentDate);
      setFieldValue("date", formattedDate);
      setShowDatepicker(false);
    } else {
      toggleDatepicker();
    }
  };

  const onChangeTime = ({ type }, selectedTime) => {
    if (type === "set") {
      const currentTime = new Date(selectedTime);
      setTime(currentTime);
      const formattedTime = formatTime(currentTime);
      setFieldValue("time", formattedTime);
      setShowTimepicker(false);
    } else {
      toggleTimepicker();
    }
  };

  const confirmIOSDate = () => {
    setDate(formatDate(date));
    toggleDatepicker();
  };

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

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <Input
          name="toothNumber"
          placeholder={"Номер зуба"}
          onChange={handleInputChange.bind(this, "toothNumber")}
          value={values.toothNumber.toString()}
          defaultValue={appointment.toothNumber}
          keyboardType="numeric"
        />

        {Platform.OS === "ios" ? (
          <>
            <TouchableOpacity onPress={handleOpenModal} style={styles.input}>
              <Text style={styles.inputText}>{selectedValue}</Text>
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
          value={values.price.toString()}
          defaultValue={appointment.price}
          keyboardType="numeric"
        />

        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 30 }}
        >
          <View style={[styles.dateTimeView, { marginRight: 30 }]}>
            <Text style={styles.dateTimeLabel}>Дата</Text>

            <View style={styles.datePicker}>
              {showDatepicker && (
                <View>
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    textColor="#000"
                    is24Hour={true}
                    onChange={onChangeDate}
                    onPressIn={toggleDatepicker}
                  />
                </View>
              )}

              {showDatepicker && Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={toggleDatepicker}
                    style={[styles.datePickerButton, styles.button]}
                  >
                    <Text style={{ color: "#EE204D" }}>Відміна</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmIOSDate}
                    style={[
                      styles.datePickerButton,
                      styles.button,
                      { backgroundColor: "#87CC6F" },
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>Підтвердити</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {!showDatepicker && Platform.OS === "android" && (
              <Pressable onPressIn={toggleDatepicker}>
                <TextInput
                  placeholder={"Sat Aug 21 2004"}
                  editable={false}
                  value={formatDate(date)}
                  onChangeText={setFieldValue.bind(this, "date")}
                  style={{ fontSize: 20, color: "#000" }}
                />
              </Pressable>
            )}

            {!showDatepicker && Platform.OS === "ios" && (
              <Pressable>
                <TextInput
                  onPressIn={toggleDatepicker}
                  placeholder={"Sat Aug 21 2004"}
                  editable={false}
                  value={formatDate(date)}
                  onChangeText={setFieldValue.bind(this, "date")}
                  style={{ fontSize: 16, color: "#000" }}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.dateTimeView}>
            <Text style={styles.dateTimeLabel}>Час</Text>

            <View style={styles.timePicker}>
              {showTimepicker && (
                <View>
                  <DateTimePicker
                    mode="time"
                    display="spinner"
                    value={time}
                    is24Hour={true}
                    onChange={onChangeTime}
                    onPressIn={toggleDatepicker}
                  />
                </View>
              )}

              {showTimepicker && Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={toggleTimepicker}
                    style={[styles.datePickerButton, styles.button]}
                  >
                    <Text style={{ color: "#EE204D" }}>Відміна</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmIOSDate}
                    style={[
                      styles.datePickerButton,
                      styles.button,
                      { backgroundColor: "#87CC6F" },
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>Підтвердити</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {!showTimepicker && Platform.OS === "ios" && (
              <Pressable>
                <TextInput
                  onPressIn={toggleTimepicker}
                  placeholder={"12:00"}
                  editable={false}
                  value={formatTime(time)}
                  onChangeText={setFieldValue.bind(this, "time")}
                  style={{ fontSize: 16, color: "#000" }}
                />
              </Pressable>
            )}

            {!showTimepicker && Platform.OS === "android" && (
              <Pressable onPress={toggleTimepicker}>
                <TextInput
                  placeholder={"12:00"}
                  editable={false}
                  value={formatTime(time)}
                  onChangeText={setFieldValue.bind(this, "time")}
                  style={{ fontSize: 20, color: "#000" }}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {/* <View style={{ marginTop: 20 }}>
        <Button onPress={onSubmit} color="#2A86FF">
          <Ionicons name="checkmark-sharp" size={24} color="white" />
          Зберегти
        </Button>
      </View> */}

      <Button
        text="Зберегти"
        icon={<Ionicons name="checkmark-sharp" size={24} color="white" />}
        onPress={onSubmit}
        color="#2A86FF"
      ></Button>
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
  inputText: {
    fontSize: 16,
  },
  container: {
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    height: "100%",
  },
  datePicker: {
    position: "absolute",
    borderRadius: 50,
    top: 220,
    height: 320,
    width: 340,
    backgroundColor: "#fff",
  },
  timePicker: {
    position: "absolute",
    borderRadius: 50,
    left: "-120%",
    top: 220,
    height: 320,
    width: 340,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
  },
  datePickerButton: {
    paddingHorizontal: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "#fff",
    position: "absolute",
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    bottom: -20,
    shadowColor: "#000",
    shadowOffset: 2,
    shadowRadius: 3,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "#2A86FF",
    borderRadius: 50,
  },
  clickable: {
    cursor: "pointer",
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

export default EditAppointmentScreen;
