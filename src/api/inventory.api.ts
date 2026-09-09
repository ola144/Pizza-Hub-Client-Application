import api from "./axios";

import type {
  InventoryCategory,
  InventoryResponse,
  InventoryItem,
} from "../types/inventory";

export interface InventoryPayload {
  name: string;
  category: InventoryCategory;
  stock: number;
  threshold: number;
  price: number;
  active?: boolean;
}

interface InventoryMutationResponse {
  success: boolean;
  message: string;
  item?: InventoryItem;
}

export const getInventoryApi = async (category?: InventoryCategory) => {
  const { data } = await api.get<InventoryResponse>("/inventory", {
    params: {
      category,
      active: true,
    },
  });

  return data;
};

export const getInventoryItemApi = async (id: string) => {
  const { data } = await api.get<{
    success: boolean;
    item: InventoryItem;
  }>(`/inventory/${id}`);

  return data;
};

export const createInventoryApi = async (payload: InventoryPayload) => {
  const { data } = await api.post<InventoryMutationResponse>(
    "/inventory",
    payload,
  );

  return data;
};

export const updateInventoryApi = async (
  id: string,
  payload: Partial<InventoryPayload>,
) => {
  const { data } = await api.patch<InventoryMutationResponse>(
    `/inventory/${id}`,
    payload,
  );

  return data;
};

export const deleteInventoryApi = async (id: string) => {
  const { data } = await api.delete<InventoryMutationResponse>(
    `/inventory/${id}`,
  );

  return data;
};

export const getLowStockApi = async () => {
  const { data } = await api.get<{
    success: boolean;
    count: number;
    items: InventoryItem[];
  }>("/inventory/low-stock");

  return data;
};
