<template>
  <div>
    <BaseTable @onload="handlerOnload" :columns="table_config.table_header" :config="table_config.config" :request="table_config.request"> </BaseTable>
  </div>
</template>

<script setup>
import BaseTable from "@/components/table";
import { reactive } from "vue";

const table_config = reactive({
  table_header: [
    { label: "标题", prop: "title", type: "text"},
    { label: "类别", prop: "category_name",  type: "text"},
    { label: "日期", prop: "createDate",  type: "text"},
    { label: "发布状态", prop: "status", type: "switch"},
  ],
  config: {
    selection: true,
    batch_delete: true,
    pagination: true,
  },
  request: {
    url: "info",
    data: {
      pageNumber: 1,
      pageSize: 10,
    },
  },
});



function handlerOnload(data) {
  console.log(data);
}
</script>

<style></style>
