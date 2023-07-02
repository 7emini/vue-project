<template>
  <div>
    <h1 class="logo"><img :src="logoPath" alt="手摸手撸前端代码" /></h1>
    <el-menu :default-active="currentPath" background-color="#344a5f" text-color="#fff" active-text-color="#fff" router :collapse="collapse">
      <template v-for="item in routers" :key="item.path">
        <template v-if="!item.hidden">
          <!--单级菜单 条件：子路由组只有一个不隐藏的路由-->
          <template v-if="hasOnlyChild(item.children)">
            <el-menu-item :index="item.children[0].path">
              <i style="line-height: 100%"><svg-icon :icon-name="item.meta && item.meta.icon" class-name="aside-menu-svg"></svg-icon></i>
              <!-- <el-icon><location /></el-icon> -->

              <template #title
                ><span>{{ item.children[0].meta && item.children[0].meta.title }}</span></template
              >
            </el-menu-item>
          </template>

          <!--多级菜单 显示条件：子路由组有多个不隐藏的路由-->
          <template v-else>
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <i style="display: block; line-height: 100%"><svg-icon :icon-name="item.meta && item.meta.icon" class-name="aside-menu-svg"></svg-icon></i>
                <span>{{ item.meta && item.meta.title }}</span>
              </template>
              <template v-for="child in item.children">
                <el-menu-item v-if="!child.hidden" :index="child.path">
                  <!-- <svg-icon></svg-icon> -->
                  {{ child.meta && child.meta.title }}
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const { options } = useRouter();
const { path } = useRoute();
const store = useStore();

// 图片路径
const logoPath = computed(() => {
  return store.state.app.collapse ? require("@/assets/images/logo-min.png") : require("@/assets/images/logo.png");
});

// 获取全部路由
const routers = options.routes;

// 监听当前的路由信息
const currentPath = computed(() => path);

const collapse = computed(() => {
  return store.state.app.collapse;
});

// 判断子路由组是否只有一个子路由
function hasOnlyChild(children) {
  if (!children) {
    return false;
  }
  const childRouter = children.filter((item) => {
    return item.hidden ? false : true;
  });
  if (childRouter.length === 1) {
    return true;
  }
  return false;
}
</script>

<style lang="scss" scoped>
.logo {
  padding: 20px 0;
  border-bottom: 1px solid #2d4153;
  img {
    margin: auto;
  }
}
</style>
