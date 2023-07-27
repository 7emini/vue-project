<template>
    <el-switch v-model="dataValue" :active-value="data.active_value" :inactive-value="data.inactive_value" @change="handlerChange" />
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

watch(()=>props.dataValue, (newValue)=>{
    dataValue.value = newValue;
})

</script>