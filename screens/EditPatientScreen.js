import React from "react";
import { View, StyleSheet, ScrollView, Platform, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { patientsApi } from "../utils/api";

import { Button, Input } from "../components";

function EditPatientScreen({ route, navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      title: "Змінити пацієнта",
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

  const { patient } = route.params;
  const [values, setValues] = React.useState(patient);
  const [isEdited, setIsEdited] = React.useState(patient);

  const patientId = route.params.patientId;

  React.useEffect(() => {
    if (patientId && !isEdited) {
      patientsApi.show(patientId).then((response) => {
        const patientData = response.data;
        setValues(patientData);
      });
    }
  }, [patientId, isEdited]);

  const handleChange = (name, e) => {
    setValues({
      ...values,
      [name]: e,
    });
    setIsEdited(true);
  };

  const onSubmit = () => {
    patientsApi
      .update(patient._id, values)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Failed to update patient:", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <Input
          name="fullname"
          placeholder={"Ім’я та прізвище"}
          onChangeText={handleChange.bind(this, "fullname")}
          value={values.fullname}
          defaultValue={values.fullname}
        />
        <Input
          name="phoneNumber"
          placeholder={"Номер телефону"}
          onChangeText={handleChange.bind(this, "phone")}
          value={values.phone}
          defaultValue={values.phone}
          dataDetectorTypes="phoneNumber"
          keyboardType="numeric"
        />
      </View>
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
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#F0F0F0",
    fontSize: 20,
    height: 50,
  },
  container: {
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    height: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});

export default EditPatientScreen;
