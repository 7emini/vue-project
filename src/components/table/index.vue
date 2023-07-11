<template>
  <div>
    <!--表格-->
    <el-row>
      <el-table ref="table" border :data="table_data.data" style="width: 100%" @selection-change="handlerSelectionChange">
        <el-table-column v-if="config.selection" type="selection" width="40"></el-table-column>
        
        <!-- <el-table-column v-for="header in data.render_header" :key="header.prop" :prop="header.prop" :label="header.label"></el-table-column> -->

        <template v-for="header in data.render_header" :key="header.prop">
          <el-table-column v-if="header.type === 'switch'" :label="header.label">
            <template #default="scope">
              <!-- <el-switch v-model="scope.row[header.prop]" :loading="scope.row.loading"></el-switch> -->
              <Switch :data="scope.row" :config="header"></Switch>
            </template>
          </el-table-column>
          <el-table-column v-else :label="header.label" :prop="header.prop"></el-table-column>
        </template>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row class="margin-top-30">
      <el-col :span="6">
        <el-button v-if="config.batch_delete" :disabled="!data.row_data_id" @click="handlerDeleteConfirm(data.row_data_id)">批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <Pagination v-if="config.pagination" @sizeChange="getList" @currentChange="getList" :total="table_data.total" :pageSize="props.request.data.pageSize"></Pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Pagination from "@/components/pagination";
import Switch from "@/components/switch";
import { onBeforeMount, reactive } from "vue";
import { configHook } from "./configHook";
import { requestHook } from "./requestHook";

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

const emits = defineEmits(["onload"]);

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

function handlerSelectionChange(val) {
  console.log(val);
  if (val && val.length > 0) {
    const idItem = val.map((item) => item.id);
    data.row_data_id = idItem.join();
  } else {
    data.row_data_id = "";
  }
}

function getList(params, type) {
  requestData(params, type).then((response) => {
    emits("onload", response);
  });
}

onBeforeMount(() => {
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
