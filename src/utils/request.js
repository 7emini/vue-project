import axios from "axios";

const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000,
});

// 在发送请求之前做什么
service.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 在发送请求之后做什么
service.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


export default service;