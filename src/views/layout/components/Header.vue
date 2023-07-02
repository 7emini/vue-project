<template>
  <div class="header-wrap">
    <!--左侧-->
    <div class="wrap">
      <div class="menu-btn" @click="switchAside">
        <svg-icon iconName="menuBtn" className="icon-menu-svg"></svg-icon>
      </div>
    </div>
    <!--右侧-->
    <div class="wrap">
      <div class="user-info">
        <div class="face-info">
          <img :src="user_img_path" alt="" />
          <span class="name">Gemini</span>
        </div>
        <span class="logout">
          <svg-icon iconName="logout" className="icon-logout"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();

const user_img_path = require("@/assets/images/logo-min.png");

function switchAside() {
    store.commit("app/SET_COLLAPSE")
}

</script>

<style lang="scss" scoped>
.header-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .wrap {
    padding: 0 20px;
  }
}
.menu-btn {
  cursor: pointer;
}
.icon-menu-svg {
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
}

.face-info {
  span,
  img {
    display: inline-block;
    vertical-align: middle;
  }
  span {
    margin-left: 15px;
  }
}

.logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  cursor: pointer;
}
.icon-logout {
  font-size: 24px;
}
</style>
