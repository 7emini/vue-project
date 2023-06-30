import instance from "@/utils/request";

export function register(data) {
    return instance.request({
        method:"post",
        url:"/register/",
        data,
    })
} 

export function login(data) {
  return instance.request({
    method: "post",
    url: "/login/",
    data,
  });
}