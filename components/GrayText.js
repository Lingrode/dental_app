import { Text, StyleSheet, Platform } from 'react-native'

const GrayText = ({ children }) => {
  return (
    <Text style={styles.text}>{children}</Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SFUIText-Regular',
    color: '#8B979F',
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 18,
      }
    })
  }
})

export default GrayText;