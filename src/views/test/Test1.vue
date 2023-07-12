<template>
  <div>
    <BaseTable @onload="handlerOnload" :columns="table_config.table_header" :config="table_config.config" :request="table_config.request">
      <template v-slot:operation="slotData">
        <el-button type="danger" size="mini" @click="handlerDetailed(slotData.data.id)"> 编辑</el-button>
        <el-button size="mini" @click="deleteConfirm(slotData.data.id)"> 删除</el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import BaseTable from "@/components/table";
import { getDate } from "@/utils/common";
import { reactive } from "vue";

const table_config = reactive({
  table_header: [
    { label: "标题", prop: "title", type: "text", width: "500" },
    { label: "类别", prop: "category_name", type: "text", width: "200" },
    {
      label: "日期",
      prop: "createDate",
      type: "function",
      callback: (row) => {
        // alert(row.currentDate);
        return getDate({ value: row.currentDate * 1000 });
      },
    },
    { label: "发布状态", prop: "status", type: "switch", width: "100", api_module: "info", api_key: "info_status", api_url: "/news/status/", key_id: "id" },
    {
      label: "操作",
      type: "slot",
      slot_name: "operation",
      width: "200",
    },
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
