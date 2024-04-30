import { Text, StyleSheet, Platform } from "react-native";

const SectionTitle = ({ children }) => {
  return (
    <Text style={styles.title}>{children}</Text>
  );
};

const styles = StyleSheet.create({ 
  title: {
    fontFamily: 'SFUIText-Bold',
    color: '#000',
    marginTop: 25,
    padding: '0 25px',
    paddingLeft: 25,
    paddingRight: 25,
    ...Platform.select({
      ios: {
        fontSize: 18
      },
      android: {
        fontSize: 24
      }
    })
  }
})

export default SectionTitle;