import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PlusButton = ({ onPress, ref }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.circle,
      {
        shadowColor: "#2A86FF",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 2.5,

        elevation: 5,
      },
    ]}
  >
    <MaterialCommunityIcons name="plus" size={32} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 50,
    width: 65,
    height: 65,
    backgroundColor: "#2a86ff",
    position: "absolute",
    right: 25,
    bottom: 25
  },
});

export default PlusButton;
