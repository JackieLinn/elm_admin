<script setup lang="ts">
import router from "@/router/index.ts";
</script>

<template>
  <div class="w-full h-[12vw] bg-[#0097FF] text-white text-[4.8vw] fixed left-0 top-0 z-[1000] flex justify-center items-center">
    <i-material-symbols-chevron-left class="w-[15%] box-border text-[6vw]"
                                     @click="router.back()"/>
    <span class="w-[70%] flex justify-center items-center">在线支付</span>
    <div class="w-[15%]"></div>
  </div>
</template>

<style scoped>

</style>