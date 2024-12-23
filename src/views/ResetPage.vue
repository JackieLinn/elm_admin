<script setup lang="ts">
import {ref} from "vue";
import {EditPen, Lock, Message} from "@element-plus/icons-vue";
import router from "@/router";
import {ElMessage} from "element-plus";

const active =ref(0)

const confirmReset = ()=> {
  active.value++
}

const doReset = ()=> {
  router.push('/login')
  ElMessage.success('密码重置成功')
}
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-center items-center mt-[30%]">
      <img src="@/assets/elm.svg" class="w-[70%]" alt="">
    </div>
    <div class="mt-[10vw] ml-[6vw] mr-[6vw] text-center">
      <div class="mt-[1vw]">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="验证电子邮件"/>
          <el-step title="重新设定密码"/>
        </el-steps>
      </div>
      <div v-if="active === 0" class="my-0 mx-2vw">
        <div class="mt-[5vw]">
          <div class="text-3xl font-semibold">重置密码</div>
          <div class="text-[1em] mt-[8px] text-gray-500">请输入需要重置密码的电子邮件地址</div>
        </div>
        <div class="mt-[5vw]">
          <el-form>
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
                <el-col :span="16">
                  <el-input :maxlength="6" type="text" placeholder="请输入验证码">
                    <template #prefix>
                      <el-icon>
                        <EditPen/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="success">获取验证码</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <div class="my-[3vw]] mx-0">
          <el-button @click="confirmReset" type="warning" plain class="w-[80vw]">开始重置密码</el-button>
        </div>
      </div>
      <div v-if="active === 1" class="my-0 mx-2vw">
        <div class="mt-[5vw]">
          <div class="text-3xl font-semibold">重置密码</div>
          <div class="text-[1em] mt-[8px] text-gray-500">请填写你的新密码，并牢记防止丢失</div>
        </div>
        <div class="mt-[5vw]">
          <el-form>
            <el-form-item prop="password">
              <el-input maxlength="20" type="password" placeholder="密码">
                <template #prefix>
                  <el-icon>
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password_repeat">
              <el-input maxlength="20" type="password" placeholder="重复密码">
                <template #prefix>
                  <el-icon>
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="my-[3vw]] mx-0">
          <el-button @click="doReset" type="danger" plain class="w-[80vw]">立即重置密码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>