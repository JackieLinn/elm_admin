<script setup lang="ts">
import BusinessListHeader from "@/components/businessList/BusinessListHeader.vue";
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type {BusinessVO} from "@/type/businessVO.ts";

const businesses = ref<BusinessVO[]>([])
const loading = ref(true)
const error = ref('')
const router = useRouter()
const route = useRoute()

// 获取 orderTypeId 参数
const orderTypeId = ref<number>(Number(route.query.orderTypeId))

const fetchBusinessList = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get('/api/business/get-business-by-orderTypeId', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        orderTypeId: orderTypeId.value
      }
    })

    if (Array.isArray(response.data)) {
      // 过滤掉 businessId 为 null 或 undefined 的对象
      businesses.value = response.data.filter((item: BusinessVO) => item.businessId != null)
    } else throw new Error('Unexpected response structure')
  } catch (err) {
    console.error('获取商家列表失败:', err)
    error.value = '无法加载商家列表，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const navigateToBusinessInfo = (businessId: number) => {
  router.push({ name: 'businessInfo', query: { businessId: businessId } })
}

onMounted(() => {
  fetchBusinessList()
})
</script>

<template>
  <BusinessListHeader/>

  <div class="w-full mt-[12vw] mb-[14vw]">
    <!-- 头部组件 -->
    <BusinessListHeader />

    <div v-if="loading" class="text-center text-lg mt-4">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500 mt-4">{{ error }}</div>
    <div v-else>
      <div
          v-for="business in businesses"
          :key="business.businessId"
          class="w-full border-b border-gray-300 p-[2.5vw] flex items-center cursor-pointer user-select-none"
          @click="navigateToBusinessInfo(business.businessId)"
      >
        <!-- 商家图片 -->
        <div class="relative">
          <img
              :src="business.businessImg || '/assets/img/sj01.png'"
              :alt="business.businessName"
              class="w-[20vw] h-[20vw] object-cover"
          />
          <div class="absolute -right-[1.5vw] -top-[1.5vw] w-[5vw] h-[5vw] bg-red-500 text-white text-[3.6vw] rounded-full flex justify-center items-center">
            3
          </div>
        </div>
        <!-- 商家信息 -->
        <div class="ml-[3vw] flex flex-col">
          <h3 class="text-[4vw] text-gray-700 m-0 font-bold">{{ business.businessName }}</h3>
          <span class="text-[3.5vw] text-gray-600 mt-[2vw]">
            &#165;{{ business.startPrice }}起送 | &#165;{{ business.deliveryPrice }}配送
          </span>
          <span class="text-[3.5vw] text-gray-600 mt-[2vw]">{{ business.businessExplain }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>