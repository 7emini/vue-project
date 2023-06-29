<template>
  <div id="login">
    <div class="form-wrap">
      <ul class="menu-tab">
        <li @click="toggleMenu(item.type)" :class="{ current: data.current_menu === item.type }" v-for="item in data.tab_menu" :key="item.type">{{ item.label }}</li>
      </ul>
      <el-form :model="data.form" :rules="data.from_rules">
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
          <el-col :span="24"><label class="form-label">验证码</label></el-col>
          <el-row :gutter="12">
            <el-col :span="17">
              <el-input v-model="data.form.code"></el-input>
            </el-col>
            <el-col :span="7"><el-button type="success" @click="handlerGetCode">获取验证码</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="el-button-block" @click="submit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive} from "vue";
import { validate_email, validate_password, validate_code } from "../../utils/validate";
import { getCode } from "@/apis/common"

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

function handlerGetCode() {
    getCode();
}

// 提交表单
function submit() {

}
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