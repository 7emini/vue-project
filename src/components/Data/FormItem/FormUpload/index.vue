<template>
  <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handlerUpload" :on-success="handlerOnSuccess" :before-upload="handlerBeforeOnUpload">
    <img v-if="dataValue" :src="dataValue" class="avatar" />
    <span v-else>+</span>
  </el-upload>
</template>
<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { uploadFile } from "@/apis/common";

const props = defineProps({
    dataValue: {
        type:String,
        default:"",
    }
});

const emits = defineEmits(["update:dataValue", "callback"]);

const dataValue = ref(props.dataValue)

function handlerUpload(params) {
  const file = params.file;
  const form = new FormData();
  form.append("files", file);
  uploadFile(form).then((response) => {
    dataValue.value = response.data.files_path;
    emits("update:dataValue", response.data.files_path);
  });
}

function handlerOnSuccess(val) {
  console.log(val);
  console.log("上传成功");
}

function handlerBeforeOnUpload(val) {
    console.log(val);
}

watch(()=>props.dataValue, (newValue, oldValue)=>{
  dataValue.value = newValue;
});

onBeforeMount(()=>{
  dataValue.value = props.dataValue;
});

onBeforeUnmount(()=>{
  dataValue.value = "";
});
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
