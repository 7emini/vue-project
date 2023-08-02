<template>
  <div>
    <BaseForm 
      :items="form_config.items" 
      :fields="form_config.fields" 
      :buttons="form_config.buttons" 
      :hiddenItems="form_config.hiddenItems" 
      :disabledItems="form_config.disabledItems"
      @callback="handlerCallback"
    >
    </BaseForm>
  </div>
</template>

<script setup>
import BaseForm from "@/components/Data/BaseForm";
import { onBeforeMount, reactive } from "vue";

const form_config = reactive({
  items: [
    {
      label: "标题",
      component: "input",
      required: true,
      input_type: "text",
      prop: "title",
      rules: [
        {min: 3, max: 20, message: "长度在3～20个字符", trigger:"change"}
      ],
      maxlength: 21,
      col: 12,
    },
    {
      label: "是否发布",
      component: "select",
      required: true,
      prop: "is_push",
      rules: [],
      col: 24,
      options: [
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      relation_disabled: [
        ["title", {"0":true, "1":false}],
        ["content", {"0":true, "1":false}],
      ],
      relation_hidden: [
        ["title", {"0": true, "1":false}]
      ]
    },
    {
      label: "所属城市",
      component: "checkbox",
      required: true,
      prop: "city",
      rules: [],
      col: 24,
      options: [
        {
          label: "北京",
          value: "0",
        },
        {
          label: "上海",
          value: "1",
        },
        {
          label: "深圳",
          value: "2",
        },
        {
          label: "杭州",
          value: "3",
        },
      ],
    },
    {
      label: "备忘",
      component: "input",
      required: true,
      input_type: "textarea",
      prop: "content",
      rules: [],
      maxlength: 100,
      col: 12,
    },
    {
      label: "性别",
      component: "radio",
      required: true,
      prop: "gender",
      rules: [],
      options: [
        {
          label: "男",
          value: "1",
        },
        {
          label: "女",
          value: "2",
        },
      ],
      col: 24,
    },
    {
      label:"立即发布",
      prop:"push_now",
      component:"switch",
      required: true,
      inactive_value:"0", // 开关关闭的值
      active_value:"1", // 开关开启的值
      rules:[],
    }
  ],
  // 表单绑定的字段，可设置默认值
  fields: {
    title: "test",
    is_push: "1",
    city: ["0", "1"],
    content: "",
    gender: "1",
    push_now:"1",
  },
  buttons: [
    {
      type: "danger",
      label: "提交",
      key: "submit",
    },
    {
      type: "primary",
      label: "重置",
      key: "reset",
    },
  ],
  hiddenItems: {
    title: false,
  },
  disabledItems: {
    title: false,
  },
});

function handlerCallback() {
  console.log("提交表单");
}
</script>

<style></style>
