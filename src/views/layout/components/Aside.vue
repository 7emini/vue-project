<template>
  <el-menu default-active="4" background-color="#344a5f" text-color="#fff" active-text-color="#ffd04b" router>
    <template v-for="item in routers" :key="item.path">
      <template v-if="!item.hidden">
        <!--单级菜单 条件：子路由组只有一个不隐藏的路由-->
        <template v-if="hasOnlyChild(item.children)">
          <el-menu-item :index="item.children[0].path">
            <template #title>{{ item.children[0].meta && item.children[0].meta.title }}</template>
          </el-menu-item>
        </template>

        <!--多级菜单 显示条件：子路由组有多个不隐藏的路由-->
        <template v-else>
          <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
            <template #title>{{ item.meta && item.meta.title }}</template>
            <template v-for="child in item.children">
              <el-menu-item v-if="!child.hidden" :index="child.path">{{ child.meta && child.meta.title }}</el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
import { useRouter } from "vue-router";

const { options } = useRouter();

// 获取全部路由
const routers = options.routes;

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

<style lang="scss" scoped></style>
