import Cookies from "js-cookie";

const tokenKey = "tokenAdmin";
const usernameKey = "usernameAdmin";

export function getToken() {
  return Cookies.get(tokenKey);
}

export function setToken(value) {
  Cookies.set(tokenKey, value);
}

export function removeToken() {
  Cookies.remove(tokenKey);
}

export function getUsername() {
  return Cookies.get(usernameKey);
}

export function setUsername(value) {
  Cookies.set(usernameKey, value);
}

export function removeUsername() {
  Cookies.remove(usernameKey);
}
