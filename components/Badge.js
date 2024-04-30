import { StyleSheet, Platform, Text } from 'react-native';

const getColor = ({ active, color }) => {
  const colors = {
    green: {
      background: 'rgba(132, 210, 105, 0.21)',
      color: '#61BB42'
    },
    active: {
      background: '#2A86FF',
      color: '#fff'
    },
    default: {
      background: '#e9f5ff',
      color: '#4294FF'
    }
  }

  let result;
  if (active) {
    result = colors.active
  } else if (color && colors[color]) {
    result = colors[color]
  } else {
    result = colors.default;
  }

  return result;
};

const styles = StyleSheet.create({
  text: {
    borderRadius: 18,
    textAlign: 'center',
    height: 35,
    fontFamily: 'SFUIText-Heavy',
    paddingLeft: 13,
    paddingRight: 13,
    flexWrap: 'wrap',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        fontSize: 13,
        overflow: 'hidden',
        lineHeight: 31,
      },
      android: {
        fontSize: 18,
        lineHeight: 38,
      }
    })
  }
});

const ColoredText = (props) => {
  const color = getColor(props);
  return (
    <Text
      style={[styles.text,
      { backgroundColor: color.background, color: color.color }
      ]}
    >
      {props.children}
    </Text>
  );
};

export default ColoredText;