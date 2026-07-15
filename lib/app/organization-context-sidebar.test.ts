import assert from "node:assert/strict";
import {
  isRealOrganizationMissingState,
  isTransientOrganizationContext,
  resolveProfileOrganizationFallback,
  resolveSidebarOrganizationDisplay,
  resolveSidebarPhaseAfterFetch,
  shouldRetryOrganizationContextFetch,
} from "@/lib/app/organization-context-sidebar";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

const LABELS = {
  contextLoading: "Loading organization context…",
  contextUnavailable: "Could not load organization context. Refresh the page.",
  organizationMissing: "Organization context missing",
  notAssigned: "Not assigned",
  statusActive: "Active",
  statusGrace: "Grace period",
  statusPaused: "Paused",
};

function readyContext(overrides: Partial<AppOrganizationContext> = {}): AppOrganizationContext {
  return {
    authenticated: true,
    state: "ready",
    user_role: "owner",
    organization_role: "owner",
    company_id: "company-1",
    customer_id: "customer-1",
    organization_id: "org-1",
    workspace_name: "Customer Org",
    licensed_to: "Customer Org",
    plan_name: "Business",
    license_status: "active",
    has_customer: true,
    has_organization_membership: true,
    has_app_access: true,
    can_access_self_support: true,
    eligible_organization_count: null,
    ...overrides,
  };
}

console.log("organization-context-sidebar.test.ts");

assert.equal(isRealOrganizationMissingState("membership_missing"), true);
assert.equal(isRealOrganizationMissingState("ready"), false);

assert.equal(
  isTransientOrganizationContext(
    readyContext({ state: "access_denied", has_organization_membership: true }),
  ),
  true,
);

assert.deepEqual(resolveProfileOrganizationFallback({ companyName: "Unonight", isPlatform: false }), {
  workspaceName: "Unonight",
  licensedTo: "Unonight",
});
assert.equal(resolveProfileOrganizationFallback({ companyName: "Aipify Group AS", isPlatform: true }), null);

const loadingDisplay = resolveSidebarOrganizationDisplay({
  phase: "loading",
  context: null,
  profileFallback: null,
  labels: LABELS,
});
assert.equal(loadingDisplay.workspaceName, LABELS.contextLoading);
assert.equal(loadingDisplay.licensedTo, LABELS.contextLoading);

const readyDisplay = resolveSidebarOrganizationDisplay({
  phase: "ready",
  context: readyContext(),
  profileFallback: null,
  labels: LABELS,
});
assert.equal(readyDisplay.workspaceName, "Customer Org");
assert.equal(readyDisplay.licensedTo, "Customer Org");
assert.equal(readyDisplay.statusLabel, LABELS.statusActive);

const degradedReady = resolveSidebarPhaseAfterFetch({
  fetchResult: { ok: false, reason: "http" },
  context: null,
  profileFallback: { companyName: "Customer Org", isPlatform: false },
});
assert.equal(degradedReady, "ready");

const transientPhase = resolveSidebarPhaseAfterFetch({
  fetchResult: { ok: false, reason: "http" },
  context: null,
  profileFallback: null,
});
assert.equal(transientPhase, "transient_error");

assert.equal(
  resolveSidebarPhaseAfterFetch({
    fetchResult: { ok: true, context: readyContext({ state: "membership_missing" }) },
    context: readyContext({ state: "membership_missing" }),
    profileFallback: { companyName: "Customer Org", isPlatform: false },
  }),
  "organization_missing",
);

const selectionRequiredContext = readyContext({
  state: "selection_required",
  eligible_organization_count: 2,
});
assert.equal(isRealOrganizationMissingState("selection_required"), true);
assert.equal(isTransientOrganizationContext(selectionRequiredContext), false);
assert.equal(
  resolveSidebarPhaseAfterFetch({
    fetchResult: { ok: true, context: selectionRequiredContext },
    context: selectionRequiredContext,
    profileFallback: { companyName: "Customer Org", isPlatform: false },
  }),
  "organization_missing",
);

assert.equal(
  shouldRetryOrganizationContextFetch({
    fetchResult: { ok: false, reason: "http" },
    context: null,
    attemptIndex: 0,
    maxAttempts: 3,
  }),
  true,
);

const profileOnlyDisplay = resolveSidebarOrganizationDisplay({
  phase: "ready",
  context: null,
  profileFallback: { companyName: "Customer Org", isPlatform: false },
  labels: LABELS,
});
assert.equal(profileOnlyDisplay.workspaceName, "Customer Org");
assert.equal(profileOnlyDisplay.licensedTo, "Customer Org");
assert.notEqual(profileOnlyDisplay.licensedTo, "Aipify Group AS");

console.log("organization-context-sidebar.test.ts: all assertions passed");
