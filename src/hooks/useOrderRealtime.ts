import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { socket } from "../lib/socket";
import { ORDER_QUERY_KEY } from "./useOrders";

export const useOrderRealtime = (orderId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    const handleStatusUpdate = (data: {
      orderId: string;
      status: string;
      order: unknown;
    }) => {
      if (String(data.orderId) !== String(orderId)) return;

      // Update the individual order query
      queryClient.setQueryData(ORDER_QUERY_KEY(orderId), (oldData: unknown) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          order: data.order,
        };

        return newData;
      });
    };

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join-order", orderId);

      console.log(`Joined order:${orderId}`);
    };

    socket.on("connect", handleConnect);
    socket.on("order-status-updated", handleStatusUpdate);

    if (!socket.connected) {
      socket.connect();
    } else {
      // Socket is already connected
      handleConnect();
    }

    return () => {
      socket.emit("leave-order", orderId);

      socket.off("connect", handleConnect);
      socket.off("order-status-updated", handleStatusUpdate);
    };
  }, [orderId, queryClient]);
};
