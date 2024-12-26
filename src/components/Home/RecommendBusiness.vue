<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface BusinessVO {
  businessId: number
  businessName: string
  businessExplain: string
  businessImg: string
  startPrice: number
  deliveryPrice: number
}

const businesses = ref<BusinessVO[]>([])
const loading = ref(true)
const error = ref('')
const router = useRouter()

// 获取推荐商家数据
const fetchRecommendBusiness = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get('/api/business/get-recommend-business', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    businesses.value = response.data
  } catch (err) {
    console.error('获取推荐商家数据失败:', err)
    error.value = '无法加载推荐商家，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecommendBusiness()
})
</script>

<template>
  <div class="w-full mb-[14vw]">
    <div v-if="loading" class="text-center text-lg">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <div
          v-for="business in businesses"
          :key="business.businessId"
          class="w-full border-b border-gray-300 p-[1.5vw] flex cursor-pointer user-select-none"
      >
        <img :src="business.businessImg || '/assets/img/sj01.png'"
             :alt="business.businessName"
             class="w-[18vw] h-[18vw] object-cover"/>
        <!-- 商家信息 -->
        <div class="flex-1 pl-[3vw]">
          <!-- 第一行：商家名称和喜欢按钮 -->
          <div class="flex justify-between items-center mb-[2vw]">
            <h3 class="text-[4vw] text-gray-800 m-0">{{ business.businessName }}</h3>
            <div class="w-[1.6vw] h-[3.4vw] bg-gray-600 text-white text-[4vw]
            flex justify-center items-center mr-[3vw]">
              &#8226;
            </div>
          </div>
          <!-- 第二行：评分和配送信息 (固定内容) -->
          <div class="flex justify-between items-center mb-[2vw] text-[3.1vw]">
            <div class="flex items-center">
              <i-material-symbols-star class="material-symbols-outlined text-yellow-500 mr-[0.5vw]"/>
              <i-material-symbols-star class="material-symbols-outlined text-yellow-500 mr-[0.5vw]"/>
              <i-material-symbols-star class="material-symbols-outlined text-yellow-500 mr-[0.5vw]"/>
              <i-material-symbols-star class="material-symbols-outlined text-yellow-500 mr-[0.5vw]"/>
              <i-material-symbols-star class="material-symbols-outlined text-yellow-500 mr-[0.5vw]"/>
              <p class="text-gray-600 ml-[1vw]">4.9 月售345单</p>
            </div>
            <div class="bg-blue-500 text-white text-[2.5vw] rounded-sm px-[0.6vw]">
              蜂鸟专送
            </div>
          </div>
          <!-- 第三行：配送费和距离 (动态内容) -->
          <div class="flex justify-between items-center mb-[2vw] text-[3.1vw] text-gray-600">
            <p>&#165;{{ business.startPrice }}起送 | &#165;{{ business.deliveryPrice }}配送</p>
            <p>3.22km | 30分钟</p>
          </div>
          <!-- 第四行：商家描述 (动态内容) -->
          <div class="flex items-center mb-[3vw]">
            <div class="border border-gray-300 text-[2.8vw] text-gray-600 rounded-sm px-[0.1vw]">
              {{ business.businessExplain }}
            </div>
          </div>
          <!-- 第五行：促销信息 (固定内容) -->
          <div class="flex justify-between items-center mb-[1.8vw]">
            <div class="flex items-center">
              <div class="w-[4vw] h-[4vw] bg-green-600 text-white text-[3vw] rounded-sm flex justify-center items-center mr-[1vw]">
                新
              </div>
              <p class="text-gray-600 text-[3vw]">饿了么新用户首单立减9元</p>
            </div>
            <div class="flex items-center text-[2.5vw] text-gray-400">
              <p class="mr-[1vw]">2个活动</p>
              <i-octicon-triangle-down-24/>
            </div>
          </div>
          <!-- 第六行：特价信息 (固定内容) -->
          <div class="flex justify-start items-center">
            <div class="w-[4vw] h-[4vw] bg-orange-500 text-white text-[3vw] rounded-sm flex justify-center items-center mr-[1vw]">
              特
            </div>
            <p class="text-gray-600 text-[3vw]">特价商品5元起</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>