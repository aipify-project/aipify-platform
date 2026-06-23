import type { AppPortalNavId } from "./nav-config";

/** Nav items gated by organization permission — any listed key grants visibility. */
export const APP_NAV_PERMISSION_KEYS: Partial<Record<AppPortalNavId, string[]>> = {
  availableBusinessPacks: ["business_packs.view", "business_pack_marketplace.view"],
  customerHealth: ["customer_health.view", "customer_health.manage"],
  customerSuccess: ["success.view"],
  abosCommandCenter: ["operations_center.view", "operations_center.manage"],
  intelligenceCommandCenter: ["operations_center.view", "operations_center.manage"],
};
