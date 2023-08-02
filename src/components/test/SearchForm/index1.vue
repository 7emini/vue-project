<template>
  <el-form ref="formDom" :model="fields" :label-width="labelWidth" inline>
    <!-- <el-row> -->
    <template v-for="item in items" :key="item.prop">
      <!-- <el-col :span="item.col || 24"> -->
      <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
        <component :ref="componentDom" :key="item.component" :is="item.component" v-model:dataValue="fields[item.prop]" :data="item" @callback="handlerComponentCallback"></component>
      </el-form-item>
      <!-- </el-col> -->
    </template>
    <!-- </el-row> -->
    <el-form-item>
      <el-button type="danger" @click="handlerSearch">搜索</el-button>
      <el-button v-if="buttons.use_resetButton" @click="handlerReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { inject, reactive, ref, defineExpose } from "vue";

// 表单所需要的组件
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormCascader from "@/components/FormCascader";
import FormKeyword from "@/components/FormKeyword";

export default {
  name: "Search",
  components: {
    el_input: FormInput,
    el_select: FormSelect,
    el_cascader: FormCascader,
    el_keyword: FormKeyword,
  },
  props: {
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
  },
  emits: ["callbackSearch"],
  setup(props, { emit }) {
    // 表单dom对象
    const formDom = ref(null);

    // 关键字组件dom对象
    const keywordDom = ref(null);

    const componentDom = (el) => {
      if (el) {
        // console.log(defineExpose(el));
        // console.log(el);
        // keywordDom.value = el;
        // console.log(keywordDom);
        console.log(defineExpose(el));
      }
    };

    // 获取类型对应的组件
    const currentComp = (type) => {
      const key = type.toString();
      if (Object.keys(typeMap).includes(key)) {
        return typeMap[key];
      }
      return typeMap["input"];
    };

    // 获取上层组件Provide数据
    const searchConfig = inject("searchConfig");

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
      console.log(requestData);

      if (data.key && data.value) {
        requestData[data.key] = data.value;
      }
      console.log(requestData);
      return requestData;
    }

    /**
     * 搜索按钮方法
     */
    function handlerSearch() {
      const requestData = formatRequest();
      // console.log(requestData);
      emits("callbackSearch", requestData, "search");
    }

    /**
     * 重置按钮方法
     */
    function handlerReset() {
      formDom.value.resetFields();
      keywordDom.value && keywordDom.value.handlerClear();
    }

    return {
      labelWidth,
      fields,
      items,
      buttons,
      formDom,
      keywordDom,
      data,
      handlerComponentCallback,
      handlerReset,
      handlerSearch,
      componentDom,
    };
  },
};
</script>

<style lang="scss" scoped></style>
