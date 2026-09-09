import { ArrowRight, Clock3, Pizza, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyOrders } from "../../hooks/useOrders";

const statusLabels: Record<string, string> = {
  pending_payment: "Payment pending",
  order_received: "Order received",
  in_kitchen: "In the kitchen",
  sent_to_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function UserDashboardPage() {
  const orders = useMyOrders();
  const recent = orders.data?.orders.slice(0, 3) ?? [];

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-[#2b1b14] px-6 py-10 text-[#fffaf5] sm:px-10 lg:px-14">
        <div className="absolute -right-12 -top-24 size-72 rounded-full border-34 border-[#f47721]/20" />
        <div className="relative max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f9b44d]">
            <Sparkles size={15} /> Your next favorite slice
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Make dinner a little more yours.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#ead8cc]">
            Build a pizza exactly how you like it, with fresh ingredients and no
            complicated decisions.
          </p>
          <Link
            to="/order/new"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f47721] px-5 py-3 text-sm font-bold text-white hover:bg-[#ff8b3a]"
          >
            Build your pizza <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/order/new"
          className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm hover:border-[#f47721]"
        >
          <Pizza className="text-[#e85d04]" size={23} />
          <h2 className="mt-4 font-bold text-[#2b1b14]">Build a pizza</h2>
          <p className="mt-1 text-sm text-[#765f54]">
            Choose your base, sauce, cheese, and toppings.
          </p>
        </Link>
        <Link
          to="/orders"
          className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm hover:border-[#f47721]"
        >
          <ShoppingBag className="text-[#e85d04]" size={23} />
          <h2 className="mt-4 font-bold text-[#2b1b14]">Track an order</h2>
          <p className="mt-1 text-sm text-[#765f54]">
            See your orders and their latest status.
          </p>
        </Link>
        <Link
          to="/ingredients"
          className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm hover:border-[#f47721]"
        >
          <Clock3 className="text-[#e85d04]" size={23} />
          <h2 className="mt-4 font-bold text-[#2b1b14]">Browse ingredients</h2>
          <p className="mt-1 text-sm text-[#765f54]">
            Explore what is fresh in the kitchen today.
          </p>
        </Link>
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eadfd8] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-display text-xl text-[#2b1b14]">
              Recent orders
            </h2>
            <p className="mt-1 text-sm text-[#765f54]">
              Your latest PizzaHub moments.
            </p>
          </div>
          <Link
            to="/orders"
            className="text-sm font-bold text-[#e85d04] hover:underline"
          >
            View all
          </Link>
        </div>
        {orders.isLoading ? (
          <p className="p-6 text-sm text-[#765f54]">Loading your orders...</p>
        ) : recent.length ? (
          <div className="divide-y divide-[#eadfd8]">
            {recent.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#fcf8f5] sm:px-6"
              >
                <div>
                  <p className="text-sm font-bold text-[#2b1b14]">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-[#a08d82]">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.length} ingredients
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#e85d04]">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-[#765f54]">
                    {statusLabels[order.status]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm font-bold text-[#2b1b14]">
              Your order history is waiting
            </p>
            <Link
              to="/order/new"
              className="mt-2 inline-block text-sm font-bold text-[#e85d04]"
            >
              Build your first pizza
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboardPage;
