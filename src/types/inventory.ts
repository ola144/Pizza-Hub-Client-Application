export type InventoryCategory = "base" | "sauce" | "cheese" | "vegetable";

export interface InventoryItem {
  _id: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  threshold: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryResponse {
  success: boolean;
  count: number;
  inventory: InventoryItem[];
}
