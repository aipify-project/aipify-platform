import {
  getWebsiteKompisPlan,
  WEBSITE_KOMPIS_PLAN_CATALOG,
} from "@/lib/website-kompis-plans/catalog";
import type { WebsiteKompisPlanDefinition } from "@/lib/website-kompis-plans/types";

/** Public sales page shows Free + one paid plan (Standard). Pro stays in catalog only. */
export const KOMPIS_WEB_SALES_PAID_PLAN_ID = "standard" as const;

export type KompisWebSalesPlanTruth = {
  free: WebsiteKompisPlanDefinition;
  paid: WebsiteKompisPlanDefinition;
  freeAnswerQuota: 150;
  paidAnswerQuota: number;
  paidMonthlyDisplay: string;
  paidAnnualDisplay: string;
  paidCurrency: "NOK";
  freeRequiresCard: false;
  checkoutEnabled: false;
  offerStatus: "planned";
};

export function getKompisWebSalesPlanTruth(): KompisWebSalesPlanTruth {
  const free = getWebsiteKompisPlan("free");
  const paid = getWebsiteKompisPlan(KOMPIS_WEB_SALES_PAID_PLAN_ID);

  if (free.answerQuota !== 150 || free.requiresCard !== false) {
    throw new Error("Kompis Web sales free plan contract drift");
  }
  if (!paid.monthlyPrice || !paid.annualPrice) {
    throw new Error("Kompis Web sales paid plan missing list prices");
  }
  if (paid.checkoutEnabled !== false || free.checkoutEnabled !== false) {
    throw new Error("Kompis Web sales must not advertise live checkout");
  }

  return {
    free,
    paid,
    freeAnswerQuota: 150,
    paidAnswerQuota: paid.answerQuota,
    paidMonthlyDisplay: paid.monthlyPrice.amountDisplay,
    paidAnnualDisplay: paid.annualPrice.amountDisplay,
    paidCurrency: "NOK",
    freeRequiresCard: false,
    checkoutEnabled: false,
    offerStatus: "planned",
  };
}

export function assertSalesPlansStayInCatalog(): void {
  const ids = WEBSITE_KOMPIS_PLAN_CATALOG.map((p) => p.id);
  if (!ids.includes("free") || !ids.includes(KOMPIS_WEB_SALES_PAID_PLAN_ID)) {
    throw new Error("Kompis Web sales plans missing from catalog");
  }
}
