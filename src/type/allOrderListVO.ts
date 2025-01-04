import type {OrderListVO} from "@/type/orderListVO.ts";

export interface AllOrderListVO {
    paidList: OrderListVO[];
    unpaidList: OrderListVO[];
}
