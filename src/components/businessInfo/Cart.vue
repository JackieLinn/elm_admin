<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import router from "@/router/index.ts";
import axios from 'axios';

const cartStore = useCartStore();

const props = defineProps<{
  businessId: number;
}>();

const cartQuantity = computed(() => cartStore.totalQuantity);
const cartAmount = computed(() => cartStore.totalPrice);
const deliveryFee = ref<number>(0);

const fetchDeliveryFee = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const response = await axios.get(`/api/business/get-delivery-price`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { businessId: props.businessId }
    });
    deliveryFee.value = response.data;
  } catch (error) {
    console.error('获取配送费失败:', error);
    deliveryFee.value = 0;
  }
};

onMounted(() => {
  fetchDeliveryFee();
});
</script>

<template>
  <div class="w-full h-[14vw] fixed bottom-0 left-0 flex">
    <div class="w-[66%] bg-[#505051] flex">
      <div class="w-[16vw] h-[16vw] border-[1.6vw] border-[#444] rounded-full bg-[#3190E8] flex justify-center items-center -mt-[4vw] ml-[3vw] relative">
        <i-material-symbols-shopping-cart class="text-[7vw] text-white"/>
        <div class="absolute top-[-1.5vw] right-[-1.5vw] w-[5vw] h-[5vw] rounded-full bg-red-500 text-white text-[3.6vw] flex justify-center items-center">
          {{ cartQuantity }}
        </div>
      </div>
      <div class="ml-[1vw] flex flex-col justify-center">
        <span class="text-white text-[5vw]">{{ '¥' + cartAmount }}</span>
        <span class="text-[#AAA] text-[3vw] mt-[0.5vw]">另需配送费¥{{ deliveryFee }}</span>
      </div>
    </div>
    <div class="w-[34%]">
      <div @click="router.push('/order')"
          class="w-full h-full bg-[#38CA73] text-white text-[4.5vw] font-bold flex justify-center items-center cursor-pointer">
        去结算
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>