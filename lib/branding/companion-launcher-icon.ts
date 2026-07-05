import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import {
  DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
  getCompanionLauncherIconUrlForVariant,
  getCompanionLauncherIconVariantDefinition,
  listCompanionLauncherIconVariants,
  resolveCompanionLauncherIconVariant,
  type CompanionLauncherIconVariantDefinition,
  type CompanionLauncherIconVariantKey,
} from "@/lib/branding/companion-launcher-icons";

const defaultDefinition = getCompanionLauncherIconVariantDefinition(
  DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
);

/** Canonical Website Kompis / Companion launcher icon — purple connected-node mark + mint presence ring. */
export const COMPANION_LAUNCHER_ICON = {
  id: defaultDefinition.id,
  assetPath: defaultDefinition.iconPath,
  sourceAssetPath: defaultDefinition.sourceAssetPath,
  description: defaultDefinition.description,
  ariaLabel: defaultDefinition.ariaLabel,
  presenceRingColor: defaultDefinition.presenceRingColor,
  symbolGradientFrom: AIPIFY_BRAND.pulse.colors.gradientFrom,
  symbolGradientTo: AIPIFY_BRAND.pulse.colors.gradientTo,
} as const;

export type CompanionLauncherIconEmbedConfig = {
  id: string;
  iconUrl: string;
  iconPath: string;
  ariaLabel: string;
  description: string;
  presenceRingColor: string;
  defaultVariant: CompanionLauncherIconVariantKey;
  selectedVariant: CompanionLauncherIconVariantKey;
  variants: CompanionLauncherIconVariantPublicMetadata[];
};

export type CompanionLauncherIconVariantPublicMetadata = Pick<
  CompanionLauncherIconVariantDefinition,
  | "id"
  | "iconPath"
  | "ariaLabel"
  | "description"
  | "presenceRingColor"
  | "recommendedSurface"
> & {
  variantKey: CompanionLauncherIconVariantKey;
  iconUrl: string;
};

export type GetCompanionLauncherIconEmbedConfigOptions = {
  /** Optional variant key; invalid values fall back to default. */
  variant?: string | null;
};

function toVariantPublicMetadata(
  origin: string,
  definition: CompanionLauncherIconVariantDefinition,
): CompanionLauncherIconVariantPublicMetadata {
  return {
    variantKey: definition.variantKey,
    id: definition.id,
    iconUrl: getCompanionLauncherIconUrlForVariant(origin, definition.variantKey),
    iconPath: definition.iconPath,
    ariaLabel: definition.ariaLabel,
    description: definition.description,
    presenceRingColor: definition.presenceRingColor,
    recommendedSurface: definition.recommendedSurface,
  };
}

export function getCompanionLauncherIconPath(
  variantKey: CompanionLauncherIconVariantKey = DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
): string {
  return getCompanionLauncherIconVariantDefinition(variantKey).iconPath;
}

export function getCompanionLauncherIconUrl(
  origin: string,
  variantKey: CompanionLauncherIconVariantKey = DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
): string {
  return getCompanionLauncherIconUrlForVariant(origin, variantKey);
}

export function getCompanionLauncherIconEmbedConfig(
  origin: string,
  options: GetCompanionLauncherIconEmbedConfigOptions = {},
): CompanionLauncherIconEmbedConfig {
  const selectedVariant = resolveCompanionLauncherIconVariant(options.variant);
  const selected = getCompanionLauncherIconVariantDefinition(selectedVariant);

  return {
    id: selected.id,
    iconUrl: getCompanionLauncherIconUrlForVariant(origin, selectedVariant),
    iconPath: selected.iconPath,
    ariaLabel: selected.ariaLabel,
    description: selected.description,
    presenceRingColor: selected.presenceRingColor,
    defaultVariant: DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
    selectedVariant,
    variants: listCompanionLauncherIconVariants().map((definition) =>
      toVariantPublicMetadata(origin, definition),
    ),
  };
}
