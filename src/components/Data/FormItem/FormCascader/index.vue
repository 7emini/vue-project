<template>
  <!--options 是数据源 props 是配置项-->
  <el-cascader v-model="dataValue" :options="data.options" :props="data.props" @change="handlerChange"></el-cascader>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { CommonApi } from "@/apis/common";
import apiUrl from "@/apis/requestUrl";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  dataValue: {
    type: [String, Number],
    default: 0,
  },
});

const emit = defineEmits(["update:dataValue"]);

const data = reactive(props.data);
const dataValue = ref(props.dataValue);

const getData = () => {
  const url = apiUrl?.cascader?.[data.url]?.url;
  const method = apiUrl?.cascader?.[data.url]?.method || "post";
  if (!url) {
    throw new Error("URL 地址不存在");
  }
  const request_data = {
    url,
    method,
    data: props.data,
  };

  CommonApi(request_data)
    .then((response) => {
      data.options = response.data;
    })
    .catch((error) => {});
};

const handlerChange = (value) => {
  const val = value.length !== 0 ? value[value.length - 1] : "";
  emit("update:dataValue", val);
};

watch(
  () => props.dataValue,
  (newValue) => {
    dataValue.value = newValue;
  }
);

onBeforeMount(() => {
  getData();
});
</script>

<style></style>
