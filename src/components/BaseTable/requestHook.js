import { reactive, getCurrentInstance } from "vue";
import { CommonApi } from "@/apis/common";
import RequestUrl from "@/apis/requestUrl";
import aipUrl from "@/apis/requestUrl";

export function requestHook() {

    const { proxy } = getCurrentInstance();

    // 请求配置
    let request_config = {
        url: "",
        method: "",
        data: {},
        search_data: {},
        delete_key: "id",
    }

    // 响应数据
    const response_table_data = reactive({
        data: [],
        total: 0,
        loading: false,
        data_id: "",
    });

    /**
     * 请求表格数据 
     * @param {*} config 
     * @param {*} type 请求数据的类型：init page 
     * @returns 
     */
    const requestTableData = (config = {}, type) => {
        if (type === "init") {
            request_config = { ...request_config, ...config };
        }

        if (type === "page") {
            request_config.data = { ...request_config.data, ...config };
        }

        if (type === "search") {
            request_config.data.pageNumber = 1,
            request_config.search_data = config;
        }

        if (!request_config.url) {
            return false;
        }
        return loadData();
    }

    const loadData = ()=>{
        // 获取默认配置的url
        const url = RequestUrl[request_config.url]?.list?.url;
        // 获取默认配置的请求方式
        const method = RequestUrl[request_config.method]?.list?.method || "post";
        // 获取默认配置的请求参数
        const data = {...request_config.data, ...request_config.search_data};

        const reqeust_params = {
            url,
            method,
            data,
        }

        response_table_data.loading = true;
        return new Promise((resolve, reject) => {
            CommonApi(reqeust_params).then((response) => {
                response_table_data.data = response.data.data;
                response_table_data.total = response.data.total;
                response_table_data.loading = false;
                resolve(response_table_data);
            }).catch(error => {
                response_table_data.loading = false;
                reject(error);
            });
        });
    }


    /**
     * 保存当前选中的数据ID
     * @param {*} value 
     */
    const saveDataId = (value) => {
        const isArray = Array.isArray(value);
        if (!isArray) {
            response_table_data.data_id = value[request_config.delete_key];
        } else {
            response_table_data.data_id = value.length > 0 ? value.map(item => item[request_config.delete_key]).join() : "";
        }
    }

    function handlerDeleteConfirm(value) {
        proxy.deleteConfirm({
            thenFun: () => {
                return deleteRow(value);
            },
        });
    }

    function deleteRow() {

        const url = aipUrl?.[request_config.url]?.delete?.url;
        const method = aipUrl?.[request_config.method]?.delete?.method || "post";
        if (!url) {
            return false;
        }

        const reqeust_params = {
            url,
            method,
            data: { id: response_table_data.data_id },
        }
        return new Promise((resolve, reject) => {
            CommonApi(reqeust_params).then(response => {
                proxy.$message.success(response.message);
                loadData();
                response_table_data.data_id = "";
                resolve(response);
            }).catch(error => {
                reject(error)
            });
        });
    }



    return { response_table_data, requestTableData, saveDataId, handlerDeleteConfirm }
}