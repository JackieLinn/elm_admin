<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from "@/router/index.ts";

interface Category {
  id: number
  name: string
}

const categories = ref<Category[]>([])

const categoryImages: Record<number, string> = {
  1: '/img/dcfl01.png',
  2: '/img/dcfl02.png',
  3: '/img/dcfl03.png',
  4: '/img/dcfl04.png',
  5: '/img/dcfl05.png',
  6: '/img/dcfl06.png',
  7: '/img/dcfl07.png',
  8: '/img/dcfl08.png',
  9: '/img/dcfl09.png',
  10: '/img/dcfl10.png'
}

const getCategoryImage = (id: number): string => {
  return categoryImages[id]
}

const fetchCategories = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get('/api/business/get-all-categories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    categories.value = Object.entries(response.data).map(([id, name]) => ({
      id: Number(id),
      name: name as string
    }))
  } catch (error) {
    console.error('获取分类数据失败:', error)
  }
}

const changeToBusinessList = (orderTypeId: number) => {
  router.push({ name: 'businessList', query: { orderTypeId: orderTypeId } });
};

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="w-full h-[43vw] flex flex-wrap justify-around items-center mt-[4vw]">
    <div
        v-for="category in categories"
        :key="category.id"
        class="w-[18vw] h-[20vw] flex flex-col justify-center items-center user-select-none cursor-pointer"
        @click="changeToBusinessList(category.id)"
    >
      <img :src="getCategoryImage(category.id)" :alt="category.name"
           class="w-[16vw] h-[16vw] object-cover"/>
      <span class="text-[3.55vw] text-gray-600 mt-2">{{ category.name }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>