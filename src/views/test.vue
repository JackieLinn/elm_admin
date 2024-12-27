<script setup lang="ts">
import MineHeader from "@/components/mine/MineHeader.vue";
import { onMounted, ref } from "vue";
import type { AccountVO } from "@/type/accountVO.ts";
import axios from "axios";

// 定义响应式变量
const account = ref<AccountVO | null>(null);
const loading = ref<boolean>(true);
const error = ref<string>("");

// 获取个人信息的函数
const fetchAccountInfo = async () => {
  try {
    const tokenData = sessionStorage.getItem('access_token');
    if (!tokenData) {
      throw new Error('未找到访问令牌。');
    }

    const parsedToken = JSON.parse(tokenData);
    const id = parsedToken.id;
    const token = parsedToken.token;

    const response = await axios.get('/api/account/get-account-by-userId', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        userId: id
      }
    });

    account.value = response.data;
  } catch (err) {
    console.error('获取个人信息失败:', err);
    error.value = '无法加载个人信息，请稍后重试。';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAccountInfo();
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-100">
    <!-- 头部组件 -->
    <MineHeader />

    <!-- 主体内容区域 -->
    <div class="w-full max-w-md mt-6 p-4 bg-white shadow-md rounded-lg">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center text-lg text-gray-700">
        加载中...
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center text-red-500">
        {{ error }}
      </div>

      <!-- 个人信息展示 -->
      <div v-else-if="account" class="flex flex-col items-center">
        <!-- 头像 -->
        <img
            :src="account.userImg || '/assets/img/default-avatar.png'"
            :alt="`${account.userName} 的头像`"
            class="w-24 h-24 rounded-full object-cover"
        />

        <!-- 用户名 -->
        <h2 class="mt-4 text-2xl font-semibold text-gray-800">
          {{ account.userName }}
        </h2>

        <!-- 用户性别 -->
        <p class="mt-2 text-gray-600">
          性别：{{ account.userSex === 1 ? '男' : account.userSex === 2 ? '女' : '其他' }}
        </p>

        <!-- 用户邮箱 -->
        <p class="mt-1 text-gray-600">
          邮箱：{{ account.email }}
        </p>
      </div>

      <!-- 如果没有账号信息 -->
      <div v-else class="text-center text-gray-700">
        未找到个人信息。
      </div>
    </div>

    <!-- 购物车组件 -->
    <Cart />
  </div>
</template>

<style scoped>
/* 由于使用了 Unocss，通常不需要在此处添加额外的样式 */
</style>
