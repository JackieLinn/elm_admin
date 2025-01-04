<script setup lang="ts">
import { ref } from 'vue';
import OrderListHeader from "@/components/orderList/orderListHeader.vue";

const isOrderDetailVisible = ref(false);
const toggleOrderDetail = () => {
  isOrderDetailVisible.value = !isOrderDetailVisible.value;
};
</script>

<template>
  <OrderListHeader/>

  <h3 class="mt-[12vw] mb-0 p-[4vw] text-[4vw] font-light text-[#777]">
    已支付订单信息：
  </h3>
  <div class="w-full">
    <div class="w-full">
      <div class="flex justify-between items-center p-[2vw] text-[#666] text-[4.5vw]">
        <span class="flex">
          万家饺子（软件园E18店）
          <i-octicon-triangle-down-24 class="ml-[-2vw] mt-[0.5vw] cursor-pointer" @click="toggleOrderDetail" />
        </span>
        <div class="flex">
          <span class="text-[orangered]">¥ 49</span>
        </div>
      </div>
      <div v-show="isOrderDetailVisible" class="w-full">
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>纯肉鲜肉（水饺） x 2</span>
          <span>¥ 15</span>
        </div>
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>玉米鲜肉（水饺） x 1</span>
          <span>¥ 16</span>
        </div>
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>配送费</span>
          <span>¥ 3</span>
        </div>
      </div>
    </div>
  </div>

  <h3 class="mt-[12vw] mb-0 p-[4vw] text-[4vw] font-light text-[#777]">
    未支付订单信息：
  </h3>
  <div class="w-full">
    <div class="w-full">
      <div class="flex justify-between items-center p-[2vw] text-[#666] text-[4.5vw]">
        <span class="flex">
          万家饺子（软件园E18店）
          <i-octicon-triangle-down-24 class="ml-[-2vw] mt-[0.5vw] cursor-pointer" @click="toggleOrderDetail" />
        </span>
        <div class="flex">
          <span class="text-[orangered]">¥ 49</span>
        </div>
      </div>
      <div v-show="isOrderDetailVisible" class="w-full">
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>纯肉鲜肉（水饺） x 2</span>
          <span>¥ 15</span>
        </div>
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>玉米鲜肉（水饺） x 1</span>
          <span>¥ 16</span>
        </div>
        <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
          <span>配送费</span>
          <span>¥ 3</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>