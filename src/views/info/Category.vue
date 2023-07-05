<template>
  <div>
    <el-button type="danger" @click="handlerCategory('first_category_add')">添加一级分类</el-button>
    <hr class="spacing-hr" />
    <el-row :gutter="20">
      <!--树形控件-->
      <el-col :span="7">
        <div class="category-list">
          <el-tree ref="category_tree" :data="data.tree_data" :props="data.defaultProps" @node-click="handlerNodeClick" default-expand-all :expand-on-click-node="false" node-key="id">
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span> {{ node.label }}</span>
                <span>
                  <el-button type="danger" round @click="handlerCategory('child_category_add', node)">添加子级</el-button>
                  <el-button type="success" round @click="handlerCategory(node.level === 1 ? 'parent_category_edit' : 'child_category_edit', node)">编辑</el-button>
                  <el-button round @click="handlerCategory('delete_category', node)">删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-col>

      <!--分类表单-->
      <el-col :span="17">
        <h4 class="column">{{ config[config.type].title }}</h4>
        <el-form label-width="100px">
          <el-form-item label="父级分类">
            <el-input style="width: 20%" v-model="data.parent_category" :disabled="config[config.type].parent_disabled"></el-input>
          </el-form-item>
          <el-form-item label="子级分类" v-if="config[config.type].sub_show">
            <el-input style="width: 20%" v-model="data.sub_category" :disabled="config[config.type].sub_disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :loading="data.button_loading" @click="handlerSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onBeforeMount, ref } from "vue";
import { firstCategoryAdd, getCategory, childCategoryAdd, categoryEdit, categoryDelete } from "@/apis/info";

const { proxy } = getCurrentInstance();

// const categoryTree = proxy.$refs.categoryTree;
const category_tree = ref(null);

const data = reactive({
  // 模拟数据
  //   tree_data: [
  //     {
  //       text: "一级",
  //       children: [
  //         {
  //           text: "二级1",
  //           children: [{ text: "三级1" }],
  //         },
  //         {
  //           text: "二级2",
  //         },
  //       ],
  //     },
  //   ],

  tree_data: [],
  parent_category: "",
  parent_category_data: null,
  sub_category_data: null,

  defaultProps: {
    children: "children",
    label: "category_name",
  },
  sub_category: "",
  button_loading: false,
});

const config = reactive({
  type: "default", // 记录操作类型
  default: {
    title: "分类标题", // 分类标题
    parent_disabled: true, // 是否启用父级分类输入框
    sub_disabled: true, // 是否启用子级分类输入框
    sub_show: true, // 子级分类显示/隐藏
    clear: ["parent_category", "sub_category"],
  },
  first_category_add: {
    title: "添加一级分类", // 分类标题
    parent_disabled: false, // 是否启用父级分类输入框
    sub_disabled: true, // 是否启用子级分类输入框
    sub_show: false, // 子级分类显示/隐藏
    clear: ["parent_category", "sub_category"],
  },
  child_category_add: {
    title: "添加子级分类", // 分类标题
    parent_disabled: true, // 是否启用父级分类输入框
    sub_disabled: false, // 是否启用子级分类输入框
    sub_show: true, // 子级分类显示/隐藏
    clear: ["sub_category"],
    create: ["parent_category"],
  },

  parent_category_edit: {
    title: "编辑父级分类", // 分类标题
    parent_disabled: false, // 是否启用父级分类输入框
    sub_disabled: true, // 是否启用子级分类输入框
    sub_show: false, // 子级分类显示/隐藏
    create: ["parent_category"],
  },
  child_category_edit: {
    title: "编辑子级分类", // 分类标题
    parent_disabled: true, // 是否启用父级分类输入框
    sub_disabled: false, // 是否启用子级分类输入框
    sub_show: true, // 子级分类显示/隐藏
    create: ["parent_category", "sub_category"],
  },
});

// 添加/编辑分类
function handlerCategory(type, node_data) {
  if (type === "child_category_edit") {
    data.sub_category_data = node_data || null;
    data.parent_category_data = node_data.parent || null;
  } else {
    data.parent_category_data = node_data || null;
  }

  config.type = type === "delete_category" ? "default" : type;
  handlerInputValue();
  type === "delete_category" && handlerDeleteConfirm();
}

// 添加分类前删除和重置输入框文本
function handlerInputValue() {
  const clearObject = config[config.type].clear;
  const createObject = config[config.type].create;

  if (clearObject && clearObject.length > 0) {
    clearObject.forEach((item) => {
      data[item] = "";
    });
  }

  if (createObject && createObject.length > 0) {
    createObject.forEach((item) => {
      console.log(data);
      console.log(item);
      console.log(`${item}_data`);
      console.log(data[`${item}_data`]);
      console.log("-----------------");
      data[item] = data[`${item}_data`].data.category_name;
    });
  }
}

// 点击节点
function handlerNodeClick() {
  return {
    data,
    handlerNodeClick,
  };
}

// 提交 添加节点/修改节点
function handlerSubmit() {
  if (config.type === "first_category_add") {
    handlerFirstCategoryAdd();
  }

  if (config.type === "child_category_add") {
    handlerChildCategoryAdd();
  }

  if (config.type === "child_category_edit" || config.type === "parent_category_edit") {
    handlerCategoryEidt();
  }
}

// 添加父节点
function handlerFirstCategoryAdd() {
  if (!data.parent_category) {
    proxy.$message.error("父级别分类名称不能为空");
    return false;
  }
  data.button_loading = true;

  const requestData = {
    categoryName: data.parent_category,
  };

  firstCategoryAdd(requestData)
    .then((response) => {
      data.button_loading = false;
      proxy.$message({
        message: response.message,
        type: "success",
      });
      data.parent_category = "";
      // 刷新数据
      handlerGetCategory();
    })
    .catch((error) => {
      data.button_loading = false;
    });
}

// 添加子节点
function handlerChildCategoryAdd() {
  if (!data.sub_category) {
    proxy.$message.error("父级别分类名称不能为空");
    return false;
  }
  data.button_loading = true;

  const requestData = {
    categoryName: data.sub_category,
    parentId: data.parent_category_data.data.id,
  };

  childCategoryAdd(requestData)
    .then((response) => {
      data.button_loading = false;
      proxy.$message({
        message: response.message,
        type: "success",
      });
      data.sub_category = "";
      category_tree.value.append(response.data, data.parent_category_data);
    })
    .catch((error) => {
      data.button_loading = false;
    });
}

function handlerCategoryEidt() {
  let textStatus = true;

  if (config.type === "parent_category_edit" && !data.parent_category) {
    textStatus = false;
  }

  if (config.type === "child_category_edit" && !data.sub_category) {
    textStatus = false;
  }

  if (!textStatus) {
    console.log(data.parent_category);
    console.log(data.sub_category);

    const message = config.type === "parent_category_edit" ? "父级" : "子级";
    proxy.$message.error(`${message}名称不能为空`);
    return false;
  }

  data.button_loading = true;
  const node_parent = data.parent_category_data.data;
  console.log(config.type);
  let node_sub = null;
  if (config.type === "child_category_edit") {
    node_sub = data.sub_category_data.data;
  }

  const requestData = {
    categoryName: config.type === "parent_category_edit" ? data.parent_category : data.sub_category,
    id: config.type === "parent_category_edit" ? node_parent.id : node_sub.id,
  };

  categoryEdit(requestData)
    .then((response) => {
      data.button_loading = false;
      proxy.$message({
        message: response.message,
        type: "success",
      });
      const node_data = config.type === "parent_category_edit" ? node_parent : node_sub;
      node_data.category_name = response.data.category_name;
    })
    .catch((error) => {
      data.button_loading = false;
    });
}


// 确认是否
function handlerDeleteConfirm() {
  proxy.$confirm("确认删除该分类吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "warning",
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        const requestData = {
          categoryId: data.parent_category_data.data.id,
        };
        categoryDelete(requestData)
          .then((response) => {
            proxy.$message({
              message: response.message,
              type: "success",
            });
            instance.confirmButtonLoading = false;
            done();
            console.log(category_tree);
            console.log(data.parent_category);
            console.log(data.sub_category);

            category_tree.value.remove(data.parent_category_data);
          })
          .catch((error) => {
            instance.confirmButtonLoading = false;
            done();
          });

          
      } else {
        done();
      }
    },
  }).catch(()=>{

  });
}

// 从接口获取所有节点
function handlerGetCategory() {
  getCategory().then((response) => {
    data.tree_data = response.data || [];
  });
}

onBeforeMount(() => {
  handlerGetCategory();
});
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
