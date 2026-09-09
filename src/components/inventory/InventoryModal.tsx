/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  useCreateInventory,
  useUpdateInventory,
} from "../../hooks/useInventory";
import type { InventoryCategory, InventoryItem } from "../../types/inventory";
import type { InventoryPayload } from "../../api/inventory.api";

interface InventoryModalProps {
  item?: InventoryItem;
  onClose: () => void;
}
const categories: InventoryCategory[] = [
  "base",
  "sauce",
  "cheese",
  "vegetable",
];
const initialForm: InventoryPayload = {
  name: "",
  category: "base",
  stock: 0,
  threshold: 20,
  price: 0,
  active: true,
};

export function InventoryModal({ item, onClose }: InventoryModalProps) {
  const create = useCreateInventory();
  const update = useUpdateInventory();

  const [form, setForm] = useState<InventoryPayload>(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item)
      setForm({
        name: item.name,
        category: item.category,
        stock: item.stock,
        threshold: item.threshold,
        price: item.price,
        active: item.active,
      });
  }, [item]);

  const isPending = create.isPending || update.isPending;

  const updateField = (
    field: keyof InventoryPayload,
    value: string | number | boolean,
  ) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) return setError("Item name is required.");

    if (form.stock < 0 || form.threshold < 0 || form.price < 0)
      return setError("Stock, threshold, and price cannot be negative.");

    try {
      if (item) await update.mutateAsync({ id: item._id, payload: form });
      else await create.mutateAsync(form);

      onClose();
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not save this inventory item.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#2b1b14]/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-modal-title"
        className="w-full max-w-xl rounded-2xl bg-[#fffaf5] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#eadfd8] px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e85d04]">
              Inventory control
            </p>
            <h2
              id="inventory-modal-title"
              className="mt-1 font-display text-2xl text-[#2b1b14]"
            >
              {item ? "Update item" : "Add inventory item"}
            </h2>
          </div>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-lg p-2 text-[#765f54] hover:bg-[#f2e9e3]"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:grid-cols-2">
          {error ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
            >
              {error}
            </p>
          ) : null}
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
              Item name
            </span>
            <input
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Mozzarella"
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#e85d04] focus:ring-4 focus:ring-[#f47721]/10"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
              Category
            </span>
            <select
              disabled={Boolean(item)}
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value as InventoryCategory)
              }
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#e85d04] disabled:cursor-not-allowed disabled:bg-[#f4ede8] disabled:text-[#a08d82]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category[0].toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
              Price per unit
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField("price", Number(event.target.value))
              }
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#e85d04]"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
              Current stock
            </span>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) =>
                updateField("stock", Number(event.target.value))
              }
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#e85d04]"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
              Low-stock threshold
            </span>
            <input
              type="number"
              min="0"
              value={form.threshold}
              onChange={(event) =>
                updateField("threshold", Number(event.target.value))
              }
              className="w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#e85d04]"
            />
          </label>
          {item ? (
            <label className="flex items-center gap-3 text-sm font-semibold text-[#3c2920] sm:col-span-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  updateField("active", event.target.checked)
                }
                className="size-4 accent-[#e85d04]"
              />
              Active in catalog
            </label>
          ) : null}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#eadfd8] px-5 py-3 text-sm font-bold text-[#765f54] hover:bg-white"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              className="rounded-xl bg-[#e85d04] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#e85d04]/20 hover:bg-[#c94d00] disabled:opacity-60"
            >
              {isPending ? "Saving..." : item ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
