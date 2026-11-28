/**
 * Product terminology helpers for ordinary APP surfaces.
 * Display names follow the Kompis/Buddy locale contract — never hardcode one language.
 */
import {
  kompisFamilyName,
  kompisProductDisplayName,
} from "@/lib/brand/kompis-buddy-display";

export function appProductTerminology(locale: string | null | undefined) {
  return {
    aipifyCompanion: "Aipify Companion",
    websiteKompis: kompisProductDisplayName("website_kompis", locale),
    kompis: kompisFamilyName(locale),
    commandBrief: "Command Brief",
    approvalCenter: "Approval Center",
    intelligenceCenter: "Intelligence Center",
  } as const;
}

/** @deprecated Prefer `appProductTerminology(locale)`. English (Buddy) defaults only. */
export const APP_PRODUCT_TERMINOLOGY = appProductTerminology("en");

export type AppProductTermKey = keyof typeof APP_PRODUCT_TERMINOLOGY;

/** Terms that must not be randomly aliased away from the locale contract. */
export const REGISTERED_PRODUCT_NAMES = new Set<string>([
  "Aipify Companion",
  "Website Kompis",
  "Website Buddy",
  "Kompis",
  "Buddy",
  "Command Brief",
  "Approval Center",
  "Intelligence Center",
]);
