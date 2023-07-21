<template>
  <el-pagination
    class="pull-right"
    size="small"
    background
    @size-change="handlerSizeChange"
    @current-change="handlerCurrentChange"
    v-model:current-page="current_page"
    :page-size="page_size"
    :page-sizes="[1, 10, 20, 50, 100]"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
  >
  </el-pagination>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  total: {
    type: [Number, String],
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  }
});

const emits = defineEmits(["sizeChange", "currentChange"]);

const current_page = ref(1);

const page_size = ref(props.pageSize);

const total = ref(props.total);
watchEffect(() => {
  total.value = props.total;
});
function handlerSizeChange(val) {
  page_size.value = val;
  current_page.value = 1;
  const params = {
    pageNumber: 1,
    pageSize: page_size.value,
  };
  emits("sizeChange", params, "page");
}

function handlerCurrentChange(val) {
  const params = {
    pageNumber: val,
    pageSize: page_size.value
  };
  emits("currentChange", params, "page");
}
</script>
