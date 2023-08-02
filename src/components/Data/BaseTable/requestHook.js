import { reactive, ref } from "vue"

import RequestUrl from "@/apis/requestUrl";

import { CommonApi } from "@/apis/common";

import { getCurrentInstance } from "vue";

import requestUrl from "@/apis/requestUrl";

export function requestHook() {

    const { proxy } = getCurrentInstance();

    // 请求配置
    let requestConfig = {
        url: "", // 请求url
        method: "", // 请求方法
        data: {}, // 请求参数
        deleteKey: "id", // 删除数键
        rowKey: "id", // 行ID
    }

    // 响应数据
    const responseData = reactive({
        data: [],
        total: 0,
        loading: false,
    });

    const dataId = ref(""); // 存储选中的数据的ID，以便删除和批量删除

    // 保存选中的数据的ID
    function saveDataId(value) {
        const isArray = Array.isArray(value);
        if (!isArray) {
            dataId.value = value[requestConfig.deleteKey];
        } else {
            dataId.value = value.length > 0 ? value.map(item => item[requestConfig.deleteKey]).join() : ""
        }

        console.log(dataId.value);
    }

    // 展示删除提示框
    function handlerDeleteConfirm() {

        proxy.deleteConfirm({
            thenFun: () => {
                return deleteRow();
            },
        });
    }

    // 删除选中的数据
    function deleteRow() {

        const url = requestUrl?.[requestConfig.url]?.delete?.url;
        const method = requestUrl?.[requestConfig.method]?.delete?.method || "post";
        if (!url) {
            throw new Error("URL 地址不存在");
        }

        const reqeust_params = {
            url,
            method,
            data: { [requestConfig.deleteKey]: dataId.value },
        }
        return new Promise((resolve, reject) => {
            CommonApi(reqeust_params).then(response => {
                proxy.$message.success(response.message);
                loadData();
                dataId.value = "";
                resolve(response);
            }).catch(error => {
                reject(error)
            });
        });
    }

    function requestData(params) {

        const { config, searchData, data } = params;

        requestConfig = { ...requestConfig, ...config };
        requestConfig.data = { ...requestConfig.data, ...data, ...searchData };

        if (!requestConfig.url) {
            return false;
        }
        loadData();
    }

    function loadData() {
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

    return { dataId, responseData, requestData, saveDataId, handlerDeleteConfirm };
}