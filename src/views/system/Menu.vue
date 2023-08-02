<template>
  <div>
    <DataTable :columns="tableSetup.columns" :tableConfig="tableSetup.tableConfig" :requestConfig="tableSetup.requestConfig">
      <template v-slot:operation="slotData">
        <el-button type="danger" @click="handlerMenu('edit', slotData.data.menu_id)">编辑</el-button>
        <el-button type="danger" @click="handlerMenu('add_sub', slotData.data.menu_id)">添加子级</el-button>
      </template>
    </DataTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%" @close="handlerDialogClose" @open="handlerDialogOpen">
      <DataForm ref="basisFormRef" :loading="formSetup.loading" :items="formSetup.items" :buttons="formSetup.buttons" :fields="formSetup.fields" labelWidth="100px" @callback="handlerSubmit" @reset="handlerResetForm">
        <template v-slot:menuFunction>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="8">功能</el-col>
            <el-col :span="8">标识符</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>

          <el-row :gutter="10" style="width: 100%" v-for="(item, index) in formSetup.pageItems" :key="item.id">
            <el-col :span="8"><el-input v-model.trim="item.label"></el-input></el-col>
            <el-col :span="8"><el-input v-model.trim="item.value"></el-input></el-col>
            <el-col :span="4"><el-button @click="handlerDel(index)">删除</el-button></el-col>
          </el-row>

          <el-row>
            <el-col :span="4"><el-button @click="handlerPush">添加功能</el-button></el-col>
          </el-row>
        </template>
      </DataForm>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, provide, ref } from "vue";
import { useStore } from "vuex";

import { MenuCreate, MenuDetailed, MenuUpdate } from "@/apis/menu";

import DataTable from "@/components/Data/BaseTable";
import DataForm from "@/components/Data/BaseForm";
import { formatResponseData } from "@/utils/format";

const store = useStore();

// 表单dom对象
const basisFormRef = ref(null);

// 列表所需数据
const tableSetup = reactive({
  columns: [
    { label: "菜单名称", prop: "menu_name" },
    { label: "菜单路径", prop: "menu_path" },
    { label: "映射组件", prop: "menu_component" },
    { label: "重定向", prop: "menu_redirect" },
    { label: "是否隐藏", prop: "menu_hidden", type: "switch", key_id:"menu_id", api_module:"menu", api_key:"hidden_status"},
    { label: "是否禁用", prop: "menu_disabled", type: "switch", key_id:"menu_id", api_module:"menu", api_key:"disabled_status"},
    { label: "操作", type: "slot", slotName: "operation", width: "300", useDelete: true },
  ],

  tableConfig: {
    useSelection: true,
    useBatchDelete: false,
    usePagination: false,
    useSearch: true,
    useActionRequest: true,
  },

  requestConfig: {
    url: "menu",
    data: {},
    deleteKey: "menu_id", // 删除动作所需的主键
    rowKey: "menu_id", // 行主键
  },
});

// 搜索组件配置
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
        handlerMenu("add");
      },
    },
  ],
});

// 表单所需数据
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
  fields: reactive({
    menu_name: "",
    menu_path: "",
    menu_router: "",
    menu_component: "",
    menu_sort: 1,
    menu_disabled: "0",
    menu_hidden: "0",
    menu_keep: "0",
    menu_redirect: "",
    menu_icon:"",
  }),
  // 页面功能
  pageItems: [{ label: "", value: "" }],
});

// 将组件配置穿透传递给子组件，配置搜索组件
provide("searchConfig", searchConfig);

// 表单的操作类型（添加/更新）
const menuHandlerFlag = ref("");

// 当前编辑的数据ID
const rowId = ref("");

// 表单操作类型和dialog标题对照表
const dialogTitleItems = reactive({
  add: "添加一级菜单",
  add_sub: "添加子级菜单",
  edit: "编辑菜单",
});

// dialog 标题
const dialogTitle = ref("");

// 是否展示Dialog对话框
const dialogVisible = ref(false);

// 按钮事件（添加一级菜单 add、添加子级别菜单 add_sub、编辑 edit）
function handlerMenu(type, id) {
  rowId.value = id;
  menuHandlerFlag.value = type;
  dialogVisible.value = true;
  dialogTitle.value = dialogTitleItems[type];
  console.log(type, id);
}

// 提交表单
function handlerSubmit() {
  if (menuHandlerFlag.value === "add" || menuHandlerFlag.value === "add_sub") {
    handlerMenuCreate();
  }

  if (menuHandlerFlag.value === "edit" && rowId) {
    handlerMenuEdit();
  }
}

function handlerMenuCreate() {
  formSetup.loading = true;
  const requestData = { ...formSetup.fields, menu_fun: formatPageItems() };
  // console.log(requestData);
  if (menuHandlerFlag.value === "add_sub") {
    requestData.parent_id = rowId.value;
  }
  MenuCreate(requestData)
    .then((response) => {
      formSetup.loading = false;
      console.log("点击提交关闭dialog");
      formSetup.loading = false;
      dialogVisible.value = false;
      store.commit("app/SET_TABLE_REQUEST"); // 要求数据表格请求并刷新数据
    })
    .catch((error) => {
      formSetup.loading = false;
    });
}

function handlerMenuEdit() {
  formSetup.loading = true;
  const requestData = { ...formSetup.fields, menu_fun: formatPageItems(), menu_id:rowId.value };
  // console.log(requestData);
  MenuUpdate(requestData)
    .then((response) => {
      formSetup.loading = false;
      console.log("点击提交关闭dialog");
      formSetup.loading = false;
      dialogVisible.value = false;
      store.commit("app/SET_TABLE_REQUEST"); // 要求数据表格请求并刷新数据
    })
    .catch((error) => {
      formSetup.loading = false;
    });
}

// 构建添加页面功能的请求参数
function formatPageItems() {
  const data = Object.assign([], formSetup.pageItems);
  const dataItems = data.filter((item) => item.label && item.value);
  return JSON.stringify(dataItems);
}

// Dialog 关闭事件
function handlerDialogClose() {
  resetForm();
}

// Dialog 打开事件
function handlerDialogOpen() {
  // 如果是编辑模式，就获取数据并展示
  if (menuHandlerFlag.value === "edit" && rowId) {
    handlerMenuDetailed();
  }
}

function handlerMenuDetailed() {
  formSetup.loading = true;
  MenuDetailed({ menu_id: rowId.value })
    .then((response) => {
      formSetup.loading = false;
      const formatResponse = formatResponseData(response.data, formSetup.fields);
      // console.log(formatResponse);
      formSetup.fields = Object.assign(formSetup.fields, formatResponse);
      // console.log(formSetup.fields);

      const pageItemsInit = response.data.menu_fun;
      pageItemsInit && (formSetup.pageItems = JSON.parse(pageItemsInit));
    })
    .catch((error) => {
      formSetup.loading = false;
      console.log(error);
    });
}

// 表单组件重置数据回调
function handlerResetForm() {
  formSetup.pageItems = [{ label: "", value: "" }];
}

// 重置表单数据
function resetForm() {
  basisFormRef.value && basisFormRef.value.handlerResetForm();
  formSetup.pageItems = [{ label: "", value: "" }];
  dialogVisible.value = false;
}

// 删除页面功能
function handlerDel(index) {
  console.log(index);
  formSetup.pageItems.splice(index, 1);
}

// 添加页面功能
function handlerPush() {
  formSetup.pageItems.push({ label: "", value: "" });
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
