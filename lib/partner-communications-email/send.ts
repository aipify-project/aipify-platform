import { wrapQueuedPartnerEmailHtml } from "./render-html";
import type { PartnerEmailOutboxItem } from "./types";

export type SendPartnerEmailResult = {
  id: string;
  status: "sent" | "failed";
  error?: string;
};

export async function sendPartnerEmail(item: PartnerEmailOutboxItem): Promise<SendPartnerEmailResult> {
  const context = item.context ?? {};
  const senderEmail = String(context.sender_email ?? "partners@aipify.ai");
  const senderName = String(context.sender_name ?? "Aipify Group AS");
  const html = wrapQueuedPartnerEmailHtml(item.html_body, context, item.subject);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { id: item.id, status: "sent" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: [item.recipient_email],
        subject: item.subject,
        html,
        text: item.plain_text_body || undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { id: item.id, status: "failed", error: body.slice(0, 500) };
    }

    return { id: item.id, status: "sent" };
  } catch (error) {
    return {
      id: item.id,
      status: "failed",
      error: error instanceof Error ? error.message : "Send failed",
    };
  }
}

export async function processPartnerEmailOutbox(
  items: PartnerEmailOutboxItem[],
  markDelivery: (id: string, status: string, error?: string) => Promise<void>,
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const item of items) {
    const result = await sendPartnerEmail(item);
    if (result.status === "sent") {
      sent += 1;
      await markDelivery(item.id, "sent");
    } else {
      failed += 1;
      await markDelivery(item.id, "failed", result.error);
    }
  }

  return { sent, failed };
}
