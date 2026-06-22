import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { emailAdapter } from "@/lib/aipify/execution/adapters";
import {
  buildActionDefinitionFromPolicy,
} from "./companion-action-definition";
import {
  createEmptyCompanionActionContext,
  normalizeCompanionActionContext,
} from "./companion-action-context";
import {
  companionActionExecutionAllowedInPhase10,
  companionActionExecutionAllowedInPhase11,
} from "./companion-action-governance";
import { buildCompanionActionPlan } from "./companion-action-plan";
import { isApprovalExpired } from "./companion-action-approval-resolver";
import { dispatchCompanionWriteAction } from "./companion-action-dispatch";
import {
  evaluateCompanionExecutionGate,
  hasCompanionExecutionIntent,
  isPhase11ForbiddenAction,
} from "./companion-action-execution-gate";
import {
  clearIdempotencyRegistryForTests,
  recordIdempotentExecution,
} from "./companion-action-idempotency";
import {
  executeCompanionAction,
  shouldAttemptCompanionExecution,
} from "./companion-action-execute";
import { buildCompanionExecutionAnswer } from "./execution-answer";

async function runPhase11Tests(): Promise<void> {
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
];

const sendEmailDefinition = buildActionDefinitionFromPolicy(policies[0], {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 3,
});

const baseActionContext = normalizeCompanionActionContext({
  companionCenterRaw: {
    has_access: true,
    execution_enabled: true,
    emergency_stop_active: false,
    automation_disabled: false,
    limits: {
      max_risk_level: "high",
      daily_action_limit: 100,
      business_hours_only: false,
      approval_threshold: "medium",
    },
    policies,
    pending_actions: [],
    receipts: [],
    audit_logs: [],
    cross_link_trust_approvals: "/app/approvals",
  },
  trustCenterRaw: { has_customer: true, emergency_state: "normal", pending_approvals: [] },
  approvalsCenterRaw: {
    approvals: [
      {
        id: "req-approved-1",
        status: "approved",
        category: "action",
        action_name: "send_email",
        risk_level: 2,
      },
    ],
  },
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

const approvedRecord = baseActionContext.approved_records.find(
  (record) => record.action_id === "send_email",
);
assert.ok(approvedRecord);

function buildPlan(overrides?: {
  rawInput?: Record<string, unknown>;
  organizationId?: string;
}) {
  return buildCompanionActionPlan({
    definition: sendEmailDefinition,
    actionContext: baseActionContext,
    organizationId: overrides?.organizationId ?? "org-1",
    requestedBy: "Alex",
    connectedProviders: ["communication"],
    effectivePermissions: ["communication.email.send"],
    rawInput: overrides?.rawInput,
  });
}

clearIdempotencyRegistryForTests();

assert.equal(companionActionExecutionAllowedInPhase10(), false);
assert.equal(companionActionExecutionAllowedInPhase11(), true);
assert.equal(hasCompanionExecutionIntent("please execute send email now"), true);
assert.equal(hasCompanionExecutionIntent("show email status"), false);
assert.equal(isPhase11ForbiddenAction("process_payment"), true);
assert.equal(shouldAttemptCompanionExecution("execute send email", buildPlan()), true);
assert.equal(
  shouldAttemptCompanionExecution("execute send email", {
    ...buildPlan(),
    approval_status: "prohibited",
  }),
  false,
);

const approvedPlan = buildPlan({
  rawInput: {
    action_id: "send_email",
    target: "support@example.com",
    idempotency_key: "idem-key-001",
  },
});

const approvedExecution = await executeCompanionAction({
  query: "execute send email to customer",
  definition: sendEmailDefinition,
  plan: { ...approvedPlan, source_reference: approvedRecord!.request_id },
  actionContext: baseActionContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
  supabase: null,
});

assert.equal(approvedExecution.status, "completed");
assert.equal(approvedExecution.action_id, "send_email");
assert.equal(approvedExecution.reversible, true);
assert.equal(approvedExecution.rollback_available, true);
assert.ok(approvedExecution.execution_id);
assert.ok(approvedExecution.completed_at);

clearIdempotencyRegistryForTests();

const missingApproval = await executeCompanionAction({
  query: "execute send email now",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-missing-approval",
    },
  }),
  actionContext: createEmptyCompanionActionContext({
    registry: baseActionContext.registry,
    execution_enabled: true,
    approved_records: [],
  }),
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});

assert.equal(missingApproval.status, "awaiting_approval");
assert.equal(missingApproval.error_code, "approval_missing");

const expiredRecord = {
  ...approvedRecord!,
  expires_at: new Date(Date.now() - 60_000).toISOString(),
};
assert.equal(isApprovalExpired(expiredRecord), true);

const expiredApproval = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-expired-approval",
    },
  }),
  actionContext: createEmptyCompanionActionContext({
    registry: baseActionContext.registry,
    execution_enabled: true,
    approved_records: [expiredRecord],
  }),
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});

assert.equal(expiredApproval.status, "blocked");
assert.equal(expiredApproval.error_code, "approval_expired");

const permissionDenied = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-permission-denied",
    },
  }),
  actionContext: baseActionContext,
  hasPermission: false,
  schemaValid: true,
  providerVerified: true,
});

assert.equal(permissionDenied.status, "blocked");
assert.equal(permissionDenied.error_code, "permission_denied");

const suspendedContext = createEmptyCompanionActionContext({
  registry: baseActionContext.registry,
  execution_enabled: true,
  app_suspended: true,
  approved_records: baseActionContext.approved_records,
});

const suspendedExecution = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-suspended-app",
    },
  }),
  actionContext: suspendedContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});

assert.equal(suspendedExecution.status, "blocked");
assert.equal(suspendedExecution.error_code, "app_suspended");

const invalidInputGate = evaluateCompanionExecutionGate({
  definition: sendEmailDefinition,
  plan: buildPlan({ rawInput: { action_id: "send_email", idempotency_key: "short" } }),
  actionContext: baseActionContext,
  approvedRecord: approvedRecord!,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
  executeIntent: true,
});

assert.equal(invalidInputGate.allowed, false);
if (!invalidInputGate.allowed) {
  assert.equal(invalidInputGate.reason, "idempotency_invalid");
}

recordIdempotentExecution("org-1", "idem-key-dup-001", "exec-existing");
const duplicatePlan = buildPlan({
  rawInput: {
    action_id: "send_email",
    target: "support@example.com",
    idempotency_key: "idem-key-dup-001",
  },
});

const duplicateExecution = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: duplicatePlan,
  actionContext: baseActionContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});

assert.equal(duplicateExecution.status, "blocked");
assert.equal(duplicateExecution.error_code, "duplicate_idempotency");

const originalExecute = emailAdapter.execute.bind(emailAdapter);
emailAdapter.execute = () => ({
  preview: "",
  valid: false,
  message: "Provider unavailable",
});
const providerFailure = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-provider-fail",
    },
  }),
  actionContext: baseActionContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});
emailAdapter.execute = originalExecute;

assert.equal(providerFailure.status, "failed");
assert.equal(providerFailure.error_code, "provider_failure");

emailAdapter.execute = () => ({
  preview: "",
  valid: true,
  executed: true,
  message: "partial delivery completed",
  rollback: true,
});
const partialExecution = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: buildPlan({
    rawInput: {
      action_id: "send_email",
      target: "support@example.com",
      idempotency_key: "idem-partial-001",
    },
  }),
  actionContext: baseActionContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
});
emailAdapter.execute = originalExecute;

assert.equal(partialExecution.status, "partially_completed");
assert.equal(partialExecution.rollback_available, true);
assert.ok(partialExecution.warnings.includes("partial_success"));

const auditSupabase = {
  rpc: async (name: string) => {
    assert.equal(name, "log_action_audit");
    return { data: "audit-ref-123", error: null };
  },
} as unknown as import("@supabase/supabase-js").SupabaseClient;

const auditedExecution = await executeCompanionAction({
  query: "execute send email",
  definition: sendEmailDefinition,
  plan: {
    ...buildPlan({
      rawInput: {
        action_id: "send_email",
        target: "support@example.com",
        idempotency_key: "idem-audit-001",
      },
    }),
    source_reference: "req-approved-1",
  },
  actionContext: baseActionContext,
  hasPermission: true,
  schemaValid: true,
  providerVerified: true,
  supabase: auditSupabase,
});

assert.equal(auditedExecution.audit_reference, "req-approved-1");

recordIdempotentExecution("org-tenant-a", "shared-idem-key-001", "exec-a");
assert.equal(
  evaluateCompanionExecutionGate({
    definition: sendEmailDefinition,
    plan: buildPlan({
      organizationId: "org-tenant-b",
      rawInput: {
        action_id: "send_email",
        target: "support@example.com",
        idempotency_key: "shared-idem-key-001",
      },
    }),
    actionContext: baseActionContext,
    approvedRecord: approvedRecord!,
    hasPermission: true,
    schemaValid: true,
    providerVerified: true,
    executeIntent: true,
  }).allowed,
  true,
);

const missingAdapter = dispatchCompanionWriteAction(
  { ...sendEmailDefinition, action_id: "unknown_write_action" },
  { action_id: "unknown_write_action" },
);
assert.equal(missingAdapter.ok, false);
if (!missingAdapter.ok) {
  assert.equal(missingAdapter.code, "missing_adapter");
}

const t = (key: string) => key;
const executionAnswer = buildCompanionExecutionAnswer(
  sendEmailDefinition,
  approvedExecution,
  baseActionContext,
  t,
  "en",
);
assert.ok(executionAnswer.directAnswer.includes("execution.lead"));
assert.ok(executionAnswer.explanation?.includes("execution.completedLine"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("executeCompanionAction"));
assert.ok(orchestratorSource.includes("companionActionExecutionAllowedInPhase11"));
assert.equal(/process_companion_action_request.*execute/i.test(orchestratorSource), false);

const phase11Files = [
  "companion-action-execution-result.ts",
  "companion-action-execution-gate.ts",
  "companion-action-dispatch.ts",
  "companion-action-execute.ts",
  "companion-action-idempotency.ts",
  "companion-action-approval-resolver.ts",
  "execution-answer.ts",
];

for (const file of phase11Files) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/canva|spotify/i.test(source), false, file);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"execution"'), locale);
  assert.ok(raw.includes("execution.gate.approval_missing") || raw.includes("approval_missing"), locale);
}

clearIdempotencyRegistryForTests();

console.log("phase11 companion runtime tests passed");
}

runPhase11Tests().catch((error) => {
  console.error(error);
  process.exit(1);
});
