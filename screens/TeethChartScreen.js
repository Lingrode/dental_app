import { React, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import styled from 'styled-components/native';


function TeethChartScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Пацієнти',
      headerTintColor: "#2A86FF",
      headerTitleStyle: {
        fontFamily: 'SFUIText-Bold',
        fontSize: 24,
        letterSpacing: 10,
        color: '#2A86FF',
      },
      headerStyle: {
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 50,
      },
      headerTitleContainerStyle: {
        paddingVertical: 10
      },
      headerShadowVisible: false,
    });
  }, [navigation])

  const { teeth } = route.params;


  const teethNumbers = [
    { id: '11', position: { top: 190, left: 177 } },
    { id: '12', position: { top: 200, left: 143 } },
    { id: '13', position: { top: 215, left: 105 } },
    { id: '14', position: { top: 245, left: 80 } },
    { id: '15', position: { top: 275, left: 63 } },
    { id: '16', position: { top: 307, left: 49 } },
    { id: '17', position: { top: 345, left: 45 } },
    { id: '18', position: { top: 380, left: 40 } },

    { id: '21', position: { top: 190, right: 177 } },
    { id: '22', position: { top: 200, right: 143 } },
    { id: '23', position: { top: 215, right: 105 } },
    { id: '24', position: { top: 245, right: 80 } },
    { id: '25', position: { top: 275, right: 63 } },
    { id: '26', position: { top: 307, right: 49 } },
    { id: '27', position: { top: 345, right: 45 } },
    { id: '28', position: { top: 380, right: 40 } },

    { id: '31', position: { bottom: 188, right: 179 } },
    { id: '32', position: { bottom: 190, right: 150 } },
    { id: '33', position: { bottom: 200, right: 123 } },
    { id: '34', position: { bottom: 225, right: 95 } },
    { id: '35', position: { bottom: 249, right: 75 } },
    { id: '36', position: { bottom: 282, right: 60 } },
    { id: '37', position: { bottom: 318, right: 47 } },
    { id: '38', position: { bottom: 358, right: 38 } },

    { id: '41', position: { bottom: 188, left: 185 } },
    { id: '42', position: { bottom: 190, left: 150 } },
    { id: '43', position: { bottom: 200, left: 123 } },
    { id: '44', position: { bottom: 225, left: 95 } },
    { id: '45', position: { bottom: 249, left: 75 } },
    { id: '46', position: { bottom: 282, left: 60 } },
    { id: '47', position: { bottom: 318, left: 47 } },
    { id: '48', position: { bottom: 358, left: 38 } },
  ];

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <Container>
        <TeethImage
          source={require('../assets/teeth.png')}
          style={{ resizeMode: 'contain' }}
        />
        {teethNumbers.map(tooth => (
          <Text
            key={tooth.id}
            style={[styles.toothNumber, tooth.position, { color: teeth && teeth[tooth.id] ? 'green' : 'black' }]}
          >
            {tooth.id}
          </Text>
        ))}
      </Container>
    </View>
  )
}

const TeethImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  padding: 0 25px;
  position: relative;
`;

const styles = StyleSheet.create({
  toothNumber: {
    position: 'absolute',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TeethChartScreen;