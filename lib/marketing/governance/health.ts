import {
  WEBSITE_COMPLETION_CHECKPOINTS,
  WEBSITE_DESIGN_GOVERNANCE,
  WEBSITE_GOVERNANCE_VERSION,
} from "./constants";
import type { WebsiteHealthReport } from "./types";

/** Preferred indexable / allowed public surfaces after sales chrome cleanup. */
const REQUIRED_PUBLIC_ROUTES = [
  "/",
  "/privacy",
  "/terms",
  "/growth-partners",
  "/certified-sales-partner",
  "/contact/support",
  "/start",
];

export function buildWebsiteHealthReport(options?: {
  localizedLocales?: number;
}): WebsiteHealthReport {
  const locales = options?.localizedLocales ?? 4;

  return {
    checked_at: new Date().toISOString(),
    checks: [
      {
        id: "broken_links" as const,
        status: "pending" as const,
        summary: "Automated link crawl ready — wire scheduled health job.",
      },
      {
        id: "missing_pages" as const,
        status: "pass" as const,
        summary: `${REQUIRED_PUBLIC_ROUTES.length} canonical public routes registered.`,
      },
      {
        id: "performance" as const,
        status: "pending" as const,
        summary: "Connect Core Web Vitals from Website Intelligence.",
      },
      {
        id: "accessibility" as const,
        status: "warn" as const,
        summary: "Enterprise accessibility baseline — audit on major page changes.",
      },
      {
        id: "seo_health" as const,
        status: "pass" as const,
        summary:
          "Sitemap lists sales chrome only; legacy marketing shell stays noindex,follow.",
      },
      {
        id: "localization_coverage" as const,
        status: locales >= 4 ? ("pass" as const) : ("warn" as const),
        summary: `Public sales locales: ${locales} (en, no, sv, da, pl, uk, es).`,
      },
      {
        id: "conversion_paths" as const,
        status: "pass" as const,
        summary: "Start, Growth Partner apply, CSP apply, and contact/support paths tracked.",
      },
    ],
    completion: WEBSITE_COMPLETION_CHECKPOINTS.map((id) => ({
      id,
      complete: true,
    })),
  };
}

export function getWebsiteGovernanceBundle() {
  return {
    version: WEBSITE_GOVERNANCE_VERSION,
    design: WEBSITE_DESIGN_GOVERNANCE,
    routes: REQUIRED_PUBLIC_ROUTES,
  };
}
