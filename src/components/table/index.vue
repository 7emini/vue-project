<template>
  <div>
    <!--表格-->
    <el-row>
      <el-table ref="table" border :data="table_data.data" style="width: 100%" @selection-change="handlerSelectionChange">
        <el-table-column v-if="config.selection" type="selection" width="40"></el-table-column>
        <el-table-column v-for="header in data.render_header" :key="header.prop" :prop="header.prop" :label="header.label"></el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row class="margin-top-30">
      <el-col :span="6">
        <el-button v-if="config.batch_delete" :disabled="!data.row_data_id" @click="handlerDeleteConfirm(data.row_data_id)">批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <Pagination
        v-if="config.pagination"
        @sizeChange = "getList"
        @currentChange = "getList"
        :total="table_data.total"
        ></Pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Pagination from "@/components/pagination";
import { onBeforeMount, reactive } from "vue";
import { useRouter } from "vue-router";
import { deleteData, getTableList, status } from "@/apis/info";
import { getDate } from "@/utils/common";
import { getCurrentInstance } from "vue";
import { categoryHook } from "@/hooks/infoHook";
import { configHook } from "./configHook";
import { requestHook } from "./requestHook";

const { infoData: category_data, handlerGetCategory: getCategoryList } = categoryHook();
const { proxy } = getCurrentInstance();
const { push } = useRouter();

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },

  config: {
    type: Object,
    default: () => ({}),
  },

  request: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['onload'])

const { config, configInit } = configHook();
const { requestData, table_data } = requestHook();



const data = reactive({
  render_header: props.columns,
  row_data_id: "",
  loading: false,
  total: 0,
  category: 0,
  // category_options: [
  //   { label: "人工智能", value: 0 },
  //   { label: "区块链", value: 1 },
  // ],
  cascader_props: {
    label: "category_name",
    value: "id",
  },

  keyword_options: [
    { label: "ID", value: "id" },
    { label: "标题", value: "title" },
  ],
  currentPage: 1,
});

const request_data = reactive({
  pageNumber: 1,
  pageSize: 1,
  category_id: [],
  key: "",
  keyword: "",
});

function formatParams() {
  const data = Object.assign({}, request_data);
  if (data.category_id.length) {
    data.category_id = data.category_id[data.category_id.length - 1];
  } else {
    delete data.category_id;
  }

  if (data.key && data.keyword) {
    data[data.key] = data.keyword;
  }
  delete data.key;
  delete data.keyword;
  return data;
}

// 跳转到详情页
function handlerDetailed(id) {
  push({
    path: "/news-detailed",
    query: { id },
  });
}

// 设置时间展示格式
function formatDate(row) {
  return getDate({ value: row.createDate * 1000 });
}

function handlerSelectionChange(val) {
  console.log(val);
  if (val && val.length > 0) {
    const idItem = val.map((item) => item.id);
    data.row_data_id = idItem.join();
  } else {
    data.row_data_id = "";
  }
}

// function handlerSizeChange(val) {
//   console.log(val);
//   request_data.pageNumber = 1;
//   request_data.pageSize = val;
//   handlerGetList();
// }

// function handlerCurrentChange(val) {
//   request_data.pageNumber = val;
//   handlerGetList();
// }

function changeStatus(value, data) {
  data.loading = true;
  data.status = !data.status;
  status({ id: data.id, status: value })
    .then((response) => {
      proxy.$message.success(response.message);
      data.status = value;
      data.loading = false;
    })
    .catch((error) => {
      data.loading = false;
    });
}

function handlerDeleteConfirm(value) {
  proxy.deleteConfirm({
    thenFun: () => {
      return handlerDeleteValue(value);
    },
  });
}

function handlerDeleteValue(value) {
  return new Promise((resolve, reject) => {
    deleteData({ id: value })
      .then((response) => {
        proxy.$message.success(response.message);
        handlerGetList();
        data.row_data_id = "";
        resolve();
      })
      .catch((error) => {
        reject();
      });
  });
}

function getList(params, type) {
  // console.log("dd",requestData(params, type));
  console.log(params);
  requestData(params, type).then(response=>{
    emits("onload", response);
  });
}

onBeforeMount(() => {
  //   handlerGetList();
  // console.log(props.request);
  configInit(props.config);
  getList(props.request);
});
</script>

<style lang="scss" scoped>
.width-160 {
  width: 160px;
}

.width-180 {
  width: 180px;
}
.width-100 {
  width: 100px;
}
</style>
