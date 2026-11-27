import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CORE_VALIDATED_EVENTS,
  PRODUCT_ANALYTICS_EVENTS,
  sanitizeAnalyticsPagePath,
  sanitizeProductAnalyticsParams,
} from "./events";
import { buildPlatformAnalyticsOverview } from "@/lib/platform-analytics/overview";
import { parseAnalyticsPeriod } from "@/lib/platform-analytics/period";
import {
  resetGa4PageViewDedupForTests,
  sendGa4PageView,
  shouldSendGa4PageView,
} from "./page-view";
import { trackProductEvent } from "./track";
import type { Ga4Window } from "./ga4";
import { writeAnalyticsConsentCookie } from "./consent";

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

function read(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

async function main() {
  await test("event taxonomy includes required platform events", () => {
    for (const name of [
      "page_view",
      "sign_up",
      "login",
      "module_view",
      "module_activate",
      "trial_start",
      "begin_checkout",
      "purchase",
      "subscription_upgrade",
      "partner_referral_visit",
      "partner_application_submit",
      "academy_started",
      "academy_exam_completed",
    ]) {
      assert.ok((PRODUCT_ANALYTICS_EVENTS as readonly string[]).includes(name), name);
    }
  });

  await test("sanitize strips email-like and forbidden keys", () => {
    const safe = sanitizeProductAnalyticsParams({
      email: "a@b.com",
      plan_key: "business",
      note: "hello@world.com",
      value: 12,
      password: "secret",
    });
    assert.deepEqual(safe, { plan_key: "business", value: 12 });
  });

  await test("page path drops sensitive query params", () => {
    assert.equal(
      sanitizeAnalyticsPagePath("/register", "?ref=partner1&email=a@b.com&token=abc"),
      "/register?ref=partner1",
    );
  });

  await test("commercial events require coreValidated", () => {
    for (const name of CORE_VALIDATED_EVENTS) {
      assert.equal(trackProductEvent(name, { plan_key: "x" }, { coreValidated: false }), false);
    }
  });

  await test("page_view dedupes identical paths", () => {
    resetGa4PageViewDedupForTests();
    assert.equal(shouldSendGa4PageView("/app"), true);
    assert.equal(shouldSendGa4PageView("/app"), false);
    assert.equal(shouldSendGa4PageView("/app/settings"), true);
  });

  await test("page_view respects denied consent", () => {
    resetGa4PageViewDedupForTests();
    const calls: unknown[][] = [];
    const windowLike = {
      dataLayer: [],
      gtag: (...args: unknown[]) => {
        calls.push(args);
      },
    } as unknown as Ga4Window;
    assert.equal(
      sendGa4PageView("/pricing", "", { consent: "denied", windowLike, force: true }),
      false,
    );
    assert.equal(calls.length, 0);
  });

  await test("overview builder never invents metrics", () => {
    const period = parseAnalyticsPeriod("30d");
    const empty = buildPlatformAnalyticsOverview({
      metrics: null,
      metricsError: "missing",
      cspOverview: null,
      cspError: "missing",
      measurementIdConfigured: false,
      period,
      generatedAt: "2026-11-25T00:00:00.000Z",
    });
    for (const card of Object.values(empty.metrics)) {
      assert.equal(card.available, false);
      assert.equal(card.value, null);
    }

    const filled = buildPlatformAnalyticsOverview({
      metrics: {
        customers: { active: 12, total: 20, trial: 2, cancelled: 1 },
        revenue: { mrr: 5000, arr: 60000 },
        growth: { new_customers_30d: 3, most_used_modules: ["website_kompis"] },
        installations: { active: 8, total: 10 },
      },
      cspOverview: { approved_partners: 2, academy: { partners_in_academy: 1 } },
      measurementIdConfigured: true,
      period,
      generatedAt: "2026-11-25T00:00:00.000Z",
    });
    assert.equal(filled.metrics.activeAppCustomers.value, 12);
    assert.equal(filled.metrics.activeGrowthPartners.value, 2);
    assert.equal(filled.metrics.academyPartners.value, 1);
    assert.equal(filled.metrics.activeSubscriptions.available, false);
    assert.equal(filled.metrics.revenueArr.value, 60000);
    assert.deepEqual(filled.mostUsedModules, ["website_kompis"]);
    assert.equal(filled.ga4.measurementConfigured, true);
  });

  await test("wiring contracts: consent provider, SPA tracker, no double auto page_view", () => {
    const ga4 = read("lib/product-analytics/ga4.ts");
    const provider = read("components/analytics/AnalyticsConsentProvider.tsx");
    const access = read("app/api/partners-portal/access/route.ts");
    void access;
    assert.match(ga4, /send_page_view:\s*false/);
    assert.match(provider, /ProductAnalyticsPageViewTracker/);
    assert.match(read("components/auth/LoginForm.tsx"), /trackLogin/);
    assert.match(read("components/auth/RegistrationWizard.tsx"), /trackSignUp/);
    assert.match(read("components/partners-portal/CertifiedSalesPartnerExamPanel.tsx"), /trackAcademyStarted/);
    assert.match(
      read("components/marketing/CertifiedSalesPartnerRegistrationForm.tsx"),
      /trackPartnerApplicationSubmit/,
    );
    assert.match(read("app/api/platform/analytics/overview/route.ts"), /get_platform_metrics/);
    assert.match(read("app/platform/analytics/page.tsx"), /PlatformAnalyticsOverviewPanel/);
    // Avoid unused import warning for writeAnalyticsConsentCookie in lint-free runs
    assert.equal(typeof writeAnalyticsConsentCookie, "function");
  });

  console.log("product-analytics events matrix passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
