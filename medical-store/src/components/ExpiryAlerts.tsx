"use client";

import { InventoryItem, InventoryStatus } from "@/types/inventory";

interface ExpiryAlertsProps {
  items: InventoryItem[];
  getStatus: (item: InventoryItem) => InventoryStatus;
}

function formatCountdown(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} overdue`;
  }

  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "Expires tomorrow";
  return `Expires in ${diffDays} days`;
}

export function ExpiryAlerts({ items, getStatus }: ExpiryAlertsProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-md shadow-slate-100 ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">
          Expiry Monitor
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          All stocked medicines are healthy. You&apos;ll see alerts here 30
          days before expiry.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-md shadow-slate-100 ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Expiry Monitor</h2>
          <p className="text-sm text-slate-500">
            Medicines expiring within the next 30 days and already expired items.
          </p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-500">
          {items.length} Alert{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const status = getStatus(item);
          const expired = status === "expired";
          return (
            <article
              key={item.id}
              className={`rounded-2xl border px-4 py-3 text-sm transition ${
                expired
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <time className="text-xs font-semibold uppercase tracking-wide">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-xs text-current">
                  {formatCountdown(item.expiryDate)} • {item.quantity} {item.unit}
                  {item.quantity === 1 ? "" : "s"} remaining
                </p>
                <p className="text-xs text-current">
                  Batch {item.batchNumber} • Supplier {item.supplier}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

