"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CspNotificationsLabels } from "@/lib/partners-portal/csp-section-labels";
import { AipifyAlert, AipifyCard, AipifyPageHeader } from "./design";

export type { CspNotificationsLabels };

type Phase = "loading" | "empty" | "ready" | "error";

type UnreadRow = {
  id: string;
  subject: string | null;
  created_at: string;
};

/**
 * Seller notifications — derived from unread admin messages (authoritative Core path).
 * No invented alerts. When the messages API is gated, show an honest empty state with next step.
 */
export function CertifiedSalesPartnerNotificationsPanel({ labels }: { labels: CspNotificationsLabels }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [unread, setUnread] = useState<UnreadRow[]>([]);

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/certified-sales-partner/messages", { cache: "no-store" });
      const body = (await res.json().catch(() => null)) as {
        found?: boolean;
        backend_ready?: boolean;
        error?: string;
        messages?: Array<Record<string, unknown>>;
      } | null;

      if (res.status === 403 || res.status === 503 || body?.backend_ready === false) {
        setUnread([]);
        setPhase("empty");
        return;
      }
      if (!res.ok || !body?.found) {
        setUnread([]);
        setPhase("error");
        return;
      }

      const rows = Array.isArray(body.messages) ? body.messages : [];
      const next = rows.flatMap((row) => {
        if (row.direction !== "admin_to_partner") return [];
        if (typeof row.read_at === "string" && row.read_at.trim()) return [];
        const id = typeof row.id === "string" ? row.id : "";
        if (!id) return [];
        return [
          {
            id,
            subject: typeof row.subject === "string" ? row.subject : null,
            created_at: typeof row.created_at === "string" ? row.created_at : "",
          },
        ];
      });
      setUnread(next);
      setPhase(next.length === 0 ? "empty" : "ready");
    } catch {
      setUnread([]);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="w-full space-y-6">
      <AipifyPageHeader title={labels.title} description={labels.intro} eyebrow="Aipify" />

      {phase === "loading" ? <AipifyLoader centered size="sm" /> : null}

      {phase === "error" ? (
        <AipifyAlert
          tone="danger"
          title={labels.errorTitle}
          actions={
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex rounded-xl border border-aipify-border px-4 py-2 text-sm font-semibold"
            >
              {labels.retry}
            </button>
          }
        >
          {labels.errorBody}
        </AipifyAlert>
      ) : null}

      {phase === "empty" ? (
        <AipifyAlert
          tone="info"
          title={labels.emptyTitle}
          actions={
            <>
              <Link
                href="/partners/account/messages"
                className="inline-flex rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white"
              >
                {labels.messagesCta}
              </Link>
              <Link
                href="/partners"
                className="inline-flex rounded-xl border border-aipify-border px-4 py-2 text-sm font-semibold text-aipify-text"
              >
                {labels.homeCta}
              </Link>
            </>
          }
        >
          {labels.emptyBody}
        </AipifyAlert>
      ) : null}

      {phase === "ready" ? (
        <AipifyCard>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]">
              <Bell className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-aipify-text">{labels.unreadTitle}</h3>
              <p className="mt-2 text-sm text-aipify-text-secondary">{labels.unreadBody}</p>
              <ul className="mt-4 space-y-2">
                {unread.map((row) => (
                  <li key={row.id}>
                    <AipifyAlert
                      tone="primary"
                      title={row.subject || labels.messagesCta}
                      actions={
                        <Link
                          href="/partners/account/messages"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED]"
                        >
                          <MessageSquare className="h-4 w-4" aria-hidden />
                          {labels.messagesCta}
                        </Link>
                      }
                    >
                      {row.created_at ? (
                        <time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString()}</time>
                      ) : null}
                    </AipifyAlert>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AipifyCard>
      ) : null}
    </div>
  );
}
