export type OrderStatus =
  | "pending_payment"
  | "order_received"
  | "in_kitchen"
  | "sent_to_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  inventoryId: string;
  name: string;
  category: "base" | "sauce" | "cheese" | "vegetable";
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentId: string | null;
  razorpayOrderId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  changedBy?: OrderCustomer | string;
  changedAt: string;
}

export type AdminOrder = Omit<Order, "user"> & {
  user: string | OrderCustomer;
  statusHistory?: OrderStatusHistoryEntry[];
};

export interface CreateOrderPayload {
  baseId: string;
  sauceId: string;
  cheeseId: string;
  vegetableIds: string[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}
