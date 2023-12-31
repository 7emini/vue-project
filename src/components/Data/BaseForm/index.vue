<template>
  <el-form ref="formDom" :model="fields" :label-width="labelWidth" v-loading="loading" element-loading-text="加载中，请稍后">
    <el-row>
      <template v-for="item in items" :key="item.prop">
        <el-col v-if="!hiddenItems[item.prop] && hiddenItems[item.prop] !== true" :span="item.col || 24">
          <el-form-item v-if="item.component === 'slot'"  :label="item.label" :rules="item.rules">
            <slot :name="item.slotName"></slot>
          </el-form-item>
          <el-form-item v-else :label="item.label" :prop="item.prop" :rules="item.rules">
            <component :is="currentComp(item.component)" v-model:dataValue="fields[item.prop]" :data="item" :disabled="disabledItems[item.prop]" @callback="componentCallback"></component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-form-item v-if="buttons && buttons.length > 0">
      <el-button v-for="button in buttons" :key="button.key" :type="button.type" @click="handlerButtonAction(button)">{{ button.label }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";

// 表单规则hook
import { rulesHook } from "./hooks/rulesHook";

// 关联操作hook
import { relationHook } from "./hooks/relationHook";

// 表单所需要的组件
import FormInput from "@/components/Data/FormItem/FormInput";
import FormSelect from "@/components/Data/FormItem/FormSelect";
import FormCheckbox from "@/components/Data/FormItem/FormCheckbox";
import FormRadio from "@/components/Data/FormItem/FormRadio";
import FormSwitch from "@/components/Data/FormItem/FormSwitch";
import FormUpload from "@/components/Data/FormItem/FormUpload";
import FormInputNumber from "@/components/Data/FormItem/FormInputNumber";

// 表单dom对象
const formDom = ref(null);

// 所有类型和组件映射关系
const typeMap = {
  input: FormInput,
  select: FormSelect,
  checkbox: FormCheckbox,
  radio: FormRadio,
  switch: FormSwitch,
  upload: FormUpload,
  inputNumber:FormInputNumber,
};

// 获取类型对应的组件
const currentComp = (type) => {

  if (!type) {
    throw Error("type is null");
  }
  

  const key = type.toString();
  if (Object.keys(typeMap).includes(key)) {
    return typeMap[key];
  }
  return typeMap["input"];
};

// 父组件传递过来的数据
const props = defineProps({

  // 表单加载状态
  loading:{
    type:Boolean,
    default:false,
  },

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

  // 需要隐藏的表单元素
  hiddenItems: {
    type: Object,
    default: {},
  },

  // 需要禁用的表单元素
  disabledItems: {
    type: Object,
    default: {},
  },
});

const loading = ref(props.loading);
const labelWidth = ref(props.labelWidth);
const fields = reactive(props.fields);
const items = reactive(props.items);
const buttons = reactive(props.buttons);
const hiddenItems = reactive(props.hiddenItems);
const disabledItems = reactive(props.disabledItems);

// 提交表单回调
const emits = defineEmits(["callback", "reset"]);

// 回调表单的change事件
function componentCallback(params) {
  // 处理表单关联操作
  const { hiddenItem, disabledItem } = relationHook();
  if (params.data.relation_hidden) {
    hiddenItem(params.value, params.data.relation_hidden, hiddenItems);
  }
  if (params.data.relation_disabled) {
    disabledItem(params.value, params.data.relation_disabled, disabledItems);
  }
}

// 处理按钮事件
function handlerButtonAction(button) {
  if (button.key === "submit") {
    formDom.value.validate((valid)=>{
      if (valid) {
        emits("callback")
      }
    })
  } else if (button.key === "reset") {
    handlerResetForm();
  }
}

/**
 * 重置表单项
 */
function handlerResetForm() {
  console.log("重置表单");
  formDom.value.resetFields();
  emits("reset");
}

onBeforeMount(() => {
  // 初始化表单规则
  const { initRules } = rulesHook();
  initRules(items);
});

watch(()=>props.loading, (value)=>{
  loading.value = value;
});

defineExpose({
  handlerResetForm,
})
</script>

<style lang="scss" scoped></style>
