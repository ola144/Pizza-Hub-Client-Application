/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Check, Circle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";
import { PaymentButton } from "../../features/payment/PaymentBtn";
import { useOrderRealtime } from "../../hooks/useOrderRealtime";

const stages = [
  "order_received",
  "in_kitchen",
  "sent_to_delivery",
  "delivered",
];
const labels: Record<string, string> = {
  order_received: "Order received",
  in_kitchen: "In the kitchen",
  sent_to_delivery: "On the way",
  delivered: "Delivered",
};

function OrderDetailsPage() {
  const { orderId } = useParams();
  const { data: orderData, isLoading, refetch } = useOrder(orderId);
  const data = orderData?.order;

  useOrderRealtime(orderId);

  const current = data ? stages.indexOf(data.status) : -1;

  if (isLoading)
    return <p className="text-sm text-[#765f54]">Loading order details...</p>;
  if (!data)
    return (
      <div>
        <p className="font-bold text-[#2b1b14]">Order not found.</p>
        <Link
          to="/orders"
          className="mt-3 inline-block text-sm font-bold text-[#e85d04]"
        >
          Back to orders
        </Link>
      </div>
    );
  return (
    <div>
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#e85d04] hover:underline"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>
      <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Order details
          </p>
          <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">
            #{data._id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            Placed {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="space-y-0">
            <div className="flex items-center gap-1 text-xs">
              Payment Status:
              <span className="w-fit rounded-full bg-[#fff0e5] px-3 py-1.5 text-xs font-bold text-[#e85d04] uppercase">
                {data.paymentStatus === "pending"
                  ? "Payment pending"
                  : data.paymentStatus}
              </span>
            </div>
          </div>

          {data.paymentStatus === "pending" && (
            <PaymentButton onPaid={() => refetch()} orderId={data._id} />
          )}
        </div>
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-6 shadow-sm">
        <h2 className="font-display text-xl text-[#2b1b14]">Order progress</h2>
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
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
          <h2 className="border-b border-[#eadfd8] px-6 py-5 font-display text-xl text-[#2b1b14]">
            Your pizza
          </h2>
          <div className="divide-y divide-[#eadfd8]">
            {data.items.map((item: any) => (
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
        <aside className="h-fit rounded-2xl bg-[#2b1b14] p-6 text-[#fffaf5]">
          <h2 className="font-display text-xl">Summary</h2>
          <div className="mt-6 flex justify-between border-t border-white/15 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#c7afa1]">
            Your order is currently{" "}
            {labels[data.status] ??
              data.status.toLowerCase().replaceAll("_", " ")}
            .
          </p>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
