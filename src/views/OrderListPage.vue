<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import OrderListHeader from "@/components/orderList/orderListHeader.vue";
import type {AllOrderListVO} from "@/type/allOrderListVO.ts";

// 状态变量
const allOrderList = ref<AllOrderListVO>({
  paidList: [],
  unpaidList: []
});

// 用于控制每个订单详情的显示状态
const orderDetailVisibility = ref<Record<string, boolean>>({});

// 获取订单信息的函数
const fetchAllOrders = async () => {
  try {
    const tokenData = sessionStorage.getItem('access_token');
    if (!tokenData) {
      console.error('没有找到访问令牌');
      return;
    }
    const { token, id } = JSON.parse(tokenData);
    const response = await axios.get<AllOrderListVO>('/api/orders/get-all-order-info', {
      params: {
        userId: id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    allOrderList.value = response.data;

    // 初始化每个订单的详情显示状态为 false
    const visibility: Record<string, boolean> = {};
    response.data.paidList.forEach((_, index) => {
      visibility[`paid-${index}`] = false;
    });
    response.data.unpaidList.forEach((_, index) => {
      visibility[`unpaid-${index}`] = false;
    });
    orderDetailVisibility.value = visibility;
  } catch (error) {
    console.error('获取订单信息失败:', error);
  }
};

// 切换订单详情显示状态的函数
const toggleOrderDetail = (key: string) => {
  orderDetailVisibility.value[key] = !orderDetailVisibility.value[key];
};

onMounted(() => {
  fetchAllOrders();
});
</script>

<template>
  <OrderListHeader />

  <h3 class="mt-[12vw] mb-0 p-[4vw] text-[4vw] font-light text-[#777]">
    已支付订单信息：
  </h3>
  <div class="w-full">
    <div v-if="allOrderList.paidList.length > 0">
      <div
          v-for="(order, index) in allOrderList.paidList"
          :key="`paid-${index}`"
          class="w-full mb-[4vw]"
      >
        <div class="flex justify-between items-center p-[2vw] text-[#666] text-[4.5vw]">
          <span class="flex items-center">
            {{ order.businessName }}
            <i-octicon-triangle-down-24
                v-if="!orderDetailVisibility[`paid-${index}`]"
                class="ml-[1vw] mt-[0.5vw] cursor-pointer"
                @click="toggleOrderDetail(`paid-${index}`)"
            />
            <i-octicon-triangle-up-24
                v-else
                class="ml-[1vw] mt-[0.5vw] cursor-pointer"
                @click="toggleOrderDetail(`paid-${index}`)"
            />
          </span>
          <div class="flex">
            <span class="text-[orangered]">¥ {{ order.totalPrice }}</span>
          </div>
        </div>
        <div v-show="orderDetailVisibility[`paid-${index}`]" class="w-full">
          <div
              v-for="(pair, foodId) in order.foodList"
              :key="foodId"
              class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]"
          >
            <span>{{ pair.first }} x {{ pair.second.first }}</span>
            <span>¥ {{ pair.second.second }}</span>
          </div>
          <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
            <span>配送费</span>
            <span>¥ {{ order.deliveryPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-[#999] p-[4vw]">
      暂无信息
    </div>
  </div>

  <h3 class="mt-[12vw] mb-0 p-[4vw] text-[4vw] font-light text-[#777]">
    未支付订单信息：
  </h3>
  <div class="w-full">
    <div v-if="allOrderList.unpaidList.length > 0">
      <div
          v-for="(order, index) in allOrderList.unpaidList"
          :key="`unpaid-${index}`"
          class="w-full mb-[4vw]"
      >
        <div class="flex justify-between items-center p-[2vw] text-[#666] text-[4.5vw]">
          <span class="flex items-center">
            {{ order.businessName }}
            <i-octicon-triangle-down-24
                v-if="!orderDetailVisibility[`unpaid-${index}`]"
                class="ml-[1vw] mt-[0.5vw] cursor-pointer"
                @click="toggleOrderDetail(`unpaid-${index}`)"
            />
            <i-octicon-triangle-up-24
                v-else
                class="ml-[1vw] mt-[0.5vw] cursor-pointer"
                @click="toggleOrderDetail(`unpaid-${index}`)"
            />
          </span>
          <div class="flex">
            <span class="text-[orangered]">¥ {{ order.totalPrice }}</span>
          </div>
        </div>
        <div v-show="orderDetailVisibility[`unpaid-${index}`]" class="w-full">
          <div
              v-for="(pair, foodId) in order.foodList"
              :key="foodId"
              class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]"
          >
            <span>{{ pair.first }} x {{ pair.second.first }}</span>
            <span>¥ {{ pair.second.second }}</span>
          </div>
          <div class="flex justify-between items-center px-[4vw] py-[1vw] text-[#666] text-[3.5vw]">
            <span>配送费</span>
            <span>¥ {{ order.deliveryPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-[#999] p-[4vw]">
      暂无信息
    </div>
  </div>
</template>

<style scoped>

</style>