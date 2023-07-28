<template>
  <div>
    <BaseTable :table_columns="table_data.columns" :table_config="table_data.config" :request_config="table_data.request">
      <template v-slot:operation="soltData">
        <el-button type="danger" size="small" @click="handlerDetailed(soltData.data.id)">编辑</el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import BaseTable from "@/components/BaseTable";
import { getDate } from "@/utils/common";
import { provide, reactive } from "vue";

const table_data = reactive({
  columns: [
    { label: "ID", prop: "id", type: "text", width: "500" },
    {
      label: "测试",
      props: [
        { name: "id", class: "row-first-line" },
        { name: "title", class: "row-second-line" },
      ],
      type: "lineText",
      width: "500",
    },
    { label: "标题", prop: "title", type: "text", width: "500" },
    { label: "类别", prop: "category_name", type: "text", width: "200" },
    {
      label: "日期",
      prop: "createDate",
      type: "function",
      callback: (row) => {
        return getDate({ value: row.currentDate * 1000 });
      },
    },
    {
      label: "发布状态",
      prop: "status",
      type: "switch",
      width: "100",
      api_module: "info",
      api_key: "info_status",
      key_id: "id",
    },
    {
      label: "操作",
      type: "slot",
      slotName: "operation",
      delete_elem: true,
      width: "200",
    },
  ],
  config: {
    use_selection: true,
    use_batch_delete: true,
    use_pagination: true,
    use_search: true,
  },
  request: {
    url: "info",
    delete_key: "id",
    data: {
      pageNumber: 1,
      pageSize: 10,
    },
  },
});

const searchConfig = reactive({
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
      col: 8,
    },
    {
      component: "select",
      label: "发布状态",
      prop: "status",
      width: "100px",
      options: [
        { value: "1", label: "是" },
        { value: "2", label: "否" },
      ],
      col: 8,
    },
    {
      component: "keyword",
      label: "关键字",
      prop: "keyword",
      options: [
        { label: "ID", value: "id" },
        { label: "标题", value: "title" },
      ],
      col: 8
    },
  ],
  // 表单绑定的字段，可设置默认值
  fields: {
    category_id: "",
    status: "",
  },
  buttons: {
    use_resetButton:true,
  }
});

provide("searchConfig", searchConfig);

function handlerDetailed(id) {
  alert(id);
}
</script>

<style></style>
