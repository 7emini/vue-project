<template>
    <el-input-number v-model="dataValue" :min="min||0" :max="max||999" @change="handleChange" />
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    min:{
        type:Number,
        default:0,
    },

    max:{
        type:Number,
        default:999,
    },
    dataValue: {
        type:Number,
        default:0,
    }
});

const min =  ref(props.min);
const max =  ref(props.max);
const dataValue =  ref(props.dataValue);


const emits = defineEmits(["update:dataValue", "callback"]);

function handleChange(value) {
    emits("update:dataValue", value);
}

watch(()=>props.dataValue, (newValue)=>{
    dataValue.value = newValue;
})

</script>

<style type="scss" scoped>

</style>