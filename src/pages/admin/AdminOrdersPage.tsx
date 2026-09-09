import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminOrders } from "../../hooks/useOrders";
import type { OrderStatus } from "../../types/order";

const statuses: Array<"all" | OrderStatus> = [
  "all",
  "pending_payment",
  "order_received",
  "in_kitchen",
  "sent_to_delivery",
  "delivered",
  "cancelled",
];
const labels: Record<string, string> = {
  pending_payment: "Payment pending",
  order_received: "Order received",
  in_kitchen: "In kitchen",
  sent_to_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const badge: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-700",
  order_received: "bg-blue-50 text-blue-700",
  in_kitchen: "bg-[#fff0e5] text-[#e85d04]",
  sent_to_delivery: "bg-violet-50 text-violet-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};
export function AdminOrdersPage() {
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const orders = useAdminOrders(status === "all" ? undefined : status, page);
  const items = useMemo(
    () =>
      (orders.data?.orders ?? []).filter((order) => {
        const customer =
          typeof order.user === "string"
            ? order.user
            : `${order.user.name} ${order.user.email}`;
        return `${order._id} ${customer}`
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
    [orders.data?.orders, search],
  );
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Kitchen operations
          </p>
          <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">Orders</h1>
          <p className="mt-2 text-sm text-[#765f54]">
            Monitor every pizza from payment to delivery.
          </p>
        </div>
        <div className="rounded-xl bg-[#fff0e5] px-4 py-3 text-sm font-bold text-[#e85d04]">
          {orders.data?.count ?? 0} total orders
        </div>
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#eadfd8] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08d82]"
              size={17}
            />
            <input
              aria-label="Search orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order or customer"
              className="w-full rounded-xl border border-[#eadfd8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#e85d04]"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#f4ede8] p-1">
            {statuses.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setStatus(value);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold capitalize ${status === value ? "bg-white text-[#e85d04] shadow-sm" : "text-[#765f54]"}`}
              >
                {value === "all" ? "All" : labels[value]}
              </button>
            ))}
          </div>
        </div>
        {orders.isLoading ? (
          <p className="p-10 text-center text-sm text-[#765f54]">
            Loading orders...
          </p>
        ) : orders.isError ? (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-[#2b1b14]">
              Orders could not load.
            </p>
            <button
              onClick={() => void orders.refetch()}
              className="mt-3 text-sm font-bold text-[#e85d04]"
            >
              Try again
            </button>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-205 text-left">
              <thead className="bg-[#fcf8f5] text-xs uppercase tracking-[0.12em] text-[#a08d82]">
                <tr>
                  <th className="px-5 py-4 font-bold">Order</th>
                  <th className="px-5 py-4 font-bold">Customer</th>
                  <th className="px-5 py-4 font-bold">Items</th>
                  <th className="px-5 py-4 font-bold">Total</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadfd8]">
                {items.map((order) => {
                  const customer =
                    typeof order.user === "string"
                      ? { name: "Customer", email: order.user }
                      : order.user;
                  return (
                    <tr key={order._id} className="hover:bg-[#fcf8f5]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#2b1b14]">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="mt-1 text-xs text-[#a08d82]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#2b1b14]">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-[#a08d82]">
                          {customer.email}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#765f54]">
                        {order.items.length} ingredients
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#2b1b14]">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${badge[order.status]}`}
                        >
                          {labels[order.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          aria-label={`View order ${order._id}`}
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex rounded-lg p-2 text-[#e85d04] hover:bg-[#fff0e5]"
                        >
                          <ArrowRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <ShoppingBag className="mx-auto text-[#e85d04]" size={32} />
            <p className="mt-3 text-sm font-bold text-[#2b1b14]">
              No matching orders
            </p>
            <p className="mt-1 text-sm text-[#765f54]">
              Try another search or status filter.
            </p>
          </div>
        )}
        {orders.data && orders.data.pages > 1 ? (
          <div className="flex flex-col gap-4 border-t border-[#eadfd8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-[#765f54]">
              Showing page {orders.data.page} of {orders.data.pages} ·{" "}
              {orders.data.total} orders
            </p>
            <div className="flex items-center gap-1">
              <button
                aria-label="Go to previous page"
                disabled={page === 1 || orders.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border border-[#eadfd8] px-3 py-2 text-xs font-bold text-[#765f54] hover:bg-[#f4ede8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Previous
                </span>
              </button>
              {Array.from(
                { length: orders.data.pages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                  disabled={orders.isFetching}
                  onClick={() => setPage(pageNumber)}
                  className={`grid size-9 place-items-center rounded-lg text-xs font-bold transition ${pageNumber === page ? "bg-[#e85d04] text-white" : "text-[#765f54] hover:bg-[#f4ede8]"} disabled:cursor-wait disabled:opacity-60`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                aria-label="Go to next page"
                disabled={page >= orders.data.pages || orders.isFetching}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-[#eadfd8] px-3 py-2 text-xs font-bold text-[#765f54] hover:bg-[#f4ede8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="inline-flex items-center gap-1">
                  Next <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
