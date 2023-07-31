import instance from "@/utils/request";

export function MenuCreate(data={}) {
    return instance.request({
        method:"post",
        url:"/menu/create",
        data,
    })
}