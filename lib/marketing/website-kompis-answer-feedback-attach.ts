import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";
import type { WebsiteKompisAskFeedbackFields } from "@/lib/marketing/website-kompis-answer-feedback";
import {
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
} from "@/lib/marketing/public-companion-tenant-faq";
import { createWebsiteKompisAnswerReceipt } from "@/lib/marketing/website-kompis-answer-feedback-server";

export type PublicCompanionAskResponseWithFeedback = PublicCompanionAskResponse &
  WebsiteKompisAskFeedbackFields;

type CreateReceiptFn = typeof createWebsiteKompisAnswerReceipt;

/**
 * Attaches a tenant-bound answer receipt when install/domain trust is present.
 * Fail-closed: missing schema → feedbackPersistenceReady false, no fake answerId.
 *
 * Optional `createReceipt` / `createServiceRoleClient` are test-only injection points.
 * Production route omits them → real service-role client + RPC INSERT path unchanged.
 */
export async function attachWebsiteKompisAnswerFeedbackReceipt(input: {
  response: PublicCompanionAskResponse;
  question: string;
  installId?: string | null;
  domain?: string | null;
  pagePathname?: string | null;
  createReceipt?: CreateReceiptFn;
  createServiceRoleClient?: typeof createServiceRoleClient;
}): Promise<PublicCompanionAskResponseWithFeedback> {
  const installId = sanitizePublicCompanionInstallId(input.installId ?? null);
  const domain = sanitizePublicCompanionDomain(input.domain ?? null);
  if (!installId || !domain) {
    return input.response;
  }

  const answerText = [
    input.response.answer.directAnswer,
    input.response.answer.explanation ?? "",
    ...(input.response.answer.steps ?? []),
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");

  if (!answerText.trim() || !input.question.trim()) {
    return input.response;
  }

  const resolveAdmin = input.createServiceRoleClient ?? createServiceRoleClient;
  let admin;
  try {
    admin = resolveAdmin();
  } catch {
    return {
      ...input.response,
      answerId: null,
      feedbackPersistenceReady: false,
    };
  }

  const createReceipt = input.createReceipt ?? createWebsiteKompisAnswerReceipt;
  const receipt = await createReceipt(admin, {
    installId,
    domain,
    locale: input.response.locale,
    question: input.question,
    answerText,
    sources: (input.response.sources ?? []).map((source) => ({
      title: source.title,
      route: source.route,
    })),
    sourceVersionRefs: (input.response.sources ?? []).map((source) => ({
      kind: "source_route",
      id: source.route,
      version: null,
    })),
    pagePathname: input.pagePathname,
  });

  return {
    ...input.response,
    answerId: receipt.answerId,
    feedbackPersistenceReady: receipt.persistenceReady,
  };
}
