/**
 * Core-owned Website Kompis launcher icon variant registry.
 * Customer installs may select an approved variant key; Core owns all assets and metadata.
 */

export const COMPANION_LAUNCHER_ICON_VARIANT_KEYS = [
  "companion-purple-default",
  "companion-purple-dark",
  "companion-purple-light",
] as const;

export type CompanionLauncherIconVariantKey =
  (typeof COMPANION_LAUNCHER_ICON_VARIANT_KEYS)[number];

export type CompanionLauncherRecommendedSurface = "light" | "dark" | "any";

export const DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT: CompanionLauncherIconVariantKey =
  "companion-purple-default";

export type CompanionLauncherIconVariantDefinition = {
  /** Stable variant key for install/config selection. */
  variantKey: CompanionLauncherIconVariantKey;
  /** Stable metadata id (matches variantKey). */
  id: string;
  /** Public path served from Aipify Core. */
  iconPath: string;
  /** Source asset path in the repository. */
  sourceAssetPath: string;
  ariaLabel: string;
  description: string;
  presenceRingColor: string;
  /** Website surface this variant is tuned for. */
  recommendedSurface: CompanionLauncherRecommendedSurface;
};

export const COMPANION_LAUNCHER_ICON_REGISTRY: Record<
  CompanionLauncherIconVariantKey,
  CompanionLauncherIconVariantDefinition
> = {
  "companion-purple-default": {
    variantKey: "companion-purple-default",
    id: "aipify-companion-launcher-icon",
    iconPath: "/aipify-companion-launcher-icon.svg",
    sourceAssetPath: "assets/brand/aipify-companion-launcher-icon.svg",
    ariaLabel: "Aipify Companion",
    description:
      "Purple connected-node Companion mark with mint presence ring for Website Kompis launcher buttons.",
    presenceRingColor: "#34D399",
    recommendedSurface: "any",
  },
  "companion-purple-dark": {
    variantKey: "companion-purple-dark",
    id: "companion-purple-dark",
    iconPath: "/aipify-companion-launcher-icon-dark.svg",
    sourceAssetPath: "assets/brand/aipify-companion-launcher-icon-dark.svg",
    ariaLabel: "Aipify Companion",
    description:
      "Aipify Companion launcher icon tuned for light or white website backgrounds.",
    presenceRingColor: "#34D399",
    recommendedSurface: "light",
  },
  "companion-purple-light": {
    variantKey: "companion-purple-light",
    id: "companion-purple-light",
    iconPath: "/aipify-companion-launcher-icon-light.svg",
    sourceAssetPath: "assets/brand/aipify-companion-launcher-icon-light.svg",
    ariaLabel: "Aipify Companion",
    description:
      "Aipify Companion launcher icon tuned for dark or black website backgrounds.",
    presenceRingColor: "#6EE7B7",
    recommendedSurface: "dark",
  },
};

export function isCompanionLauncherIconVariantKey(
  value: string | null | undefined,
): value is CompanionLauncherIconVariantKey {
  return (
    typeof value === "string" &&
    (COMPANION_LAUNCHER_ICON_VARIANT_KEYS as readonly string[]).includes(value)
  );
}

export function resolveCompanionLauncherIconVariant(
  requested: string | null | undefined,
): CompanionLauncherIconVariantKey {
  if (isCompanionLauncherIconVariantKey(requested)) {
    return requested;
  }
  return DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT;
}

export function getCompanionLauncherIconVariantDefinition(
  variantKey: CompanionLauncherIconVariantKey,
): CompanionLauncherIconVariantDefinition {
  return COMPANION_LAUNCHER_ICON_REGISTRY[variantKey];
}

export function listCompanionLauncherIconVariants(): CompanionLauncherIconVariantDefinition[] {
  return COMPANION_LAUNCHER_ICON_VARIANT_KEYS.map(
    (key) => COMPANION_LAUNCHER_ICON_REGISTRY[key],
  );
}

export function getCompanionLauncherIconUrlForVariant(
  origin: string,
  variantKey: CompanionLauncherIconVariantKey,
): string {
  const normalizedOrigin = origin.replace(/\/$/, "");
  const { iconPath } = getCompanionLauncherIconVariantDefinition(variantKey);
  return `${normalizedOrigin}${iconPath}`;
}
