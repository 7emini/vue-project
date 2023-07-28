<template>
  <div>
    <DataTable :tableColumns="tableSetup.tableColumns" :tableConfig="tableSetup.tableConfig" :requestConfig="tableSetup.requestConfig">
      <template>
        <el-button type="danger">编辑</el-button>
        <el-button type="danger">添加子级</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </DataTable>
    <el-dialog title="标题" v-model="dialogVisible" width="30%"></el-dialog>
  </div>
</template>

<script setup>
import { reactive, provide, ref } from "vue";

import DataTable from "@/components/Data/BaseTable";

const tableSetup = reactive({
  tableColumns: [
    { label: "菜单名称", prop: "menu_name" },
    { label: "菜单路径", prop: "menu_path" },
    { label: "映射组件", prop: "menu_component" },
    { label: "重定向", prop: "menu_redirect" },
    { label: "是否隐藏", prop: "menu_hidden", type: "switch" },
    { label: "是否禁用", prop: "menu_disabled", type: "switch" },
    { label: "操作", type: "slot", slotName: "operation", width: "250" },
  ],

  tableConfig: {
    use_selection: false,
    use_batch_delete: false,
    use_pagination: false,
    use_search: true,
  },

  requestConfig: {
    url: "menu",
    data: {},
  },
});

const searchConfig = reactive({
  labelWidth: "70px",
  items: [
    {
      component: "select",
      label: "是否禁用",
      prop: "menu_disabled",
      width: "100px",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
    {
      component: "keyword",
      label: "关键字",
      prop: "keyword",
      options: [
        { label: "菜单名称", value: "menu_name" },
        { label: "菜单路径", value: "menu_path" },
        { label: "组件名称", value: "menu_component" },
      ],
    },
  ],
  buttons: [
    {
      label: "添加一级菜单",
      id: "add",
      callback: () => {
        dialogVisible.value = true;
      },
    },
  ],
});

const dialogVisible = ref(false);

provide("searchConfig", searchConfig);

</script>

<style lang="scss" scoped></style>
