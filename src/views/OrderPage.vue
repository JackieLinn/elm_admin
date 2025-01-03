<script setup lang="ts">
import OrderHeader from "@/components/order/OrderHeader.vue";
import OrderAddress from "@/components/order/OrderAddress.vue";

const props = defineProps<{
  orderId: number;
}>();

console.log(props);
console.log(props.orderId);
</script>

<template>
  <OrderHeader/>
  <OrderAddress/>

  <h3 class="m-0 box-border p-[3vw] text-[5vw] text-[#666] border-b border-[#DDD] font-bold">
    万家饺子（软件园E18店）
  </h3>

  <div class="w-full">
    <div class="w-full h-[16vw] p-[3vw] text-[#666] flex justify-between items-center">
      <div class="flex items-center">
        <img src="/img/sp01.png" alt="" class="w-[10vw] h-[10vw]" />
        <span class="text-[4vw] ml-[3vw]">纯肉鲜肉（水饺） x 2</span>
      </div>
      <span class="text-[4vw]">¥15</span>
    </div>
    <div class="w-full h-[16vw] p-[3vw] text-[#666] flex justify-between items-center">
      <div class="flex items-center">
        <img src="/img/sp02.png" alt="" class="w-[10vw] h-[10vw]" />
        <span class="text-[4vw] ml-[3vw]">玉米鲜肉（水饺） x 1</span>
      </div>
      <span class="text-[4vw]">¥16</span>
    </div>
  </div>

  <div class="w-full h-[16vw] p-[3vw] text-[#666] flex justify-between items-center text-[4vw] mb-[14vw]">
    <span>配送费</span>
    <span>¥3</span>
  </div>

  <div class="w-full h-[14vw] fixed bottom-0 left-0 flex">
    <div class="w-[66%] bg-[#505051] text-white text-[4.5vw] font-bold flex justify-center items-center">
      &#165; 49
    </div>
    <div class="w-[34%] bg-[#38CA73] text-white text-[4.5vw] font-bold flex justify-center items-center cursor-pointer">
      去支付
    </div>
  </div>
</template>

<style scoped>

</style>