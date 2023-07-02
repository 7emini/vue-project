<template>
  <div class="common-layout">
    <el-container id="layout-container">
      <el-aside id="layout-aside" :width="aside_width"><Aside></Aside></el-aside>
      <el-container>
        <el-header id="layout-header" height="75px"><Header></Header></el-header>
        <el-main id="layout-main"><Main></Main></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Aside from "./components/Aside";
import Header from "./components/Header";
import Main from "./components/Main";

const store = useStore();

const aside_width = computed(() => {
  const collapse = store.state.app.collapse;
  return collapse ? "64px" : "250px";
});
</script>

<style lang="scss" scoped>
#layout-container {
  height: 100vh;
}
#layout-aside {
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
}
#layout-header {
  position: relative;
  z-index: 0;
  background-color: $color_white;
  @include webkit(box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.5));
}
#layout-main {
  background-color: #bc77a1;
}
</style>
