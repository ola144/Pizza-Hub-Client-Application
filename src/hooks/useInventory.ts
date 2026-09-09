import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInventoryApi,
  deleteInventoryApi,
  getInventoryApi,
  getLowStockApi,
  updateInventoryApi,
  type InventoryPayload,
} from "../api/inventory.api";
import type { InventoryCategory } from "../types/inventory";

export const LOW_STOCK_QUERY_KEY = ["inventory", "low-stock"];
export const INVENTORY_QUERY_KEY = ["inventory"];

export const useInventory = (category?: InventoryCategory) =>
  useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, category ?? "all"],
    queryFn: () => getInventoryApi(category),
  });

export const useLowStock = () =>
  useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockApi,
  });

const useInventoryMutation = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: () => {
      void queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: LOW_STOCK_QUERY_KEY });
    },
  };
};

export const useCreateInventory = () => {
  const { invalidate } = useInventoryMutation();

  return useMutation({
    mutationFn: (payload: InventoryPayload) => createInventoryApi(payload),
    onSuccess: invalidate,
  });
};

export const useUpdateInventory = () => {
  const { invalidate } = useInventoryMutation();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<InventoryPayload>;
    }) => updateInventoryApi(id, payload),
    onSuccess: invalidate,
  });
};

export const useDeleteInventory = () => {
  const { invalidate } = useInventoryMutation();

  return useMutation({
    mutationFn: (id: string) => deleteInventoryApi(id),
    onSuccess: invalidate,
  });
};
