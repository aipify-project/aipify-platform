import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  clipWebsiteKompisFeedbackSnapshot,
  CREATE_WEBSITE_KOMPIS_ANSWER_RECEIPT_RPC,
  GET_WEBSITE_KOMPIS_ANSWER_FEEDBACK_OVERVIEW_RPC,
  isValidWebsiteKompisAnswerFeedbackVote,
  RECORD_WEBSITE_KOMPIS_ANSWER_FEEDBACK_RPC,
  sanitizeWebsiteKompisFeedbackComment,
  WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_ANSWER,
  WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_QUESTION,
  type WebsiteKompisAnswerFeedbackVote,
  type WebsiteKompisAnswerReceiptInput,
  type WebsiteKompisAnswerSourceSnapshot,
} from "@/lib/marketing/website-kompis-answer-feedback";

export function hashWebsiteKompisVisitorKey(rawKey: string): string {
  return createHash("sha256").update(`wk-visitor:${rawKey.trim()}`).digest("hex");
}

export function normalizeWebsiteKompisPagePathname(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.length > 500) return trimmed.slice(0, 500);
  return trimmed;
}

function isMissingRpcError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = String(error.code ?? "");
  const message = String(error.message ?? "").toLowerCase();
  return (
    code === "PGRST202" ||
    code === "42883" ||
    message.includes("could not find the function") ||
    message.includes("does not exist")
  );
}

function sanitizeSources(
  sources: WebsiteKompisAnswerSourceSnapshot[],
): WebsiteKompisAnswerSourceSnapshot[] {
  return sources
    .filter((source) => typeof source.title === "string" && source.title.trim())
    .slice(0, 12)
    .map((source) => ({
      title: source.title.trim().slice(0, 200),
      route: typeof source.route === "string" ? source.route.trim().slice(0, 500) : "",
    }));
}

export async function createWebsiteKompisAnswerReceipt(
  admin: SupabaseClient,
  input: WebsiteKompisAnswerReceiptInput,
): Promise<{ answerId: string | null; persistenceReady: boolean }> {
  const question = clipWebsiteKompisFeedbackSnapshot(
    input.question,
    WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_QUESTION,
  );
  const answerText = clipWebsiteKompisFeedbackSnapshot(
    input.answerText,
    WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_ANSWER,
  );
  if (!question || !answerText) {
    return { answerId: null, persistenceReady: true };
  }

  const { data, error } = await admin.rpc(CREATE_WEBSITE_KOMPIS_ANSWER_RECEIPT_RPC, {
    p_install_id: input.installId,
    p_domain: input.domain,
    p_locale: input.locale,
    p_question: question,
    p_answer_text: answerText,
    p_sources: sanitizeSources(input.sources),
    p_source_version_refs: input.sourceVersionRefs ?? [],
    p_page_pathname: normalizeWebsiteKompisPagePathname(input.pagePathname),
  });

  if (error) {
    if (isMissingRpcError(error)) {
      return { answerId: null, persistenceReady: false };
    }
    console.error("[website-kompis-answer-feedback] create receipt failed", {
      code: error.code,
      message: error.message,
    });
    return { answerId: null, persistenceReady: true };
  }

  const row = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const answerId =
    typeof row?.answer_id === "string" && row.answer_id.trim() ? row.answer_id.trim() : null;
  return { answerId, persistenceReady: true };
}

export type RecordWebsiteKompisAnswerFeedbackResult =
  | {
      ok: true;
      feedbackId: string | null;
      vote: WebsiteKompisAnswerFeedbackVote | null;
      alreadyRecorded: boolean;
      cleared?: boolean;
      updated?: boolean;
    }
  | {
      ok: false;
      code:
        | "persistence_unavailable"
        | "invalid_payload"
        | "not_found"
        | "tenant_mismatch"
        | "rate_limited"
        | "rpc_error";
      message: string;
    };

export async function recordWebsiteKompisAnswerFeedback(
  admin: SupabaseClient,
  input: {
    answerId: string;
    installId: string;
    domain: string;
    vote?: unknown;
    comment?: unknown;
    visitorKeyRaw: string;
    clear?: boolean;
  },
): Promise<RecordWebsiteKompisAnswerFeedbackResult> {
  const clear = input.clear === true;
  if (!clear && !isValidWebsiteKompisAnswerFeedbackVote(input.vote)) {
    return { ok: false, code: "invalid_payload", message: "Invalid vote." };
  }
  if (!input.answerId.trim() || !input.installId.trim() || !input.domain.trim()) {
    return { ok: false, code: "invalid_payload", message: "Missing answer binding." };
  }
  if (!input.visitorKeyRaw.trim()) {
    return { ok: false, code: "invalid_payload", message: "Missing visitor key." };
  }

  const visitorKeyHash = hashWebsiteKompisVisitorKey(input.visitorKeyRaw);
  const { data, error } = await admin.rpc(RECORD_WEBSITE_KOMPIS_ANSWER_FEEDBACK_RPC, {
    p_answer_id: input.answerId.trim(),
    p_install_id: input.installId.trim(),
    p_domain: input.domain.trim(),
    p_vote: clear ? null : input.vote,
    p_comment: sanitizeWebsiteKompisFeedbackComment(input.comment),
    p_visitor_key_hash: visitorKeyHash,
    p_clear: clear,
  });

  if (error) {
    if (isMissingRpcError(error)) {
      return {
        ok: false,
        code: "persistence_unavailable",
        message: "Feedback storage is not available yet.",
      };
    }
    const message = String(error.message ?? "").toLowerCase();
    if (message.includes("answer_not_found") || message.includes("not found")) {
      return { ok: false, code: "not_found", message: "Answer not found." };
    }
    if (message.includes("rate_limited")) {
      return {
        ok: false,
        code: "rate_limited",
        message: "Too many feedback attempts. Try again later.",
      };
    }
    if (message.includes("tenant") || message.includes("install")) {
      return { ok: false, code: "tenant_mismatch", message: "Feedback binding rejected." };
    }
    console.error("[website-kompis-answer-feedback] record failed", {
      code: error.code,
      message: error.message,
    });
    return { ok: false, code: "rpc_error", message: "Could not save feedback." };
  }

  const row = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  if (!row || row.ok !== true) {
    const code = typeof row?.error === "string" ? row.error : "rpc_error";
    if (code === "persistence_unavailable") {
      return {
        ok: false,
        code: "persistence_unavailable",
        message: "Feedback storage is not available yet.",
      };
    }
    if (code === "answer_not_found") {
      return { ok: false, code: "not_found", message: "Answer not found." };
    }
    if (code === "tenant_mismatch" || code === "install_mismatch") {
      return { ok: false, code: "tenant_mismatch", message: "Feedback binding rejected." };
    }
    if (code === "rate_limited") {
      return { ok: false, code: "rate_limited", message: "Too many feedback attempts. Try again later." };
    }
    return { ok: false, code: "rpc_error", message: "Could not save feedback." };
  }

  if (row.cleared === true) {
    return {
      ok: true,
      feedbackId:
        typeof row.feedback_id === "string" && row.feedback_id.trim()
          ? row.feedback_id.trim()
          : null,
      vote: null,
      alreadyRecorded: row.already_recorded === true,
      cleared: true,
    };
  }

  const vote = isValidWebsiteKompisAnswerFeedbackVote(row.vote)
    ? row.vote
    : isValidWebsiteKompisAnswerFeedbackVote(input.vote)
      ? input.vote
      : null;

  return {
    ok: true,
    feedbackId:
      typeof row.feedback_id === "string" && row.feedback_id.trim()
        ? row.feedback_id.trim()
        : randomUUID(),
    vote,
    alreadyRecorded: row.already_recorded === true,
    updated: row.updated === true,
  };
}

export type WebsiteKompisAnswerFeedbackOverview = {
  persistenceReady: boolean;
  totals: {
    answers: number;
    helpful: number;
    notHelpful: number;
    withComment: number;
  };
  recent: Array<{
    id: string;
    vote: WebsiteKompisAnswerFeedbackVote;
    comment: string | null;
    questionPreview: string;
    answerPreview: string;
    pagePathname: string | null;
    locale: string | null;
    createdAt: string;
  }>;
};

export async function getWebsiteKompisAnswerFeedbackOverview(
  supabase: SupabaseClient,
  options?: { limit?: number },
): Promise<WebsiteKompisAnswerFeedbackOverview> {
  const limit = Math.min(Math.max(options?.limit ?? 40, 1), 100);
  const empty: WebsiteKompisAnswerFeedbackOverview = {
    persistenceReady: false,
    totals: { answers: 0, helpful: 0, notHelpful: 0, withComment: 0 },
    recent: [],
  };

  const { data, error } = await supabase.rpc(GET_WEBSITE_KOMPIS_ANSWER_FEEDBACK_OVERVIEW_RPC, {
    p_limit: limit,
  });

  if (error) {
    if (isMissingRpcError(error)) return empty;
    console.error("[website-kompis-answer-feedback] overview failed", {
      code: error.code,
      message: error.message,
    });
    return empty;
  }

  const row = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  if (!row || row.ok === false) return empty;

  const totals =
    row.totals && typeof row.totals === "object"
      ? (row.totals as Record<string, unknown>)
      : {};
  const recentRaw = Array.isArray(row.recent) ? row.recent : [];

  return {
    persistenceReady: row.persistence_ready !== false,
    totals: {
      answers: Number(totals.answers ?? 0) || 0,
      helpful: Number(totals.helpful ?? 0) || 0,
      notHelpful: Number(totals.not_helpful ?? 0) || 0,
      withComment: Number(totals.with_comment ?? 0) || 0,
    },
    recent: recentRaw
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object")
      .map((entry) => ({
        id: String(entry.id ?? ""),
        vote: (entry.vote === "not_helpful" ? "not_helpful" : "helpful") as WebsiteKompisAnswerFeedbackVote,
        comment: typeof entry.comment === "string" ? entry.comment : null,
        questionPreview: String(entry.question_preview ?? ""),
        answerPreview: String(entry.answer_preview ?? ""),
        pagePathname:
          typeof entry.page_pathname === "string" ? entry.page_pathname : null,
        locale: typeof entry.locale === "string" ? entry.locale : null,
        createdAt: String(entry.created_at ?? ""),
      }))
      .filter((entry) => entry.id),
  };
}
