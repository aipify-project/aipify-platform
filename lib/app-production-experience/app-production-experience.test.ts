import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyAppIdentity,
  filterProductionPresentableIdentities,
  isProductionPresentableIdentity,
} from "./identity-classification";
import { filterShowcaseByNotesOrTitle, isShowcaseTitle } from "./showcase-filter";
import {
  isAppRouteNavVisible,
  resolveAppRouteHref,
  resolveAppRouteReadiness,
} from "./route-readiness";

describe("app production experience — identity classification", () => {
  it("keeps real customer identities", () => {
    assert.equal(
      classifyAppIdentity({ email: "admin@unonight.com", fullName: "Unonight Admin" }),
      "REAL_CUSTOMER_DATA",
    );
    assert.equal(
      isProductionPresentableIdentity({ email: "admin@unonight.com", name: "Unonight Admin" }),
      true,
    );
  });

  it("excludes smoke, probe, invalid, and example identities", () => {
    assert.equal(
      classifyAppIdentity({
        email: "oaa-debug-3ffb0b44@aipify-gate.invalid",
        fullName: "oaa-debug-3ffb0b44",
      }),
      "QA_FIXTURE",
    );
    assert.equal(
      classifyAppIdentity({
        email: "oaa-direct-grant-probe-c69139fe@aipify-gate.invalid",
        fullName: "oaa-direct-grant-probe-c69139fe",
      }),
      "PROBE_DATA",
    );
    assert.equal(
      classifyAppIdentity({
        email: "p111c3a-smoke-viewer-a7f6860e@aipify-gate.invalid",
        fullName: "p111c3a-smoke-viewer-a7f6860e",
      }),
      "SMOKE_TEST",
    );
    assert.equal(classifyAppIdentity({ email: "analyst@example.com" }), "EXAMPLE_PLACEHOLDER");
  });

  it("filters member lists for production presentation", () => {
    const filtered = filterProductionPresentableIdentities([
      { id: "1", email: "admin@unonight.com", name: "Unonight Admin" },
      { id: "2", email: "oaa-gate-staff-a18abc0b@aipify-gate.invalid", name: "oaa-gate-staff-a18abc0b" },
      { id: "3", email: "analyst@example.com", name: "Analyst" },
    ]);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.email, "admin@unonight.com");
  });
});

describe("app production experience — showcase filter", () => {
  it("detects Phase 620 fixture titles", () => {
    assert.equal(isShowcaseTitle("Bright Fjord Marketing Studio — Full-service"), true);
    assert.equal(isShowcaseTitle("Improve onboarding time-to-value"), true);
    assert.equal(isShowcaseTitle("Customer renewal program"), false);
  });

  it("filters showcase rows from lists", () => {
    const filtered = filterShowcaseByNotesOrTitle([
      { title: "Improve onboarding time-to-value", notes: "ps620:goal:1" },
      { title: "Real customer goal", notes: null },
      { organization_name: "Nordic Ledger Partners AS", notes: "" },
    ]);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.title, "Real customer goal");
  });
});

describe("app production experience — route readiness", () => {
  it("hides placeholder profile and upgrade routes", () => {
    assert.equal(isAppRouteNavVisible("profile"), false);
    assert.equal(isAppRouteNavVisible("upgradeOptions"), false);
    assert.equal(resolveAppRouteReadiness("profile").status, "hidden");
  });

  it("hides foundation portal shells from customer nav", () => {
    assert.equal(isAppRouteNavVisible("appTasks"), false);
    assert.equal(isAppRouteNavVisible("workflows"), false);
    assert.equal(isAppRouteNavVisible("rolesPermissions"), false);
    assert.equal(isAppRouteNavVisible("contactSupport"), false);
    assert.equal(isAppRouteNavVisible("accountSecurity"), false);
    assert.equal(isAppRouteNavVisible("activityOverview"), false);
    assert.equal(isAppRouteNavVisible("apiAccess"), false);
  });

  it("redirects billing shells to settings billing", () => {
    assert.equal(resolveAppRouteHref("subscription", "/app/billing/subscription"), "/app/settings/billing");
    assert.equal(resolveAppRouteHref("paymentHistory", "/app/billing/payment-history"), "/app/settings/billing");
    assert.equal(isAppRouteNavVisible("subscription"), true);
  });

  it("keeps production routes visible by default", () => {
    assert.equal(isAppRouteNavVisible("teamMembers"), true);
    assert.equal(isAppRouteNavVisible("appDashboard"), true);
    assert.equal(isAppRouteNavVisible("softwareCatalog"), true);
  });
});
