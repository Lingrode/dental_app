import { View, Animated } from 'react-native';
import { useRef } from 'react';
import styled from 'styled-components/native';

import GrayText from "./GrayText";
import Badge from "./Badge";

import getAvatarColor from "../utils/getAvatarColor";

function Appointment({ onPress, item, active }) {
  const { patient, diagnosis, time } = item;
  const avatarColors = getAvatarColor(patient.fullname[0].toUpperCase());

  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    <View style={{ backgroundColor: '#fff' }}>
      <AnimatedTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ opacity: fadeAnim }}
        activeOpacity={1}
      >
        <Avatar
          style={{
            backgroundColor: avatarColors.background,
          }}
        >
          <Letter style={{ color: avatarColors.color }}>{patient.fullname[0].toUpperCase()}</Letter>
        </Avatar>
        <View style={{ flex: 1 }}>
          <FullName>{patient.fullname}</FullName>
          <GrayText>{diagnosis}</GrayText>
        </View>
        {time && <Badge active={active}>{time}</Badge>}
      </AnimatedTouchableOpacity> 
    </View>
  );
};



Appointment.defaultProps = {
  groupTitle: 'Untitled',
  items: []
}

const Letter = styled.Text`
  font-size: 22px;
  font-family: 'SFUIText-Bold';
  line-height: 26px;
`;

const FullName = styled.Text`
  font-family: 'SFUIText-Bold';
  font-size: 18px;
`;

const Avatar = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  margin-right: 16px;
`;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  padding: 20px 25px;
  border-bottom-width: 1px;
  border-bottom-color: #F3F3F3;
  background-color: #fff;
`);

export default Appointment;