import {
  getKompisAiRuntimeStatus,
  requestKompisAiPlan,
  type KompisAiPlanCandidate,
  type KompisAiProviderStatus,
} from "./ai-runtime";
import { createKompisOperatorIdempotencyKey } from "./ids";
import {
  getKompisOperatorTool,
  isKompisOperatorToolKey,
  type KompisOperatorRiskClass,
  type KompisOperatorToolKey,
} from "./tools-registry";

export { createKompisOperatorIdempotencyKey } from "./ids";
export type KompisOperatorPlanStep = {
  sequence: number;
  toolKey: KompisOperatorToolKey;
  toolVersion: string;
  purpose: string;
  riskClass: KompisOperatorRiskClass;
  requiresApproval: boolean;
  safeInput: Record<string, unknown>;
};

export type KompisOperatorPlan = {
  intent: string;
  title: string;
  userSummary: string;
  riskClass: KompisOperatorRiskClass;
  requiresApproval: boolean;
  confidence: "high" | "medium" | "low";
  steps: KompisOperatorPlanStep[];
  unavailableReason?: string;
  blockedReasonCode?: string;
  plannerSource: "deterministic" | "ai" | "ai_fallback";
  providerStatus: KompisAiProviderStatus;
};

const MAX_STEPS = 5;
export const PLANNER_VERSION = "planner_v2";

type IntentRule = {
  intent: string;
  title: string;
  summary: string;
  patterns: RegExp[];
  tools: KompisOperatorToolKey[];
  critical?: boolean;
  confidence?: "high" | "medium" | "low";
  safeInput?: Record<string, unknown>;
};

const RULES: IntentRule[] = [
  {
    intent: "critical_forbidden",
    title: "Critical action",
    summary: "This request asks for a critical change that Kompis cannot execute in V2.",
    patterns: [
      /slett/i,
      /delete/i,
      /betal/i,
      /payment/i,
      /stripe/i,
      /fiken/i,
      /dns/i,
      /domeneendr/i,
      /change\s*domain/i,
      /roter.*nøkkel/i,
      /rotate.*key/i,
      /suspender/i,
      /revoke/i,
      /mfa/i,
      /totp/i,
      /passord/i,
      /password/i,
      /publiser/i,
      /publish/i,
    ],
    tools: [],
    critical: true,
    confidence: "high",
  },
  {
    intent: "create_support_case",
    title: "Create a support case",
    summary: "Create a support case for this organization after approval.",
    patterns: [/opprett.*supportsak/i, /create.*support\s*case/i, /ny\s*supportsak/i],
    tools: ["support_case_create"],
    safeInput: { channel: "admin_inbox", priority: "medium" },
  },
  {
    intent: "draft_support_case",
    title: "Draft a support case",
    summary: "Prepare a support-case draft without sending.",
    patterns: [
      /utkast.*supportsak/i,
      /utkast.*support/i,
      /draft.*support/i,
      /supportsak.*utkast/i,
      /support.*draft/i,
    ],
    tools: ["content_draft_create"],
    safeInput: { kind: "support_case_draft" },
  },
  {
    intent: "draft_profile_change",
    title: "Draft a profile change",
    summary: "Prepare an organization profile change draft without publishing it.",
    patterns: [/utkast.*profil/i, /draft.*profile/i, /endre.*profil/i, /profile\s*draft/i],
    tools: ["organization_profile_draft"],
  },
  {
    intent: "draft_content",
    title: "Create a content draft",
    summary: "Create an organization content draft without publishing.",
    patterns: [/innholdsutkast/i, /content\s*draft/i, /utkast.*innhold/i],
    tools: ["content_draft_create"],
  },
  {
    intent: "draft_knowledge",
    title: "Create a knowledge draft",
    summary: "Create a knowledge draft that stays unpublished.",
    patterns: [/kunnskapsutkast/i, /knowledge\s*draft/i, /utkast.*kunnskap/i],
    tools: ["knowledge_draft_create"],
  },
  {
    intent: "mark_notification_read",
    title: "Mark notification as read",
    summary: "Mark one of your notifications as read after approval.",
    patterns: [/marker.*lest/i, /mark.*read/i],
    tools: ["notification_mark_read"],
  },
  {
    intent: "knowledge_search",
    title: "Search authorized knowledge",
    summary: "Search the organization's authorized published knowledge sources.",
    patterns: [/kunnskap/i, /knowledge/i, /faq/i, /søk.*i/i, /search.*(knowledge|faq)/i],
    tools: ["knowledge_search"],
  },
  {
    intent: "support_cases_overview",
    title: "Support cases overview",
    summary: "Summarize open support cases for this organization.",
    patterns: [/supportsak/i, /support\s*cases?/i, /åpne\s*saker/i, /open\s*cases/i],
    tools: ["support_cases_read"],
  },
  {
    intent: "notifications_overview",
    title: "Notifications",
    summary: "List relevant notifications for the signed-in operator.",
    patterns: [/varsl/i, /notif/i],
    tools: ["notifications_read"],
  },
  {
    intent: "members_overview",
    title: "Organization members",
    summary: "List active organization members and roles.",
    patterns: [/medlem/i, /member/i, /ansatte/i, /employee/i, /team/i],
    tools: ["organization_members_read"],
  },
  {
    intent: "activity_overview",
    title: "Activity summary",
    summary: "Summarize recent organization activity.",
    patterns: [/aktivitet/i, /activity/i, /historikk/i],
    tools: ["activity_summary_read", "operator_history_read"],
  },
  {
    intent: "check_kompis_delivery",
    title: "Check APP and Website Kompis",
    summary: "Review APP license, Website Kompis capability, domain, installation, and acknowledgement.",
    patterns: [/kompis/i, /website\s*kompis/i, /leverans/i, /delivery/i, /installasjons?status/i, /installation\s*status/i, /kontroller.*app/i, /check.*(app|kompis)/i],
    tools: ["app_access_status_read", "license_status_read", "website_kompis_status_read", "domain_installation_status_read"],
  },
  {
    intent: "license_agreement_overview",
    title: "License and agreement overview",
    summary: "Summarize the organization agreement and APP license status.",
    patterns: [/lisens/i, /license/i, /avtale/i, /agreement/i, /subscription/i],
    tools: ["agreement_status_read", "license_status_read", "customer_profile_read"],
  },
  {
    intent: "organization_profile",
    title: "Organization profile",
    summary: "Read the organization business profile for this APP panel.",
    patterns: [/profil/i, /profile/i, /organisasjon/i, /organization/i, /virksomhet/i],
    tools: ["customer_profile_read", "app_access_status_read"],
  },
];

function scrubInjection(input: string): string {
  return input
    .replace(/ignore (all|previous|prior) instructions/gi, "[filtered]")
    .replace(/system\s*prompt/gi, "[filtered]")
    .replace(/```[\s\S]*?```/g, "[code removed]")
    .slice(0, 4000);
}

function buildSteps(
  tools: KompisOperatorToolKey[],
  safeInput: Record<string, unknown> = {},
): { steps: KompisOperatorPlanStep[]; unavailableReason?: string; riskClass: KompisOperatorRiskClass } {
  const steps: KompisOperatorPlanStep[] = [];
  for (const toolKey of tools.slice(0, MAX_STEPS)) {
    const tool = getKompisOperatorTool(toolKey);
    if (!tool) continue;
    if (!tool.available) {
      return {
        steps: [],
        unavailableReason: tool.unavailableReason ?? "tool_unavailable",
        riskClass: tool.riskClass,
      };
    }
    steps.push({
      sequence: steps.length + 1,
      toolKey: tool.key,
      toolVersion: tool.version,
      purpose: tool.description,
      riskClass: tool.riskClass,
      requiresApproval: tool.requiresApproval || tool.riskClass >= 1,
      safeInput,
    });
  }
  if (steps.length === 0) {
    return { steps: [], unavailableReason: "no_available_tools", riskClass: 0 };
  }
  const riskClass = Math.max(...steps.map((step) => step.riskClass)) as KompisOperatorRiskClass;
  return { steps, riskClass };
}

export function planKompisOperatorRequestDeterministic(rawRequest: string): KompisOperatorPlan {
  const runtime = getKompisAiRuntimeStatus();
  const request = scrubInjection(rawRequest.trim());
  if (request.length < 2) {
    return {
      intent: "invalid",
      title: "Invalid request",
      userSummary: "The request was empty or too short.",
      riskClass: 3,
      requiresApproval: false,
      confidence: "high",
      steps: [],
      unavailableReason: "invalid_request",
      blockedReasonCode: "invalid_request",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }

  if (/\b(select|insert|update|drop|delete)\b.+\b(from|into|table)\b/i.test(request)) {
    return {
      intent: "blocked_sql",
      title: "Blocked request",
      userSummary: "Kompis cannot run database statements.",
      riskClass: 3,
      requiresApproval: false,
      confidence: "high",
      steps: [],
      unavailableReason: "sql_blocked",
      blockedReasonCode: "sql_blocked",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }
  if (/https?:\/\//i.test(request) && /fetch|curl|wget/i.test(request)) {
    return {
      intent: "blocked_url",
      title: "Blocked request",
      userSummary: "Kompis cannot call arbitrary URLs.",
      riskClass: 3,
      requiresApproval: false,
      confidence: "high",
      steps: [],
      unavailableReason: "url_blocked",
      blockedReasonCode: "url_blocked",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }
  if (/\b(eval|exec|shell|bash|powershell)\b/i.test(request)) {
    return {
      intent: "blocked_shell",
      title: "Blocked request",
      userSummary: "Kompis cannot run shell or evaluation commands.",
      riskClass: 3,
      requiresApproval: false,
      confidence: "high",
      steps: [],
      unavailableReason: "shell_blocked",
      blockedReasonCode: "shell_blocked",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }

  const matched = RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(request))) ?? null;
  if (!matched) {
    return {
      intent: "unsupported",
      title: "Not supported yet",
      userSummary: "Kompis understood the request but does not have a registered tool for it yet.",
      riskClass: 0,
      requiresApproval: false,
      confidence: "low",
      steps: [],
      unavailableReason: "unsupported_intent",
      blockedReasonCode: "unsupported_intent",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }

  if (matched.critical) {
    return {
      intent: matched.intent,
      title: matched.title,
      userSummary: matched.summary,
      riskClass: 3,
      requiresApproval: false,
      confidence: "high",
      steps: [],
      unavailableReason: "critical_blocked",
      blockedReasonCode: "critical_blocked",
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }

  const built = buildSteps(matched.tools, matched.safeInput ?? {});
  if (built.steps.length === 0) {
    return {
      intent: matched.intent,
      title: matched.title,
      userSummary: matched.summary,
      riskClass: built.riskClass,
      requiresApproval: built.riskClass >= 1,
      confidence: matched.confidence ?? "medium",
      steps: [],
      unavailableReason: built.unavailableReason,
      blockedReasonCode: built.unavailableReason,
      plannerSource: "deterministic",
      providerStatus: runtime.providerStatus,
    };
  }

  return {
    intent: matched.intent,
    title: matched.title,
    userSummary: matched.summary,
    riskClass: built.riskClass,
    requiresApproval: built.riskClass >= 1,
    confidence: matched.confidence ?? "high",
    steps: built.steps,
    plannerSource: "deterministic",
    providerStatus: runtime.providerStatus,
  };
}

function validateAiCandidate(candidate: KompisAiPlanCandidate): KompisOperatorPlan | null {
  const runtime = getKompisAiRuntimeStatus();
  const intent = typeof candidate.intent === "string" ? candidate.intent.slice(0, 120) : "";
  const title = typeof candidate.title === "string" ? candidate.title.slice(0, 160) : "";
  const userSummary =
    typeof candidate.userSummary === "string" ? candidate.userSummary.slice(0, 500) : "";
  const confidence =
    candidate.confidence === "high" || candidate.confidence === "medium" || candidate.confidence === "low"
      ? candidate.confidence
      : null;
  const riskClass =
    candidate.riskClass === 0 || candidate.riskClass === 1 || candidate.riskClass === 2 || candidate.riskClass === 3
      ? candidate.riskClass
      : null;
  if (!intent || !title || !userSummary || !confidence || riskClass === null) return null;

  if (riskClass === 3) {
    return {
      intent,
      title,
      userSummary,
      riskClass: 3,
      requiresApproval: false,
      confidence,
      steps: [],
      unavailableReason: "critical_blocked",
      blockedReasonCode:
        typeof candidate.blockedReasonCode === "string"
          ? candidate.blockedReasonCode
          : "critical_blocked",
      plannerSource: "ai",
      providerStatus: "active",
    };
  }

  if (!Array.isArray(candidate.steps) || candidate.steps.length === 0 || candidate.steps.length > MAX_STEPS) {
    return null;
  }

  const steps: KompisOperatorPlanStep[] = [];
  for (const [index, raw] of candidate.steps.entries()) {
    if (!raw || typeof raw !== "object") return null;
    const row = raw as Record<string, unknown>;
    const toolKey = typeof row.toolKey === "string" ? row.toolKey : "";
    if (!isKompisOperatorToolKey(toolKey)) return null;
    const tool = getKompisOperatorTool(toolKey);
    if (!tool || !tool.available) return null;
    const toolVersion = typeof row.toolVersion === "string" ? row.toolVersion : tool.version;
    if (toolVersion !== tool.version) return null;
    steps.push({
      sequence: index + 1,
      toolKey,
      toolVersion: tool.version,
      purpose:
        typeof row.purpose === "string" && row.purpose.trim()
          ? row.purpose.slice(0, 200)
          : tool.description,
      riskClass: tool.riskClass,
      requiresApproval: tool.requiresApproval || tool.riskClass >= 1,
      safeInput:
        row.safeInput && typeof row.safeInput === "object" && !Array.isArray(row.safeInput)
          ? (row.safeInput as Record<string, unknown>)
          : {},
    });
  }

  if (confidence === "low") {
    return {
      intent,
      title,
      userSummary,
      riskClass: 0,
      requiresApproval: false,
      confidence: "low",
      steps: [],
      unavailableReason: "low_confidence",
      blockedReasonCode: "low_confidence",
      plannerSource: "ai",
      providerStatus: "active",
    };
  }

  const computedRisk = Math.max(...steps.map((step) => step.riskClass), riskClass) as KompisOperatorRiskClass;
  return {
    intent,
    title,
    userSummary,
    riskClass: computedRisk,
    requiresApproval: computedRisk >= 1,
    confidence,
    steps,
    plannerSource: "ai",
    providerStatus: runtime.providerConfigured ? "active" : "not_configured",
  };
}

export async function planKompisOperatorRequest(rawRequest: string): Promise<KompisOperatorPlan> {
  const deterministic = planKompisOperatorRequestDeterministic(rawRequest);
  const runtime = getKompisAiRuntimeStatus();
  if (!runtime.liveAiActive) {
    return deterministic;
  }

  const ai = await requestKompisAiPlan(rawRequest);
  if (!ai.ok || !ai.candidate) {
    return {
      ...deterministic,
      plannerSource: "ai_fallback",
      providerStatus: ai.status,
    };
  }

  const validated = validateAiCandidate(ai.candidate);
  if (!validated) {
    return {
      ...deterministic,
      plannerSource: "ai_fallback",
      providerStatus: "fallback",
    };
  }
  return validated;
}

/** Sync planner used by unit tests and non-async callers. */
export function planKompisOperatorRequestSync(rawRequest: string): KompisOperatorPlan {
  return planKompisOperatorRequestDeterministic(rawRequest);
}

export function planToRpcJson(plan: KompisOperatorPlan): Record<string, unknown> {
  return {
    intent: plan.intent,
    title: plan.title,
    userSummary: plan.userSummary,
    riskClass: plan.riskClass,
    requiresApproval: plan.requiresApproval,
    confidence: plan.confidence,
    unavailableReason: plan.unavailableReason ?? null,
    blockedReasonCode: plan.blockedReasonCode ?? null,
    plannerVersion: PLANNER_VERSION,
    modelIdentifier: plan.plannerSource === "ai" ? "ai_planner_v2" : "deterministic_planner_v2",
    plannerSource: plan.plannerSource,
    providerStatus: plan.providerStatus,
    steps: plan.steps.map((step) => ({
      sequence: step.sequence,
      toolKey: step.toolKey,
      toolVersion: step.toolVersion,
      purpose: step.purpose,
      riskClass: step.riskClass,
      requiresApproval: step.requiresApproval,
      safeInput: step.safeInput,
    })),
  };
}
