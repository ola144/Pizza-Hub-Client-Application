import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyOrders } from "../../hooks/useOrders";

const labels: Record<string, string> = {
  pending_payment: "Payment pending",
  order_received: "Order received",
  in_kitchen: "In the kitchen",
  sent_to_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
export function OrdersPage() {
  const orders = useMyOrders();
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
        Your history
      </p>
      <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">My orders</h1>
      <p className="mt-2 text-sm text-[#765f54]">
        Every custom pizza you have sent our way.
      </p>
      {orders.isLoading ? (
        <p className="mt-8 text-sm text-[#765f54]">Loading orders...</p>
      ) : orders.data?.orders.length ? (
        <div className="mt-8 space-y-3">
          {orders.data.orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex flex-col gap-4 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm transition hover:border-[#f47721] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-[#2b1b14]">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.status === "delivered" ? "bg-green-50 text-green-700" : order.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-[#fff0e5] text-[#e85d04]"}`}
                  >
                    {labels[order.status]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#a08d82]">
                  {new Date(order.createdAt).toLocaleString()} ·{" "}
                  {order.items.map((item) => item.name).join(", ")}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <span className="font-bold text-[#2b1b14]">
                  ${order.total.toFixed(2)}
                </span>
                <ArrowRight size={18} className="text-[#e85d04]" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-10 text-center">
          <ShoppingBag className="mx-auto text-[#e85d04]" size={32} />
          <p className="mt-4 font-bold text-[#2b1b14]">No orders yet</p>
          <Link
            to="/order/new"
            className="mt-3 inline-block text-sm font-bold text-[#e85d04]"
          >
            Build your first pizza
          </Link>
        </div>
      )}
    </div>
  );
}
