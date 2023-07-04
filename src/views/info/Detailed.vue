<template>
    <div>
        <el-form label-width="150">
            <el-form-item label="信息类别:">
                <el-select v-model="data.category">
                    <el-option v-for="item in data.category_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="信息标题:">
                <el-input v-model="data.title"></el-input>
            </el-form-item>
            <el-form-item label="缩略图:">
                <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handlerAvatarSuccess"
                :befor-upload="beforeAcatarUploade"
                >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <span v-else>+</span>
                </el-upload>
            </el-form-item>
            <el-form-item label="发布日期:">
                <el-date-picker v-model="data.date" type="datetime" placeholder="请选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="内容:">
                <div ref="editor"></div>
            </el-form-item>

        </el-form>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref } from "vue";
import WangEditor from "wangeditor";

const editor = ref();
let editor_instance = null;

onMounted(()=>{
    editor_instance = new WangEditor(editor.value);
    Object.assign(editor_instance.config, {
        onchange(){
            console.log("change");
        }
    });
    editor_instance.create();
});

const data = reactive({
    imageUrl:"",
    category:"",
    title:"",
    category_options:[
        {label:"人工智能", value:0},
        {label:"技术", value:1},
    ]
})
</script>

<style lang="scss" scoped>
.avatar-uploader{
    border: 1px dashed #d9d9d9;
    color: #d9d9d9;
    border-radius: 6px;
    cursor:pointer;
    position:relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
}
</style>