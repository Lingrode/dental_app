export default str => {
  return str.split('').reduce((result, n) => {
    return result.replace('X', n);
  }, '+XX (XXX) XXX-XX-XX');
}; 