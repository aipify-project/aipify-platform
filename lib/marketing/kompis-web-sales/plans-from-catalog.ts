import {
  getWebsiteKompisPlan,
  WEBSITE_KOMPIS_PLAN_CATALOG,
} from "@/lib/website-kompis-plans/catalog";
import type { WebsiteKompisPlanDefinition } from "@/lib/website-kompis-plans/types";

/** Public sales page shows Free + Standard. Pro remains catalog-backed for honesty notes. */
export const KOMPIS_WEB_SALES_PAID_PLAN_ID = "standard" as const;
export const KOMPIS_WEB_SALES_PRO_PLAN_ID = "pro" as const;

export type KompisWebSalesPlanTruth = {
  free: WebsiteKompisPlanDefinition;
  paid: WebsiteKompisPlanDefinition;
  pro: WebsiteKompisPlanDefinition;
  freeAnswerQuota: 150;
  paidAnswerQuota: number;
  proAnswerQuota: number;
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
  const pro = getWebsiteKompisPlan(KOMPIS_WEB_SALES_PRO_PLAN_ID);

  if (free.answerQuota !== 150 || free.requiresCard !== false) {
    throw new Error("Kompis Web sales free plan contract drift");
  }
  if (!paid.monthlyPrice || !paid.annualPrice) {
    throw new Error("Kompis Web sales paid plan missing list prices");
  }
  if (pro.answerQuota !== 10000) {
    throw new Error("Kompis Web sales Pro quota contract drift");
  }
  if (
    paid.checkoutEnabled !== false ||
    free.checkoutEnabled !== false ||
    pro.checkoutEnabled !== false
  ) {
    throw new Error("Kompis Web sales must not advertise live checkout");
  }

  return {
    free,
    paid,
    pro,
    freeAnswerQuota: 150,
    paidAnswerQuota: paid.answerQuota,
    proAnswerQuota: pro.answerQuota,
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
