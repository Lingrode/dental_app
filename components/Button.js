import React from "react";
import styled from 'styled-components/native';

const Button = ({ children, color, onPress }) => {
  return (
    <ButtonWrapper onPress={onPress} color={color}>
      <ButtonText>{children}</ButtonText>
    </ButtonWrapper>
  );
}


Button.defaultProps = {
  color: '#2A86FF'
}

const ButtonText = styled.Text`
  font-family: 'SFUIText-Semibold';
  font-size: 18px;
  color: #fff;
  `;
// line-height: 22px;

const ButtonWrapper = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  background-color: ${props => props.color};
  text-align: center;
  height: 50px;
`;

export default Button;