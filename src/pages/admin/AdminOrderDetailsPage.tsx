import { useState } from "react";
import { ArrowLeft, Check, Circle, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAdminOrder, useUpdateAdminOrder } from "../../hooks/useOrders";
import type { OrderStatus } from "../../types/order";
import { useOrderRealtime } from "../../hooks/useOrderRealtime";

const stages: OrderStatus[] = [
  "order_received",
  "in_kitchen",
  "sent_to_delivery",
  "delivered",
];
const labels: Record<string, string> = {
  pending_payment: "Payment pending",
  order_received: "Order received",
  in_kitchen: "In kitchen",
  sent_to_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const statusOptions: OrderStatus[] = [
  "pending_payment",
  "order_received",
  "in_kitchen",
  "sent_to_delivery",
  "delivered",
  "cancelled",
];
export function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const order = useAdminOrder(orderId);
  const update = useUpdateAdminOrder();
  const [status, setStatus] = useState<OrderStatus>();

  const data = order.data?.order;

  useOrderRealtime(orderId ?? "");

  if (order.isLoading)
    return <p className="text-sm text-[#765f54]">Loading order details...</p>;
  if (!data)
    return (
      <div>
        <p className="font-bold text-[#2b1b14]">Order not found.</p>
        <Link
          to="/admin/orders"
          className="mt-3 inline-block text-sm font-bold text-[#e85d04]"
        >
          Back to orders
        </Link>
      </div>
    );
  const customer =
    typeof data.user === "string"
      ? { name: "Customer", email: data.user }
      : data.user;
  const selectedStatus = status ?? data.status;

  const current = stages.indexOf(data.status);

  const save = () =>
    void update.mutateAsync({
      orderId: data._id,
      status: status ?? data.status,
    });

  return (
    <div>
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#e85d04] hover:underline"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Order operations
          </p>
          <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">
            #{data._id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            Placed {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="w-fit rounded-full bg-[#fff0e5] px-3 py-1.5 text-xs font-bold text-[#e85d04] uppercase">
          {labels[data.status]}
        </span>
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-6 shadow-sm">
        <h2 className="font-display text-xl text-[#2b1b14]">
          Fulfillment progress
        </h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-4">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-3 sm:block">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full ${index <= current ? "bg-[#e85d04] text-white" : "bg-[#f4ede8] text-[#a08d82]"}`}
              >
                {index < current ? <Check size={16} /> : <Circle size={13} />}
              </span>
              <p
                className={`text-sm font-bold ${index <= current ? "text-[#2b1b14]" : "text-[#a08d82]"}`}
              >
                {labels[stage]}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eadfd8] px-6 py-5">
            <h2 className="font-display text-xl text-[#2b1b14]">
              Pizza contents
            </h2>
            <span className="text-sm font-bold text-[#e85d04]">
              ${data.total.toFixed(2)}
            </span>
          </div>
          <div className="divide-y divide-[#eadfd8]">
            {data.items.map((item) => (
              <div
                key={`${item.inventoryId}-${item.category}`}
                className="flex justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="text-sm font-bold text-[#2b1b14]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs capitalize text-[#a08d82]">
                    {item.category} · quantity {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#765f54]">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#fff0e5] text-[#e85d04]">
              <UserRound size={20} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#2b1b14]">
                {customer.name}
              </h2>
              <p className="text-xs text-[#a08d82]">{customer.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 border-t border-[#eadfd8] pt-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#a08d82]">
                Order status
              </span>
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setStatus(event.target.value as OrderStatus)
                }
                className="w-full rounded-xl border border-[#eadfd8] bg-white px-3 py-3 text-sm font-semibold text-[#2b1b14] outline-none focus:border-[#e85d04]"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {labels[option]}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={save}
              disabled={
                update.isPending ||
                status === undefined ||
                status === data.status
              }
              className="w-full rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-bold text-white hover:bg-[#c94d00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {update.isPending ? "Saving..." : "Save updates"}
            </button>
            {update.isSuccess ? (
              <p className="text-center text-xs font-semibold text-green-700">
                Order updated successfully.
              </p>
            ) : null}
            {update.isError ? (
              <p className="text-center text-xs text-red-600">
                Could not update this order.
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
