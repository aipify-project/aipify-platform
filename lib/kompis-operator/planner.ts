import {
  getKompisOperatorTool,
  type KompisOperatorRiskClass,
  type KompisOperatorToolKey,
} from "./tools-registry";

export type KompisOperatorPlanStep = {
  sequence: number;
  toolKey: KompisOperatorToolKey;
  toolVersion: string;
  purpose: string;
  riskClass: KompisOperatorRiskClass;
  requiresApproval: boolean;
};

export type KompisOperatorPlan = {
  intent: string;
  title: string;
  userSummary: string;
  riskClass: KompisOperatorRiskClass;
  requiresApproval: boolean;
  steps: KompisOperatorPlanStep[];
  unavailableReason?: string;
};

const MAX_STEPS = 8;
const PLANNER_VERSION = "deterministic_planner_v1";

type IntentRule = {
  intent: string;
  title: string;
  summary: string;
  patterns: RegExp[];
  tools: KompisOperatorToolKey[];
  critical?: boolean;
};

const RULES: IntentRule[] = [
  {
    intent: "check_kompis_delivery",
    title: "Check APP and Website Kompis",
    summary: "Review APP license, Website Kompis capability, domain, installation, and acknowledgement.",
    patterns: [
      /kompis/i,
      /website\s*kompis/i,
      /leverans/i,
      /delivery/i,
      /installasjons?status/i,
      /installation\s*status/i,
      /kontroller.*app/i,
      /check.*(app|kompis)/i,
    ],
    tools: [
      "app_access_status_read",
      "license_status_read",
      "website_kompis_status_read",
      "domain_installation_status_read",
    ],
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
  {
    intent: "draft_support_case",
    title: "Draft a support case",
    summary: "Prepare a support-case draft without sending or creating a live case.",
    patterns: [/supportsak/i, /support\s*case/i, /utkast.*support/i, /draft.*support/i],
    tools: ["content_draft_create"],
  },
  {
    intent: "draft_profile_change",
    title: "Draft a profile change",
    summary: "Prepare an organization profile change draft without publishing it.",
    patterns: [/utkast.*profil/i, /draft.*profile/i, /endre.*profil/i],
    tools: ["organization_profile_draft"],
  },
  {
    intent: "critical_forbidden",
    title: "Critical action",
    summary: "This request asks for a critical change that Kompis cannot execute in V1.",
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
    ],
    tools: [],
    critical: true,
  },
];

function scrubInjection(input: string): string {
  return input
    .replace(/ignore (all|previous|prior) instructions/gi, "[filtered]")
    .replace(/system\s*prompt/gi, "[filtered]")
    .replace(/```[\s\S]*?```/g, "[code removed]")
    .slice(0, 4000);
}

export function createKompisOperatorIdempotencyKey(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `kor-${rand}`;
}

export function planKompisOperatorRequest(rawRequest: string): KompisOperatorPlan {
  const request = scrubInjection(rawRequest.trim());
  if (request.length < 2) {
    return {
      intent: "invalid",
      title: "Invalid request",
      userSummary: "The request was empty or too short.",
      riskClass: 3,
      requiresApproval: false,
      steps: [],
      unavailableReason: "invalid_request",
    };
  }

  // Prompt-injection / SQL / URL attempts are blocked.
  if (/\b(select|insert|update|drop|delete)\b.+\b(from|into|table)\b/i.test(request)) {
    return {
      intent: "blocked_sql",
      title: "Blocked request",
      userSummary: "Kompis cannot run database statements.",
      riskClass: 3,
      requiresApproval: false,
      steps: [],
      unavailableReason: "sql_blocked",
    };
  }
  if (/https?:\/\//i.test(request) && /fetch|curl|wget/i.test(request)) {
    return {
      intent: "blocked_url",
      title: "Blocked request",
      userSummary: "Kompis cannot call arbitrary URLs.",
      riskClass: 3,
      requiresApproval: false,
      steps: [],
      unavailableReason: "url_blocked",
    };
  }

  const matched =
    RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(request))) ?? null;

  if (!matched) {
    return {
      intent: "unsupported",
      title: "Not supported yet",
      userSummary:
        "Kompis understood the request but does not have a registered tool for it yet.",
      riskClass: 0,
      requiresApproval: false,
      steps: [],
      unavailableReason: "unsupported_intent",
    };
  }

  if (matched.critical) {
    return {
      intent: matched.intent,
      title: matched.title,
      userSummary: matched.summary,
      riskClass: 3,
      requiresApproval: false,
      steps: [],
      unavailableReason: "critical_blocked",
    };
  }

  const steps: KompisOperatorPlanStep[] = [];
  for (const toolKey of matched.tools.slice(0, MAX_STEPS)) {
    const tool = getKompisOperatorTool(toolKey);
    if (!tool) continue;
    if (!tool.available) {
      return {
        intent: matched.intent,
        title: matched.title,
        userSummary: matched.summary,
        riskClass: tool.riskClass,
        requiresApproval: tool.riskClass >= 1,
        steps: [],
        unavailableReason: tool.unavailableReason ?? "tool_unavailable",
      };
    }
    steps.push({
      sequence: steps.length + 1,
      toolKey: tool.key,
      toolVersion: tool.version,
      purpose: tool.key.replace(/_/g, " "),
      riskClass: tool.riskClass,
      requiresApproval: tool.riskClass >= 1,
    });
  }

  if (steps.length === 0) {
    return {
      intent: matched.intent,
      title: matched.title,
      userSummary: matched.summary,
      riskClass: 0,
      requiresApproval: false,
      steps: [],
      unavailableReason: "no_available_tools",
    };
  }

  const riskClass = Math.max(...steps.map((step) => step.riskClass)) as KompisOperatorRiskClass;
  return {
    intent: matched.intent,
    title: matched.title,
    userSummary: matched.summary,
    riskClass,
    requiresApproval: riskClass >= 1,
    steps,
  };
}

export function planToRpcJson(plan: KompisOperatorPlan): Record<string, unknown> {
  return {
    intent: plan.intent,
    title: plan.title,
    userSummary: plan.userSummary,
    riskClass: plan.riskClass,
    requiresApproval: plan.requiresApproval,
    unavailableReason: plan.unavailableReason ?? null,
    plannerVersion: PLANNER_VERSION,
    modelIdentifier: PLANNER_VERSION,
    steps: plan.steps.map((step) => ({
      sequence: step.sequence,
      toolKey: step.toolKey,
      toolVersion: step.toolVersion,
      purpose: step.purpose,
      riskClass: step.riskClass,
      requiresApproval: step.requiresApproval,
    })),
  };
}
