import { useMemo, useState } from "react";
import { Check, ChevronRight, Pizza } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../hooks/useInventory";
import { useCreateOrder } from "../../hooks/useOrders";
import type { InventoryItem } from "../../types/inventory";

type RequiredCategory = "base" | "sauce" | "cheese";
const required: RequiredCategory[] = ["base", "sauce", "cheese"];
const title: Record<string, string> = {
  base: "Choose your base",
  sauce: "Pick a sauce",
  cheese: "Add your cheese",
  vegetable: "Finish with toppings",
};

function CreateOrderPage() {
  const navigate = useNavigate();
  const inventory = useInventory();
  const createOrder = useCreateOrder();
  const [step, setStep] = useState(0);

  const [selected, setSelected] = useState<{
    base?: InventoryItem;
    sauce?: InventoryItem;
    cheese?: InventoryItem;
    vegetableIds: string[];
  }>({ vegetableIds: [] });

  const [error, setError] = useState("");

  const items = useMemo(() => {
    return inventory.data?.inventory ?? [];
  }, [inventory.data?.inventory]);

  const currentCategory = step < 3 ? required[step] : "vegetable";

  const options = useMemo(
    () =>
      items.filter(
        (item) => item.category === currentCategory && item.stock > 0,
      ),
    [items, currentCategory],
  );
  const chosenItems = [
    selected.base,
    selected.sauce,
    selected.cheese,
    ...items.filter((item) => selected.vegetableIds.includes(item._id)),
  ].filter(Boolean) as InventoryItem[];

  const total = chosenItems.reduce((sum, item) => sum + item.price, 0);

  const choose = (item: InventoryItem) => {
    if (currentCategory === "vegetable")
      setSelected((current) => ({
        ...current,
        vegetableIds: current.vegetableIds.includes(item._id)
          ? current.vegetableIds.filter((id) => id !== item._id)
          : [...current.vegetableIds, item._id],
      }));
    else setSelected((current) => ({ ...current, [currentCategory]: item }));
  };

  const next = () => {
    setError("");
    if (step < 3 && !selected[currentCategory as RequiredCategory])
      return setError(
        `Please ${step === 0 ? "choose a base" : step === 1 ? "choose a sauce" : "choose a cheese"}.`,
      );
    if (step < 3) setStep(step + 1);
    else void submit();
  };

  const submit = async () => {
    if (!selected.base || !selected.sauce || !selected.cheese) return;
    try {
      const result = await createOrder.mutateAsync({
        baseId: selected.base._id,
        sauceId: selected.sauce._id,
        cheeseId: selected.cheese._id,
        vegetableIds: selected.vegetableIds,
      });
      navigate(`/orders/${result.order._id}`);
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not create your order.",
      );
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end w-full">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Custom order
          </p>
          <h1 className="mt-2 font-display text-4xl text-[#2b1b14]">
            Build your pizza
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            A few good choices stand between you and dinner.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a08d82]">
            Current total
          </p>
          <p className="mt-1 text-2xl font-bold text-[#2b1b14]">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-y-8 gap-x-4 lg:grid-cols-3 w-full">
        <section className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm sm:p-4 lg:col-span-2">
          <div className="mb-8 flex items-center gap-2 overflow-x-auto">
            {[...required, "vegetable"].map((category, index) => (
              <div key={category} className="flex items-center gap-1">
                <div
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${index < step ? "bg-green-100 text-green-700" : index === step ? "bg-[#e85d04] text-white" : "bg-[#f4ede8] text-[#a08d82]"}`}
                >
                  {index < step ? <Check size={15} /> : index + 1}
                </div>
                <span
                  className={`whitespace-nowrap text-xs font-bold capitalize ${index === step ? "text-[#2b1b14]" : "text-[#a08d82]"}`}
                >
                  {category}
                </span>
                {index < 3 ? (
                  <ChevronRight size={15} className="text-[#d4c2b8]" />
                ) : null}
              </div>
            ))}
          </div>
          <h2 className="font-display text-2xl text-[#2b1b14]">
            {title[currentCategory]}
          </h2>
          <p className="mt-2 text-sm text-[#765f54]">
            {currentCategory === "vegetable"
              ? "Choose as many as you like, or skip this step."
              : "Choose one option to continue."}
          </p>
          {inventory.isLoading ? (
            <p className="mt-8 text-sm text-[#765f54]">
              Loading today&apos;s ingredients...
            </p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {options.map((item) => {
                const isSelected =
                  currentCategory === "vegetable"
                    ? selected.vegetableIds.includes(item._id)
                    : selected[currentCategory as RequiredCategory]?._id ===
                      item._id;
                return (
                  <button
                    key={item._id}
                    onClick={() => choose(item)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${isSelected ? "border-[#e85d04] bg-[#fff0e5] ring-2 ring-[#f47721]/15" : "border-[#eadfd8] bg-white hover:border-[#f47721]"}`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#2b1b14]">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#a08d82]">
                        {item.stock} available
                      </span>
                    </span>
                    <span className="text-sm font-bold text-[#e85d04]">
                      ${item.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-8 flex items-center justify-between border-t border-[#eadfd8] pt-5">
            {error ? (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            ) : (
              <span className="text-sm text-[#765f54]">
                Step {step + 1} of 4
              </span>
            )}
            <button
              onClick={next}
              disabled={inventory.isLoading || createOrder.isPending}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#e85d04]/20 hover:bg-[#c94d00] disabled:opacity-50"
            >
              {createOrder.isPending
                ? "Creating order..."
                : step === 3
                  ? "Place order"
                  : "Continue"}
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-[#eadfd8] bg-[#2b1b14] p-4 text-[#fffaf5] lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#f47721]">
              <Pizza size={21} />
            </span>
            <div>
              <p className="text-sm font-bold">Your pizza</p>
              <p className="text-xs text-[#c7afa1]">Made your way</p>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            {chosenItems.length ? (
              chosenItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-[#d5bfb3]">{item.name}</span>
                  <span className="font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#c7afa1]">
                Your choices will appear here.
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-between border-t border-white/15 pt-4 text-base font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CreateOrderPage;
