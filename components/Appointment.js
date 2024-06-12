import {
  View,
  Text,
  Animated,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";

import GrayText from "./GrayText";
import Badge from "./Badge";

import getAvatarColor from "../utils/getAvatarColor";

function Appointment({
  onPress,
  item,
  active,
  groupTitle = "Untitled",
  items = [],
}) {
  const { patient, diagnosis, time } = item;
  const avatarColors = getAvatarColor(patient.fullname[0].toUpperCase());

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <AnimatedTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { opacity: fadeAnim }]}
        activeOpacity={1}
      >
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: avatarColors.background,
            },
          ]}
        >
          <Text style={[styles.letter, { color: avatarColors.color }]}>
            {patient.fullname[0].toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fullname}>{patient.fullname}</Text>
          <GrayText>{diagnosis}</GrayText>
        </View>
        {time && <Badge active={active}>{time}</Badge>}
      </AnimatedTouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  letter: {
    fontFamily: "SFUIText-Bold",
    ...Platform.select({
      ios: {
        fontSize: 18,
        lineHeight: 36,
      },
      android: {
        fontSize: 22,
        lineHeight: 26,
      },
    }),
  },
  fullname: {
    fontFamily: "SFUIText-Bold",
    ...Platform.select({
      ios: {
        fontSize: 14,
        marginBottom: 3,
      },
      android: {
        fontSize: 18,
      },
    }),
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginRight: 16,
    ...Platform.select({
      ios: {
        width: 47,
        height: 47,
      },
      android: {
        width: 50,
        height: 50,
      },
    }),
  },
  button: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 25,
    paddingLeft: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
    backgroundColor: "#fff",
    width: "100%",
  },
});

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default Appointment;
