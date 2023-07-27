<template>
  <el-row class="margin-bottom-20">
    <SearchForm @callbackSearch="getTableData" @callbackReset="resetTableData"></SearchForm>
  </el-row>
  <el-row>
    <el-table ref="table" border :data="responseData.data" style="width: 100%" v-loading="responseData.loading" element-loading-text="加载中，请稍后..." header-row-class-name="base-table-header" :cell-class-name="tableCellClassName" :row-key="tableRowKey" empty-text="暂无数据">
      <el-table-column v-if="tableConfig.use_selection" type="selection" width="40"></el-table-column>

      <template v-for="header in tableColumns" :key="header.prop">
        <!--开关-->
        <el-table-column :align="header.align" v-if="header.type === 'switch'" :label="header.label" :width="header.width">
          <template #default="scope">
            <Switch :data="scope.row" :config="header"></Switch>
          </template>
        </el-table-column>

        <!--操作原始列数据-->
        <el-table-column :align="header.align" v-else-if="header.type === 'function'" :label="header.label" width="header.width">
          <template #default="scope">
            <div v-html="header.callback && header.callback(scope.row)"></div>
          </template>
        </el-table-column>

        <!--插槽-->
        <el-table-column :align="header.align" v-else-if="header.type === 'slot'" :label="header.label" :width="header.width">
          <template #default="scope">
            <slot :name="header.slot_name" :data="scope.row"></slot>
          </template>
        </el-table-column>

        <!--双行数据-->
        <el-table-column :align="header.align" v-else-if="header.type === 'lineText'" :label="header.label" :width="header.width">
          <template #default="scope">
            <div v-for="line in header.props" :key="header.props" :class="line.class">
              <span>{{ scope.row[line.name] }}</span>
            </div>
          </template>
        </el-table-column>

        <!--普通数据展示-->
        <el-table-column :align="header.align" v-else :label="header.label" :prop="header.prop" :width="header.width"></el-table-column>
      </template>
    </el-table>
  </el-row>
  <el-row class="margin-top-20">
    <el-col :span="12"></el-col>
    <el-col :span="12">
      <Pagination v-if="tableConfig.use_pagination" :total="responseData.total" :pageSize="requestConfig.data.pageSize" @sizeChange="getTableData" @currentChange="getTableData"></Pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import { configHook } from "./configHook";
import { requestHook } from "./requestHook";

import Pagination from "@/components/Data/TableItem/Pagination";
import Switch from "@/components/Data/TableItem/Switch";
import SearchForm from "@/components/Data/SearchForm";

const props = defineProps({
  tableConfig: {
    type: Object,
    default: {},
  },
  requestConfig: {
    type: Object,
    default: {},
  },
  tableColumns: {
    type: Array,
    default: [],
  },
});

// 父组件传递过来的数据
const tableConfig = reactive(props.tableConfig); // 表格配置
const tableColumns = reactive(props.tableColumns); // 表格列配置
const requestConfig = reactive(props.requestConfig); // 请求配置

const { responseConfig, configInit } = configHook(); // 表格配置Hook
const { responseData, requestData } = requestHook(); // 表格数据请求Hook

function tableRowKey(row) {
  return row.id;
}

function tableCellClassName(params) {
  return "row";
}

/**
 * 获取表格数据
 * @param {*} requestConfig 请求配置
 * @param {*} data 请求参数
 * @param {*} searchData 搜索请求参数
 */
function getTableData(params) {
  requestData(params)
    .then((response) => {
      console.log(responseData);
    })
    .catch((error) => {
      console.log(error);
    });
}

function resetTableData() {
  getTableData({
    config: requestConfig,
  });
}

// 在组件挂载之前
onBeforeMount(() => {
  // 1.初始化表格配置
  configInit(tableConfig);
  // 2.获取表格数据
  getTableData({
    config: requestConfig,
  });
});
</script>

<style lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}

.margin-bottom-20 {
  margin-bottom: 20px;
}
</style>
