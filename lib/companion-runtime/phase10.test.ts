import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildActionDefinitionFromPolicy,
  createEmptyCompanionActionRegistry,
  validateCompanionActionInput,
} from "./companion-action-definition";
import {
  createEmptyCompanionActionContext,
  normalizeCompanionActionContext,
} from "./companion-action-context";
import {
  companionActionExecutionAllowedInPhase10,
  evaluateCompanionActionSafety,
  shouldAutoExecuteCompanionAction,
} from "./companion-action-governance";
import {
  hasCompanionActionIntent,
  matchCompanionActionQuery,
  shouldPreferReadPath,
} from "./companion-action-query-match";
import { buildCompanionActionPlan } from "./companion-action-plan";
import { buildCompanionActionApprovalRequiredAnswer } from "./action-answer";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const policies = [
  {
    id: "p1",
    policy_key: "send_email",
    policy_label: "Send email",
    category: "communication",
    allowed: true,
    requires_approval: true,
    prohibited: false,
    auto_approve_low_risk: false,
    workflow_type: "manager",
  },
  {
    id: "p2",
    policy_key: "delete_users",
    policy_label: "Delete users",
    category: "operations",
    allowed: false,
    requires_approval: true,
    prohibited: true,
    auto_approve_low_risk: false,
    workflow_type: "executive",
  },
];

const actionContext = normalizeCompanionActionContext({
  companionCenterRaw: {
    has_access: true,
    execution_enabled: true,
    emergency_stop_active: false,
    automation_disabled: false,
    limits: { max_risk_level: "high", daily_action_limit: 100, business_hours_only: false, approval_threshold: "medium" },
    policies,
    pending_actions: [],
    receipts: [{ audit_reference: "AUD-123", id: "r1", action_request_id: "a1", result_summary: "", duration_ms: 0, created_at: "", title: "" }],
    audit_logs: [],
    cross_link_trust_approvals: "/app/approvals",
  },
  trustCenterRaw: { has_customer: true, emergency_state: "normal", pending_approvals: [] },
  schemaContext: {
    entities: [],
    availableEntities: [],
    availableOperations: [],
    permissionDenied: false,
    appEntitlementBlocked: false,
    lastUpdatedAt: null,
  },
  businessPackContext: {
    packs: [],
    entitledCapabilities: [],
    enabledModules: [],
    appEntitlementBlocked: false,
    permissionDenied: false,
    lastUpdatedAt: null,
  },
  effectivePermissions: ["communication.email.send"],
  subscriptionStatus: "active",
});

const tenantContext = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  actionContext,
  writeActionsAvailable: true,
  effectivePermissions: ["communication.email.send"],
});

assert.equal(companionActionExecutionAllowedInPhase10(), false);
assert.equal(shouldAutoExecuteCompanionAction(), false);

const sendEmail = actionContext.registry.actions.find((action) => action.action_id === "send_email");
assert.ok(sendEmail);
assert.equal(sendEmail?.approval_required, true);

const deleteUsers = actionContext.registry.actions.find((action) => action.action_id === "delete_users");
assert.ok(deleteUsers);
assert.equal(deleteUsers?.enabled, false);
assert.equal(deleteUsers?.risk_level, 4);

const match = matchCompanionActionQuery("please send email response to customer", tenantContext);
assert.ok(match);
assert.equal(match?.definition.action_id, "send_email");

assert.equal(shouldPreferReadPath("show connection status", match), true);
assert.equal(hasCompanionActionIntent("create meeting invite"), true);

const validation = validateCompanionActionInput(sendEmail!, { action_id: "send_email", target: "support@example.com" });
assert.equal(validation.ok, true);

const plan = buildCompanionActionPlan({
  definition: sendEmail!,
  actionContext,
  organizationId: "org-1",
  requestedBy: "Alex",
  effectivePermissions: ["communication.email.send"],
  connectedProviders: ["demo_provider"],
});
assert.equal(plan.approval_status, "pending");
assert.equal(plan.approval_required, true);
assert.ok(plan.created_at);

const blockedSafety = evaluateCompanionActionSafety(deleteUsers!, actionContext);
assert.equal(blockedSafety.blocked, true);
assert.equal(blockedSafety.reason, "critical_prohibited");

const suspendedContext = createEmptyCompanionActionContext({
  registry: actionContext.registry,
  app_suspended: true,
});
const suspendedSafety = evaluateCompanionActionSafety(sendEmail!, suspendedContext);
assert.equal(suspendedSafety.blocked, true);
assert.equal(suspendedSafety.reason, "entitlement_blocked");

const missingPolicyContext = createEmptyCompanionActionContext({
  registry: createEmptyCompanionActionRegistry({
    actions: [sendEmail!],
    enabledActions: [],
  }),
  missing_policy: true,
});

const t = (key: string) => key;
const approvalAnswer = buildCompanionActionApprovalRequiredAnswer(
  sendEmail!,
  plan,
  actionContext,
  t,
  "en",
);
assert.ok(approvalAnswer.directAnswer.includes("approvalRequiredLead"));
assert.equal(approvalAnswer.actions.length, 1);
assert.equal(approvalAnswer.actions[0]?.href, "/app/approvals");

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
const orchestrateSection =
  orchestratorSource.split("export async function orchestrateCompanionSearch")[1] ?? "";
assert.ok(orchestrateSection.includes("resolveCompanionActionAnswer"));
assert.ok(
  orchestrateSection.indexOf("resolveCompanionActionAnswer") <
    orchestrateSection.indexOf("resolveLiveToolAnswer"),
);
assert.equal(/process_companion_action_request.*execute/i.test(orchestratorSource), false);

const coreFiles = [
  "companion-action-definition.ts",
  "companion-action-context.ts",
  "companion-action-governance.ts",
  "companion-action-plan.ts",
  "action-answer.ts",
  "companion-action-query-match.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/canva|spotify/i.test(source), false, file);
  assertCoreSourceFreeOfCustomerPilotNames(source, file);
  assert.equal(/process_companion_action_request/i.test(source), false, file);
}

const policyDefinition = buildActionDefinitionFromPolicy(policies[0], {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 3,
});
assert.equal(policyDefinition.enabled, true);

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"actions"'), locale);
  assert.ok(raw.includes("blockReason"), locale);
}

console.log("phase10 companion runtime tests passed");
