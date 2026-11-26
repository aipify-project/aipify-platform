"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";

export type CspNotificationsLabels = {
  title: string;
  intro: string;
  emptyTitle: string;
  emptyBody: string;
  messagesCta: string;
  homeCta: string;
  unreadTitle: string;
  unreadBody: string;
  retry: string;
  errorTitle: string;
  errorBody: string;
};

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
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
        <p className="max-w-3xl text-sm text-aipify-text-secondary">{labels.intro}</p>
      </header>

      {phase === "loading" ? <AipifyLoader centered size="sm" /> : null}

      {phase === "error" ? (
        <section className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm" role="alert">
          <h3 className="font-semibold text-aipify-text">{labels.errorTitle}</h3>
          <p className="mt-2 text-sm text-aipify-text-secondary">{labels.errorBody}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex rounded-xl border border-aipify-border px-4 py-2 text-sm font-semibold"
          >
            {labels.retry}
          </button>
        </section>
      ) : null}

      {phase === "empty" ? (
        <section className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm" role="status">
          <h3 className="font-semibold text-aipify-text">{labels.emptyTitle}</h3>
          <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
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
          </div>
        </section>
      ) : null}

      {phase === "ready" ? (
        <section className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
          <h3 className="font-semibold text-aipify-text">{labels.unreadTitle}</h3>
          <p className="mt-2 text-sm text-aipify-text-secondary">{labels.unreadBody}</p>
          <ul className="mt-4 space-y-2">
            {unread.map((row) => (
              <li key={row.id} className="rounded-xl border border-aipify-border px-3 py-2 text-sm">
                <p className="font-medium text-aipify-text">{row.subject || labels.messagesCta}</p>
                {row.created_at ? (
                  <p className="mt-1 text-xs text-aipify-text-secondary">
                    <time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString()}</time>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <Link
            href="/partners/account/messages"
            className="mt-4 inline-flex rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white"
          >
            {labels.messagesCta}
          </Link>
        </section>
      ) : null}
    </div>
  );
}

export function buildCspNotificationsLabels(t: (key: string) => string): CspNotificationsLabels {
  const p = "partnersPortal.certifiedSalesPartner.notifications";
  const messages = "partnersPortal.certifiedSalesPartner.messages";
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    messagesCta: t(`${p}.messagesCta`),
    homeCta: t(`${p}.homeCta`),
    unreadTitle: t(`${p}.unreadTitle`),
    unreadBody: t(`${p}.unreadBody`),
    retry: t(`${messages}.retry`),
    errorTitle: t(`${messages}.errorTitle`),
    errorBody: t(`${messages}.errorBody`),
  };
}
