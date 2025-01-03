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
</template>

<style scoped>

</style>