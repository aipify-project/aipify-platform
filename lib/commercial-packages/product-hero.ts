/**
 * Product-agnostic hero tiles for APP subscription / products surfaces.
 * Logo + name + descriptor — no invented AI product scenes.
 * Swap logoSrc later when approved brand assets land under /public/brand.
 */

import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { KompisProductAccessRead } from "./portfolio-presentation";

export type WorkspaceProductId = "kompis_web" | "kompis_bedrift" | "sales_partner";

export type WorkspaceProductHero = {
  id: WorkspaceProductId;
  /** Public brand mark under /public when available; null → letter mark. */
  logoSrc: string | null;
  accent: "violet" | "indigo" | "emerald";
  letter: string;
};

export const WORKSPACE_PRODUCT_HEROES: Record<WorkspaceProductId, WorkspaceProductHero> = {
  kompis_web: {
    id: "kompis_web",
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    accent: "violet",
    letter: "W",
  },
  kompis_bedrift: {
    id: "kompis_bedrift",
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    accent: "indigo",
    letter: "B",
  },
  sales_partner: {
    id: "sales_partner",
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    accent: "emerald",
    letter: "P",
  },
};

export type ProductCardStatus =
  | "active"
  | "not_active"
  | "not_licensed"
  | "under_review"
  | "planned"
  | "available"
  | "unknown";

export type ProductCardPrimaryAction =
  | "open"
  | "view"
  | "upgrade"
  | "buy"
  | "add_module"
  | "contact"
  | "none";

export type WorkspaceProductCardModel = {
  id: WorkspaceProductId;
  hero: WorkspaceProductHero;
  status: ProductCardStatus;
  /** Mine produkter when true; otherwise Tilgjengelige produkter. */
  inMyProducts: boolean;
  openHref: string | null;
  primaryAction: ProductCardPrimaryAction;
  /** Optional plan chip for Kompis Web when a real plan is assigned. */
  planChip: "free" | "standard" | "pro" | null;
};

export function productHeroAccentClass(accent: WorkspaceProductHero["accent"]): string {
  if (accent === "indigo") {
    return "from-[#EEF2FF] via-[#F5F3FF] to-[#F8FAFC]";
  }
  if (accent === "emerald") {
    return "from-[#ECFDF5] via-[#F0FDF4] to-[#F8FAFC]";
  }
  return "from-[#F5F3FF] via-[#FAF5FF] to-[#F8FAFC]";
}

/**
 * Build product cards from authoritative access reads.
 * Never invent Active for products without known entitlement.
 * Sales Partner has no APP entitlement read yet → under_review + contact.
 */
export function buildWorkspaceProductCards(
  access: KompisProductAccessRead
): WorkspaceProductCardModel[] {
  const webActive = access.webKind === "known_plan" && Boolean(access.webPlan);
  const webInWorkspace =
    webActive || access.webKind === "unknown_plan" || access.webKind === "no_module";

  let webStatus: ProductCardStatus = "unknown";
  if (webActive) webStatus = "active";
  else if (access.webKind === "unknown_plan") webStatus = "available";
  else if (access.webKind === "no_module") webStatus = "not_licensed";
  else if (access.webKind === "unauthenticated" || access.webKind === "unavailable") {
    webStatus = "unknown";
  }

  const bedriftActive = access.bedrift === "licensed";
  let bedriftStatus: ProductCardStatus = "unknown";
  if (bedriftActive) bedriftStatus = "active";
  else if (access.bedrift === "not_licensed") bedriftStatus = "not_licensed";

  const web: WorkspaceProductCardModel = {
    id: "kompis_web",
    hero: WORKSPACE_PRODUCT_HEROES.kompis_web,
    status: webStatus,
    inMyProducts: webInWorkspace || webActive,
    openHref: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
    primaryAction: webActive ? "open" : webStatus === "not_licensed" ? "contact" : "view",
    planChip: webActive ? access.webPlan : null,
  };

  const bedrift: WorkspaceProductCardModel = {
    id: "kompis_bedrift",
    hero: WORKSPACE_PRODUCT_HEROES.kompis_bedrift,
    status: bedriftStatus,
    inMyProducts: bedriftActive || access.bedrift !== "unknown",
    openHref: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
    primaryAction: bedriftActive
      ? "open"
      : bedriftStatus === "not_licensed"
        ? "contact"
        : "view",
    planChip: null,
  };

  const salesPartner: WorkspaceProductCardModel = {
    id: "sales_partner",
    hero: WORKSPACE_PRODUCT_HEROES.sales_partner,
    status: "under_review",
    inMyProducts: false,
    openHref: null,
    primaryAction: "contact",
    planChip: null,
  };

  return [web, bedrift, salesPartner];
}
