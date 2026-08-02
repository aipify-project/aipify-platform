import {
  PACKAGE_FEATURE_ALIASES,
  type PackagePresentationOptions,
} from "@/lib/commercial-packages/package-presentation";
import type { Dictionary } from "@/lib/i18n/translate";

/** Serializable package/feature copy for Client Components (no functions across RSC boundary). */
export type BillingPresentationMaps = {
  packages: Record<string, { name?: string; description?: string }>;
  features: Record<string, string>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readCatalogNode(dict: Dictionary): Record<string, unknown> | null {
  const customerApp = asRecord(dict.customerApp);
  const portalStructure = asRecord(customerApp?.portalStructure);
  return asRecord(portalStructure?.softwareCatalog);
}

/**
 * Build serializable package/feature maps from the dictionary tree.
 * Package keys come from locale content — not a hardcoded product list.
 */
export function buildBillingPresentationMaps(dict: Dictionary): BillingPresentationMaps {
  const catalog = readCatalogNode(dict);
  const packageCopy = asRecord(catalog?.packageCopy) ?? {};
  const featureLabels = asRecord(catalog?.featureLabels) ?? {};

  const packages: BillingPresentationMaps["packages"] = {};
  for (const [key, value] of Object.entries(packageCopy)) {
    const entry = asRecord(value);
    if (!entry) continue;
    const name = typeof entry.name === "string" ? entry.name.trim() : "";
    const description = typeof entry.description === "string" ? entry.description.trim() : "";
    if (!name && !description) continue;
    packages[key] = {
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    };
  }

  const features: Record<string, string> = {};
  for (const alias of new Set(Object.values(PACKAGE_FEATURE_ALIASES))) {
    const label = featureLabels[alias];
    if (typeof label === "string" && label.trim()) {
      features[alias] = label.trim();
    }
  }

  return { packages, features };
}

export function presentationOptionsFromMaps(
  maps: BillingPresentationMaps | undefined
): PackagePresentationOptions {
  if (!maps) return {};
  return {
    localizePackage(packageKey: string) {
      const entry = maps.packages[packageKey];
      if (!entry) return null;
      return { name: entry.name ?? null, description: entry.description ?? null };
    },
    localizeFeature(feature: string) {
      const alias = PACKAGE_FEATURE_ALIASES[feature.trim().toLowerCase().replace(/\s+/g, " ")];
      if (!alias) return null;
      return maps.features[alias] ?? null;
    },
  };
}
