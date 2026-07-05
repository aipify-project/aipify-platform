import { AIPIFY_BRAND } from "@/lib/branding/tokens";

/** Canonical Website Kompis / Companion launcher icon — purple connected-node mark + mint presence ring. */
export const COMPANION_LAUNCHER_ICON = {
  id: "aipify-companion-launcher-icon",
  assetPath: "/aipify-companion-launcher-icon.svg",
  sourceAssetPath: "assets/brand/aipify-companion-launcher-icon.svg",
  description:
    "Purple connected-node Companion mark with mint presence ring for Website Kompis launcher buttons.",
  ariaLabel: "Aipify Companion",
  presenceRingColor: "#34D399",
  symbolGradientFrom: AIPIFY_BRAND.pulse.colors.gradientFrom,
  symbolGradientTo: AIPIFY_BRAND.pulse.colors.gradientTo,
} as const;

export type CompanionLauncherIconEmbedConfig = {
  id: typeof COMPANION_LAUNCHER_ICON.id;
  iconUrl: string;
  iconPath: typeof COMPANION_LAUNCHER_ICON.assetPath;
  ariaLabel: typeof COMPANION_LAUNCHER_ICON.ariaLabel;
  description: typeof COMPANION_LAUNCHER_ICON.description;
  presenceRingColor: typeof COMPANION_LAUNCHER_ICON.presenceRingColor;
};

export function getCompanionLauncherIconPath(): string {
  return COMPANION_LAUNCHER_ICON.assetPath;
}

export function getCompanionLauncherIconUrl(origin = ""): string {
  const normalizedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  return `${normalizedOrigin}${COMPANION_LAUNCHER_ICON.assetPath}`;
}

export function getCompanionLauncherIconEmbedConfig(origin: string): CompanionLauncherIconEmbedConfig {
  return {
    id: COMPANION_LAUNCHER_ICON.id,
    iconUrl: getCompanionLauncherIconUrl(origin),
    iconPath: COMPANION_LAUNCHER_ICON.assetPath,
    ariaLabel: COMPANION_LAUNCHER_ICON.ariaLabel,
    description: COMPANION_LAUNCHER_ICON.description,
    presenceRingColor: COMPANION_LAUNCHER_ICON.presenceRingColor,
  };
}
