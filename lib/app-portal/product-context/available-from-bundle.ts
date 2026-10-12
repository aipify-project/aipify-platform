import { getVisibleCapabilityIds, type AppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import type { AppProductContextId } from "./constants";

const WEB_SIGNAL_IDS = [
  "kompisWebDashboard",
  "kompisWebQa",
  "kompisWebFaq",
  "kompisWebModules",
  "kompisWebConnection",
  "kompisWebSettings",
] as const;

const BEDRIFT_SIGNAL_IDS = [
  "kompisBedriftDashboard",
  "kompisBedriftEmployees",
  "kompisBedriftDocuments",
  "kompisBedriftFaq",
  "kompisBedriftComms",
  "kompisBedriftMeetings",
  "kompisBedriftModules",
  "kompisBedriftSettings",
  "kompisBedriftConnection",
] as const;

/** Derive switchable products from the capability allowlist (no new license schema). */
export function availableProductsFromBundle(
  bundle: AppMenuCapabilityBundle
): AppProductContextId[] {
  const visible = getVisibleCapabilityIds(bundle);
  const available: AppProductContextId[] = [];
  if (WEB_SIGNAL_IDS.some((id) => visible.has(id))) available.push("kompisWeb");
  if (BEDRIFT_SIGNAL_IDS.some((id) => visible.has(id))) available.push("kompisBedrift");
  return available;
}
