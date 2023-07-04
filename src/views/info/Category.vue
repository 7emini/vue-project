<template>
  <div>
    <el-button type="danger">添加一级分类</el-button>
    <hr class="spacing-hr" />
    <el-row :gutter="20">
      <!--树形控件-->
      <el-col :span="7">
        <div class="category-list">
          <el-tree :data="data.tree_data" :props="data.defaultProps" @node-click="handlerNodeClick" default-expand-all :expand-on-click-node="false">
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span> {{ node.label }}</span>
                <span>
                  <el-button type="danger" round>添加子级</el-button>
                  <el-button type="success" round>编辑</el-button>
                  <el-button round>删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-col>

      <!--分类表单-->
      <el-col :span="17">
        <h4 class="column">分类名称</h4>
        <el-form label-width="100px">
          <el-form-item label="父级分类">
            <el-input style="width: 20%"></el-input>
          </el-form-item>
          <el-form-item label="子级分类">
            <el-input style="width: 20%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const data = reactive({
  tree_data: [
    {
      text: "一级",
      children: [
        {
          text: "二级1",
          children: [{ text: "三级1" }],
        },
        {
          text: "二级2",
        },
      ],
    },
  ],
  defaultProps: {
    children: "children",
    label: "text",
  },
});

function handlerNodeClick() {
  return {
    data,
    handlerNodeClick,
  };
}
</script>

<style lang="scss" scoped>
.spacing-hr {
  border: none;
  border-top: 1px solid #e9e9e9;
  margin: 30px 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

:deep(.el-tree-node__content) {
  height: auto;
  button {
    padding: 6px 12px;
    margin: 8px 3px;
    font-size: 12px;
    height: auto;
  }
}

.column {
  height: 44px;
  padding: 0 20px;
  margin-bottom: 30px;
  line-height: 44px;
  border-radius: 6px;
  background-color: #f3f3f3;
}
</style>
