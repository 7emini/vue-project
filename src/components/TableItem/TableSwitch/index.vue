<template>
  <el-switch v-model="init_data.value" :loading="init_data.loading" :before-change="handlerSwitch"> </el-switch>
</template>

<script setup>
import { reactive, getCurrentInstance} from "vue";

import { CommonApi} from "@/apis/common";
import ApiUrl from "@/apis/requestUrl";

const props = defineProps({

  data: {
    type: Object,
    default: () => { },
  },
  config: {
    type: Object,
    default: () => { },
  },
});

// console.log(props);
const { proxy } = getCurrentInstance();
const config = reactive(props.config);
const data = reactive(props.data);

const init_data = reactive({
  value: data[config.prop],
  loading: false,
});

function handlerSwitch(value) {
  if (!data.id) {
    return false;
  }
  init_data.loading = true;


  const url = config.api_url || ApiUrl?.[config.api_module]?.[config.api_key]?.url;
  console.log(config.api_module, config.api_key);
  console.log(ApiUrl?.[config.api_module]?.[config.api_key]?.url);
  const method = config.method || ApiUrl?.[config.api_module]?.[config.api_key]?.method || "post";

  if (!url) {
    throw new Error("Url 地址不存在");
  }

  const key_id = config.key_id || 'id';

  const request_data = {
    url,
    method,
    data: {
      [key_id]: data[key_id],
      [config.prop]: !init_data.value,
    }
  }

  return new Promise((resolve, reject) => {
    CommonApi(request_data)
      .then((response) => {
        proxy.$message.success(response.message);
        data[config.prop] = value;
        init_data.loading = false;
        resolve(response);
      })
      .catch((error) => {
        init_data.loading = false;
        reject(error);
      });
  });
}
</script>
