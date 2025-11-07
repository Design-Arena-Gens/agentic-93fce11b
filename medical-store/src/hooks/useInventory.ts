"use client";

import { useEffect, useMemo, useState } from "react";
import {
  InventoryItem,
  InventorySnapshot,
  InventoryStatus,
  InventoryUnit,
} from "@/types/inventory";

const STORAGE_KEY = "medical-store-inventory";
const EXPIRY_THRESHOLD_DAYS = 30;

const defaultUnits: InventoryUnit[] = [
  "tablet",
  "capsule",
  "ml",
  "mg",
  "piece",
  "packet",
  "bottle",
  "tube",
  "sachet",
  "other",
];

const defaultCategories = [
  "Analgesic",
  "Antibiotic",
  "Supplement",
  "First Aid",
  "Dermatology",
  "Respiratory",
  "Gastrointestinal",
  "Cardiology",
  "Diabetes Care",
  "Wellness",
];

function isExpired(expiryDate: string) {
  return new Date(expiryDate).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);
}

function isExpiringSoon(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= EXPIRY_THRESHOLD_DAYS;
}

function isLowStock(item: InventoryItem) {
  return item.quantity <= item.minStockLevel;
}

function getStatus(item: InventoryItem): InventoryStatus {
  if (isExpired(item.expiryDate)) return "expired";
  if (isExpiringSoon(item.expiryDate)) return "expiring";
  if (isLowStock(item)) return "low-stock";
  return "healthy";
}

function calculateSnapshot(inventory: InventoryItem[]): InventorySnapshot {
  const now = new Date();
  const expiringCutoff = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + EXPIRY_THRESHOLD_DAYS,
  );

  let totalUnits = 0;
  let expiringSoon = 0;
  let expired = 0;
  let lowStock = 0;

  inventory.forEach((item) => {
    totalUnits += item.quantity;

    if (isExpired(item.expiryDate)) {
      expired += 1;
      return;
    }

    if (new Date(item.expiryDate) <= expiringCutoff) {
      expiringSoon += 1;
    }

    if (isLowStock(item)) {
      lowStock += 1;
    }
  });

  return {
    totalSkus: inventory.length,
    totalUnits,
    expiringSoon,
    expired,
    lowStock,
  };
}

const defaultInventory: InventoryItem[] = [
  {
    id: crypto.randomUUID(),
    name: "Paracetamol 500mg",
    category: "Analgesic",
    batchNumber: "PCM-A23",
    supplier: "GoodHealth Distributors",
    quantity: 150,
    unit: "tablet",
    expiryDate: new Date(
      new Date().setMonth(new Date().getMonth() + 3),
    ).toISOString(),
    purchaseDate: new Date().toISOString(),
    pricePerUnit: 0.35,
    minStockLevel: 50,
    notes: "Best seller for fever and headaches.",
  },
  {
    id: crypto.randomUUID(),
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    batchNumber: "AMX-2023-09",
    supplier: "MedSupply Co.",
    quantity: 80,
    unit: "capsule",
    expiryDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ).toISOString(),
    purchaseDate: new Date().toISOString(),
    pricePerUnit: 0.65,
    minStockLevel: 40,
    notes: "Keep refrigerated once opened.",
  },
  {
    id: crypto.randomUUID(),
    name: "Vitamin C Syrup",
    category: "Supplement",
    batchNumber: "VITC-332",
    supplier: "NatureLife Labs",
    quantity: 45,
    unit: "bottle",
    expiryDate: new Date(
      new Date().setDate(new Date().getDate() + 10),
    ).toISOString(),
    purchaseDate: new Date().toISOString(),
    pricePerUnit: 4.25,
    minStockLevel: 30,
    notes: "Child-friendly syrup.",
  },
];

export interface InventoryFilters {
  search: string;
  category: string;
  status: "all" | InventoryStatus;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    if (typeof window === "undefined") {
      return defaultInventory;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: InventoryItem[] = JSON.parse(stored);
        return parsed.map((item) => ({
          ...item,
          id: item.id || crypto.randomUUID(),
        }));
      } catch (error) {
        console.error("Failed to parse stored inventory", error);
      }
    }
    return defaultInventory;
  });
  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    category: "all",
    status: "all",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const upsertItem = (item: Omit<InventoryItem, "id">, id?: string) => {
    setInventory((prev) => {
      if (id) {
        return prev.map((existing) =>
          existing.id === id ? { ...existing, ...item, id } : existing,
        );
      }
      return [
        { ...item, id: crypto.randomUUID() },
        ...prev,
      ];
    });
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    updates: Partial<Omit<InventoryItem, "id">>,
  ) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const resetInventory = () => {
    setInventory(defaultInventory);
  };

  const categories = useMemo(() => {
    const existing = new Set<string>(defaultCategories);
    inventory.forEach((item) => existing.add(item.category));
    return Array.from(existing).sort();
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        if (filters.category !== "all" && item.category !== filters.category) {
          return false;
        }

        if (filters.status !== "all" && getStatus(item) !== filters.status) {
          return false;
        }

        const normalizedSearch = filters.search.trim().toLowerCase();
        if (!normalizedSearch) return true;

        return (
          item.name.toLowerCase().includes(normalizedSearch) ||
          item.batchNumber.toLowerCase().includes(normalizedSearch) ||
          item.supplier.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
      );
  }, [inventory, filters]);

  const expiringSoonInventory = useMemo(() => {
    return inventory
      .filter((item) => isExpiringSoon(item.expiryDate) || isExpired(item.expiryDate))
      .sort(
        (a, b) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
      );
  }, [inventory]);

  const snapshot = useMemo(
    () => calculateSnapshot(inventory),
    [inventory],
  );

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));
  const setCategory = (category: string) =>
    setFilters((prev) => ({ ...prev, category }));
  const setStatus = (status: InventoryFilters["status"]) =>
    setFilters((prev) => ({ ...prev, status }));

  return {
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
  };
};
