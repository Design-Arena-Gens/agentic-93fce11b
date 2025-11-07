"use client";

import { InventoryFilters } from "@/hooks/useInventory";

interface InventoryFiltersProps {
  filters: InventoryFilters;
  categories: string[];
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: InventoryFilters["status"]) => void;
  onClear: () => void;
}

const statusLabels: { value: InventoryFilters["status"]; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "healthy", label: "Healthy" },
  { value: "expiring", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
  { value: "low-stock", label: "Low stock" },
];

export function InventoryFiltersBar({
  filters,
  categories,
  onSearch,
  onCategoryChange,
  onStatusChange,
  onClear,
}: InventoryFiltersProps) {
  return (
    <section className="rounded-3xl bg-white px-5 py-4 shadow-md shadow-slate-100 ring-1 ring-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 focus-within:border-sky-500">
          <span className="text-lg text-slate-400">🔍</span>
          <input
            value={filters.search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by medicine, batch or supplier"
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
          />
        </label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            value={filters.category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) =>
              onStatusChange(event.target.value as InventoryFilters["status"])
            }
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 focus:border-sky-500 focus:outline-none"
          >
            {statusLabels.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}

