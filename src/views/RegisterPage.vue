<script setup lang="ts">
import {EditPen, Lock, Message, User} from "@element-plus/icons-vue";
import router from "@/router";
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-center items-center mt-[30%]">
      <img src="@/assets/elm.svg" class="w-[70%]" alt="">
    </div>
    <div class="mt-[10vw] flex justify-center items-center text-3xl font-semibold">注册</div>
    <div class="mt-[4vw] ml-[6vw] mr-[6vw]">
      <el-form>
        <el-form-item prop="username">
          <el-input maxlength="30" type="text" placeholder="用户名/邮箱" class="mt-[5px]">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input maxlength="20" type="password" placeholder="密码" class="mt-[5px]">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input maxlength="20" type="password" placeholder="重复密码" class="mt-[5px]">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="email" placeholder="电子邮件地址">
            <template #prefix>
              <el-icon>
                <Message/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" class="w-full">
            <el-col :span="18">
              <el-input :maxlength="6" type="text" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <EditPen/>
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="success">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="flex justify-center items-center flex-col">
        <div class="mt-[1vw]">
          <el-button type="warning" plain class="w-[80vw]">立即注册</el-button>
        </div>
        <div class="my-[3vw] mx-0">
          <span class="text-[1em] leading-[15px] text-gray-500">已有账号?&nbsp;&nbsp;&nbsp;</span>
          <el-link @click="router.push('/login')" type="primary" class="translate-x-0 translate-y-[-2px]">立即登录</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>