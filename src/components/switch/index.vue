<template>
    <el-switch v-model="init_data.value" :loading="init_data.loading">

    </el-switch>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    data:{
        type: Object,
        default:()=>{}
    },
    config:{
        type: Object,
        default:()=>{}
    }
})

const config = reactive(props.config);
const data = reactive(props.data);

const init_data = reactive({
    value:data[config.prop],
    loading:false,
})
</script>