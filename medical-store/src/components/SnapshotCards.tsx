"use client";

import { InventorySnapshot } from "@/types/inventory";

interface SnapshotCardsProps {
  snapshot: InventorySnapshot;
}

const cards: {
  key: keyof InventorySnapshot;
  label: string;
  accent: string;
  description: string;
}[] = [
  {
    key: "totalSkus",
    label: "Total SKUs",
    accent: "from-indigo-500 via-sky-500 to-cyan-400",
    description: "Unique medicines tracked",
  },
  {
    key: "totalUnits",
    label: "Units In Stock",
    accent: "from-emerald-500 via-green-500 to-lime-400",
    description: "Overall inventory balance",
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    description: "Within the next 30 days",
  },
  {
    key: "expired",
    label: "Expired",
    accent: "from-rose-500 via-red-500 to-pink-500",
    description: "Remove from shelves immediately",
  },
  {
    key: "lowStock",
    label: "Low Stock",
    accent: "from-fuchsia-500 via-purple-500 to-indigo-500",
    description: "Needs purchase order soon",
  },
];

export function SnapshotCards({ snapshot }: SnapshotCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ key, label, accent, description }) => (
        <article
          key={key}
          className="rounded-3xl bg-white p-4 shadow-lg shadow-slate-100/70 ring-1 ring-slate-100"
        >
          <div
            className={`inline-flex items-center rounded-2xl bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white`}
          >
            {label}
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {snapshot[key]}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </article>
      ))}
    </section>
  );
}
