import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import type { InventoryCategory } from "../../types/inventory";

const filters: Array<"all" | InventoryCategory> = [
  "all",
  "base",
  "sauce",
  "cheese",
  "vegetable",
];
export function IngredientsPage() {
  const [filter, setFilter] = useState<"all" | InventoryCategory>("all");
  const [search, setSearch] = useState("");
  const inventory = useInventory(filter === "all" ? undefined : filter);
  const items = useMemo(
    () =>
      (inventory.data?.inventory ?? []).filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [inventory.data?.inventory, search],
  );
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
        Fresh today
      </p>
      <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">Ingredients</h1>
      <p className="mt-2 text-sm text-[#765f54]">
        Everything available for your next custom pizza.
      </p>
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08d82]"
            size={17}
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ingredients"
            className="w-full rounded-xl border border-[#eadfd8] bg-[#fffaf5] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#e85d04]"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#f4ede8] p-1">
          {filters.map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold capitalize ${filter === value ? "bg-white text-[#e85d04] shadow-sm" : "text-[#765f54]"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      {inventory.isLoading ? (
        <p className="mt-8 text-sm text-[#765f54]">Loading ingredients...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-[#fff0e5] px-2.5 py-1 text-xs font-bold capitalize text-[#e85d04]">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-[#2b1b14]">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl text-[#2b1b14]">
                {item.name}
              </h2>
              <p className="mt-2 text-sm text-[#765f54]">
                {item.stock} available in the kitchen
              </p>
            </article>
          ))}
          {!items.length ? (
            <p className="text-sm text-[#765f54]">
              No ingredients match your search.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
