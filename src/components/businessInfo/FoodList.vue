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

// 更新购物车数量
const updateCartQuantity = async (foodId: number, currentQuantity: number) => {
  const newQuantity = currentQuantity + 1;
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const id = JSON.parse(sessionStorage.getItem('access_token')).id;
    if (currentQuantity === 0) {
      const response = await axios.post('/api/cart/save-cart', {
        userId: id,
        businessId: props.businessId,
        foodId: foodId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('添加至购物车:', response.data);
    } else {
      const response = await axios.post('/api/cart/update-cart', {
        userId: id,
        businessId: props.businessId,
        foodId: foodId,
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('更新购物车:', response.data);
    }
    const food = foodList.value.find(item => item.foodId === foodId);
    if (food) {
      food.quantity = newQuantity;
    }
  } catch (err) {
    console.error('操作失败:', err);
    error.value = '操作失败，请稍后重试。';
  }
};

// 移除购物车中的食物
const removeCartItem = async (foodId: number, currentQuantity: number) => {
  if (currentQuantity > 0) {
    const newQuantity = currentQuantity - 1;
    try {
      const token = JSON.parse(sessionStorage.getItem('access_token')).token;
      const id = JSON.parse(sessionStorage.getItem('access_token')).id;
      if (newQuantity > 0) {
        const response = await axios.post('/api/cart/update-cart', {
          userId: id,
          businessId: props.businessId,
          foodId: foodId,
          quantity: newQuantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('更新购物车:', response.data);
      } else {
        const response = await axios.post('/api/cart/remove-cart', {
          userId: id,
          businessId: props.businessId,
          foodId: foodId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('从购物车移除:', response.data);
      }
      // 更新本地 UI 中的数量
      const food = foodList.value.find(item => item.foodId === foodId);
      if (food) {
        food.quantity = newQuantity;
      }
    } catch (err) {
      console.error('操作失败:', err);
      error.value = '操作失败，请稍后重试。';
    }
  }
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
            <i-material-symbols-add-circle-rounded
                class="text-[5.5vw] text-blue-500 cursor-pointer"
                @click="updateCartQuantity(food.foodId, food.quantity)"
            />
            <p class="text-[3.6vw] text-gray-800 mx-[1vw]">{{ food.quantity }}</p>
            <i-material-symbols-do-not-disturb-on
                class="text-[5.5vw] text-gray-500 cursor-pointer"
                @click="removeCartItem(food.foodId, food.quantity)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>