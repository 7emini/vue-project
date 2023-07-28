<template>
  <div>
    <el-row v-if="config.use_search" >
      <SearchForm @callbackSearch="getTableData"></SearchForm>
    </el-row>
    <!--数据表格-->
    <el-row>
      <el-table ref="table" border 
        :data="response_table_data.data" 
        style="width: 100%" 
        v-loading="response_table_data.loading" 
        element-loading-text="加载中，请稍后..."
        header-row-class-name="base-table-header"
        :cell-class-name="cellClassName"
        :row-key="tableRowKey"
        empty-text="暂无数据"
        @selection-change="handlerSelectionChange"

      >
        <el-table-column v-if="table_config.use_selection" type="selection" width="40"></el-table-column>

        <template v-for="header in columns" :key="header.prop">
          <!--开关-->
          <el-table-column v-if="header.type === 'switch'" :label="header.label" :width="header.width">
            <template #default="scope">
              <TableSwitch :data="scope.row" :config="header"></TableSwitch>
            </template>
          </el-table-column>

          <!--操作原始列数据-->
          <el-table-column v-else-if="header.type === 'function'" :label="header.label" width="header.width">
            <template #default="scope">
              <div v-html="header.callback && header.callback(scope.row)"></div>
            </template>
          </el-table-column>

          <!--插槽-->
          <el-table-column v-else-if="header.type === 'slot'" :label="header.label" :width="header.width">
            <template #default="scope">
              <slot :name="header.slotName" :data="scope.row"></slot>
              <el-button v-if="header.delete_elem" size="small" @click="handlerDelete('delete', scope.row)">删除</el-button>
            </template>
          </el-table-column>

          <!--双行数据-->
          <el-table-column v-else-if="header.type === 'lineText'" :label="header.label" :width="header.width">
            <template #default="scope">
              <div v-for="line in header.props" :key="header.props" :class="line.class">
                <span>{{ scope.row[line.name] }}</span>
              </div>
            </template>
          </el-table-column>

          <!--普通数据展示-->
          <el-table-column v-else :label="header.label" :prop="header.prop" :width="header.width"></el-table-column>
        </template>
      </el-table>
    </el-row>

    <!--底部控制-->
    <el-row class="margin-top-30">
      <!--批量删除按钮-->
      <el-col :span="10">
        <el-button :disabled="!response_table_data.data_id" size="small" @click="handlerDelete('batch')" v-if="config.use_batch_delete">批量删除</el-button>
      </el-col>

      <!--分页-->
      <el-col :span="14">
        <TablePagination v-if="config.use_pagination" :total="response_table_data.total" :pageSize="props.request_config.data.pageSize" @sizeChange="getTableData" @currentChange="getTableData"></TablePagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { requestHook } from "./requestHook";
import { configHook } from "./configHook";

import TablePagination from "@/components/TableItem/TablePagination";
import TableSwitch from "@/components/TableItem/TableSwitch";
import SearchForm from "@/components/SearchForm";

const props = defineProps({
  table_config: {
    type: Object,
    default: () => {},
  },

  request_config: {
    type: Object,
    default: () => {},
  },

  table_columns: {
    type: Array,
    default: () => [],
  },
});

const table = ref(null);

const columns = reactive(props.table_columns);

const { config, configInit } = configHook();

const { response_table_data, requestTableData, saveDataId, handlerDeleteConfirm } = requestHook();

/**
 * 获取数据
 * @param {*} config 配置信息，包括请求地址参数等
 * @param {*} type 请求类型：初始化/分页
 */
function getTableData(config, type) {
  requestTableData(config, type)
    .then((response) => {})
    .catch((error) => {});
}

function handlerDelete(type, val) {
  if (type === "delete") {
    saveDataId(val);
  }
  handlerDeleteConfirm();
}

function handlerSelectionChange(val) {
  saveDataId(val);
}

function tableRowKey(row) {
  return row.id;
}

function cellClassName(params) {
  // const rowIndex = params.rowIndex;
  // console.log(rowIndex);

  // const columnsIndex = params.columnIndex;
  // console.log(columnsIndex);

  // const row = params.row;
  // console.log(row);

  // if (row.id === 1173 && columnsIndex == 2) {
  //   return "row-class";
  // }

}

// 数据挂载前调用
onBeforeMount(() => {
  // 初始化配置
  configInit(props.table_config);
  // 获取数据表格所需数据
  getTableData(props.request_config, "init");
});
</script>

<style type="scss">
.base-table-header {
  font-size: 18px;
  height: 80px;
}

.row-first-line {
  font-size: 16px;
  margin-bottom: 5px;
}

.row-second-line {
  font-size: 14px;
}

.row-class {
  background-color: aquamarine;
  .row-first-line {
    background-color: blue;
  }
}
</style>
