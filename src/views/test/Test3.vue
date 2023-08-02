<template>
  <div>
    <DataTable :tableConfig="tableConfig" :tableColumns="tableColumns" :requestConfig="tableRequest">
      <template v-slot:operation="soltData">
        <el-button type="danger" @click="handlerDetailed(soltData.data.id)">编辑</el-button>
        <el-button  @click="handlerDelete(soltData.data.id)">删除</el-button>
      </template>
    </DataTable>
  </div>
</template>
<script setup>
import DataTable from "@/components/Data/BaseTable";
import { provide, reactive } from "vue";
import { getDate } from "@/utils/common";

const tableColumns = reactive([
  { label: "ID", prop: "id", type: "text", width: "80", align:"center"},
  {
    label: "测试",
    props: [
      { name: "id", class: "row-first-line" },
      { name: "title", class: "row-second-line" },
    ],
    type: "lineText",
    width: "500",
    align: "center",
  },
  { label: "标题", prop: "title", type: "text", width: "500", align:"center" },
  { label: "类别", prop: "category_name", type: "text", width: "500", align:"center" },
  {
    label: "日期",
    prop: "createDate",
    type: "function",
    callback: (row) => {
      return getDate({ value: row.currentDate * 1000 });
    },
    width: "500",
    align:"center",
  },
  {
    label: "发布状态",
    prop: "status",
    type: "switch",
    width: "100",
    api_module: "info",
    api_key: "info_status",
    key_id: "id",
    align: "center",
  },
  {
    label: "操作",
    type: "slot",
    slotName: "operation",
    delete_elem: true,
    width: "200",
    align: "center"
  },
]);

const tableConfig = reactive({
  useSelection: false,
  useBatchDelete: true,
  usePagination: true,
  useSearch: true,
});

const tableRequest = reactive({
  url: "info",
  delete_key: "id",
  data: {
    pageNumber: 1,
    pageSize: 10,
  },
});

const searchConfig = reactive({
  labelWidth:"80px",
  items: [
    {
      component: "cascader",
      label: "类别",
      prop: "category_id",
      props: {
        label: "category_name",
        value: "id",
      },
      url: "category",
      col: 6,
    },
    {
      component: "select",
      label: "发布状态",
      prop: "status",
      width: "100px",
      options: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      col: 6,
    },
    {
      component: "keyword",
      label: "关键字",
      prop: "keyword",
      options: [
        { label: "ID", value: "id" },
        { label: "标题", value: "title" },
      ],
      col: 6
    },
  ],
  // 表单绑定的字段，可设置默认值
  fields: {
    category_id: "",
    status: "",
  },
});

provide("searchConfig", searchConfig);

function handlerDelete(id) {

}

function handlerDetailed(id) {

}

</script>
