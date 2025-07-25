<script setup lang="ts">
import {ref, reactive} from "vue";
import {Lock, User} from "@element-plus/icons-vue";
import router from "@/router";
import {login} from "@/net/index.ts";
import {ElMessage} from "element-plus";

const formRef = ref()

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const rules = {
  username: [
    {required: true, message: '请输入用户名'}
  ],
  password: [
    {required: true, message: '请输入密码'}
  ]
}

const userLogin = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      login(form.username, form.password, form.remember, (data) => {
        if (data.role !== '管理员') {
          ElMessage.error('无权限：仅管理员可登录管理端');
          return;
        }
        // 存储token时带上role
        const authObj = {
          token: data.token,
          expire: data.expire,
          username: data.username,
          id: data.id,
          role: data.role
        };
        const str = JSON.stringify(authObj);
        if (form.remember) {
          localStorage.setItem('access_token', str);
        } else {
          sessionStorage.setItem('access_token', str);
        }
        ElMessage.success(`欢迎 ${data.username} ~`);
        router.push('/home');
      })
    }
  });
}
</script>

<template>
  <div class="page-flex">
    <div class="left-blank"></div>
    <div class="right-login">
      <el-card class="login-card">
        <div class="login-logo">
          <img src="@/assets/elm.svg" alt="logo" />
        </div>
        <div class="login-title">管理员端登录</div>
        <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="form.username" maxlength="30" type="text" placeholder="用户名/邮箱">
              <template #prefix>
                <el-icon>
                  <User/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" maxlength="20" type="password" placeholder="密码">
              <template #prefix>
                <el-icon>
                  <Lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-row class="login-row">
            <el-col :span="24" class="text-left">
              <el-form-item prop="remember">
                <el-checkbox v-model="form.remember" label="记住我"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="userLogin" type="success" plain class="login-btn">立即登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.page-flex {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}
.left-blank {
  flex: 1;
  /* 可加背景图或宣传语 */
}
.right-login {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 420px;
}
.login-card {
  width: 400px;
  padding: 40px 32px 32px 32px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  background: #fff;
}
.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
.login-logo img {
  width: 80px;
  height: 80px;
}
.login-title {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 28px;
  color: #333;
}
.login-form {
  margin-bottom: 0;
}
.login-btn {
  width: 294px;
  display: block;
  margin: 0 auto 16px auto;
  font-size: 16px;
}
.login-row {
  margin-bottom: 8px;
}
</style> 