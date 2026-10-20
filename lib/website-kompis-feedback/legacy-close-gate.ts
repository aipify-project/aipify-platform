import { FEEDBACK_REVIEW_CLOSE_READY } from "@/lib/website-kompis-feedback/operations-model";

const FEEDBACK_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function legacyFeedbackCloseIsBlocked(ready: boolean = FEEDBACK_REVIEW_CLOSE_READY): boolean {
  return ready !== true;
}

type CloseRpcResult = {
  data: unknown;
  error: { code?: string; message?: string } | null;
};

export async function runLegacyFeedbackClose(input: {
  userId: string | null;
  feedbackId: string;
  ready?: boolean;
  rpc: (args: { p_feedback_id: string; p_confirmation: true }) => Promise<CloseRpcResult>;
}): Promise<{ status: number; body: Record<string, unknown> }> {
  if (!input.userId) return { status: 401, body: { error: "Unauthorized" } };
  if (!FEEDBACK_ID_RE.test(input.feedbackId)) {
    return { status: 400, body: { error: "Invalid feedback id" } };
  }
  if (legacyFeedbackCloseIsBlocked(input.ready)) {
    return {
      status: 501,
      body: { error: "Review close is not available.", code: "review_close_unavailable" },
    };
  }

  const { data, error } = await input.rpc({
    p_feedback_id: input.feedbackId.toLowerCase(),
    p_confirmation: true,
  });
  if (error) {
    const message = String(error.message ?? "");
    const missing =
      error.code === "42883" ||
      (/close_website_kompis_answer_feedback_review/i.test(message) && /does not exist/i.test(message));
    if (missing) {
      return { status: 501, body: { error: "Review close is not available.", code: "review_close_unavailable" } };
    }
    if (/owner or admin|forbidden/i.test(message)) return { status: 403, body: { error: "Forbidden" } };
    if (/not found/i.test(message)) return { status: 404, body: { error: "Feedback not found" } };
    return { status: 400, body: { error: "Review close failed" } };
  }

  const row = data && typeof data === "object" ? (data as { review_status?: string }) : null;
  if (row?.review_status !== "closed") {
    return { status: 400, body: { error: "Review close was not confirmed" } };
  }
  return {
    status: 200,
    body: { ok: true, id: input.feedbackId.toLowerCase(), reviewStatus: "closed", faqPublished: false },
  };
}
