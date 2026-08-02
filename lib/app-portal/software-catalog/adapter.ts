import { parseBillingCenter, parseModulesCenter } from "@/lib/commercial-packages/parse";
import type { BusinessPackActivationGateItem } from "@/lib/business-pack-activation-gate";
import type { SoftwareCatalogItem, SoftwareCatalogStatus, SoftwareCatalogViewModel } from "./types";

export const CANONICAL_HOSTS_PACK_KEY = "aipify_hosts" as const;

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry)).filter(Boolean);
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

  const currentPackage = billing.current_package
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

  if (billing.current_package) {
    items.push({
      id: `package:${billing.current_package.package_key}`,
      sourceType: "package",
      canonicalKey: billing.current_package.package_key,
      name: billing.current_package.package_name,
      valueProposition: billing.positioning ?? null,
      description: billing.current_package.description || null,
      category: "package",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status: "active",
      ...statusFlags("active"),
      detailsRoute: "/app/settings/billing",
      currentEntitlement: billing.current_package.package_key,
      readiness: "operational",
      features: billing.current_package.features,
    });
  }

  for (const option of billing.upgrade_options ?? []) {
    const key = str(option.package_key) ?? str(option.packageKey);
    const name = str(option.package_name) ?? str(option.packageName) ?? key;
    if (!key || !name) continue;
    if (items.some((item) => item.id === `package:${key}`)) continue;
    items.push({
      id: `package:${key}`,
      sourceType: "package",
      canonicalKey: key,
      name,
      valueProposition: str(option.description),
      description: str(option.description),
      category: "package",
      price: null,
      billingPeriod: null,
      licenseModel: null,
      capacity: null,
      status: "available",
      ...statusFlags("available"),
      detailsRoute: "/app/settings/billing/packages",
      currentEntitlement: null,
      readiness: "operational",
      features: asStringArray(option.features),
    });
  }

  const installed = modules.installed_modules ?? [];
  for (const mod of installed) {
    const key = str(mod.module_key) ?? str(mod.moduleKey) ?? str(mod.key);
    const name = str(mod.module_name) ?? str(mod.name) ?? key;
    if (!key || !name) continue;
    const enabled = mod.enabled === true || mod.licensed === true || mod.status === "enabled";
    const status: SoftwareCatalogStatus = enabled ? "included" : "unavailable";
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
      detailsRoute: "/app/settings/modules",
      currentEntitlement: enabled ? key : null,
      readiness: "operational",
      features: asStringArray(mod.features),
    });
  }

  for (const mod of modules.available_modules ?? []) {
    const key = str(mod.module_key) ?? str(mod.moduleKey) ?? str(mod.key);
    const name = str(mod.module_name) ?? str(mod.name) ?? key;
    if (!key || !name) continue;
    if (items.some((item) => item.id === `module:${key}`)) continue;
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
      status: "available",
      ...statusFlags("available"),
      detailsRoute: "/app/settings/modules",
      currentEntitlement: null,
      readiness: "operational",
      features: asStringArray(mod.features),
    });
  }

  let identityPacks = parseIdentityPacks(input.identityDashboardRaw);
  if (identityPacks.length === 0) {
    diagnostics.push("business_pack_identity_partial");
  }

  if (input.hostsLandingRaw && typeof input.hostsLandingRaw === "object") {
    const landing = input.hostsLandingRaw as Record<string, unknown>;
    if (landing.found !== false && str(landing.pack_key) === CANONICAL_HOSTS_PACK_KEY) {
      const exists = identityPacks.some(
        (pack) => str(pack.pack_key) === CANONICAL_HOSTS_PACK_KEY
      );
      if (!exists) identityPacks = [landing, ...identityPacks];
    }
  }

  for (const pack of identityPacks) {
    const key = str(pack.pack_key);
    const name = str(pack.pack_name) ?? key;
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
      features: asStringArray(pack.features),
    });
  }

  const hasHosts = items.some(
    (item) =>
      item.sourceType === "business_pack" && item.canonicalKey === CANONICAL_HOSTS_PACK_KEY
  );
  if (!hasHosts) {
    diagnostics.push("aipify_hosts_missing_from_identity");
  }

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
    partial: diagnostics.length > 0,
    diagnostics,
  };
}
