<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import PaymentHead from "@/components/payment/PaymentHead.vue";
import type { OrdersBusinessVO } from "@/type/ordersBusinessVO.ts";
import type { OrdersFoodVO } from "@/type/ordersFoodVO.ts";
import axios from "axios";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

const orderId = ref<number>(Number(route.query.orderId));

const selectedPayment = ref<'ALiPay' | 'WeChatPay' | null>('ALiPay');

const togglePayment = (payment: 'ALiPay' | 'WeChatPay') => {
  if (selectedPayment.value === payment) {
    selectedPayment.value = null;
  } else {
    selectedPayment.value = payment;
  }
};

const isFoodListVisible = ref(false);

const businessInfo = ref<OrdersBusinessVO | null>({});
const foodInfo = ref<OrdersFoodVO[]>([]);

const fetchOrderData = async () => {
  try {
    const tokenData = sessionStorage.getItem('access_token');
    if (!tokenData) {
      console.error('没有找到访问令牌');
      return;
    }
    const { token, id } = JSON.parse(tokenData);

    // 获取商家信息
    const businessResponse = await axios.get('/api/orders/get-business-info', {
      params: {
        orderId: orderId.value
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    businessInfo.value = businessResponse.data;

    // 获取食物信息
    const foodResponse = await axios.get('/api/orders/get-food-info', {
      params: {
        orderId: orderId.value
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    foodInfo.value = foodResponse.data;
  } catch (error) {
    console.log('获取订单数据失败:', error);
  }
}

const payment = async () => {
  try {
    const tokenData = sessionStorage.getItem('access_token');
    if (!tokenData) {
      ElMessage.error("未找到访问令牌！");
      return;
    }
    const { token, id } = JSON.parse(tokenData);

    const response = await axios.post('/api/orders/payment', {
      userId: id,
      orderId: orderId.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const isPay = response.data;
    if (isPay) {
      ElMessage.success("支付成功！");
      await router.push('/home');
    } else {
      ElMessage.error("出现异常！");
    }
  } catch (error) {
    console.error('支付失败:', error);
    ElMessage.error("支付失败，请稍后重试！");
  }
}

onMounted(() => {
  fetchOrderData();
});
</script>

<template>
  <PaymentHead/>

  <h3 class="mt-[12vw] mb-0 px-[4vw] pt-[4vw] text-[4vw] font-light text-[#777]">
    订单信息：
  </h3>

  <div class="flex justify-between items-center p-[4vw] text-[#666] text-[4.5vw]">
    <span class="flex">
      {{ businessInfo.businessName }}
      <i-octicon-triangle-down-24
          v-if="!isFoodListVisible"
          @click="isFoodListVisible = !isFoodListVisible"
          class="ml-[1vw] mt-[0.5vw] align-center cursor-pointer"
      />
      <i-octicon-triangle-up-24
          v-else
          @click="isFoodListVisible = !isFoodListVisible"
          class="ml-[1vw] mt-[0.5vw] align-center cursor-pointer"
      />
    </span>
    <span class="text-[orangered]">¥ {{ businessInfo.totalPrice }}</span>
  </div>
  <div class="w-full" v-show="isFoodListVisible">
    <div v-for="(food, index) in foodInfo" :key="index" class="flex justify-between items-center px-[4vw] py-[1vw]">
      <span class="text-[3.5vw] text-[#666]">{{ food.foodName }} x {{ food.quantity }}</span>
      <span class="text-[3.5vw] text-[#666]">¥ {{ food.foodPrice * food.quantity }}</span>
    </div>
    <!-- 配送费 -->
    <div class="flex justify-between items-center px-[4vw] py-[1vw]">
      <span class="text-[3.5vw] text-[#666]">配送费</span>
      <span class="text-[3.5vw] text-[#666]">¥ {{ businessInfo.deliveryPrice }}</span>
    </div>
  </div>

  <div class="w-full">
    <div class="flex flex-col w-full">
      <div
          class="flex justify-between items-center px-[4vw] py-[4vw] pb-[1vw]"
          @click="togglePayment('ALiPay')"
      >
        <img src="/img/alipay.png" alt="支付宝" class="w-[33vw] h-[8.6vw]" />
        <i-material-symbols-check-circle
            class="text-[5vw]"
            :class="{'text-[#38CA73]': selectedPayment === 'ALiPay', 'text-[#ccc]': selectedPayment !== 'ALiPay'}"
        />
      </div>
      <div
          class="flex justify-between items-center px-[4vw] py-[4vw] pb-[1vw]"
          @click="togglePayment('WeChatPay')"
      >
        <img src="/img/wechat.png" alt="微信支付" class="w-[33vw] h-[8.6vw]" />
        <i-material-symbols-check-circle
            class="text-[5vw]"
            :class="{'text-[#38CA73]': selectedPayment === 'WeChatPay', 'text-[#ccc]': selectedPayment !== 'WeChatPay'}"
        />
      </div>
    </div>

    <div class="w-full px-[4vw] pb-[14vw] pt-[3vw] flex justify-center items-center">
      <el-button @click="payment" type="success" class="w-[95vw]">
        确认支付
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>