<template>
  <el-form ref="formDom" :model="fields" :label-width="labelWidth">
    <el-row>
      <template v-for="item in items" :key="item.prop">
        
          <el-col v-if="!hiddenItems[item.prop] && hiddenItems[item.prop] !== true" :span="item.col || 24">
            <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
              <!-- <FormInput v-model:dataValue="fields[item.prop]" :data="item" :disabled="disabledItems[item.prop]"></FormInput> -->
              <component :is="currentComp(item.component)" v-model:dataValue="fields[item.prop]" :data="item" :disabled="disabledItems[item.prop]"></component>
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
import { reactive, ref } from "vue";

import FormInput from "@/components/control/FormInput";
import FormSelect from "@/components/control/FormSelect";

// 所有类型和组件映射关系
const typeMap = {
  input: FormInput,
  select: FormSelect,
};

// 当前组件
const currentComp = (type) => {
  const key = type.toString();
  if (Object.keys(typeMap).includes(key)) {
    return typeMap[key];
  }
  return typeMap["input"];
};

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

// 父组件传递过来的值

const labelWidth = ref(props.labelWidth);
const fields = reactive(props.fields);
const items = reactive(props.items);
const buttons = reactive(props.buttons);
const hiddenItems = reactive(props.hiddenItems);
const disabledItems = reactive(props.disabledItems);

// 表单dom对象
const formDom = ref(null);

// 处理按钮事件
function handlerButtonAction(button) {
  if (button.key === "submit") {
    console.log("submit");
    console.log(fields);
  } else if (button.key === "reset") {
    console.log("reset");
    formDom.value.resetFields();
    console.log(fields);
  }
}
</script>

<style lang="scss" scoped></style>
