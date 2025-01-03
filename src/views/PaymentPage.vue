<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter } from "vue-router";
import PaymentHead from "@/components/payment/PaymentHead.vue";

const route = useRoute()
const router = useRouter()

const orderId = ref<number>(Number(route.query.orderId));
console.log(orderId.value)
console.log(typeof orderId.value)

const selectedPayment = ref<'ALiPay' | 'WeChatPay' | null>('ALiPay');

const togglePayment = (payment: 'ALiPay' | 'WeChatPay') => {
  if (selectedPayment.value === payment) {
    selectedPayment.value = null;
  } else {
    selectedPayment.value = payment;
  }
};

onMounted(() => {
});
</script>

<template>
  <PaymentHead/>

  <h3 class="mt-[12vw] mb-0 px-[4vw] pt-[4vw] text-[4vw] font-light text-[#777]">
    订单信息：
  </h3>

  <div class="flex justify-between items-center p-[4vw] text-[#666] text-[4.5vw]">
    <span class="flex">
      万家饺子（软件园E18店）
      <i-octicon-triangle-down-24 class="ml-[-2vw] mt-[0.5vw] align-[center]"/>
    </span>
    <span class="text-[orangered]">¥ 49</span>
  </div>
  <div class="w-full">
    <div class="flex justify-between items-center px-[4vw] py-[1vw]">
      <span class="text-[3.5vw] text-[#666]">纯肉鲜肉（水饺） x 2</span>
      <span class="text-[3.5vw] text-[#666]">&#165;15</span>
    </div>
    <div class="flex justify-between items-center px-[4vw] py-[1vw]">
      <span class="text-[3.5vw] text-[#666]">玉米鲜肉（水饺） x 1</span>
      <span class="text-[3.5vw] text-[#666]">&#165;16</span>
    </div>
    <div class="flex justify-between items-center px-[4vw] py-[1vw]">
      <span class="text-[3.5vw] text-[#666]">配送费</span>
      <span class="text-[3.5vw] text-[#666]">&#165;3</span>
    </div>
  </div>

  <div class="w-full">
    <div class="flex flex-col w-full">
      <div
          class="flex justify-between items-center px-[4vw] py-[4vw] pb-[1vw]"
          @click="togglePayment('ALiPay')"
      >
        <img src="/img/alipay.png" alt="" class="w-[33vw] h-[8.6vw]" />
        <i-material-symbols-check-circle
            class="text-[5vw]"
            :class="{'text-[#38CA73]': selectedPayment === 'ALiPay', 'text-[#ccc]': selectedPayment !== 'ALiPay'}"
        />
      </div>
      <div
          class="flex justify-between items-center px-[4vw] py-[4vw] pb-[1vw]"
          @click="togglePayment('WeChatPay')"
      >
        <img src="/img/wechat.png" alt="" class="w-[33vw] h-[8.6vw]" />
        <i-material-symbols-check-circle
            class="text-[5vw]"
            :class="{'text-[#38CA73]': selectedPayment === 'WeChatPay', 'text-[#ccc]': selectedPayment !== 'WeChatPay'}"
        />
      </div>
    </div>

    <div class="w-full px-[4vw] pb-[14vw] pt-[3vw] flex justify-center items-center">
      <el-button type="success" class="w-[95vw]">
        确认支付
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>