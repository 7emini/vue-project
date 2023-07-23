<template>
  <el-radio-group v-model="dataValue" @change="handlerChange">
    <el-radio v-for="radio in data.options" :key="radio.value" :label="radio.value">{{ radio.label }}</el-radio>
  </el-radio-group>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  dataValue: {
    type: [String, Boolean, Number],
    default: false,
  },
});

const data = reactive(props.data);
const dataValue = ref(props.dataValue); 

const emits = defineEmits(["update:dataValue", "callback"]);

function handlerChange(val) {
    emits("update:dataValue", val);
    emits("callback", {
    type: "checkbox",
    value: val,
    data: data,
  });
}

watch(()=>props.dataValue, (newValue)=>{
    dataValue.value = newValue;
})

</script>
