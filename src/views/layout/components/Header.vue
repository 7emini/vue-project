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
          <img :src="user_img_path" :alt="username" />
          <span class="name">{{ username }}</span>
        </div>
        <span class="logout" @click="handlerLogout">
          <svg-icon iconName="logout" className="icon-logout"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance();

const { replace } = useRouter();

const store = useStore();

const user_img_path = require("@/assets/images/logo-min.png");

const username = ref(store.state.app.username);

function switchAside() {
  store.commit("app/SET_COLLAPSE");
}

function handlerLogout() {

  proxy
    .$confirm("确定退出后台管理？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      store
        .dispatch("app/logoutAction")
        .then((response) => {
          proxy.$message({
            message: response.message,
            type: "success",
          });
          replace({
            name: "login",
          });
        })
        .catch((error) => {
        });
    })
    .catch((error) => {

    });
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
