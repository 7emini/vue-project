<template>
  <div>
    <!--搜索区-->
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="类别">
            <el-select v-model="data.category" placeholder="请选择">
              <el-option v-for="item in data.category_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
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
      <el-table ref="table" border :data="data.tableData" style="width: 100%" @selection="handlerSelectionChange" height="900">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="标题" width="500"></el-table-column>
        <el-table-column prop="address" label="类别"></el-table-column>
        <el-table-column prop="date" label="日期" width="200"></el-table-column>
        <el-table-column lablel="操作" width="200">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handlerDetailed">编辑</el-button>
            <el-button size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row class="margin-top-30">
      <el-col :span="6">
        <el-button>批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination class="pull-right" size="small" background @size-change="handlerSizeChange" @current-change="handlerCurrentChange" :current-page="data.current_page" :page-size="10" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="100"> </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const { push } = useRouter();

const data = reactive({
  category: 0,
  category_options: [
    { label: "人工智能", value: 0 },
    { label: "区块链", value: 1 },
  ],
  tableData: [
    {
      name: "王小虎",
      address: "上海市普陀区金沙江路1516号",
      date: "2020-06-05 00:00",
    },
    {
      name: "王小虎",
      address: "上海市普陀区金沙江路1516号",
      date: "2020-06-05 00:00",
    },
  ],
  currentPage: 1,
});

function handlerDetailed() {
  push({
    path: "/news-detailed",
  });
}

function handlerSelectionChange(val) {
  console.log(val);
  return { data, handlerSelectionChange };
}

function handlerSizeChange(val) {}
function handlerCurrentChange(val) {}
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
