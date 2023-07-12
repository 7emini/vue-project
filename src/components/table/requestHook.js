import { reactive } from "vue";

import { TableData } from "@/apis/common";

import ApiUrl from "@/apis/requestUrl";

export function requestHook() {
  // 参数 集合对象
  let request_config = {
    has: true, //是否请求
    url: "", // 请求地址
    method: "post", //请求类型
    data: {}, // 请求参数
  };

  // 结果 集合对象
  const table_data = reactive({
    data: [], // 请求到的数据
    total: 0, // 数据列表数量
    loading: false,
  });

  // 加载数据
  const loadData = () => {
    table_data.loading = true;
    // 判断是否允许请求
    if (!request_config.has) {
      return false;
    }

    // 判断是否有请求地址
    if (!request_config.url) {
      return false;
    }

    // 获取默认配置的url
    const url = ApiUrl[request_config.url]?.list?.url;
    // 获取默认配置的请求方式
    const method = ApiUrl[request_config.method]?.list?.method || "post";
    // 获取默认配置的请求参数
    const data = request_config.data;

    if (!url) {
      return false;
    }

    // 封装请求配置
    const request_data = {
      url,
      method,
      data,
    };

    // 请求数据
    return new Promise((resolve, reject) => {
      TableData(request_data)
        .then((response) => {
          table_data.data = response.data.data;
          table_data.total = response.data.total;
          table_data.loading = false;
          resolve(table_data.data);
        })
        .catch((error) => {
          table_data.loading = false;
          reject(error);
        });
    });
  };

  // 请求数据
  const requestData = (data = {}, type = "init") => {
    console.log("----------------------");
    console.log(data);
    console.log(request_config.data);
    console.log(request_config);

    // 初始化的状态
    if (type == "init") {
      request_config = { ...request_config, ...data };
    }

    // 分页状态
    if (type == "page") {
      request_config.data = { ...request_config.data, ...data };
    }

    return loadData();
  };

  return { table_data, requestData };
}
