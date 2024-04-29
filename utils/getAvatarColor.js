export default letter => {
  const charCode = letter.charCodeAt();
  if (charCode >= 1028 && charCode <= 1046) {
    return {
      background: '#F7F8D5',
      color: '#CCC058'
    }
  }
  if (charCode >= 1047 && charCode <= 1053) {
    return {
      background: '#DAD5F8',
      color: '#816CFF'
    }
  }
  if (charCode >= 1054 && charCode <= 1059) {
    return {
      background: '#D5F8E5',
      color: '#58CC86'
    }
  }
  if (charCode >= 1060 && charCode <= 1065) {
    return {
      background: '#F5D6D9',
      color: '#F38181'
    }
  }
  if (charCode >= 1066 && charCode <= 1071) {
    return {
      background: '#F8ECD5',
      color: '#F1A32F'
    }
  }
  return {
    background: '#D5EEF8',
    color: '#59A5DC'
  }
}