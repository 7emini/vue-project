<template>
  <el-input v-model="dataValue" @input="handlerEnter"   :type="data.input_type || 'text'" :placeholder="data.placeholder" :maxlength="data.maxlength" :minlength="data.minlength"></el-input>
</template>

<script setup>
import { reactive, ref, watch} from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: {
      type: "text",
      placeholder: "",
      maxlength: 1000,
      minlength: 0,
    },
  },
  dataValue: {
    type: [Number, String],
    default: "",
  },
});

const emits = defineEmits(["update:dataValue", "callback"]);

const data = reactive(props.data);

const dataValue = ref(props.dataValue);

function handlerEnter(val) {
  emits("update:dataValue", val);
}

watch(()=>props.dataValue, (newValue)=> {
  dataValue.value = newValue;
});

</script>
