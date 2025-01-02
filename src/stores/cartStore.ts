import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartVO } from '@/type/cartVO.ts';

export const useCartStore = defineStore('cart', () => {
  // 存储购物车列表
  const cartList = ref<CartVO[]>([]);

  // 计算总数量
  const totalQuantity = computed(() => {
    return cartList.value.reduce((total, item) => total + item.quantity, 0);
  });

  // 计算总价格，防止 NaN
  const totalPrice = computed(() => {
    return cartList.value.reduce((total, item) => {
      const price = isNaN(item.foodPrice) ? 0 : item.foodPrice;  // 防止 NaN
      return total + (item.quantity * price);
    }, 0);
  });

  // 更新购物车
  const updateCart = (foodId: number, quantity: number, foodPrice: number) => {
    const item = cartList.value.find(cart => cart.foodId === foodId);
    if (item) {
      item.quantity = quantity;
    } else {
      // 如果没有此商品，加入购物车
      cartList.value.push({
        foodId,
        quantity,
        foodPrice,
        foodName: '',
      });
    }
  };

  // 移除购物车中的商品
  const removeCart = (foodId: number) => {
    cartList.value = cartList.value.filter(cart => cart.foodId !== foodId);
  };

  return {
    cartList,
    totalQuantity,
    totalPrice,
    updateCart,
    removeCart,
  };
});
