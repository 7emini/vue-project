<template>
  <div id="login">
    <div class="form-wrap">
      <ul class="menu-tab">
        <li @click="toggleMenu(item.type)" :class="{ current: data.current_menu === item.type }" v-for="item in data.tab_menu" :key="item.type">{{ item.label }}</li>
      </ul>

      <el-form ref="account_form" :model="data.form" :rules="data.from_rules">
        <el-form-item prop="username">
          <label class="form-label">用户名</label>
          <el-input v-model="data.form.username"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <label class="form-label">密码</label>
          <el-input type="password" v-model="data.form.password"></el-input>
        </el-form-item>

        <el-form-item v-show="data.current_menu === 'register'" prop="passwords">
          <label class="form-label">确认密码</label>
          <el-input type="password" v-model="data.form.passwords"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-col :span="24">
            <label class="form-label">验证码</label>
          </el-col>
          <el-col :span="15">
            <el-input v-model="data.form.code"></el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button style="width: 100%" type="success" @click="handlerGetCode" :disabled="data.code_btn_disabled" :loading="data.code_btn_loading">{{ data.code_btn_text }}</el-button>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="el-button-block" @click="submit" :disabled="data.submit_btn_disabled" :loading="data.submit_btn_loading">{{ data.submit_btn_text }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>

import { computed, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
import { validate_email, validate_password, validate_code } from "../../utils/validate";
import { getCode } from "@/apis/common";
import { register, login } from "@/apis/account";
import sha1 from "js-sha1";

const { proxy } = getCurrentInstance();

const data = reactive({
  tab_menu: [
    { type: "login", label: "登陆" },
    { type: "register", label: "注册" },
  ],

  current_menu: "login",

  form: {
    username: "",
    password: "",
    passwords: "",
    code: "",
  },

  from_rules: {
    username: [{ validator: validate_name_rules, trigger: "change" }],
    password: [{ validator: validate_password_rules, trigger: "change" }],
    passwords: [{ validator: validate_passwords_rules, trigger: "change" }],
    code: [{ validator: validate_code_rules, trigger: "change" }],
  },

  submit_btn_text: computed(() => {
    return data.current_menu === "login" ? "登陆" : "注册";
  }),
  submit_btn_disabled: true,
  submit_btn_loading: false,
  code_btn_disabled: false,
  code_btn_loading: false,
  code_btn_text: "获取验证码",
  code_btn_timer: null,
});

// 用户名验证
function validate_name_rules(rule, value, callback) {
  let regEmail = validate_email(value);
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else if (!regEmail) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
}

// 密码验证
function validate_password_rules(rule, value, callback) {
  let regPassword = validate_password(value);
  // 获取“确认密码”
  const passwordsValue = data.form.passwords;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!regPassword) {
    callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
  } else {
    callback();
  }
}

// 确认密码验证
function validate_passwords_rules(rule, value, callback) {
  // 如果是登录，不需要校验确认密码，默认通过
  if (data.current_menu === "login") {
    callback();
  }
  let regPassword = validate_password(value);
  // 获取“密码”
  const passwordValue = data.form.password;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!regPassword) {
    callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
  } else if (passwordValue && passwordValue !== value) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
}

// 验证码验证
function validate_code_rules(rule, value, callback) {
  let regCode = validate_code(value);
  data.submit_btn_disabled = !regCode;
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (!regCode) {
    callback(new Error("请输入6位的验证码"));
  } else {
    callback();
  }
}

// 点击 登陆/注册 切换
function toggleMenu(type) {
  data.current_menu = type;
}

// 获取验证码
function handlerGetCode() {
  const username = data.form.username;
  const password = data.form.password;
  const passwords = data.form.passwords;
  if (!validate_email(username)) {
    proxy.$message({
      message: "用户名格式不正确",
      type: "error",
    });
    return false;
  }

  if (!validate_password(password)) {
    proxy.$message({
      message: "密码格式不正确",
      type: "error",
    });
    return false;
  }

  if (data.current_menu === "register" && password !== passwords) {
    proxy.$message({
      message: "两次密码不一致",
      type: "error",
    });
    return false;
  }

  const requestData = {
    username,
    module: data.current_menu,
  };

  data.code_btn_loading = true;
  data.code_btn_text = "发送中";

  getCode(requestData)
    .then((response) => {
      data.submit_btn_disabled = false;
      if (response.resCode === 1024) {
        proxy.$message.error(response.message);
        return false;
      }

      proxy.$message.success(response.message);
      data.form.code = response.data;
      countdown();
    })
    .catch((error) => {
      data.code_btn_loading = false;
      data.code_btn_text = "获取验证码";
    });
}

// 倒计时
function countdown(time) {
  let second = time || 30;

  // 计时器开始之前设置状态
  data.code_btn_loading = false;
  data.code_btn_disabled = true;
  data.code_btn_text = `倒计时${second}秒`;

  // 如果有计时器就先删除计时器
  if (data.code_btn_timer) {
    clearInterval(data.code_btn_timer);
  }

  data.code_btn_timer = setInterval(() => {
    second--;

    // 计时器运行时设置状态
    data.code_btn_text = `倒计时${second}秒`;

    if (second <= 0) {
      // 计时器结束后设置状态
      data.code_btn_text = "重新获取";
      data.code_btn_disabled = false;
      clearInterval(data.code_btn_timer);
    }
  }, 1000);
}

// 提交表单
function submit() {
  proxy.$refs.account_form.validate((valid) => {
    if (valid) {
      data.current_menu === "login" ? submitLogin() : submitRegister();
    } else {
      proxy.$message("数据校验错误");
    }
  });
}

// 登陆逻辑
function submitLogin() {
  const requestData = {
    username: data.form.username,
    password: sha1(data.form.password),
    code: data.form.code,
  };
  data.submit_btn_loading = true;
  login(requestData)
    .then((response) => {
      proxy.$message({
        message: response.message,
        type: "success",
      });
      reset();
    })
    .catch((error) => {
      data.submit_btn_loading = false;
    });
}

// 注册逻辑
function submitRegister() {
  const requestData = {
    username: data.form.username,
    password: sha1(data.form.password),
    code: data.form.code,
  };
  data.submit_btn_loading = true;
  register(requestData)
    .then((response) => {
      proxy.$message({
        message: response.message,
        type: "success",
      });
      reset();
    })
    .catch((error) => {
      data.submit_btn_loading = false;
    });
}

function reset() {
  proxy.$refs.account_form.resetFields();
  data.current_menu = "login";
  data.code_btn_timer && clearInterval(data.code_btn_timer);
  data.code_btn_text = "获取验证码";
  data.code_btn_disabled = false;
  data.submit_btn_disabled = true;
  data.submit_btn_loading = false;
}

onBeforeUnmount(() => {
  console.log("unmount");
  clearInterval(data.code_btn_timer);
});
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}

.form-wrap {
  width: 320px;
  padding-top: 100px;
  margin: auto;
}

.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    padding: 10px 24px;
    margin: 0;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    &.current {
      background-color: rgba(0, 0, 0, 1);
    }
  }
}

.form-label {
  display: block;
  color: #fff;
  font-size: 14px;
}
</style>
