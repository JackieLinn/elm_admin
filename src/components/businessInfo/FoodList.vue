<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import type { FoodVO } from '@/type/foodVO.ts';
import type {CartVO} from "@/type/cartVO.ts";

const props = defineProps<{
  businessId: number;
}>();

const cartList = ref<CartVO[]>([]);
const foodList = ref<FoodVO[]>([]);
const loading = ref<boolean>(true);
const error = ref<string>('');

// 获取食物数据
const fetchFoodList = async () => {
  loading.value = true;
  error.value = '';
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get('/api/food/list-food-by-BusinessId', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { businessId: props.businessId }
    });
    foodList.value = response.data;
  } catch (err) {
    console.error('获取食物列表失败:', err);
    error.value = '无法加载食物列表，请稍后重试。';
  } finally {
    loading.value = false;
  }
};

// 获取购物车数据
const fetchCartList = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const id = JSON.parse(sessionStorage.getItem('access_token')).id;
    const response = await axios.post('/api/cart/list-cart', {
      userId: id,
      businessId: props.businessId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    cartList.value = response.data;
    mergeFoodAndCart(); // 合并食物信息和购物车数据
  } catch (err) {
    console.error('获取购物车失败:', err);
    error.value = '无法加载购物车，请稍后重试。';
  }
};

// 合并食物和购物车数据
const mergeFoodAndCart = () => {
  foodList.value = foodList.value.map(food => {
    const cartItem = cartList.value.find(cart => cart.foodId === food.foodId);
    food.quantity = cartItem ? cartItem.quantity : 0; // 默认数量为0
    return food;
  });
};

onMounted(() => {
  if (props.businessId) {
    fetchFoodList();
    fetchCartList();
  } else {
    error.value = '缺少 businessId 参数。';
    loading.value = false;
  }
});

watch(() => props.businessId, (newId) => {
  if (newId) {
    fetchFoodList();
  }
});
</script>

<template>
  <div class="w-full flex flex-col px-[2vw]">
    <div v-if="loading" class="text-center text-lg mt-4">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500 mt-4">{{ error }}</div>
    <div v-else>
      <div class="w-full">
        <div
            v-for="food in foodList"
            :key="food.foodId"
            class="w-full h-[25vw] flex justify-between items-center  border-b border-gray-300"
        >
          <!-- 左侧信息 -->
          <div class="flex items-center">
            <img
                :src="food.foodImg || '/img/sp01.png'"
                :alt="food.foodName"
                class="w-[20vw] h-[20vw] object-cover"
            />
            <div class="ml-[3vw] flex flex-col">
              <h3 class="text-[4.5vw] text-gray-700 font-bold">{{ food.foodName }}</h3>
              <span class="text-[3.5vw] text-gray-600 mt-[2vw]">{{ food.foodExplain }}</span>
              <span class="text-[3.5vw] text-gray-600 mt-[2vw]">&#165;{{ food.foodPrice }}</span>
            </div>
          </div>
          <!-- 右侧操作 -->
          <div class="w-[16vw] flex justify-between items-center mr-[1vw]">
            <i-material-symbols-add-circle-rounded class="text-[5.5vw] text-gray-500 cursor-pointer"/>
            <p class="text-[3.6vw] text-gray-800 mx-[1vw]">{{ food.quantity }}</p>
            <i-material-symbols-add-circle-rounded class="text-[5.5vw] text-blue-500 cursor-pointer"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>