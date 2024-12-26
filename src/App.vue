<script setup lang="ts">
import router from "@/router/index.ts";
</script>

<template>
  <RouterView></RouterView>

  <div class="w-full h-[14vw] border-t border-[#DDD] fixed left-0 bottom-0 flex justify-around items-center bg-white">
    <div class="text-center" @click="router.push('/home')">
      <i-material-symbols-house-rounded class="text-[#888] text-[6vw] ml-[0.5vw]"/>
      <span class="text-[#888] text-[4vw] font-medium">首页</span>
    </div>
    <div class="text-center">
      <i-tdesign-compass class="text-[#888] text-[6vw] ml-[0.5vw]"/>
      <span class="text-[#888] text-[4vw] font-medium">发现</span>
    </div>
    <div class="text-center">
      <i-material-symbols-text-snippet-outline-sharp class="text-[#888] text-[6vw] ml-[0.5vw]"/>
      <span class="text-[#888] text-[4vw] font-medium">订单</span>
    </div>
    <div class="text-center">
      <i-ic-round-person class="text-[#888] text-[6vw] ml-[0.5vw]"/>
      <span class="text-[#888] text-[4vw] font-medium">我的</span>
    </div>
  </div>
</template>

<style scoped>

</style>
