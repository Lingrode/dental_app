import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { patientsApi } from "../utils/api";

import { Button, Input } from "../components";

import { formatPhoneNumber } from "../utils/phoneFormat";

function AddPatientScreen({ route, navigation }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Додати пацієнта",
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

  const [values, setValues] = useState({});

  const handleChange = (name, e) => {
    const text = e.nativeEvent.text;
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handlePhoneChange = (text) => {
    let cleaned = ("" + text).replace(/\D/g, "");
    let match = cleaned.match(/^(38)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      let intlCode = match[1] ? "+38 " : "",
        part1 = match[2] ? "(" + match[2] + ") " : "",
        part2 = match[3] ? match[3] + "-" : "",
        part3 = match[4] ? match[4] + "-" : "",
        part4 = match[5] ? match[5] : "";
      return handleChange("phone", {
        nativeEvent: { text: [intlCode, part1, part2, part3, part4].join("") },
      });
    }
    return handleChange("phone", { nativeEvent: { text } });
  };

  // const handlePhoneChange = (text) => {
  //   const formattedText = formatPhoneNumber(text);
  //   handleChange('phone', { nativeEvent: { text: formattedText } });
  // }

  const onSubmit = () => {
    patientsApi
      .add(values)
      .then((response) => {
        navigation.navigate("Patients");
      })
      .catch((error) => {
        console.error("Failed to add patient:", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <Input
          name="fullname"
          placeholder={"Ім’я та прізвище"}
          onChange={handleChange.bind(this, "fullname")}
          value={values.fullname}
        />
        <Input
          name="phoneNumber"
          placeholder={"Номер телефону"}
          onChangeText={handlePhoneChange}
          // onChange={handleChange.bind(this, 'phone')}
          value={values.phone}
          dataDetectorTypes="phoneNumber"
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button onPress={onSubmit} color="#87CC6F">
          <Ionicons style={{ height: 24 }} name="add" size={20} color="white" />
          Додати пацієнта
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "gray",
    borderRadius: 5,
    fontSize: 18,
  },
  container: {
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    height: "100%",
  },
});

export default AddPatientScreen;
