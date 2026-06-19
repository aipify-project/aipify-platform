export type InventoryAdvisorInsight = {
  key?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  href?: string;
};

export function inventoryAdvisorRouteForKey(key: string): string {
  switch (key) {
    case "low_stock":
      return "/app/inventory/purchase-requests";
    case "appointment_readiness":
      return "/app/inventory/reservations";
    case "quarantine":
      return "/app/inventory/stock";
    case "checkout_guard":
      return "/app/inventory/policies";
    default:
      return "/app/inventory";
  }
}
