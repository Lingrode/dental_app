import React from "react";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PlusButton = ({ onPress, ref }) => (
  <Circle onPress={onPress}
    style={{
      shadowColor: "#2A86FF",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.7,
      shadowRadius: 2.5,

      elevation: 5,
    }}
  >
    <MaterialCommunityIcons name="plus" size={32} color="white" />
  </Circle>
);

const Circle = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 50px;
  width: 65px;
  height: 65px;
  background-color: #2A86FF;
  position: absolute;
  right: 25px;
  bottom: 25px;
`;

export default PlusButton;