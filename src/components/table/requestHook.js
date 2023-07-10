import { reactive } from "vue";

import { TableData } from "@/apis/common";

import ApiUrl from "@/apis/requestUrl";

export function requestHook() {
  let request_config = {
    has: true,
    url: "",
    method: "post",
    data: "",
  };

  const table_data = reactive({
    data: [],
    total: 0,
  });

  const loadData = () => {
    if (!request_config.has) {
      return false;
    }
    if (!request_config.url) {
      return false;
    }
    console.log(request_config.url);
    const url = ApiUrl[request_config.url]?.list?.url;
    console.log(url);
    const method = ApiUrl[request_config.method]?.list?.method || "post";
    const data = request_config.data;

    if (!url) {
      return false;
    }

    const request_data = {
      url,
      method,
      data,
    };
    return new Promise((resolve, reject) => {
      TableData(request_data).then((response) => {
        table_data.data = response.data.data;
        table_data.total = response.data.total;
        resolve(table_data.data);
      }).catch(error=>{
        reject(error);
      });
    });
  };

  const requestData = (data = {}, type = "init") => {
    if (type == "init") {
      request_config = { ...request_config, ...data };
    }
    if (type == "page") {
      request_config = { ...request_config, ...data };
    }
    return loadData();
  };

  return { table_data, requestData };
}
