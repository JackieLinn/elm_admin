<script setup lang="ts">
import BusinessInfoHeader from "@/components/BusinessInfo/BusinessInfoHeader.vue";
import {useRoute, useRouter } from "vue-router";
import axios from 'axios'
import type {BusinessVO} from "@/type/businessVO.ts";

const route = useRoute()
const router = useRouter()

const businessId = ref<number>(Number(route.query.businessId))

const business = ref<BusinessVO | null>(null)

const loading = ref<boolean>(true)
const error = ref<string>('')

const fetchBusinessInfo = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get('/api/business/get-business-by-businessId', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        businessId: businessId.value
      }
    })
    console.log('API Response:', response.data)
    business.value = response.data
  } catch (err) {
    console.error('获取商家信息失败:', err)
    error.value = '无法加载商家信息，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (businessId.value) {
    fetchBusinessInfo()
  } else {
    error.value = '缺少 businessId 参数。'
    loading.value = false
  }
})
</script>

<template>
  <BusinessInfoHeader/>

  <div class="w-full mt-[12vw] mb-[14vw] flex flex-col items-center">
    <div v-if="loading" class="text-center text-lg mt-4">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500 mt-4">{{ error }}</div>
    <div v-else-if="business" class="business-info w-full h-[20vw] flex flex-col justify-center items-center">
      <img :src="business.businessImg || '/img/sj01.png'" :alt="business.businessName"
           class="w-[40vw] h-[30vw] object-cover mt-[40vw]"/>
      <h1 class="text-[5.5vw] text-gray-700 mt-[2vw] font-bold">{{ business.businessName }}</h1>
      <span class="text-[3.5vw] text-gray-600 mt-[1vw]">
        &#165;{{ business.startPrice }}起送 &#165;{{ business.deliveryPrice }}配送
      </span>
      <span class="text-[3.5vw] text-gray-600 mt-[1vw]">{{ business.businessExplain }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>