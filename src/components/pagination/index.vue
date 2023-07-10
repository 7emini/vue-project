<template>
  <el-pagination
    class="pull-right"
    size="small"
    background
    @size-change="handlerSizeChange"
    @current-change="handlerCurrentChange"
    v-model:current-page="current_page"
    :page-size="1"
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
});

const emits = defineEmits(["sizeChange", "currentChange"]);

const current_page = ref(1);

const total = ref(props.total);
watchEffect(() => {
  total.value = props.total;
});
function handlerSizeChange(val) {
  const params = {
    pageNumber: 1,
    pageSize: val,
  };
  emits("sizeChange", params, "page");
}

function handlerCurrentChange(val) {
  const params = {
    pageNumber: val,
  };
  emits("currentChange", params, "page");
}
</script>
