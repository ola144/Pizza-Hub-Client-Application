import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useInventory, useLowStock } from "../../hooks/useInventory";

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Boxes;
  tone: "orange" | "green" | "red";
}) {
  const colors = {
    orange: "bg-[#fff0e5] text-[#e85d04]",
    green: "bg-[#e8f7ee] text-[#22864a]",
    red: "bg-[#fff0f0] text-[#d64545]",
  };
  return (
    <div className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#765f54]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#2b1b14]">
            {value}
          </p>
        </div>
        <span
          className={`grid size-11 place-items-center rounded-xl ${colors[tone]}`}
        >
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 text-xs text-[#a08d82]">{detail}</p>
    </div>
  );
}

function AdminDashboardPage() {
  const inventory = useInventory();
  const lowStock = useLowStock();

  const items = inventory.data?.inventory ?? [];
  const lowItems = lowStock.data?.items ?? [];

  const totalUnits = items.reduce((total, item) => total + item.stock, 0);

  const inventoryValue = items.reduce(
    (total, item) => total + item.stock * item.price,
    0,
  );

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Overview
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-[#2b1b14]">
            Kitchen at a glance
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            A quick read on the ingredients keeping PizzaHub moving.
          </p>
        </div>
        <Link
          to="/admin/inventory"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#e85d04]/20 hover:bg-[#c94d00]"
        >
          Manage inventory <ArrowRight size={17} />
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active ingredients"
          value={inventory.isLoading ? "—" : items.length}
          detail="Currently in your catalog"
          icon={Boxes}
          tone="orange"
        />
        <StatCard
          label="Units in stock"
          value={inventory.isLoading ? "—" : totalUnits}
          detail="Across all active ingredients"
          icon={PackageCheck}
          tone="green"
        />
        <StatCard
          label="Low-stock alerts"
          value={lowStock.isLoading ? "—" : lowItems.length}
          detail={
            lowItems.length
              ? "Needs attention today"
              : "Everything is well stocked"
          }
          icon={AlertTriangle}
          tone={lowItems.length ? "red" : "green"}
        />
        <StatCard
          label="Stock value"
          value={
            inventory.isLoading ? "—" : `$${inventoryValue.toLocaleString()}.00`
          }
          detail="Estimated current inventory value"
          icon={CircleDollarSign}
          tone="orange"
        />
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eadfd8] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-display text-xl text-[#2b1b14]">
              Low-stock attention
            </h2>
            <p className="mt-1 text-sm text-[#765f54]">
              Ingredients below their reorder threshold.
            </p>
          </div>
          <Link
            to="/admin/inventory"
            className="text-sm font-bold text-[#e85d04] hover:underline"
          >
            View all
          </Link>
        </div>
        {lowStock.isLoading ? (
          <p className="p-6 text-sm text-[#765f54]">Loading alerts...</p>
        ) : lowItems.length ? (
          <div className="divide-y divide-[#eadfd8]">
            {lowItems.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#2b1b14]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs capitalize text-[#a08d82]">
                    {item.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#d64545]">
                    {item.stock} left
                  </p>
                  <p className="mt-1 text-xs text-[#a08d82]">
                    Threshold {item.threshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <PackageCheck className="mx-auto text-[#22864a]" size={30} />
            <p className="mt-3 text-sm font-bold text-[#2b1b14]">
              All ingredients are in good shape
            </p>
            <p className="mt-1 text-xs text-[#765f54]">
              No low-stock items need your attention.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
