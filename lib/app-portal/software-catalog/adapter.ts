import { parseBillingCenter, parseModulesCenter } from "@/lib/commercial-packages/parse";
import { resolveCustomerFacingFeatureLabel } from "@/lib/commercial-packages/package-presentation";
import type { BusinessPackActivationGateItem } from "@/lib/business-pack-activation-gate";
import {
  resolveCustomerFacingModuleName,
  resolveModuleCatalogStatus,
  unwrapBusinessPackIdentityPayload,
} from "./module-presentation";
import type { SoftwareCatalogItem, SoftwareCatalogStatus, SoftwareCatalogViewModel } from "./types";

export const CANONICAL_HOSTS_PACK_KEY = "aipify_hosts" as const;

/** Diagnostics that represent hard section failures (show partial notice). */
export const SOFTWARE_CATALOG_HARD_FAILURE_DIAGNOSTICS = new Set([
  "billing_center_error",
  "modules_center_error",
  "billing_or_modules_unavailable",
  "api_error",
]);

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asFeatureArray(
  value: unknown,
  localizeFeature?: (feature: string) => string | null
): string[] {
  if (!Array.isArray(value)) return [];
  const labels: string[] = [];
  for (const entry of value) {
    const label = resolveCustomerFacingFeatureLabel(String(entry), localizeFeature);
    if (label) labels.push(label);
  }
  return labels;
}

function packStatus(
  packKey: string,
  gateByPack: Map<string, BusinessPackActivationGateItem>,
  identityStatus: string | null
): SoftwareCatalogStatus {
  const gate = gateByPack.get(packKey);
  if (gate?.activation_status === "active") return "active";
  if (
    gate?.activation_status === "pending_activation" ||
    gate?.activation_status === "validating"
  ) {
    return "pending_approval";
  }
  if (identityStatus === "coming_soon" || identityStatus === "deprecated" || identityStatus === "retired") {
    return "unavailable";
  }
  return "available";
}

function statusFlags(status: SoftwareCatalogStatus) {
  return {
    included: status === "included",
    active: status === "active" || status === "included",
    available: status === "available",
    pendingApproval: status === "pending_approval",
    unavailable: status === "unavailable",
  };
}

function parseIdentityPacks(raw: unknown): Array<Record<string, unknown>> {
  if (!raw || typeof raw !== "object") return [];
  const row = raw as Record<string, unknown>;
  if (row.has_access === false) return [];
  return Array.isArray(row.packs) ? (row.packs as Record<string, unknown>[]) : [];
}

export function computeSoftwareCatalogPartial(diagnostics: string[]): boolean {
  return diagnostics.some((code) => SOFTWARE_CATALOG_HARD_FAILURE_DIAGNOSTICS.has(code));
}

/**
 * Pure adapter — maps authoritative RPC payloads into a read-only catalog view model.
 * No fake prices, no runtime fixtures, no mutations.
 */
export function buildSoftwareCatalogViewModel(input: {
  billingRaw: unknown;
  modulesRaw: unknown;
  identityDashboardRaw: unknown;
  hostsLandingRaw?: unknown;
  activationGates?: BusinessPackActivationGateItem[];
  /** Optional localized package copy keyed by package_key — never invented. */
  localizePackage?: (packageKey: string) => { name?: string | null; description?: string | null } | null;
  /** Optional localized module display names keyed by module_key — never invented. */
  localizeModuleName?: (moduleKey: string) => string | null;
  /** Optional localized included-feature labels — never invented. */
  localizeFeature?: (feature: string) => string | null;
}): SoftwareCatalogViewModel {
  const diagnostics: string[] = [];
  const billing = parseBillingCenter(input.billingRaw);
  const modules = parseModulesCenter(input.modulesRaw);
  const gateByPack = new Map(
    (input.activationGates ?? []).map((gate) => [gate.pack_key, gate] as const)
  );

  const items: SoftwareCatalogItem[] = [];

  if (!billing.has_customer && !modules.has_customer) {
    diagnostics.push("billing_or_modules_unavailable");
  }

  const localizePackage = input.localizePackage;
  const localizeModuleName = input.localizeModuleName;
  const localizeFeature = input.localizeFeature;

  let currentPackage = billing.current_package
    ? {
        packageKey: billing.current_package.package_key,
        packageName: billing.current_package.package_name,
        description: billing.current_package.description || null,
      }
    : modules.current_package
      ? {
          packageKey: modules.current_package,
          packageName: modules.current_package,
          description: null,
        }
      : null;

  if (currentPackage && localizePackage) {
    const localized = localizePackage(currentPackage.packageKey);
    if (localized?.name) currentPackage = { ...currentPackage, packageName: localized.name };
    if (localized?.description) {
      currentPackage = { ...currentPackage, description: localized.description };
    }
  }

  if (billing.current_package) {
    const key = billing.current_package.package_key;
    const localized = localizePackage?.(key);
    const description =
      localized?.description ?? (billing.current_package.description || null);
    items.push({
      id: `package:${key}`,
      sourceType: "package",
      canonicalKey: key,
      name: localized?.name ?? billing.current_package.package_name,
      // Never prefer English backend positioning over localized package copy.
      valueProposition: description,
      description,
      category: "package",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status: "active",
      ...statusFlags("active"),
      detailsRoute: "/app/settings/billing",
      currentEntitlement: key,
      readiness: "operational",
      features: asFeatureArray(billing.current_package.features, localizeFeature),
    });
  }

  for (const option of billing.upgrade_options ?? []) {
    const key = str(option.package_key) ?? str(option.packageKey);
    if (!key) continue;
    const localized = localizePackage?.(key);
    const name =
      localized?.name ?? str(option.package_name) ?? str(option.packageName);
    if (!name) continue;
    if (items.some((item) => item.id === `package:${key}`)) continue;
    items.push({
      id: `package:${key}`,
      sourceType: "package",
      canonicalKey: key,
      name,
      valueProposition: localized?.description ?? str(option.description),
      description: localized?.description ?? str(option.description),
      category: "package",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status: "available",
      ...statusFlags("available"),
      detailsRoute: "/app/settings/billing",
      currentEntitlement: null,
      readiness: "operational",
      features: asFeatureArray(option.features, localizeFeature),
    });
  }

  const installed = modules.installed_modules ?? [];
  for (const mod of installed) {
    const key = str(mod.module_key) ?? str(mod.moduleKey) ?? str(mod.key);
    if (!key) continue;
    const name = resolveCustomerFacingModuleName({
      moduleKey: key,
      moduleName: str(mod.module_name),
      name: str(mod.name),
      localizedName: localizeModuleName?.(key) ?? null,
    });
    if (!name) {
      diagnostics.push(`module_hidden_missing_display_name:${key}`);
      continue;
    }
    const resolved = resolveModuleCatalogStatus(mod);
    items.push({
      id: `module:${key}`,
      sourceType: "module",
      canonicalKey: key,
      name,
      valueProposition: str(mod.description),
      description: str(mod.description),
      category: str(mod.suite) ?? str(mod.category) ?? "module",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status: resolved.status,
      ...statusFlags(resolved.status),
      detailsRoute: "/app/settings/billing",
      currentEntitlement: resolved.entitled ? key : null,
      readiness: "operational",
      features: asFeatureArray(mod.features, localizeFeature),
    });
  }

  for (const mod of modules.available_modules ?? []) {
    const key = str(mod.module_key) ?? str(mod.moduleKey) ?? str(mod.key);
    if (!key) continue;
    if (items.some((item) => item.id === `module:${key}`)) continue;
    const name = resolveCustomerFacingModuleName({
      moduleKey: key,
      moduleName: str(mod.module_name),
      name: str(mod.name),
      localizedName: localizeModuleName?.(key) ?? null,
    });
    if (!name) {
      diagnostics.push(`module_hidden_missing_display_name:${key}`);
      continue;
    }
    // Available catalog rows are never "included"
    const status: SoftwareCatalogStatus = "available";
    items.push({
      id: `module:${key}`,
      sourceType: "module",
      canonicalKey: key,
      name,
      valueProposition: str(mod.description),
      description: str(mod.description),
      category: str(mod.suite) ?? str(mod.category) ?? "module",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status,
      ...statusFlags(status),
      detailsRoute: "/app/settings/billing",
      currentEntitlement: null,
      readiness: "operational",
      features: asFeatureArray(mod.features, localizeFeature),
    });
  }

  let identityPacks = parseIdentityPacks(input.identityDashboardRaw);
  if (
    input.identityDashboardRaw &&
    typeof input.identityDashboardRaw === "object" &&
    (input.identityDashboardRaw as Record<string, unknown>).has_access === false
  ) {
    diagnostics.push("business_pack_identity_unavailable");
  } else if (identityPacks.length === 0) {
    diagnostics.push("business_pack_identity_empty");
  }

  const hostsIdentity = unwrapBusinessPackIdentityPayload(input.hostsLandingRaw);
  if (hostsIdentity && str(hostsIdentity.pack_key) === CANONICAL_HOSTS_PACK_KEY) {
    const exists = identityPacks.some((pack) => str(pack.pack_key) === CANONICAL_HOSTS_PACK_KEY);
    if (!exists) identityPacks = [hostsIdentity, ...identityPacks];
  }

  for (const pack of identityPacks) {
    const key = str(pack.pack_key);
    const name = str(pack.pack_name);
    if (!key || !name) continue;
    const status = packStatus(key, gateByPack, str(pack.status));
    const detailsRoute =
      str(pack.landing_route) ?? `/app/marketplace/packs/${encodeURIComponent(key)}`;
    items.push({
      id: `business_pack:${key}`,
      sourceType: "business_pack",
      canonicalKey: key,
      name,
      valueProposition: str(pack.business_value_statement) ?? str(pack.short_description),
      description: str(pack.short_description) ?? str(pack.long_description),
      category: str(pack.pack_category),
      price: null,
      billingPeriod: null,
      licenseModel: str(pack.licensing_summary),
      capacity: null,
      status,
      ...statusFlags(status),
      detailsRoute,
      currentEntitlement: status === "active" ? key : null,
      readiness: "operational",
      features: asFeatureArray(pack.features, localizeFeature),
    });
  }

  const hasHosts = items.some(
    (item) =>
      item.sourceType === "business_pack" && item.canonicalKey === CANONICAL_HOSTS_PACK_KEY
  );
  if (!hasHosts) {
    diagnostics.push("aipify_hosts_unavailable");
  }

  const viewDiagnostics = diagnostics;
  return {
    found: Boolean(currentPackage) || items.length > 0,
    currentPackage,
    items,
    referencePackKey: CANONICAL_HOSTS_PACK_KEY,
    sections: {
      packages: items.some((item) => item.sourceType === "package"),
      modules: items.some((item) => item.sourceType === "module"),
      businessPacks: items.some((item) => item.sourceType === "business_pack"),
    },
    partial: computeSoftwareCatalogPartial(viewDiagnostics),
    diagnostics: viewDiagnostics,
  };
}
