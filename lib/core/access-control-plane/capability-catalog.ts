/**
 * Typed capability catalog — no DB mutation.
 * Reserved keys stay hidden until a later activation job.
 */

import type { AccessCapabilityCatalogEntry } from "./types";

/** Reserved paid add-on for future Design Studio (Web + Bedrift). Not navigable in job 62. */
export const KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY = "kompis_design_studio" as const;

export const ACCESS_CAPABILITY_CATALOG: readonly AccessCapabilityCatalogEntry[] = [
  {
    capabilityKey: "website_kompis",
    kind: "standard_included",
    products: ["kompisWeb"],
    defaultLifecycle: "inactive",
    menuHiddenUntilActivated: false,
  },
  {
    capabilityKey: "kompis_bedrift",
    kind: "standard_included",
    products: ["kompisBedrift"],
    defaultLifecycle: "inactive",
    menuHiddenUntilActivated: false,
  },
  {
    capabilityKey: KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY,
    kind: "paid_addon",
    products: ["kompisWeb", "kompisBedrift"],
    defaultLifecycle: "hidden_reserved",
    menuHiddenUntilActivated: true,
  },
] as const;

export function getCatalogEntry(capabilityKey: string): AccessCapabilityCatalogEntry | null {
  return ACCESS_CAPABILITY_CATALOG.find((entry) => entry.capabilityKey === capabilityKey) ?? null;
}

export function isReservedHiddenCapability(capabilityKey: string): boolean {
  const entry = getCatalogEntry(capabilityKey);
  return entry?.menuHiddenUntilActivated === true || entry?.defaultLifecycle === "hidden_reserved";
}
