import api from "./axios";

import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrdersResponse,
  Order,
  AdminOrder,
  OrderStatus,
} from "../types/order";

export const createOrderApi = async (payload: CreateOrderPayload) => {
  const { data } = await api.post<CreateOrderResponse>("/orders", payload);

  return data;
};

export const getMyOrdersApi = async () => {
  const { data } = await api.get<OrdersResponse>("/orders/my-orders");

  return data;
};

export const getOrderApi = async (orderId: string) => {
  const { data } = await api.get<{
    success: boolean;
    order: Order;
  }>(`/orders/${orderId}`);

  return data;
};

export const getAdminOrdersApi = async (
  status?: OrderStatus,
  page = 1,
  limit = 10,
) => {
  const { data } = await api.get<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    orders: AdminOrder[];
  }>("/admin/orders", { params: { status, page, limit } });
  return data;
};

export const getAdminOrderApi = async (orderId: string) => {
  const { data } = await api.get<{ success: boolean; order: AdminOrder }>(
    `/admin/orders/${orderId}`,
  );
  return data;
};

export const updateAdminOrderApi = async (
  orderId: string,
  status: OrderStatus,
) => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    order: AdminOrder;
  }>(`/admin/orders/${orderId}/status`, { status });

  return response.data;
};
