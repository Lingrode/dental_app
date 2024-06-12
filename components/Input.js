import React from "react";
import { Animated, Platform, StyleSheet, TextInput, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

const Input = ({
  containerStyle,
  placeholder,
  onChangeText,
  error,
  defaultValue,
  name,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = React.useState("");
  const [values, setValues] = React.useState({});
  const labelPosition = React.useRef(
    new Animated.Value(values[name] ? 1 : 0)
  ).current;
  const borderColor = React.useRef(
    new Animated.Value(isFocused ? 1 : 0)
  ).current;

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (defaultValue) {
      animatedLabel(1);
    }
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
    animateBorderColor(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!values[name]) {
      animatedLabel(0);
    }
    animateBorderColor(0);
  };

  const handleTextChange = (text) => {
    setText(text);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: text,
    }));
    if (onChangeText) {
      onChangeText(text);
    }
    if (text) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  const dismissKeyboard = () => {
    inputRef.current.blur();
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animateBorderColor = (toValue) => {
    Animated.timing(borderColor, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 5],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: Platform.select({
        ios: [14, 12],
        android: [18, 16],
      }),
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ["#A0A2A4", "#A0A2A4"],
    }),
  };

  const borderBottomColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F0F0F0", "#2A86FF"],
  });

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ marginBottom: 20 }}>
          <Animated.View style={[styles.innerContainer, { borderBottomColor }]}>
            <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
            <TextInput
              {...props}
              ref={inputRef}
              style={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleTextChange}
              selectionColor={"rgba(42, 134, 255, 0.58)"}
              defaultValue={defaultValue}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderBottomWidth: 1,
    height: 65,
    width: 360,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        width: "auto",
      },
    }),
  },
  label: {
    position: "absolute",
    bottom: 10,
    color: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    height: 50,
    marginTop: 5,
    paddingLeft: 10,
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
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: "red",
  },
});

export default Input;
