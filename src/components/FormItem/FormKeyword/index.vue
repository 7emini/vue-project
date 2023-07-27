<template>
    <el-select v-model="key" placeholder="请选择" @change="handlerChange" class="keyword-select">
      <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <el-input v-model="value" :placeholder="placeholder" class="width-300" v-on:input="callback"></el-input>
</template>

<script setup>
import { reactive, toRefs } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  dataValue: {
    type: String,
    default: "",
  }
});

const emits = defineEmits(["callback"]);

const data = reactive({
  component: props.data.component,
  key: "",
  value: "",
  placeholder: "请输入搜索关键字",
  options: props.data.options,
});

const { key, value, placeholder, options, component } = toRefs(data);

function callback() {
  emits("callback", {
    type: "keyword",
    value: {key: data.key, value: data.value},
    formItem: props.data,
  });
}

function handlerChange() {
  data.value = "";
  const item = data.options.filter(item=>item.value === data.key)[0];
  data.placeholder = `请输入${item.label}`;
  callback();
}

function handlerClear() {
  data.key = "";
  data.value = "";
}


defineExpose({
  data,
  handlerClear
})

</script>

<style lang="scss" scoped>
.keyword-select {
  --el-form-inline-content-width: 100px;
  margin-right: 10px;
}

.width-300 {
  --el-input-width: 300px;
}

</style>
