import axios from 'axios';
import * as Network from 'expo-network';

// const getIpAddress = async () => {
//   const ip = await Network.getIpAddressAsync();
//   return ip;
// }

// const setAxiosBaseUrl = async () => {
//   const ip = await getIpAddress();
//   axios.defaults.baseURL = 'http://' + (__DEV__ ? ip.concat(`:3000`) : `api.example.com`);
// }

// const setAxiosBaseUrl = async () => {
//   const ip = '192.168.58.113';
//   axios.defaults.baseURL = 'http://' + (__DEV__ ? ip.concat(`:3000`) : `api.example.com`);
// }


// const setAxiosBaseUrl = async () => {
//   const ip = '192.168.163.97';
//   axios.defaults.baseURL = 'http://' + (__DEV__ ? ip.concat(`:3000`) : `api.example.com`);
// }

const setAxiosBaseUrl = async () => {
  const ip = '192.168.58.104';
  axios.defaults.baseURL = 'http://' + (__DEV__ ? ip.concat(`:3000`) : `api.example.com`);
}

setAxiosBaseUrl();

console.log(axios.defaults.baseURL);
// console.log(setAxiosBaseUrl());

export default axios;
