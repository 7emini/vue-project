import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, getUsername, removeToken, removeUsername} from "./cookies";
import router from "@/router";

const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000,
});

// 在发送请求之前做什么
service.interceptors.request.use(
  function (config) {
    if (getToken()) {
      config.headers["Token"] = getToken();
    }

    if (getUsername()) {
      config.headers["Username"] = getUsername();
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 对响应数据做些什么
service.interceptors.response.use(
  function (response) {
    const data = response.data;

    const code = data.resCode;
    if (code === 0) {
      // HTTP状态码为200 并且 resCode为0
      return Promise.resolve(data);
    } else {
      // HTTP状态码为200 但是 resCode不为0
      let errorMessage = "未知错误";
      if (data.message) {
        errorMessage = data.message;
      }
      ElMessage({
        message: errorMessage,
        type: "error",
      });
      return Promise.reject(data);
    }
  },
  function (error) {
    // HTTP状态码不为200
    const errorData = JSON.parse(error.request.response);

    if (errorData.resCode === 1010) {
      router.replace({
        name:"login",
      })
      removeToken();
      removeUsername();
    } 
    
    if (errorData.message) {
      ElMessage({
        message: errorData.message,
        type: "error",
      });
    }
    return Promise.reject(errorData);
  }
);

export default service;
