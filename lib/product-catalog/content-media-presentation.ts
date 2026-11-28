/**
 * Map Core approved content onto APP/SALE presentation without inventing copy/URLs.
 * Short-lived signed URLs are resolved by API/helpers — never stored as catalog truth.
 */

import {
  applyApprovedContentToPresentation,
  type ApprovedProductContent,
} from "./locale-media-core";
import { isProductMediaPath } from "./product-media-storage-contract";
import type { UnifiedCatalogProduct } from "./types";

/** Public static assets only — private Storage paths must never become img src. */
export function isPublicCatalogAsset(src: string | null | undefined): boolean {
  if (!src) return false;
  const value = src.trim();
  if (!value) return false;
  if (isProductMediaPath(value)) return false;
  if (value.startsWith("products/")) return false;
  return value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://");
}

export function overlayApprovedProductPresentation(input: {
  title: string;
  tagline: string;
  description: string;
  logoSrc: string | null;
  heroImagePath: string | null;
  approved: ApprovedProductContent | null;
}): {
  title: string;
  tagline: string;
  description: string;
  logoSrc: string | null;
  heroImagePath: string | null;
  logoPath: string | null;
  heroPath: string | null;
  benefits: string[];
  contentSource: "core" | "registry_fallback";
  localeApproved: boolean;
} {
  const merged = applyApprovedContentToPresentation({
    title: input.title,
    tagline: input.tagline,
    description: input.description,
    logoSrc: input.logoSrc,
    heroImagePath: input.heroImagePath,
    content: input.approved,
  });
  return {
    ...merged,
    localeApproved: Boolean(
      input.approved && !input.approved.contentMissing && input.approved.title,
    ),
  };
}

export type EnrichedCatalogProduct = UnifiedCatalogProduct & {
  benefits: string[];
  contentSource: "core" | "registry_fallback";
};

/**
 * Apply approved Core content + optional signed media URLs to one catalog product.
 * Missing Core content stays missing (registry copy only). Missing signed media → letter/empty.
 */
export function enrichUnifiedCatalogProduct(input: {
  product: UnifiedCatalogProduct;
  approved: ApprovedProductContent | null;
  signedLogoUrl?: string | null;
  signedHeroUrl?: string | null;
}): EnrichedCatalogProduct {
  const overlay = overlayApprovedProductPresentation({
    title: input.product.title,
    tagline: input.product.tagline,
    description: input.product.description,
    logoSrc: input.product.logoSrc,
    heroImagePath: input.product.heroImagePath,
    approved: input.approved,
  });

  const logoSrc =
    overlay.contentSource === "core"
      ? input.signedLogoUrl ?? null
      : isPublicCatalogAsset(overlay.logoSrc)
        ? overlay.logoSrc
        : null;
  const heroImagePath =
    overlay.contentSource === "core"
      ? input.signedHeroUrl ?? null
      : isPublicCatalogAsset(overlay.heroImagePath)
        ? overlay.heroImagePath
        : null;

  return {
    ...input.product,
    title: overlay.title,
    tagline: overlay.tagline,
    description: overlay.description,
    localeApproved: overlay.localeApproved,
    logoSrc,
    heroImagePath,
    benefits: overlay.benefits,
    contentSource: overlay.contentSource,
  };
}
