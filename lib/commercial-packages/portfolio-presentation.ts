import type { BillingViewModel } from "./billing-view-model";

/** Historical commercial package keys. They are records, not the Kompis portfolio. */
const LEGACY_PACKAGE_KEYS = new Set([
  "starter",
  "professional",
  "business",
  "enterprise",
  "insights",
  "growth",
]);

export type WorkspaceLicenseRead = {
  planName: string | null;
  licenseStatus: string | null;
};

export type KompisProductAccessRead = {
  webKind: "unauthenticated" | "no_module" | "unknown_plan" | "unavailable" | "known_plan";
  webPlan: "free" | "standard" | "pro" | null;
  bedrift: "licensed" | "not_licensed" | "unknown";
};

export type RenewalPresentation = "date" | "lifetime" | "unknown";

export function isLegacyCommercialPackage(packageKey: string | null | undefined): boolean {
  const key = packageKey?.trim().toLowerCase() ?? "";
  return LEGACY_PACKAGE_KEYS.has(key);
}

export function renewalPresentation(input: {
  statusKey: string | null;
  licenseStatus: string | null;
  renewalDate: string | null;
}): RenewalPresentation {
  if (input.renewalDate) return "date";
  const status = (input.licenseStatus ?? input.statusKey ?? "").toLowerCase();
  if (status === "lifetime") return "lifetime";
  return "unknown";
}

export function subscriptionShowsDistinctLicense(
  packageName: string | null,
  license: WorkspaceLicenseRead | null
): boolean {
  const registered = packageName?.trim() ?? "";
  const licenseName = license?.planName?.trim() ?? "";
  if (!registered || !licenseName) return false;
  return registered.localeCompare(licenseName, undefined, { sensitivity: "accent" }) !== 0;
}

export type WebProductTone = "unassigned" | "assigned" | "not_licensed" | "unknown";
export type BedriftProductTone = "licensed" | "not_licensed" | "unknown";

export function webProductTone(access: KompisProductAccessRead): WebProductTone {
  if (access.webKind === "known_plan" && access.webPlan) return "assigned";
  if (access.webKind === "unknown_plan") return "unassigned";
  if (access.webKind === "no_module") return "not_licensed";
  return "unknown";
}

export function bedriftProductTone(access: KompisProductAccessRead): BedriftProductTone {
  return access.bedrift;
}

/** A missing answer plan never becomes the free catalog allowance. */
export function assignedWebPlan(access: KompisProductAccessRead): "free" | "standard" | "pro" | null {
  if (access.webKind !== "known_plan") return null;
  return access.webPlan;
}

export function capacityState(vm: BillingViewModel, key: BillingViewModel["limits"][number]["key"]) {
  return vm.limits.find((limit) => limit.key === key)?.state ?? "unknown";
}
