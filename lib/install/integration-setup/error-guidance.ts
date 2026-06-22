/** Known integration error categories with customer-facing guidance keys. */
export type IntegrationErrorCategory =
  | "unauthorized"
  | "network"
  | "invalid_scope"
  | "missing_env"
  | "validation_pending"
  | "unknown";

export type IntegrationErrorGuidance = {
  category: IntegrationErrorCategory;
  titleKey: string;
  bodyKey: string;
  checklistKeys: string[];
  actions: {
    retry: string;
    findKey: string;
    contactSupport: string;
  };
};

const ERROR_BASE = "customerApp.portalStructure.integrations.errorGuidance";

const GUIDANCE_BY_CATEGORY: Record<IntegrationErrorCategory, IntegrationErrorGuidance> = {
  unauthorized: {
    category: "unauthorized",
    titleKey: `${ERROR_BASE}.unauthorized.title`,
    bodyKey: `${ERROR_BASE}.unauthorized.body`,
    checklistKeys: [
      `${ERROR_BASE}.unauthorized.checklist.verifyKey`,
      `${ERROR_BASE}.unauthorized.checklist.readOnly`,
      `${ERROR_BASE}.unauthorized.checklist.notRevoked`,
      `${ERROR_BASE}.unauthorized.checklist.correctProject`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
  network: {
    category: "network",
    titleKey: `${ERROR_BASE}.network.title`,
    bodyKey: `${ERROR_BASE}.network.body`,
    checklistKeys: [
      `${ERROR_BASE}.network.checklist.connectivity`,
      `${ERROR_BASE}.network.checklist.providerStatus`,
      `${ERROR_BASE}.network.checklist.retryLater`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
  invalid_scope: {
    category: "invalid_scope",
    titleKey: `${ERROR_BASE}.invalidScope.title`,
    bodyKey: `${ERROR_BASE}.invalidScope.body`,
    checklistKeys: [
      `${ERROR_BASE}.invalidScope.checklist.readOnly`,
      `${ERROR_BASE}.invalidScope.checklist.approvedScopes`,
      `${ERROR_BASE}.invalidScope.checklist.regenerateKey`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
  missing_env: {
    category: "missing_env",
    titleKey: `${ERROR_BASE}.missingEnv.title`,
    bodyKey: `${ERROR_BASE}.missingEnv.body`,
    checklistKeys: [
      `${ERROR_BASE}.missingEnv.checklist.contactAdmin`,
      `${ERROR_BASE}.missingEnv.checklist.supportTicket`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
  validation_pending: {
    category: "validation_pending",
    titleKey: `${ERROR_BASE}.validationPending.title`,
    bodyKey: `${ERROR_BASE}.validationPending.body`,
    checklistKeys: [
      `${ERROR_BASE}.validationPending.checklist.wait`,
      `${ERROR_BASE}.validationPending.checklist.retryTest`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
  unknown: {
    category: "unknown",
    titleKey: `${ERROR_BASE}.unknown.title`,
    bodyKey: `${ERROR_BASE}.unknown.body`,
    checklistKeys: [
      `${ERROR_BASE}.unknown.checklist.verifySetup`,
      `${ERROR_BASE}.unknown.checklist.retryTest`,
    ],
    actions: {
      retry: `${ERROR_BASE}.actions.retry`,
      findKey: `${ERROR_BASE}.actions.findKey`,
      contactSupport: `${ERROR_BASE}.actions.contactSupport`,
    },
  },
};

function normalizeErrorText(error: unknown): string {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    const obj = error as Record<string, unknown>;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.detail === "string") return obj.detail;
  }
  return String(error);
}

/** Classify a technical API or network error into actionable customer guidance. */
export function classifyIntegrationError(error: unknown): IntegrationErrorCategory {
  const text = normalizeErrorText(error).toLowerCase();

  if (
    text.includes("unauthorized") ||
    text.includes("401") ||
    text.includes("invalid api key") ||
    text.includes("invalid token") ||
    text.includes("authentication failed")
  ) {
    return "unauthorized";
  }

  if (
    text.includes("failed to fetch") ||
    text.includes("network") ||
    text.includes("timeout") ||
    text.includes("econnrefused") ||
    text.includes("503") ||
    text.includes("502")
  ) {
    return "network";
  }

  if (
    text.includes("invalid scope") ||
    text.includes("scope") ||
    text.includes("permission denied") ||
    text.includes("insufficient permissions") ||
    text.includes("403")
  ) {
    return "invalid_scope";
  }

  if (
    text.includes("missing environment variable") ||
    text.includes("missing env") ||
    text.includes("not configured") ||
    text.includes("configuration error")
  ) {
    return "missing_env";
  }

  if (
    text.includes("connection validation pending") ||
    text.includes("validation pending") ||
    text.includes("pending validation")
  ) {
    return "validation_pending";
  }

  return "unknown";
}

export function getIntegrationErrorGuidance(category: IntegrationErrorCategory): IntegrationErrorGuidance {
  return GUIDANCE_BY_CATEGORY[category];
}

/** i18n keys used by integration error panels — resolve on the server for client components. */
export function listIntegrationErrorTranslationKeys(): string[] {
  const keys = new Set<string>();
  for (const guidance of Object.values(GUIDANCE_BY_CATEGORY)) {
    keys.add(guidance.titleKey);
    keys.add(guidance.bodyKey);
    for (const checklistKey of guidance.checklistKeys) keys.add(checklistKey);
    for (const actionKey of Object.values(guidance.actions)) keys.add(actionKey);
  }
  return [...keys];
}

/** Parse an API response or thrown error into customer-facing guidance. */
export function parseIntegrationError(error: unknown): IntegrationErrorGuidance {
  return getIntegrationErrorGuidance(classifyIntegrationError(error));
}

/** Extract error message from a failed fetch Response body. */
export async function parseIntegrationErrorFromResponse(
  response: Response
): Promise<IntegrationErrorGuidance> {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = { error: response.statusText || "Request failed" };
  }
  return parseIntegrationError(payload);
}
