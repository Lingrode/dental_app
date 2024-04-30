import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

const Button = ({ children, color = '#2A86FF', onPress }) => {
  return (
    <TouchableOpacity style={[styles.buttonWrapper, { backgroundColor: color }]} onPress={onPress} color={color}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    textAlign: 'center',
    height: 50,
  },
  buttonText: {
    fontFamily: 'SFUIText-Semibold',
    color: '#fff',
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
      }
    })
  }
})

export default Button;