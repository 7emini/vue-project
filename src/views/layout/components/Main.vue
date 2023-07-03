<template>
  <!-- <router-view /> -->
  <div id="main-content">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>

#main-content {
  background-color: #fff;
  padding: 20px;
  min-height: 100%;
  @include webkit(box-sizing, border-box);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
