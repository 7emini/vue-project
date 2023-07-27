import { reactive } from "vue"

import RequestUrl from "@/apis/requestUrl";

import { CommonApi } from "@/apis/common";

export function requestHook() {
    // 请求配置
    let requestConfig = {
        url: "", // 请求url
        method: "", // 请求方法
        data: {}, // 请求参数
        deelteKey: "id", // 删除数键
    }

    const responseData = reactive({
        data: [],
        total: 0,
        loading: false,
    });

    function requestData(params) {

        const {config, searchData, data } = params;

        requestConfig = { ...requestConfig, ...config };
        requestConfig.data = { ...requestConfig.data, ...data, ...searchData };

        if (!requestConfig.url) {
            return false;
        }

        // 获取默认配置的url
        const url = RequestUrl[requestConfig.url]?.list?.url;
        // 获取默认配置的请求方式
        const method = RequestUrl[requestConfig.method]?.list?.method || "post";
        // 获取默认配置的请求参数
        const requestData = requestConfig.data;

        const reqeust_params = {
            url,
            method,
            data: requestData,
        }

        responseData.loading = true;
        return new Promise((resolve, reject) => {
            CommonApi(reqeust_params).then((response) => {
                responseData.data = response.data.data;
                responseData.total = response.data.total;
                responseData.loading = false;
                resolve(responseData);
            }).catch(error => {
                responseData.loading = false;
                reject(error);
            });
        });
    }
    return { responseData, requestData };
}