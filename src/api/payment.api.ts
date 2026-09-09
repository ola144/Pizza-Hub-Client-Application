import api from "./axios";

import type {
  CreateRazorpayOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/payment";

export const createRazorpayOrderApi = async (orderId: string) => {
  const { data } = await api.post<CreateRazorpayOrderResponse>(
    "/payments/create-payment",
    {
      orderId,
    },
  );

  return data;
};

export const verifyPaymentApi = async (payload: VerifyPaymentPayload) => {
  const { data } = await api.post<VerifyPaymentResponse>(
    "/payments/verify",
    payload,
  );

  return data;
};
