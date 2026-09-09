import type { Order } from "./order";

export interface CreateRazorpayOrderResponse {
  success: boolean;
  key: string;

  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };

  order: Order;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order: Order;
}
