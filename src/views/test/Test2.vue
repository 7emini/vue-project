<template>
<h1>{{ message }}</h1>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { errorHttpTest } from '@/apis/common';
const message = ref("Hello World");
errorHttpTest().then((response)=>{
    console.log(response);
}).catch((errorData)=>{
    console.log(errorData);
})
</script>