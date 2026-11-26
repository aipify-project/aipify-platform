"use client";

import { useEffect, useState } from "react";
import { AipifyAlert, AipifyCard, AipifyPageHeader } from "./design";

type Message = { id: string; direction: string; body_text: string; created_at: string };
type Lead = { id: string; product_key: string; recipient_email: string; status: string };

export function CertifiedSalesPartnerEmailInbox({
  leadId,
  title,
  intro,
  empty,
}: {
  leadId: string | null;
  title: string;
  intro: string;
  empty: string;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;
    void (async () => {
      const thread = await fetch(`/api/certified-sales-partner/email/thread?lead=${encodeURIComponent(leadId)}`, {
        cache: "no-store",
      });
      const body = (await thread.json().catch(() => null)) as {
        found?: boolean;
        lead?: Lead;
        messages?: Message[];
        code?: string;
      } | null;
      if (cancelled) return;
      if (!thread.ok || !body?.found || !body.lead) {
        setNotice(body?.code || empty);
        return;
      }
      setLead(body.lead);
      setMessages(Array.isArray(body.messages) ? body.messages : []);
      const notes = await fetch("/api/certified-sales-partner/email/notifications", { cache: "no-store" });
      const unread = (await notes.json().catch(() => null)) as {
        backend_ready?: boolean;
        unread?: Array<{ id?: string; lead_id?: string }>;
      } | null;
      const match = unread?.backend_ready
        ? unread.unread?.find((item) => item.lead_id === leadId && item.id)
        : undefined;
      if (match?.id) {
        await fetch("/api/certified-sales-partner/email/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: match.id }),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadId, empty]);

  return (
    <div className="w-full space-y-5">
      <AipifyPageHeader title={title} description={intro} eyebrow="Aipify" />
      {!leadId ? <AipifyAlert tone="info" title={empty}>{empty}</AipifyAlert> : null}
      {notice ? <AipifyAlert tone="warning" title={notice}>{notice}</AipifyAlert> : null}
      {lead ? (
        <AipifyCard>
          <p className="text-sm font-semibold text-[#1E293B]">{lead.product_key}</p>
          <p className="mt-1 text-sm text-[#64748B]">{lead.recipient_email}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-[#94A3B8]">{lead.status}</p>
          <ul className="mt-4 space-y-3">
            {messages.map((message) => (
              <li key={message.id} className="rounded-xl bg-[#F8F7FC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{message.direction}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#1E293B]">{message.body_text}</p>
              </li>
            ))}
          </ul>
        </AipifyCard>
      ) : null}
    </div>
  );
}
