import type { SupabaseClient } from "@supabase/supabase-js";
import { FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import {
  buildPublishedDispositionCall,
  buildRejectDispositionCall,
  buildReviewQueueRpcArgs,
  cursorFromQueuePage,
  mapReviewQueueItem,
  type DispositionAction,
  type FeedbackReviewQueuePage,
} from "@/lib/website-kompis-feedback/disposition";
import type { FeedbackOpsRow } from "@/lib/website-kompis-feedback/operations-model";

type RpcError = { code?: string; message?: string };

function mapRpcFailure(error: RpcError, rpcName: string): { status: number; error: string; code: string } {
  const message = String(error.message ?? "");
  const missing =
    error.code === "42883" ||
    error.code === "PGRST202" ||
    (message.toLowerCase().includes(rpcName) && /does not exist|could not find the function/i.test(message));
  if (missing) return { status: 501, error: "Review disposition is not available.", code: "disposition_unavailable" };
  if (/owner or admin|forbidden/i.test(message)) return { status: 403, error: "Forbidden", code: "forbidden" };
  if (/feedback not found/i.test(message)) return { status: 404, error: "Feedback not found", code: "missing" };
  if (/not eligible/i.test(message)) return { status: 409, error: "This case cannot take that outcome.", code: "not_eligible" };
  if (/faq not published/i.test(message)) return { status: 409, error: "The FAQ is not published for this site.", code: "faq_not_published" };
  if (/confirmation required/i.test(message)) return { status: 400, error: "Confirmation is required.", code: "confirmation_required" };
  return { status: 400, error: "Review disposition failed", code: "failed" };
}

function readDisposition(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const value = (data as { review_disposition?: unknown }).review_disposition;
  return value === "published" || value === "rejected" || value === "open" ? value : null;
}

export async function runFeedbackDisposition(
  supabase: SupabaseClient,
  input: {
    feedbackId: string;
    action: DispositionAction;
    faqItemId?: string | null;
    feedbackInstallId?: string | null;
    faqInstallId?: string | null;
    publishStatus?: string | null;
  },
  ready = FEEDBACK_REVIEW_DISPOSITION_READY,
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (ready !== true) {
    return { status: 501, body: { error: "Review disposition is not available.", code: "disposition_unavailable" } };
  }

  if (input.action === "rejected") {
    const call = buildRejectDispositionCall(input.feedbackId);
    if (!call.ok) return { status: 400, body: { error: "Invalid feedback id", code: "invalid_id" } };
    const { data, error } = await supabase.rpc(call.rpc, call.args);
    if (error) {
      const mapped = mapRpcFailure(error, call.rpc);
      return { status: mapped.status, body: { error: mapped.error, code: mapped.code } };
    }
    const reviewDisposition = readDisposition(data);
    if (reviewDisposition !== "rejected") {
      return { status: 400, body: { error: "Rejection was not confirmed", code: "unconfirmed" } };
    }
    return { status: 200, body: { ok: true, id: call.args.p_feedback_id, reviewDisposition } };
  }

  const call = buildPublishedDispositionCall({
    feedbackId: input.feedbackId,
    faqItemId: input.faqItemId ?? "",
    feedbackInstallId: input.feedbackInstallId ?? "",
    faqInstallId: input.faqInstallId ?? "",
    publishStatus: input.publishStatus,
  });
  if (!call.ok) return { status: 409, body: { error: "The FAQ is not ready to complete this case.", code: call.reason } };
  const { data, error } = await supabase.rpc(call.rpc, call.args);
  if (error) {
    const mapped = mapRpcFailure(error, call.rpc);
    return { status: mapped.status, body: { error: mapped.error, code: mapped.code } };
  }
  const reviewDisposition = readDisposition(data);
  if (reviewDisposition !== "published") {
    return { status: 400, body: { error: "Publication was not confirmed for this case.", code: "unconfirmed" } };
  }
  return {
    status: 200,
    body: { ok: true, id: call.args.p_feedback_id, reviewDisposition, faqItemId: call.args.p_faq_item_id },
  };
}

function readCount(data: object, key: string): number {
  const value = (data as Record<string, unknown>)[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function loadReviewQueuePage(
  supabase: SupabaseClient,
  input: { queue: "review" | "history"; limit?: number; before?: string | null; beforeId?: string | null },
  ready = FEEDBACK_REVIEW_DISPOSITION_READY,
): Promise<{ ok: true; page: FeedbackReviewQueuePage } | { ok: false; code: string }> {
  if (ready !== true) return { ok: false, code: "disposition_unavailable" };
  const call = buildReviewQueueRpcArgs({
    limit: input.limit ?? 100,
    queue: input.queue,
    before: input.before,
    beforeId: input.beforeId,
  });
  if (!call.ok) return { ok: false, code: "cursor" };
  const { data, error } = await supabase.rpc(call.rpc, call.args);
  if (error || !data || typeof data !== "object" || !Array.isArray((data as { items?: unknown }).items)) {
    return { ok: false, code: "queue_failed" };
  }
  const raw = (data as { items: unknown[] }).items;
  const stamped = raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { id?: unknown; created_at?: unknown };
    if (typeof row.id !== "string" || typeof row.created_at !== "string") return [];
    return [{ id: row.id, createdAt: row.created_at }];
  });
  const items = raw.flatMap((item) => {
    const mapped = mapReviewQueueItem(item);
    return mapped ? [mapped] : [];
  });
  return {
    ok: true,
    page: {
      items,
      next: cursorFromQueuePage(stamped),
      openReviewCount: readCount(data, "open_review_count"),
      publishedCount: readCount(data, "published_count"),
      rejectedCount: readCount(data, "rejected_count"),
    },
  };
}

export async function loadOpenReviewQueue(
  supabase: SupabaseClient,
  ready = FEEDBACK_REVIEW_DISPOSITION_READY,
): Promise<{ ok: true; items: FeedbackOpsRow[] } | { ok: false; code: string }> {
  if (ready !== true) return { ok: false, code: "disposition_unavailable" };
  const items: FeedbackOpsRow[] = [];
  let before: string | null = null;
  let beforeId: string | null = null;
  for (let page = 0; page < 50; page += 1) {
    const result = await loadReviewQueuePage(supabase, { queue: "review", limit: 100, before, beforeId }, true);
    if (!result.ok) return result;
    items.push(...result.page.items.filter((item) => item.reviewDisposition === "open" || item.reviewDisposition == null));
    if (!result.page.next) break;
    before = result.page.next.before;
    beforeId = result.page.next.beforeId;
  }
  return { ok: true, items };
}
