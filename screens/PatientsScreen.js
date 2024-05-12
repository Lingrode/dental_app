import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  TextInput,
  View,
  Keyboard,
  Animated,
  StyleSheet,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from 'axios;'
// import axios, * as others from 'axios';
import { SwipeListView } from "react-native-swipe-list-view";

import { Appointment, PlusButton } from "../components";
import { phoneFormat, patientsApi } from "../utils";

function PatientsScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Пацієнти",
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
      },
      headerTitleContainerStyle: {
        paddingVertical: 10,
      },
      headerShadowVisible: false,
    });
  }, [navigation]);

  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
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
    extrapolate: "clamp",
  });

  const inputRef = useRef();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data } = await patientsApi.get();
      let appointments = data.data;
      appointments.sort(
        (a, b) => new Date(a.originalDate) - new Date(b.originalDate)
      );
      swipeListViewRef.current?.closeAllOpenRows();
      setData(appointments);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPatients);

    return unsubscribe;
  }, [navigation]);

  // const fetchPatients = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await patientsApi.get();
  //     let appointments = data.data;
  //     appointments.sort(
  //       (a, b) => new Date(a.originalDate) - new Date(b.originalDate)
  //     );
  //     swipeListViewRef.current?.closeAllOpenRows();
  //     setData(appointments);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(fetchPatients, []);
  // useEffect(fetchPatients, [route.params]);

  // useEffect(() => {
  //   fetchPatients();
  // }, [patientData]);

  // const updatePatientData = (newData) => {
  //   setPatientData(newData);
  // };

  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidHide = () => {
    inputRef.current.blur();
  };

  const onSearch = (e) => {
    setSearchValue(e.nativeEvent.text);
  };

  const removePatient = (id) => {
    Alert.alert(
      "Видалення пацієнта",
      "Ви дійсно хочете видалити пацієнта?",
      [
        {
          text: "Відміна",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Видалити",
          onPress: () => {
            setIsLoading(true);
            patientsApi
              .remove(id)
              .then(() => {
                fetchPatients();
              })
              .catch(() => {
                setIsLoading(false);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {data && (
        <>
          <View
            style={{
              marginLeft: 25,
              marginRight: 25,
              marginTop: 15,
              marginBottom: 20,
            }}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                onChange={onSearch}
                ref={inputRef}
                placeholder="Пошук пацієнта"
                style={styles.input}
              ></TextInput>
            </View>
          </View>

          <SwipeListView
            rightOpenValue={-180}
            closeOnScroll={true}
            closeOnRowPress={true}
            disableRightSwipe={true}
            keyExtractor={(item) => item._id}
            ref={swipeListViewRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={data.filter(
              (item) =>
                item.fullname
                  .toLowerCase()
                  .indexOf(searchValue.toLowerCase()) >= 0
            )}
            renderItem={({ item }) => (
              <Appointment
                onPress={() =>
                  navigation.navigate("Patient", {
                    patient: item,
                  })
                }
                item={{
                  patient: item,
                  diagnosis: phoneFormat(item.phone),
                }}
              />
            )}
            renderHiddenItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditPatient", { patient: item });
                    console.log(item);
                  }}
                  style={[
                    styles.swipeViewButton,
                    { backgroundColor: "#B4C1CB", width: 90, height: "100%" },
                  ]}
                >
                  <MaterialCommunityIcons
                    style={{ position: "relative", left: 30 }}
                    name="pencil"
                    size={32}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={removePatient.bind(this, item._id)}
                  style={[
                    styles.swipeViewButton,
                    { backgroundColor: "#F85A5A", height: "100%", width: 90 },
                  ]}
                >
                  <MaterialCommunityIcons
                    style={{ position: "relative", left: 30 }}
                    name="close"
                    size={32}
                    color="white"
                  />
                </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputWrapper: {
    paddingTop: 10,
    paddingRight: 25,
    paddingBottom: 10,
    paddingLeft: 25,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 50,
  },
  input: {
    color: "#000",
    fontFamily: "SFUIText-Regular",
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 20,
      },
    }),
  },
  swipeViewButton: {
    justifyContent: "center",
    height: "100%",
  },
});

export default PatientsScreen;
