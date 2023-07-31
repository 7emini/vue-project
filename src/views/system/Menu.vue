<template>
  <div>
    <DataTable :columns="tableSetup.columns" :tableConfig="tableSetup.tableConfig" :requestConfig="tableSetup.requestConfig">
      <template v-slot:operation="slotData">
        <el-button type="danger">编辑</el-button>
        <el-button type="danger">添加子级</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </DataTable>
    <el-dialog title="添加一级别菜单" v-model="dialogVisible" width="30%" @close="handlerDialogClose">
      <DataForm ref="basisFormRef" :loading="formSetup.loading" :items="formSetup.items" :buttons="formSetup.buttons" :fields="formSetup.fields" labelWidth="100px" @callback="handlerSubmit">
        <template v-slot:menuFunction>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="8">功能</el-col>
            <el-col :span="8">标识符</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>

          <el-row :gutter="10" style="width: 100%">
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="4"><el-button>删除</el-button></el-col>
          </el-row>

          <el-row :gutter="10" style="width: 100%">
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="4"><el-button>删除</el-button></el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="8"><el-input></el-input></el-col>
            <el-col :span="4"><el-button>删除</el-button></el-col>
          </el-row>

          <el-row>
            <el-col :span="4"><el-button>添加功能</el-button></el-col>
          </el-row>
        </template>
      </DataForm>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, provide, ref } from "vue";
import { useStore } from "vuex";

import { MenuCreate } from "@/apis/menu";

import DataTable from "@/components/Data/BaseTable";
import DataForm from "@/components/Data/BaseForm";



const tableSetup = reactive({
  columns: [
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
    use_actionRequest: true,
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

const formSetup = reactive({
  loading: false,
  items: [
    { component: "input", label: "菜单名称", prop: "menu_name", required: false },
    { component: "input", label: "菜单路径", prop: "menu_path", required: false },
    { component: "input", label: "路由名称", prop: "menu_router", required: false },
    { component: "input", label: "映射组件", prop: "menu_component", required: false },
    { component: "upload", label: "图标", prop: "menu_icon", required: false },
    { component: "inputNumber", label: "排序", prop: "menu_sort", required: false },
    {
      component: "radio",
      label: "是否禁用",
      prop: "menu_disabled",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
    {
      component: "radio",
      label: "是否隐藏",
      prop: "menu_hidden",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
    {
      component: "radio",
      label: "是否缓存",
      prop: "menu_keep",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
    { component: "input", label: "重定向", prop: "menu_redirect", required: false },
    { component: "slot", label: "页面功能", slotName: "menuFunction" },
  ],
  buttons: [
    { label: "确认添加", type: "danger", key: "submit", callback: () => {} },
    { label: "重置", key: "reset" },
  ],
  fields: {
    menu_name: "",
    menu_path: "",
    menu_router: "",
    menu_component: "",
    menu_sort: 1,
    menu_disabled: "0",
    menu_hidden: "0",
    menu_keep: "0",
    menu_redirect: "",
  },
});

const store = useStore();

function handlerSubmit() {
  formSetup.loading = true;

  // MenuCreate(formSetup.fields).then((response) => {
  //   formSetup.loading = false;
  // }).catch(error=>{
  // formSetup.loading = false;
  // });
  console.log("点击提交关闭dialog");
  formSetup.loading = false;
  dialogVisible.value = false;
  store.commit("app/SET_TABLE_REQUEST");
}

const basisFormRef = ref(null);

function handlerDialogClose() {
  resetForm();
}

function resetForm() {
  dialogVisible.value = false;
  basisFormRef.value && basisFormRef.value.handlerResetForm();
}

provide("searchConfig", searchConfig);
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
