"use client";

import { useMemo, useState } from "react";
import { InventoryForm } from "@/components/InventoryForm";
import { InventoryList } from "@/components/InventoryList";
import { ExpiryAlerts } from "@/components/ExpiryAlerts";
import { SnapshotCards } from "@/components/SnapshotCards";
import { InventoryFiltersBar } from "@/components/InventoryFilters";
import { InventoryItem } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";

export default function Home() {
  const {
    inventory,
    filteredInventory,
    expiringSoonInventory,
    snapshot,
    categories,
    defaultUnits,
    filters,
    setSearch,
    setCategory,
    setStatus,
    upsertItem,
    updateItem,
    deleteItem,
    resetInventory,
    getStatus,
  } = useInventory();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const uniqueSuppliers = useMemo(() => {
    const suppliers = new Set(inventory.map((item) => item.supplier));
    return suppliers.size;
  }, [inventory]);

  const handleSave = (item: Omit<InventoryItem, "id">, id?: string) => {
    upsertItem(item, id);
    setEditingItem(null);
  };

  const handleAdjustQuantity = (id: string, delta: number) => {
    const existing = inventory.find((item) => item.id === id);
    if (!existing) return;
    const updatedQuantity = Math.max(0, existing.quantity + delta);
    updateItem(id, { quantity: updatedQuantity });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="glass-card relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-sky-100/90 sm:p-8">
        <div className="absolute inset-y-0 -left-24 h-full w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute inset-y-0 -right-24 h-full w-56 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
              MediTrack HQ
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Mobile Medical Store Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Monitor your pharmacy stock, get instant expiry alerts, and keep
              your counters replenished. Optimized for Android webview or mobile
              browsers for a native-like experience.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Trusted Suppliers
            </p>
            <p className="text-3xl font-semibold">{uniqueSuppliers}</p>
            <p className="text-xs text-slate-300">
              Active vendor{uniqueSuppliers === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </header>

      <SnapshotCards snapshot={snapshot} />

      <InventoryFiltersBar
        filters={filters}
        categories={categories}
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onClear={() => {
          setSearch("");
          setCategory("all");
          setStatus("all");
        }}
      />

      <InventoryForm
        onSave={handleSave}
        units={defaultUnits}
        categories={categories}
        editingItem={editingItem ?? undefined}
        onCancelEdit={() => setEditingItem(null)}
      />

      <section className="flex flex-col gap-4 rounded-3xl bg-transparent">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Inventory Overview
          </h2>
          <button
            type="button"
            onClick={() => {
              resetInventory();
              setEditingItem(null);
            }}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            Restore Sample Data
          </button>
        </div>

        <InventoryList
          items={filteredInventory}
          onEdit={(item) => setEditingItem(item)}
          onDelete={deleteItem}
          onAdjustQuantity={handleAdjustQuantity}
          getStatus={getStatus}
        />
      </section>

      <ExpiryAlerts items={expiringSoonInventory} getStatus={getStatus} />
    </main>
  );
}
