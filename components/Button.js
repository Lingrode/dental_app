import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from "react-native";

const Button = ({ icon, text, color = "#2A86FF", onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, { backgroundColor: color }]}
      onPress={onPress}
      color={color}
    >
      <View style={styles.buttonContent}>
        {icon}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    textAlign: "center",
    height: 50,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontFamily: "SFUIText-Semibold",
    color: "#fff",
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
      },
    }),
  },
});

export default Button;
