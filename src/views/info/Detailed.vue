<template>
  <div>
    <el-form ref="formDom" label-width="150" :model="data.form" :rules="data.form_rules">
      <el-form-item label="信息类别:" prop="category">
        <el-cascader v-model="data.form.category_id" :options="category_data.category_options" :props="data.cascader_props"></el-cascader>
      </el-form-item>
      <el-form-item label="信息标题:" prop="title">
        <el-input v-model="data.form.title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图:" prop="image_url">
        <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handlerUpload" :on-success="handlerOnSuccess" :before-upload="handlerBeforeOnUpload">
          <img v-if="data.form.image_url" :src="data.form.image_url" class="avatar" />
          <span v-else>+</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布日期:" prop="create_date">
        <el-date-picker v-model="data.form.create_date" type="datetime" placeholder="请选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        <div ref="editor"></div>
      </el-form-item>

      <el-form-item label="是否发布" prop="status">
        <el-radio-group v-model="data.form.status">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="danger" @click="handlerSubmitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { onBeforeMount, onMounted, getCurrentInstance, reactive, ref, toRefs } from "vue";

import { categoryHook } from "@/hooks/infoHook";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import WangEditor from "wangeditor";
import { uploadFile } from "@/apis/common";
import { infoCreate, getDetailed, infoEdit } from "@/apis/info";
const { proxy } = getCurrentInstance();
const { infoData: category_data, handlerGetCategory: getList } = categoryHook();
const store = useStore();
const { go } = useRouter();
const editor = ref();
const formDom = ref();
const { query } = useRoute();

let editor_instance = null;

const data = reactive({
  row_id: query.id,
  cascader_props: {
    label: "category_name",
    value: "id",
  },

  form: {
    image_url: "",
    category_id: "",
    title: "",
    create_date: "",
    content: "",
    status: "1",
  },

  form_rules: {
    category_id: [{ required: true, message: "分类不能为空", trigger: "change" }],
    title: [{ required: true, message: "标题不能为空", trigger: "change" }],
    image_url: [{ required: true, message: "图片路径不能为空", trigger: "change" }],
    content: [{ required: true, message: "内容不能为空", trigger: "change" }],
    status: [{ required: true, message: "状态不能为空", trigger: "change" }],
    createDate: [{ required: true, message: "发布日期不能为空", trigger: "change" }],
  },
});

function handlerBeforeOnUpload(file) {
  console.log(file);
  const isJpg = file.type === "image/jpeg";
  const islt2m = file.size / 1024 / 1024 < 2;
  if (!isJpg) {
    proxy.$message.error("上传的图片只能是jpg格式");
    return false;
  }

  if (!islt2m) {
    proxy.$message.error("上传图片大小不能超过2MB");
    return false;
  }
  return isJpg && islt2m;
}

function handlerUpload(params) {
  const file = params.file;
  console.log(file);
  const form = new FormData();
  form.append("files", file);
  uploadFile(form).then((response) => {
    data.form.image_url = response.data.files_path;
  });
}

function handlerOnSuccess() {}

function handlerSubmitForm() {
  formDom.value.validate((valid) => {
    if (valid) {
      data.row_id ? handlerEditInfo() : handlerAddInfo();
    } else {
      console.log("error submit");
      return false;
    }
  });
}

function handlerAddInfo() {
  const requestData = JSON.parse(JSON.stringify(data.form));
  requestData.create_date = dayjs(requestData.create_date).format("YYYY-MM-DD HH:mm:ss");
  requestData.category_id = requestData.category_id[requestData.category_id.length - 1];
  console.log(requestData);
  infoCreate(requestData)
    .then((response) => {
      proxy.$message.success(response.message);
      go(-1);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handlerEditInfo() {
  const requestData = JSON.parse(JSON.stringify(data.form));
  requestData.create_date = dayjs(requestData.create_date).format("YYYY-MM-DD HH:mm:ss");
  requestData.category_id = requestData.category_id[requestData.category_id.length - 1];
  console.log(requestData);
  infoEdit(requestData)
    .then((response) => {
      proxy.$message.success(response.message);
      go(-1);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handlerGetDetailed() {
  getDetailed({ id: data.row_id }).then((response) => {
    const response_data = response.data;
    data.form = response_data;
    editor_instance.txt.html(response_data.content);
  });
}

onMounted(() => {
  editor_instance = new WangEditor(editor.value);
  Object.assign(editor_instance.config, {
    onchange(value) {
      data.form.content = value;
    },
  });
  editor_instance.create();
  getList();

  data.row_id && handlerGetDetailed();
});

onBeforeMount(() => {});
</script>

<style lang="scss" scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  color: #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
</style>
