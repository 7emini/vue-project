<template>
    <svg class="svg-class" :class="svgClassName">
        <use :xlink:href="SvgIcon"></use>
    </svg>
</template>
<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  iconName: String,
  className: String,
});

const svgClassName = ref(props.className);

const SvgIcon = computed(()=>{
    return `#icon-${props.iconName}`
});

</script>
<style lang="scss">
.svg-class {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>