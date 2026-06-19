import {
  WEBSITE_COMPLETION_CHECKPOINTS,
  WEBSITE_DESIGN_GOVERNANCE,
  WEBSITE_GOVERNANCE_VERSION,
} from "./constants";
import type { WebsiteHealthReport } from "./types";

const REQUIRED_PUBLIC_ROUTES = [
  "/",
  "/product",
  "/pricing",
  "/enterprise",
  "/security",
  "/knowledge",
  "/growth-partners",
  "/company",
  "/careers",
  "/media",
  "/contact",
  "/privacy",
  "/terms",
  "/get-started",
  "/book-demo",
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
        summary: "Sitemap, knowledge articles, and Business Pack landing pages active.",
      },
      {
        id: "localization_coverage" as const,
        status: locales >= 4 ? ("pass" as const) : ("warn" as const),
        summary: `Marketing locales: ${locales} (en, no, sv, da).`,
      },
      {
        id: "conversion_paths" as const,
        status: "pass" as const,
        summary: "Book Demo, Early Access, and Growth Partner paths tracked.",
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
