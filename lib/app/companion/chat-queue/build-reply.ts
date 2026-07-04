import { parseSupportAssistantSearch, type SupportAssistantArticle } from "@/lib/app-portal/support-assistant";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionExperienceLabels, CompanionChatMessage, CompanionChatCta } from "../types";
import { serializeAssistantPayload } from "./message-payload";

function createMessageId(prefix = "msg") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function platformActionToCta(action: {
  label: string;
  href: string;
  labelKey?: string;
  variant?: "primary" | "secondary";
}): CompanionChatCta | null {
  const href = action.href?.trim();
  if (!href) return null;

  const label = action.label?.trim() || action.labelKey?.trim() || href;
  return {
    label,
    href,
    variant: action.variant,
  };
}

export function buildPlatformAnswerReply(
  platformAnswer: NonNullable<ReturnType<typeof parseSupportAssistantSearch>["answer"]>,
  lbls: CompanionExperienceLabels,
  question: string,
): CompanionChatMessage {
  const ctas =
    platformAnswer.actions.length > 0
      ? platformAnswer.actions
          .map((action) => platformActionToCta(action))
          .filter((cta): cta is NonNullable<typeof cta> => cta !== null)
      : [];

  const pendingSupportWrite = (
    platformAnswer as PlatformKnowledgeAnswer & {
      pendingSupportWrite?: { actionRequestId: string };
    }
  ).pendingSupportWrite;

  return {
    id: createMessageId(),
    role: "aipify",
    content: platformAnswer.directAnswer,
    directAnswer: platformAnswer.directAnswer,
    explanation: platformAnswer.explanation,
    integrationStatusCard: platformAnswer.integrationStatusCard,
    platformSnapshotCard: platformAnswer.platformSnapshotCard,
    question,
    steps: platformAnswer.steps,
    ctas,
    sources: platformAnswer.sources,
    sourceId: platformAnswer.sourceId,
    confidence: platformAnswer.confidence,
    showSupportEscalation:
      platformAnswer.showSupportEscalation ?? platformAnswer.confidence === "low",
    orgConfirmEligible: platformAnswer.orgConfirmEligible !== false,
    orgConfirmBlockedReason: platformAnswer.orgConfirmBlockedReason,
    liveIntegrationToolUsed: platformAnswer.liveIntegrationToolUsed === true,
    requestedLiveIntegration: platformAnswer.requestedLiveIntegration === true,
    ...(platformAnswer.pendingBookingWrite?.actionRequestId
      ? {
          pendingBookingWrite: {
            actionRequestId: platformAnswer.pendingBookingWrite.actionRequestId,
          },
        }
      : {}),
    ...(pendingSupportWrite?.actionRequestId
      ? {
          pendingSupportWrite: {
            actionRequestId: pendingSupportWrite.actionRequestId,
          },
        }
      : {}),
    ...(platformAnswer.pendingBookingClarification
      ? { pendingBookingClarification: platformAnswer.pendingBookingClarification }
      : {}),
    timestamp: Date.now(),
  };
}

export function buildFallbackReply(
  lbls: CompanionExperienceLabels,
  question: string,
): CompanionChatMessage {
  return {
    id: createMessageId(),
    role: "aipify",
    content: lbls.noResults,
    directAnswer: lbls.noResults,
    question,
    timestamp: Date.now(),
    showSupportEscalation: true,
    ctas: [
      { label: lbls.createSupportRequest, href: "/app/support/requests?from=companion" },
      { label: lbls.contextPages.support, href: "/app/support/knowledge" },
      { label: lbls.openCompanion, href: "/app/companion" },
    ],
  };
}

export function buildArticleReply(
  article: SupportAssistantArticle,
  lbls: CompanionExperienceLabels,
  question: string,
): CompanionChatMessage {
  const ctas = [{ label: lbls.createSupportRequest, href: "/app/support/requests?from=companion" }];
  if (article.related_module) {
    ctas.unshift({ label: lbls.viewSuggestions, href: "/app/support/knowledge" });
  }
  return {
    id: createMessageId(),
    role: "aipify",
    content: article.summary,
    directAnswer: article.summary,
    question,
    steps: article.steps,
    ctas,
    showSupportEscalation: true,
    timestamp: Date.now(),
  };
}

export function buildReplyFromSearchJson(
  data: unknown,
  labels: CompanionExperienceLabels,
  question: string,
): { message: CompanionChatMessage; payload: ReturnType<typeof serializeAssistantPayload> } {
  const parsed = parseSupportAssistantSearch(data);
  const answer = parsed.answer;
  const article = parsed.articles[0];

  const message = answer
    ? buildPlatformAnswerReply(answer, labels, question)
    : article
      ? buildArticleReply(article, labels, question)
      : buildFallbackReply(labels, question);

  return {
    message,
    payload: serializeAssistantPayload(message),
  };
}
