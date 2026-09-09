import { useMemo, useState } from "react";
import { Edit3, PackagePlus, Search, Trash2 } from "lucide-react";
import { InventoryModal } from "../../components/inventory/InventoryModal";
import { useDeleteInventory, useInventory } from "../../hooks/useInventory";
import type { InventoryCategory, InventoryItem } from "../../types/inventory";

const categories: Array<"all" | InventoryCategory> = [
  "all",
  "base",
  "sauce",
  "cheese",
  "vegetable",
];

function InventoryPage() {
  const [category, setCategory] = useState<"all" | InventoryCategory>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<InventoryItem>();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const inventory = useInventory(category === "all" ? undefined : category);
  const remove = useDeleteInventory();
  const items = useMemo(
    () =>
      (inventory.data?.inventory ?? []).filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [inventory.data?.inventory, search],
  );
  const openCreate = () => {
    setEditing(undefined);
    setShowModal(true);
  };
  const openEdit = (item: InventoryItem) => {
    setEditing(item);
    setShowModal(true);
  };
  const handleDelete = async (item: InventoryItem) => {
    if (!window.confirm(`Deactivate ${item.name}?`)) return;
    setError("");
    try {
      await remove.mutateAsync(item._id);
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not deactivate this item.",
      );
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Kitchen operations
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-[#2b1b14]">
            Inventory
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            Keep every ingredient accounted for and ready to serve.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#e85d04]/20 hover:bg-[#c94d00]"
        >
          <PackagePlus size={18} /> Add item
        </button>
      </div>
      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#eadfd8] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08d82]"
              size={17}
            />
            <input
              aria-label="Search inventory"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ingredients"
              className="w-full rounded-xl border border-[#eadfd8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#e85d04]"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#f4ede8] p-1">
            {categories.map((value) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${category === value ? "bg-white text-[#e85d04] shadow-sm" : "text-[#765f54] hover:text-[#2b1b14]"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        {error ? (
          <p
            role="alert"
            className="mx-5 mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
        {inventory.isLoading ? (
          <div className="p-10 text-center text-sm text-[#765f54]">
            Loading inventory...
          </div>
        ) : inventory.isError ? (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-[#2b1b14]">
              Inventory could not load.
            </p>
            <p className="mt-2 text-sm text-[#765f54]">
              Check your connection and try again.
            </p>
            <button
              onClick={() => void inventory.refetch()}
              className="mt-4 text-sm font-bold text-[#e85d04] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead className="bg-[#fcf8f5] text-xs uppercase tracking-[0.12em] text-[#a08d82]">
                <tr>
                  <th className="px-5 py-4 font-bold">Ingredient</th>
                  <th className="px-5 py-4 font-bold">Category</th>
                  <th className="px-5 py-4 font-bold">Stock</th>
                  <th className="px-5 py-4 font-bold">Unit price</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadfd8]">
                {items.map((item) => {
                  const low = item.stock < item.threshold;
                  return (
                    <tr key={item._id} className="hover:bg-[#fcf8f5]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#2b1b14]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#a08d82]">
                          Updated{" "}
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm capitalize text-[#765f54]">
                        {item.category}
                      </td>
                      <td className="px-5 py-4">
                        <p
                          className={`text-sm font-bold ${low ? "text-[#d64545]" : "text-[#2b1b14]"}`}
                        >
                          {item.stock} units
                        </p>
                        <p className="mt-1 text-xs text-[#a08d82]">
                          Threshold {item.threshold}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#765f54]">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${!item.active ? "bg-[#f4ede8] text-[#a08d82]" : low ? "bg-red-50 text-[#d64545]" : "bg-green-50 text-[#22864a]"}`}
                        >
                          {!item.active
                            ? "Inactive"
                            : low
                              ? "Low stock"
                              : "Healthy"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            aria-label={`Edit ${item.name}`}
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-2 text-[#765f54] hover:bg-[#f4ede8] hover:text-[#e85d04]"
                          >
                            <Edit3 size={17} />
                          </button>
                          <button
                            aria-label={`Deactivate ${item.name}`}
                            onClick={() => void handleDelete(item)}
                            disabled={remove.isPending}
                            className="rounded-lg p-2 text-[#765f54] hover:bg-red-50 hover:text-[#d64545] disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                          {/* <button
                            aria-label="More actions"
                            className="rounded-lg p-2 text-[#765f54] hover:bg-[#f4ede8]"
                          >
                            <MoreHorizontal size={17} />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <PackagePlus className="mx-auto text-[#e85d04]" size={30} />
            <p className="mt-3 text-sm font-bold text-[#2b1b14]">
              No ingredients found
            </p>
            <p className="mt-1 text-sm text-[#765f54]">
              Try another search or add your first item.
            </p>
          </div>
        )}
      </section>
      {showModal ? (
        <InventoryModal item={editing} onClose={() => setShowModal(false)} />
      ) : null}
    </div>
  );
}

export default InventoryPage;
