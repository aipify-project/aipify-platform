/**
 * APP product activation journey — registration → catalog → entitlement → setup.
 * Feature owner: CUSTOMER APP. Reuses existing routes; no parallel license registry.
 */

import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  APP_SOFTWARE_STORE_ROUTE,
  APP_SUBSCRIPTION_ROUTE,
  appSoftwareDetailHref,
  type AppProductAccessState,
} from "./app-customer-journey";

export type ProductActivationStepId =
  | "explore_catalog"
  | "product_detail"
  | "subscription"
  | "support"
  | "web_connection"
  | "web_knowledge"
  | "web_settings"
  | "bedrift_connection"
  | "bedrift_employees"
  | "bedrift_knowledge"
  | "bedrift_settings"
  | "open_product";

export type ProductActivationStep = {
  id: ProductActivationStepId;
  href: string;
};

/** Free account ≠ paid entitlement — catalog browse is always allowed. */
export const PRODUCT_ACTIVATION_FREE_ACCOUNT_RULES = {
  catalogBrowseRequiresLicense: false,
  operationalWebRequiresLicense: true,
  operationalBedriftRequiresLicense: true,
  checkoutLive: false,
} as const;

export function appSoftwareLicensedScopeHref(): string {
  return `${APP_SOFTWARE_STORE_ROUTE}?scope=licensed`;
}

export function parseSoftwareCatalogScope(
  value: string | string[] | undefined,
): "all" | "licensed" {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().toLowerCase() === "licensed" ? "licensed" : "all";
}

/**
 * Next honest destinations after access is known.
 * Never invents checkout success or entitlement.
 */
export function resolveProductActivationNextSteps(input: {
  productKey: string;
  accessState: AppProductAccessState;
  openHref: string | null;
}): ProductActivationStep[] {
  const key = input.productKey.trim().toLowerCase();
  const steps: ProductActivationStep[] = [];

  if (input.accessState === "active") {
    if (input.openHref) {
      steps.push({ id: "open_product", href: input.openHref });
    }
    if (key === "kompis_web") {
      steps.push(
        { id: "web_connection", href: FOUNDATION_NAV_BINDINGS.kompisWebConnection },
        { id: "web_knowledge", href: FOUNDATION_NAV_BINDINGS.kompisWebFaq },
        { id: "web_settings", href: FOUNDATION_NAV_BINDINGS.kompisWebSettings },
      );
    } else if (key === "kompis_bedrift") {
      steps.push(
        { id: "bedrift_connection", href: FOUNDATION_NAV_BINDINGS.kompisBedriftConnection },
        { id: "bedrift_employees", href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees },
        { id: "bedrift_knowledge", href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq },
        { id: "bedrift_settings", href: FOUNDATION_NAV_BINDINGS.kompisBedriftSettings },
      );
    }
    steps.push({ id: "subscription", href: APP_SUBSCRIPTION_ROUTE });
    steps.push({ id: "support", href: FOUNDATION_NAV_BINDINGS.supportTickets });
    return steps;
  }

  steps.push({ id: "product_detail", href: appSoftwareDetailHref(key) });
  steps.push({ id: "explore_catalog", href: APP_SOFTWARE_STORE_ROUTE });
  steps.push({ id: "subscription", href: APP_SUBSCRIPTION_ROUTE });
  steps.push({ id: "support", href: FOUNDATION_NAV_BINDINGS.supportTickets });
  return steps;
}

/** Resume after registration — product choice before paid rights. */
export function resolvePostRegistrationActivationHref(input: {
  hasAnyEntitlement: boolean;
  preferredProductKey?: string | null;
}): string {
  if (input.hasAnyEntitlement && input.preferredProductKey) {
    const key = input.preferredProductKey.trim().toLowerCase();
    if (key === "kompis_web") return FOUNDATION_NAV_BINDINGS.kompisWebDashboard;
    if (key === "kompis_bedrift") return FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard;
    return appSoftwareDetailHref(key);
  }
  if (input.hasAnyEntitlement) return appSoftwareLicensedScopeHref();
  return APP_SOFTWARE_STORE_ROUTE;
}
