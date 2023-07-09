import { reactive } from "vue";

import { TableData } from "@/apis/common";

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
    if (!request_config.has) { return false; }
    if (!request_config.url) { return false; }
    const request_data = {
        url: request_config.url,
        method: request_config.method,
        data: request_config.data,
    }
    TableData(request_data).then(response=>{
        table_data.data = response.data.data;
        table_data.total = response.data.total;
    })
  };

  const requestData = (data = {}) => {
    request_config = { ...request_config, ...data };
    loadData();
  };

  return { table_data, requestData };
}
