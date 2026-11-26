/**
 * Outbound sales email. `accepted_by_provider` is provider acceptance, not inbox delivery.
 * Message bodies are never written to logs.
 */
import { SALES_EMAIL_FROM } from "./catalog";
import { normalizeEmailAddress } from "./gates";

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const recentSends = new Map<string, number>();
const idempotentResults = new Map<string, SalesEmailProviderResult>();

export type SalesEmailProviderResult =
  | { status: "not_configured" }
  | { status: "failed"; error: "provider_rejected" }
  | { status: "accepted_by_provider"; providerId?: string; duplicate: boolean };

export function resetSalesEmailSendState(): void {
  recentSends.clear();
  idempotentResults.clear();
}

export function salesEmailRateLimited(partnerId: string, now = Date.now()): boolean {
  const windowMs = 60 * 60 * 1000;
  const stamps = [...recentSends.entries()].filter(([key, at]) => key.startsWith(`${partnerId}:`) && now - at < windowMs);
  return stamps.length >= 3;
}

function rememberSend(partnerId: string, now = Date.now()): void {
  recentSends.set(`${partnerId}:${now}:${recentSends.size}`, now);
  if (recentSends.size > 5000) {
    for (const [key, at] of recentSends) {
      if (now - at > 60 * 60 * 1000) recentSends.delete(key);
    }
  }
}

export async function sendSalesEmail(input: {
  apiKey: string | null;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  idempotencyKey: string;
  partnerId: string;
  fetchImpl?: typeof fetch;
}): Promise<SalesEmailProviderResult> {
  const cached = idempotentResults.get(input.idempotencyKey);
  if (cached?.status === "accepted_by_provider") return { ...cached, duplicate: true };
  if (cached) return cached;
  const apiKey = input.apiKey?.trim() ?? "";
  if (!apiKey) return { status: "not_configured" };
  const fetchImpl = input.fetchImpl ?? fetch;
  try {
    const res = await fetchImpl(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: SALES_EMAIL_FROM,
        to: [normalizeEmailAddress(input.to)],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });
    if (!res.ok) {
      const failed: SalesEmailProviderResult = { status: "failed", error: "provider_rejected" };
      return failed;
    }
    const json = (await res.json().catch(() => null)) as { id?: unknown } | null;
    const providerId = typeof json?.id === "string" ? json.id : undefined;
    const result: SalesEmailProviderResult = {
      status: "accepted_by_provider",
      duplicate: false,
      ...(providerId ? { providerId } : {}),
    };
    idempotentResults.set(input.idempotencyKey, result);
    rememberSend(input.partnerId);
    return result;
  } catch {
    return { status: "failed", error: "provider_rejected" };
  }
}
