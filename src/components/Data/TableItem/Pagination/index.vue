<template>
  <el-pagination
    class="pull-right"
    size="small"
    background
    @size-change="handlerSizeChange"
    @current-change="handlerCurrentChange"
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="[1, 10, 20, 50, 100]"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
  >
  </el-pagination>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  currentPage: {
    type: [Number, String],
    default: 1,
  },
  total: {
    type: [Number, String],
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emits = defineEmits(["sizeChange", "currentChange"]);

const currentPage = ref(props.currentPage);

const pageSize = ref(props.pageSize);

const total = ref(props.total);

watchEffect(() => {
  total.value = props.total;
});

function handlerSizeChange(val) {
  pageSize.value = val;
  currentPage.value = 1;
  const params = {
    pageNumber: 1,
    pageSize: pageSize.value,
  };
  emits("sizeChange", {data:params});
}

function handlerCurrentChange(val) {
  const params = {
    pageNumber: val,
    pageSize: pageSize.value,
  };
  emits("currentChange",{data:params});
}
</script>
