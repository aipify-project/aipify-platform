"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CspNotificationsLabels } from "@/lib/partners-portal/csp-section-labels";
import {
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
} from "@/lib/platform-presentation-quality/date-time";
import {
  CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS,
  mapPartnersHrefToAppHost,
} from "@/lib/sales-partner-app-migration/phase-c-shared-surfaces";
import { AipifyAlert, AipifyCard, AipifyPageHeader } from "./design";

export type { CspNotificationsLabels };

type Phase = "loading" | "empty" | "ready" | "error";

type UnreadRow = {
  id: string;
  subject: string | null;
  excerpt: string;
  created_at: string;
};

/**
 * Seller notifications — derived from unread admin messages (authoritative Core path).
 * No invented alerts. When the messages API is gated, show an honest empty state with next step.
 */
export function CertifiedSalesPartnerNotificationsPanel({
  labels,
  locale = "no",
}: {
  labels: CspNotificationsLabels;
  locale?: string;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [unread, setUnread] = useState<UnreadRow[]>([]);
  const dateOptions = { locale, emptyFallback: "—", invalidFallback: "—" };

  const messagesHref = mapPartnersHrefToAppHost("/partners/account/messages");
  const homeHref = mapPartnersHrefToAppHost("/partners");

  const load = useCallback(async () => {
    setPhase("loading");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch("/api/certified-sales-partner/messages", {
        cache: "no-store",
        signal: controller.signal,
      });
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
      const next = rows
        .flatMap((row) => {
          if (row.direction !== "admin_to_partner") return [];
          if (typeof row.read_at === "string" && row.read_at.trim()) return [];
          const id = typeof row.id === "string" ? row.id : "";
          if (!id) return [];
          const excerpt = typeof row.body === "string" ? row.body.slice(0, 160) : "";
          return [
            {
              id,
              subject: typeof row.subject === "string" ? row.subject : null,
              excerpt,
              created_at: typeof row.created_at === "string" ? row.created_at : "",
            },
          ];
        })
        .sort((a, b) => compareTimestampsDesc(a.created_at, b.created_at));
      setUnread(next);
      setPhase(next.length === 0 ? "empty" : "ready");
    } catch {
      setUnread([]);
      setPhase("error");
    } finally {
      window.clearTimeout(timeout);
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
                href={messagesHref}
                className="inline-flex rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white"
              >
                {labels.messagesCta}
              </Link>
              <Link
                href={homeHref}
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
                          href={messagesHref}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED]"
                        >
                          <MessageSquare className="h-4 w-4" aria-hidden />
                          {labels.messagesCta}
                        </Link>
                      }
                    >
                      {row.excerpt ? <p className="mb-2 text-sm font-normal">{row.excerpt}</p> : null}
                      {row.created_at ? (
                        <time className="text-xs font-normal" dateTime={row.created_at}>
                          {formatPlatformDateTimeClock(row.created_at, dateOptions)}
                        </time>
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
