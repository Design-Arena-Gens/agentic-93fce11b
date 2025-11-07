export type InventoryUnit =
  | "tablet"
  | "capsule"
  | "ml"
  | "mg"
  | "piece"
  | "packet"
  | "bottle"
  | "tube"
  | "sachet"
  | "other";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  supplier: string;
  quantity: number;
  unit: InventoryUnit;
  expiryDate: string;
  purchaseDate: string;
  pricePerUnit: number;
  minStockLevel: number;
  notes?: string;
}

export type InventoryStatus = "healthy" | "expiring" | "expired" | "low-stock";

export interface InventorySnapshot {
  totalSkus: number;
  totalUnits: number;
  expiringSoon: number;
  expired: number;
  lowStock: number;
}
