/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { loadRazorpay } from "../../lib/loadRazorpay";

import {
  useCreateRazorpayOrder,
  useVerifyPayment,
} from "../../hooks/usePayment";

interface PaymentButtonProps {
  orderId: string;
  onPaid: () => void;
}

export const PaymentButton = ({ orderId, onPaid }: PaymentButtonProps) => {
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCreateRazorpayOrder();

  const verifyPayment = useVerifyPayment();

  const handlePayment = async () => {
    try {
      setError(null);

      const loaded = await loadRazorpay();

      if (!loaded) {
        setError("Unable to load Razorpay Checkout");

        return;
      }

      const paymentOrder = await createPayment.mutateAsync(orderId);

      const razorpay = new window.Razorpay({
        key: paymentOrder.key,
        amount: paymentOrder.razorpayOrder.amount,
        currency: paymentOrder.razorpayOrder.currency,
        name: "Pizza Hub",
        description: "Custom Pizza Order",
        order_id: paymentOrder.razorpayOrder.id,
        theme: {
          color: "#f97316",
        },

        handler: async (response) => {
          try {
            const result = await verifyPayment.mutateAsync({
              orderId,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              onPaid();
            }
          } catch (error) {
            console.error("Payment verification failed:", error);

            setError("Payment verification failed. Please contact support.");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("Razorpay checkout closed");
          },
        },
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);

      setError(error?.response?.data?.message || "Unable to start payment");
    }
  };

  const isLoading = createPayment.isPending || verifyPayment.isPending;

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createPayment.isPending
          ? "Preparing Payment..."
          : verifyPayment.isPending
            ? "Verifying Payment..."
            : "Pay Now"}
      </button>
    </div>
  );
};
