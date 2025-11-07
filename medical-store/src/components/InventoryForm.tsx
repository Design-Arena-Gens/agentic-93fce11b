"use client";

import { useEffect, useState } from "react";
import { InventoryItem, InventoryUnit } from "@/types/inventory";

interface InventoryFormProps {
  onSave: (item: Omit<InventoryItem, "id">, id?: string) => void;
  units: InventoryUnit[];
  categories: string[];
  editingItem?: InventoryItem | null;
  onCancelEdit?: () => void;
}

const initialForm: Omit<InventoryItem, "id"> = {
  name: "",
  category: "",
  batchNumber: "",
  supplier: "",
  quantity: 0,
  unit: "tablet",
  expiryDate: "",
  purchaseDate: "",
  pricePerUnit: 0,
  minStockLevel: 0,
  notes: "",
};

export function InventoryForm({
  onSave,
  units,
  categories,
  editingItem,
  onCancelEdit,
}: InventoryFormProps) {
  const [form, setForm] = useState<Omit<InventoryItem, "id">>(initialForm);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    if (editingItem) {
      setForm({ ...editingItem });
      setShowAdvanced(true);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem?.id]);

  const resetForm = () => {
    setForm(initialForm);
    setCustomCategory("");
    setShowAdvanced(false);
  };

  const handleChange = (
    field: keyof Omit<InventoryItem, "id">,
    value: string,
  ) => {
    if (field === "quantity" || field === "pricePerUnit" || field === "minStockLevel") {
      setForm((prev) => ({
        ...prev,
        [field]: Number(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      category: customCategory.trim() ? customCategory.trim() : form.category,
    };

    onSave(payload, editingItem?.id);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg shadow-sky-100/60 ring-1 ring-sky-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {editingItem ? "Update Medicine" : "Add New Medicine"}
          </h2>
          <p className="text-sm text-slate-500">
            Track stock, suppliers, expiry and pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
        >
          {showAdvanced ? "Hide Details" : "More Fields"}
        </button>
      </div>

      <form
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Medicine Name
          <input
            required
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="e.g. Ciprofloxacin 500mg"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Batch Number
          <input
            required
            value={form.batchNumber}
            onChange={(event) => handleChange("batchNumber", event.target.value)}
            placeholder="e.g. CIP-0824-B"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Category
          <select
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            disabled={!!customCategory.trim()}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Custom Category
          <input
            value={customCategory}
            onChange={(event) => setCustomCategory(event.target.value)}
            placeholder="Enter a new category"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Quantity In Stock
          <input
            required
            type="number"
            min={0}
            value={form.quantity}
            onChange={(event) => handleChange("quantity", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Unit
          <select
            value={form.unit}
            onChange={(event) =>
              handleChange("unit", event.target.value as InventoryUnit)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Expiry Date
          <input
            required
            type="date"
            value={form.expiryDate ? form.expiryDate.slice(0, 10) : ""}
            onChange={(event) =>
              handleChange("expiryDate", event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Supplier
          <input
            required
            value={form.supplier}
            onChange={(event) => handleChange("supplier", event.target.value)}
            placeholder="Supplier name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
          />
        </label>

        {showAdvanced && (
          <>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Purchase Date
              <input
                type="date"
                value={form.purchaseDate ? form.purchaseDate.slice(0, 10) : ""}
                onChange={(event) =>
                  handleChange("purchaseDate", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Price Per Unit
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.pricePerUnit}
                onChange={(event) =>
                  handleChange("pricePerUnit", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Minimum Stock Level
              <input
                type="number"
                min={0}
                value={form.minStockLevel}
                onChange={(event) =>
                  handleChange("minStockLevel", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
              />
            </label>

            <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-slate-600">
              Notes
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Storage instructions, dosage info…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none"
              />
            </label>
          </>
        )}

        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-500 active:bg-sky-700"
          >
            {editingItem ? "Save Changes" : "Add Medicine"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

