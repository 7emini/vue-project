<template>
  <div style="width: 100%">
    <el-row>
      <el-col :span="20">
        <el-form ref="formDom" :model="fields" :label-width="labelWidth" inline>
          <template v-for="item in items" :key="item.prop">
            <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
              <component :ref="componentDom" :is="currentComp(item.component)" v-model:dataValue="fields[item.prop]" :data="item" @callback="handlerComponentCallback"></component>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="danger" @click="handlerSearch">搜索</el-button>
            <el-button @click="handlerReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="2">
        <template v-for="button in buttons" :key="button.id">
          <el-button @click="button.callback && button.callback()"> {{ button.label }} </el-button>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { inject, reactive, ref, defineExpose } from "vue";

// 表单所需要的组件
import FormInput from "@/components/Data/FormItem/FormInput";
import FormSelect from "@/components/Data/FormItem/FormSelect";
import FormCascader from "@/components/Data/FormItem/FormCascader";
import FormKeyword from "@/components/Data/FormItem/FormKeyword";

// 表单dom对象
const formDom = ref(null);

// 关键字组件dom对象
const keywordDom = ref(null);

const componentDom = (el) => {
  if (el) {
    if (el && el.data) {
      if (el.data.component === "keyword") {
        keywordDom.value = el;
      }
    }
  }
};

// 所有类型和组件映射关系
const typeMap = {
  input: FormInput,
  select: FormSelect,
  cascader: FormCascader,
  keyword: FormKeyword,
};

// 获取类型对应的组件
const currentComp = (type) => {
  const key = type.toString();
  if (Object.keys(typeMap).includes(key)) {
    return typeMap[key];
  }
  return typeMap["input"];
};

// 父组件传递过来的数据
const props = defineProps({
  //标题宽度
  labelWidth: {
    type: [String, Number],
    default: "100px",
  },
  // 表单绑定的数据
  fields: {
    type: Object,
    default: {},
  },
  // 表单元素组
  items: {
    type: Array,
    default: [],
  },
  // 表单按钮组
  buttons: {
    type: Array,
    default: [],
  },
});

const emits = defineEmits(["callbackSearch", "callbackReset", "callbackAdd"]);

// 获取上层组件Provide数据
const searchConfig = inject("searchConfig") || { labelWidth: "80", fields: [], items: [], buttons: [] };

const labelWidth = ref(searchConfig.labelWidth || props.labelWidth || "100px");
const fields = reactive(searchConfig.fields || props.fields);
const items = reactive(searchConfig.items || props.items);
const buttons = reactive(searchConfig.buttons || props.buttons);

const data = reactive({
  key: "",
  data: "",
});

/**
 * 回调组件传递参数
 * @param {*} params
 */
function handlerComponentCallback(params) {
  console.log(params);
  if (params.type === "keyword") {
    data.key = params.value.key;
    data.value = params.value.value;
  }
}

/**
 * 构建请求参数
 */
function formatRequest() {
  let requestData = {};
  for (let key in fields) {
    if (fields[key] !== "") {
      requestData[key] = fields[key];
    }
  }

  if (data.key && data.value) {
    requestData[data.key] = data.value;
  }

  return requestData;
}

/**
 * 搜索按钮方法
 */
function handlerSearch() {
  const requestData = formatRequest();
  // console.log(requestData);
  emits("callbackSearch", { searchData: requestData });
}

/**
 * 重置按钮方法
 */
function handlerReset() {
  formDom.value.resetFields();
  keywordDom.value && keywordDom.value.handlerClear();
  emits("callbackReset");
}
</script>

<style lang="scss" scoped></style>
