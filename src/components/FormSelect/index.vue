<template>
  <el-select v-model="dataValue"  placeholder="请选择" @change="handlerChange">
    <el-option v-for="item in data.options" :key="item.value" :label="item.label" :value="item.value"  />
  </el-select>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({

  data: {
    type: Object,
    default: {},
  },
  dataValue: {
    type: [String, Number],
    default: "",
  },
});

const emits = defineEmits(["update:dataValue", "callback"]);

const data = reactive(props.data);
const dataValue = ref(props.dataValue);

function handlerChange(val) {
    emits("update:dataValue", val);
    emits("callback", {
    type: "checkbox",
    value: val,
    data: data,
  });
}

watch(()=>props.dataValue, (newValue)=> {
    dataValue.value = newValue;
});
</script>
