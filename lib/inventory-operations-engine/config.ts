export const INV613_SECTIONS = [
  { key: "overview", href: "/app/inventory" },
  { key: "products", href: "/app/inventory/products" },
  { key: "consumables", href: "/app/inventory/consumables" },
  { key: "stock", href: "/app/inventory/stock" },
  { key: "locations", href: "/app/inventory/locations" },
  { key: "reservations", href: "/app/inventory/reservations" },
  { key: "purchaseRequests", href: "/app/inventory/purchase-requests" },
  { key: "purchaseOrders", href: "/app/inventory/purchase-orders" },
  { key: "suppliers", href: "/app/inventory/suppliers" },
  { key: "receiving", href: "/app/inventory/receiving" },
  { key: "transfers", href: "/app/inventory/transfers" },
  { key: "stockCounts", href: "/app/inventory/stock-counts" },
  { key: "adjustments", href: "/app/inventory/adjustments" },
  { key: "waste", href: "/app/inventory/waste" },
  { key: "returns", href: "/app/inventory/returns" },
  { key: "equipment", href: "/app/inventory/equipment" },
  { key: "forecasting", href: "/app/inventory/forecasting" },
  { key: "policies", href: "/app/inventory/policies" },
  { key: "reports", href: "/app/inventory/reports" },
] as const;

export type Inv613Section = (typeof INV613_SECTIONS)[number]["key"];

export function getInv613ActiveSection(pathname: string): Inv613Section {
  if (pathname === "/app/inventory" || pathname === "/app/inventory/") return "overview";
  const match = INV613_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function inv613SectionToRpc(section: Inv613Section): string {
  const map: Partial<Record<Inv613Section, string>> = {
    purchaseRequests: "purchase_requests",
    purchaseOrders: "purchase_orders",
    stockCounts: "stock_counts",
  };
  return map[section] ?? section.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function inv613RowsKey(section: Inv613Section): string {
  const map: Partial<Record<Inv613Section, string>> = {
    overview: "products",
    purchaseRequests: "purchase_requests",
    purchaseOrders: "purchase_orders",
    stockCounts: "stock_counts",
  };
  return map[section] ?? inv613SectionToRpc(section);
}
