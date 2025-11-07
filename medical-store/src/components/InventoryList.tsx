"use client";

import { InventoryItem, InventoryStatus } from "@/types/inventory";

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  getStatus: (item: InventoryItem) => InventoryStatus;
}

const statusStyles: Record<
  InventoryStatus,
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className:
      "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  expiring: {
    label: "Expiring Soon",
    className:
      "bg-amber-100 text-amber-700 ring-amber-200 animate-pulse",
  },
  expired: {
    label: "Expired",
    className:
      "bg-rose-200 text-rose-800 ring-rose-300",
  },
  "low-stock": {
    label: "Low Stock",
    className:
      "bg-sky-100 text-sky-700 ring-sky-200",
  },
};

export function InventoryList({
  items,
  onEdit,
  onDelete,
  onAdjustQuantity,
  getStatus,
}: InventoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        No medicines match your filters. Try adjusting the search or add a new
        product.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const status = getStatus(item);
        return (
          <article
            key={item.id}
            className="rounded-3xl bg-white p-5 shadow-md shadow-slate-100 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Batch {item.batchNumber}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[status].className}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
                {statusStyles[status].label}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-slate-500">
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Category
                </dt>
                <dd className="text-sm text-slate-700">{item.category}</dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Supplier
                </dt>
                <dd className="text-sm text-slate-700">{item.supplier}</dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Expiry
                </dt>
                <dd className="text-sm text-slate-700">
                  {new Date(item.expiryDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Stock
                </dt>
                <dd className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {item.quantity}
                  </span>{" "}
                  {item.unit}
                  {item.quantity !== 1 ? "s" : ""}
                </dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Min Level
                </dt>
                <dd className="text-sm text-slate-700">
                  {item.minStockLevel || 0} {item.unit}
                  {item.minStockLevel !== 1 ? "s" : ""}
                </dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-slate-400">
                  Unit Cost
                </dt>
                <dd className="text-sm text-slate-700">
                  {item.pricePerUnit
                    ? `₹${item.pricePerUnit.toFixed(2)}`
                    : "—"}
                </dd>
              </div>
            </dl>

            {item.notes && (
              <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                {item.notes}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onAdjustQuantity(item.id, -1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-lg font-semibold text-slate-500 transition hover:bg-slate-100 active:scale-95"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => onAdjustQuantity(item.id, 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-lg font-semibold text-slate-500 transition hover:bg-slate-100 active:scale-95"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 active:scale-95"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-rose-200 transition hover:bg-rose-600 active:scale-95"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
