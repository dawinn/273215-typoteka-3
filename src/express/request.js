'use strict';
const urlDataServer = `http://localhost:3000`;
const request = require(`request-promise-native`);

const getData = async (url) => {
  try {
    return await request(`${urlDataServer}${url}`, {json: true});
  } catch (error) {
    console.error(`Произошла ошибка: ${error}`);
    return false;
  }
};

const sendData = async (url, data) => {
  try {
    return await request.post(`${urlDataServer}${url}`, {json: data});
  } catch (error) {
    console.error(`Произошла ошибка: ${error}`);
    return false;
  }
};

module.exports = {
  getData,
  sendData,
};
