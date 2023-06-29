import instance from "@/utils/request"; 

export function getCode(data) {
    return instance.request({
        method:"post",
        url: "/getCode/",
        data
    })
}