import React from "react";
import {
  TouchableOpacity,
  Alert,
  Animated,
  View,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import _ from "lodash";
import { ListItem } from "@rneui/themed";
import moment from "moment";

import { Appointment, SectionTitle, PlusButton } from "../components";
import { appointmentsApi } from "../utils/api";

function HomeScreen({ navigation, route }) {
  React.useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.header}>
          <View>
            <Text style={[{ color: "#2A86FF" }, styles.headerText]}>
              Журнал прийомів
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate("Patients")}
          >
            <MaterialCommunityIcons
              name="account-supervisor"
              size={32}
              color="#2A86FF"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [nearestAppointment, setNearestAppointment] = React.useState(null);

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const fetchAppointments = () => {
    setIsLoading(true);
    appointmentsApi
      .get()
      .then(({ data }) => {
        let appointments = data.data;
        appointments.sort(
          (a, b) => new Date(a.originalDate) - new Date(b.originalDate)
        );

        appointments.forEach((section) => {
          section.data.sort((a, b) => {
            const timeA = moment(a.time, "HH:mm");
            const timeB = moment(b.time, "HH:mm");
            return timeA - timeB;
          });
        });

        setNearestAppointment(appointments[0].data[0]);

        setData(appointments);
        console.log(appointments);
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };

  React.useEffect(fetchAppointments, []);

  React.useEffect(fetchAppointments, [route.params]);

  // const removeAppointment = (id) => {
  //   Alert.alert(
  //     "Видалення прийому",
  //     "Ви дійсно хочете видалити прийом?",
  //     [
  //       {
  //         text: "Відміна",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel",
  //       },
  //       {
  //         text: "Видалити",
  //         onPress: () => {
  //           setIsLoading(true);
  //           appointmentsApi
  //             .remove(id)
  //             .then(() => {
  //               fetchAppointments();
  //             })
  //             .catch(() => {
  //               setIsLoading(false);
  //             });
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  const removeAppointment = (id) => {
    Alert.alert(
      "Видалення прийому",
      "Ви дійсно хочете видалити прийом?",
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
            appointmentsApi
              .remove(id)
              .then(() => {
                const newData = data
                  .map((section) => ({
                    ...section,
                    data: section.data.filter((item) => item._id !== id),
                  }))
                  .filter((section) => section.data.length > 0);
                setData(newData);
                setIsLoading(false);
              })
              .catch(() => {
                setData(data);
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
      {data && data.length > 0 ? (
        <Animated.SectionList
          sections={data}
          keyExtractor={(item) => item._id}
          onRefresh={fetchAppointments}
          refreshing={isLoading}
          renderItem={({ item }) => {
            return (
              <ListItem.Swipeable
                containerStyle={{ padding: 0 }}
                rightStyle={{
                  display: "flex",
                  flexDirection: "row",
                  height: 91,
                }}
                rightWidth={180}
                rightContent={(reset) => (
                  <>
                    <TouchableHighlight
                      onPress={() =>
                        navigation.navigate("EditAppointment", {
                          appointment: item,
                        })
                      }
                      style={[
                        styles.swipeViewButton,
                        { backgroundColor: "#B4C1CB", width: 90 },
                      ]}
                    >
                      <MaterialCommunityIcons
                        style={{ position: "relative", left: 30 }}
                        name="pencil"
                        size={32}
                        color="white"
                      />
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={removeAppointment.bind(this, item._id)}
                      style={[
                        styles.swipeViewButton,
                        { backgroundColor: "#F85A5A", width: 90 },
                      ]}
                    >
                      <MaterialCommunityIcons
                        style={{ position: "relative", left: 30 }}
                        name="close"
                        size={32}
                        color="white"
                      />
                    </TouchableHighlight>
                  </>
                )}
              >
                <ListItem.Content>
                  <Appointment
                    active={item._id === nearestAppointment._id}
                    onPress={() =>
                      navigation.navigate("Patient", {
                        patient: item.patient,
                      })
                    }
                    item={item}
                  />
                </ListItem.Content>
              </ListItem.Swipeable>
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <SectionTitle>{title}</SectionTitle>
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Прийоми відсутні</Text>
        </View>
      )}
      <Animated.View style={{ transform: [{ translateY }], bottom: 0 }}>
        <PlusButton onPress={() => navigation.navigate("AddPatient")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: "#f3f3f3",
    borderBottomWidth: 2,
    ...Platform.select({
      ios: {
        height: 120,
      },
      android: {
        height: 110,
      },
    }),
  },
  headerText: {
    fontFamily: "SFUIText-Heavy",
    color: "#2A86FF",
    marginLeft: 25,
    ...Platform.select({
      ios: {
        fontSize: 24,
        marginTop: 65,
      },
      android: {
        fontSize: 32,
        marginTop: 45,
      },
    }),
  },
  headerIcon: {
    position: "absolute",
    ...Platform.select({
      ios: {
        right: 30,
        top: 66,
      },
      android: {
        right: 30,
        top: 52,
      },
    }),
  },
  swipeViewButton: {
    justifyContent: "center",
    height: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    color: "#2A86FF",
    fontFamily: "SFUIText-Bold",
  },
});

export default HomeScreen;
