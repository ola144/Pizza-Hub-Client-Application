import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_ORDERS_QUERY_KEY } from "./useOrders";
import { useEffect } from "react";
import { socket } from "../lib/socket";

export const useOrderRealtime = (orderId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) {
      return;
    }

    // connect socket
    if (!socket.connected) {
      socket.connect();
    }

    // Join this specific order room.
    socket.emit("join-order", orderId);

    // Listen for status changes
    const handleStatusUpdate = (data: {
      orderId: string;
      status: string;
      order: unknown;
    }) => {
      if (data.orderId !== orderId) {
        return;
      }

      // update react query cache immediate
      queryClient.setQueryData(ADMIN_ORDERS_QUERY_KEY, {
        succces: true,
        order: data.order,
      });
    };

    socket.on("order-status-updated", handleStatusUpdate);

    return () => {
      socket.emit("leave-order", orderId);

      socket.off("order-status-updated", handleStatusUpdate);
    };
  }, [orderId, queryClient]);
};
