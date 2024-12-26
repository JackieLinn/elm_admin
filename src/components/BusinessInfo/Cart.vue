<script setup lang="ts">
const cartQuantity = 3;
const cartAmount = 12.88;
const deliveryFee = 3;
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
      <div class="w-full h-full bg-[#38CA73] text-white text-[4.5vw] font-bold flex justify-center items-center cursor-pointer">
        去结算
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>