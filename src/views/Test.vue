<template>
<h1>{{ message }}</h1>
</template>

<script setup>
import { reactive, ref } from 'vue';
const message = ref("Hello World");
</script>