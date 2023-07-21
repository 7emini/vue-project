<template>
  <div>
    <BaseForm :items="form_config.items" :fields="form_config.fields" :buttons="form_config.buttons" :hiddenItems="form_config.hiddenItems" :disabledItems="form_config.disabledItems"></BaseForm>
  </div>
</template>

<script setup>
import BaseForm from "@/components/BaseForm";
import { onBeforeMount, reactive } from "vue";

const form_config = reactive({
  items:[
    {
      label:"标题",
      component: "input",
      input_type: "text",
      prop: "title",
      rules: [],
      maxlength:100,
      col:12
    },
    {
      label:"是否发布",
      component:"select",
      prop: "is_push",
      rules: [],
      col:24,
      options: [
        {
          label:"是",
          value:"1"
        },
        {
          label:"否",
          value:"0",
        }
      ]
    },
    {
      label:"备忘",
      component: "input",
      input_type: "textarea",
      prop: "content",
      rules: [],
      maxlength:100,
      col:12
    },
  ],
  fields: {
    title:"",
    is_push:"",
    content:"",
  },
  buttons: [
    {
      type:"danger",
      label:"提交",
      key:"submit",
    }, 
    {
      type:"primary",
      label:"重置",
      key:"reset",
    }
  ],
  hiddenItems: {
    title:false,
  },
  disabledItems: {
    title:false,
  }
});

</script>

<style></style>
