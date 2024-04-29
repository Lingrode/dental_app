import styled from 'styled-components/native';

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

export default styled.Text`
  background: ${props => getColor(props).background};
  color: ${props => getColor(props).color};
  border-radius: 18px;
  font-family: 'SFUIText-Heavy';
  text-align: center;
  font-size: 18px;
  width: 75px;
  height: 35px;
  line-height: 38px;
`;