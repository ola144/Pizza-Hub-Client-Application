import { useMutation } from "@tanstack/react-query";

import { createRazorpayOrderApi, verifyPaymentApi } from "../api/payment.api";

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: (orderId: string) => createRazorpayOrderApi(orderId),
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPaymentApi,
  });
};
