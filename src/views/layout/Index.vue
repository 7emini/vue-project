<template>
    <div class="common-layout">
      <el-container id="layout-container">
        <el-aside id="layout-aside" width="250px"><Aside></Aside></el-aside>
        <el-container>
          <el-header id="layout-header" height="75px"><Header></Header></el-header>
          <el-main id="layout-main"><Main></Main></el-main>
        </el-container>
      </el-container>
    </div>
  </template>

<script setup>
import Aside from "./components/Aside";
import Header from "./components/Header";
import Main from "./components/Main";
</script>

<style lang="scss" scoped>
#layout-container {
  height: 100vh;
}
#layout-aside {
  background-color: #344a5f;
}
#layout-header {
  background-color: #77bc99;
}
#layout-main {
  background-color: #bc77a1;
}
</style>
