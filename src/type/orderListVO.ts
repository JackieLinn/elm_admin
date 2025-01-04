import type {Pair} from "@/type/pair.ts";

export interface OrderListVO {
    businessName: string;
    totalPrice: string;
    deliveryPrice: number;
    foodList: Record<number, Pair<string, Pair<number, number>>>;
}
