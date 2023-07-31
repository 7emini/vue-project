import { getToken, getUsername, removeToken, removeUsername, setToken, setUsername } from "@/utils/cookies";
import { login, logout } from "@/apis/account";

const state = {
  collapse: JSON.parse(sessionStorage.getItem("collapse")) || false,
  token: "" || getToken(),
  username: "" || getUsername(),
  table_action_request:false,
};
const getters = {};
const mutations = {
  SET_COLLAPSE(state) {
    state.collapse = !state.collapse;
    sessionStorage.setItem("collapse", JSON.stringify(state.collapse));
  },
  SET_TOKEN(state, value) {
    state.token = value; // 设置运行时token
    value && setToken(value); // 当token存在时写入缓存
  },
  SET_USERNAME(state, value) {
    state.username = value; //设置运行时用户名
    value && setUsername(value); // 当用户明存在写入缓存
  },
  SET_TABLE_REQUEST(state) {
    state.table_action_request = !state.table_action_request;
  } 
};
const actions = {
  // 异步登录
  loginAction(context, requestData) {
    return new Promise((resolve, reject) => {
      login(requestData)
        .then((response) => {
          let data = response.data;
          context.commit("SET_TOKEN", data.token);
          context.commit("SET_USERNAME", data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  logoutAction(context) {
    return new Promise((resolve, reject) => {
      logout()
        .then((response) => {
          removeToken();
          removeUsername();
          context.commit("SET_TOKEN", "");
          context.commit("SET_USERNAME", "");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
