import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrderApi,
  getAdminOrderApi,
  getAdminOrdersApi,
  getMyOrdersApi,
  getOrderApi,
  updateAdminOrderApi,
} from "../api/order.api";
import type { CreateOrderPayload, OrderStatus } from "../types/order";

export const ORDERS_QUERY_KEY = ["orders", "mine"];
export const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"];

export const useMyOrders = () =>
  useQuery({ queryKey: ORDERS_QUERY_KEY, queryFn: getMyOrdersApi });

export const useOrder = (orderId: string | undefined) =>
  useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderApi(orderId as string),
    enabled: Boolean(orderId),
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderApi(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
};

export const useAdminOrders = (status?: OrderStatus, page = 1, limit = 10) =>
  useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, status ?? "all", page, limit],
    queryFn: () => getAdminOrdersApi(status, page, limit),
  });

export const useAdminOrder = (orderId: string | undefined) =>
  useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => getAdminOrderApi(orderId as string),
    enabled: Boolean(orderId),
  });

export const useUpdateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateAdminOrderApi(orderId, status),
    onSuccess: (result) => {
      queryClient.setQueryData(["admin", "orders", result.order._id], result);
      void queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
    },
  });
};
