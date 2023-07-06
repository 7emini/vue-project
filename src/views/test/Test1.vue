<template>
  <div>
    <h1>{{ message }}</h1>
    <br />
    <el-button @click="request" type="primary">错误请求测试</el-button>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { errorHttpTest } from "@/apis/common";
const message = ref("Hello World");

function request() {
  errorHttpTest()
    .then((response) => {
      console.log(response);
    })
    .catch((errorData) => {
      console.log(errorData);
    });
}
console.log("Hello");

</script>
