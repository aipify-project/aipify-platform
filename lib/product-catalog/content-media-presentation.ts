/**
 * Map Core approved content onto APP/SALE presentation without inventing copy/URLs.
 * Short-lived signed URLs are resolved by API routes — not stored in the catalog VM.
 */

import {
  applyApprovedContentToPresentation,
  type ApprovedProductContent,
} from "./locale-media-core";

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
    localeApproved: Boolean(input.approved && !input.approved.contentMissing && input.approved.title),
  };
}
