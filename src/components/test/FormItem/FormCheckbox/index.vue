<template>
  <el-checkbox-group v-model="dataValue" @change="handlerChange">
    <el-checkbox v-for="checkbox in data.options" :key="checkbox.value" :label="checkbox.value">{{ checkbox.label }}</el-checkbox>
  </el-checkbox-group>
</template>
<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  dataValue: {
    type: Array,
    default: [],
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

watch(
  () => props.dataValue,
  (newValue) => {
    dataValue.value = newValue;
  }
);
</script>
