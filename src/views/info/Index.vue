<template>
  <div>
    <!--搜索区-->
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="类别">
            <el-select v-model="data.category" placeholder="请选择">
              <el-option
                v-for="item in data.category_options"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字">
            <el-select placeholder="请选择"></el-select>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入关键字"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <router-link to="/news-detailed" class="pull-right">
          <el-button type="danger" class="pull-right">新增</el-button>
        </router-link>
      </el-col>
    </el-row>

    <!--表格-->
    <el-row>
      <el-table
        ref="table"
        border
        :data="data.tableData"
        style="width: 100%"
        @selection-change="handlerSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="500"
        ></el-table-column>
        <el-table-column prop="category_name" label="类别"></el-table-column>
        <el-table-column
          prop="createDate"
          label="日期"
          width="200"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column prop="status" label="发布状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus($event, scope.row)"
              :loading="scope.row.loading"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handlerDetailed">编辑</el-button>
            <el-button size="small" @click="handlerDeleteConfirm(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row class="margin-top-30">
      <el-col :span="6">
        <el-button :disabled="!data.row_data_id" @click="handlerDeleteConfirm(data.row_data_id)">批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
          class="pull-right"
          size="small"
          background
          @size-change="handlerSizeChange"
          @current-change="handlerCurrentChange"
          :current-page="data.current_page"
          :page-size="request_data.pageSize"
          :page-sizes="[1, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import { useRouter } from "vue-router";
import { deleteData, getTableList, status } from "@/apis/info";
import { getDate } from "@/utils/common";
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

const { push } = useRouter();

const data = reactive({
  row_data_id:"",
  loading: false,
  total: 0,
  category: 0,
  category_options: [
    { label: "人工智能", value: 0 },
    { label: "区块链", value: 1 },
  ],
  tableData: [],
  currentPage: 1,
});

const request_data = reactive({
  pageNumber: 1,
  pageSize: 1,
});

function handlerGetList() {
  getTableList(request_data).then((response) => {
    console.log(response);
    let response_data = response.data;
    data.tableData = response_data.data;
    data.total = response_data.total;
  });
}

function handlerDetailed() {
  push({
    path: "/news-detailed",
  });
}

function formatDate(row) {
  return getDate({ value: row.createDate * 1000 });
}

function handlerSelectionChange(val) {
  console.log(val);
  if (val && val.length > 0) {
    const idItem = val.map(item=>item.id);
    data.row_data_id = idItem.join();
  } else {
    data.row_data_id = "";
  }
}

function handlerSizeChange(val) {
  console.log(val);
  request_data.pageNumber = 1;
  request_data.pageSize = val;
  handlerGetList();
}

function handlerCurrentChange(val) {
  request_data.pageNumber = val;
  handlerGetList();
}

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
  proxy
    .$confirm("确定删除当前数据吗？", "提示", {
      confirmButtonText: "",
      cancelButtonText: "",
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: "warning",
      beforeClose: (action, instance, done) => {
        instance.confirmButtonLoading = true;
        if (action === "confirm") {
          deleteData({ id: value }).then((response) => {
            proxy.$message.success(response.message);
            instance.confirmButtonLoading = false;
            done();
            handlerGetList();
          }).catch(error=> {
            instance.confirmButtonLoading = false;
            done();
          });
        } else {
          instance.confirmButtonLoading = false;
          done();
        }
      },
    })
    .catch((error) => {
      console.log(error);
    });
}

onBeforeMount(() => {
  handlerGetList();
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
