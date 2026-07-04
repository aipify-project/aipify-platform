import {
  collectPublicCompanionSubmitPageContext,
  sanitizeCompanionSubmitPageContext,
  type CompanionSubmitPageContext,
} from "@/lib/companion-runtime/companion-submit-page-context";

export const WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH = 1000;
export const WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGES = 6;
export const WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGE_LENGTH = 500;

export type PublicCompanionRecentContextMessage = {
  role: "user" | "assistant";
  text: string;
};

export type PublicCompanionAskResponseShape = {
  answer: {
    directAnswer: string;
    explanation: string | null;
    steps: string[];
  };
  actions: Array<{
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  }>;
  sources: Array<{ title: string; route: string }>;
};

export type WebsiteCompanionUiAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type WebsiteCompanionUserMessage = {
  id: string;
  role: "user";
  text: string;
};

export type WebsiteCompanionAssistantMessage = {
  id: string;
  role: "assistant";
  directAnswer: string;
  explanation: string | null;
  steps: string[];
  sources: string[];
  actions: WebsiteCompanionUiAction[];
  failed?: false;
};

export type WebsiteCompanionErrorMessage = {
  id: string;
  role: "assistant";
  failed: true;
  retryQuestion: string;
};

export type WebsiteCompanionChatMessage =
  | WebsiteCompanionUserMessage
  | WebsiteCompanionAssistantMessage
  | WebsiteCompanionErrorMessage;

export type WebsiteCompanionPageContext = CompanionSubmitPageContext;

export type WebsiteCompanionAskRequestBody = {
  question: string;
  locale: string;
  recentContext?: PublicCompanionRecentContextMessage[];
  pageContext?: WebsiteCompanionPageContext;
};

export const WEBSITE_COMPANION_PAGE_CONTEXT_MAX_PATHNAME_LENGTH = 240;
export const WEBSITE_COMPANION_PAGE_CONTEXT_MAX_TITLE_LENGTH = 200;
export const WEBSITE_COMPANION_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH = 320;

export function sanitizeWebsiteCompanionPageContext(
  value: unknown,
): WebsiteCompanionPageContext | undefined {
  return sanitizeCompanionSubmitPageContext(value);
}

export function collectWebsiteCompanionPageContext(windowLike?: {
  location?: { pathname?: string };
  document?: {
    title?: string;
    querySelector?: (selector: string) => { getAttribute?: (name: string) => string | null } | null;
  };
}): WebsiteCompanionPageContext | undefined {
  return collectPublicCompanionSubmitPageContext(windowLike);
}

export type WebsiteCompanionQuestionValidationResult =
  | { valid: true; question: string }
  | { valid: false; reason: "empty" | "too_long" };

export function validateWebsiteCompanionQuestion(
  text: string,
): WebsiteCompanionQuestionValidationResult {
  const question = text.trim();
  if (!question) return { valid: false, reason: "empty" };
  if (question.length > WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH) {
    return { valid: false, reason: "too_long" };
  }
  return { valid: true, question };
}

export function isSafeWebsiteCompanionActionHref(href: string): boolean {
  const normalized = href.trim();
  if (!normalized.startsWith("/app/")) return false;
  const lower = normalized.toLowerCase();
  if (lower.startsWith("//")) return false;
  if (/^(javascript:|data:|vbscript:)/.test(lower)) return false;
  if (/^https?:/.test(lower)) return false;
  return true;
}

export function filterWebsiteCompanionUiActions(
  actions: WebsiteCompanionUiAction[],
): WebsiteCompanionUiAction[] {
  return actions.filter(
    (action) =>
      action.label.trim().length > 0 &&
      isSafeWebsiteCompanionActionHref(action.href),
  );
}

function assistantMessageContextText(message: WebsiteCompanionAssistantMessage): string {
  const parts = [message.directAnswer.trim()];
  if (message.explanation?.trim()) parts.push(message.explanation.trim());
  for (const step of message.steps) {
    const trimmed = step.trim();
    if (trimmed) parts.push(trimmed);
  }
  return parts.join("\n\n");
}

export function buildWebsiteCompanionRecentContext(
  messages: WebsiteCompanionChatMessage[],
): PublicCompanionRecentContextMessage[] {
  const relevant = messages.filter(
    (message): message is WebsiteCompanionUserMessage | WebsiteCompanionAssistantMessage =>
      message.role === "user" ||
      (message.role === "assistant" && !("failed" in message && message.failed)),
  );

  const tail = relevant.slice(-WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGES);
  return tail.map((message) => {
    const text =
      message.role === "user"
        ? message.text.trim()
        : assistantMessageContextText(message).trim();
    return {
      role: message.role,
      text: text.slice(0, WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGE_LENGTH),
    };
  });
}

export function buildWebsiteCompanionAskBody(input: {
  question: string;
  locale: string;
  messages: WebsiteCompanionChatMessage[];
  pageContext?: WebsiteCompanionPageContext;
}): WebsiteCompanionAskRequestBody {
  const recentContext = buildWebsiteCompanionRecentContext(input.messages);
  const body: WebsiteCompanionAskRequestBody = {
    question: input.question.trim(),
    locale: input.locale,
  };
  if (recentContext.length > 0) {
    body.recentContext = recentContext;
  }
  if (input.pageContext) {
    body.pageContext = input.pageContext;
  }
  return body;
}

export function assertWebsiteCompanionAskBodyShape(
  body: WebsiteCompanionAskRequestBody,
): void {
  const forbiddenKeys = [
    "tenantId",
    "organizationId",
    "userId",
    "providerId",
    "email",
    "name",
    "messageLocale",
  ];
  const record = body as Record<string, unknown>;
  for (const key of forbiddenKeys) {
    if (key in record) {
      throw new Error(`Forbidden request field: ${key}`);
    }
  }
  if (!body.question.trim()) throw new Error("question required");
  if (body.recentContext && body.recentContext.length > WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGES) {
    throw new Error("recentContext too long");
  }
  for (const entry of body.recentContext ?? []) {
    if (entry.role !== "user" && entry.role !== "assistant") {
      throw new Error("invalid recentContext role");
    }
    if (!entry.text.trim()) throw new Error("recentContext text required");
    if (entry.text.length > WEBSITE_COMPANION_CHAT_MAX_CONTEXT_MESSAGE_LENGTH) {
      throw new Error("recentContext text too long");
    }
  }
  if ("pageContext" in record && record.pageContext != null) {
    sanitizeWebsiteCompanionPageContext(record.pageContext);
  }
}

export function mapWebsiteCompanionApiResponse(
  payload: PublicCompanionAskResponseShape,
): Omit<WebsiteCompanionAssistantMessage, "id" | "role"> {
  return {
    directAnswer: payload.answer.directAnswer,
    explanation: payload.answer.explanation,
    steps: (payload.answer.steps ?? []).filter((step) => step.trim().length > 0),
    sources: payload.sources.map((source) => source.title).filter(Boolean),
    actions: filterWebsiteCompanionUiActions(payload.actions),
    failed: false,
  };
}

export function shouldAllowWebsiteCompanionSend(input: {
  question: string;
  sending: boolean;
}): boolean {
  if (input.sending) return false;
  return validateWebsiteCompanionQuestion(input.question).valid;
}

export function formatWebsiteCompanionCharactersRemaining(
  template: string,
  remaining: number,
): string {
  return template.replace("{count}", String(Math.max(0, remaining)));
}

export function shouldShowWebsiteCompanionJumpToLatest(input: {
  isNearBottom: boolean;
  hasMessages: boolean;
}): boolean {
  return input.hasMessages && !input.isNearBottom;
}
