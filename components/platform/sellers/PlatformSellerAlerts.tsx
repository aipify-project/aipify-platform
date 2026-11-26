"use client";

import Link from "next/link";
import { createContext, useContext, useId, useState } from "react";
import { parseSellersOverview, parseSettlementList } from "@/lib/certified-sales-partner/platform-sellers-view";

export type PlatformSellerAlertLabels = {
  title: string;
  empty: string;
  applications: string;
  settlements: string;
  messages: string;
  readBlocked: string;
  loading: string;
  error: string;
  retry: string;
  close: string;
};

const LabelsContext = createContext<PlatformSellerAlertLabels | null>(null);

export function PlatformSellerAlertsProvider({
  labels,
  children,
}: {
  labels: PlatformSellerAlertLabels;
  children: React.ReactNode;
}) {
  return <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>;
}

export function usePlatformSellerAlerts(): PlatformSellerAlertLabels | null {
  return useContext(LabelsContext);
}

type Item = { id: string; href: string; title: string; detail: string };

const PENDING = new Set(["registered", "under_review", "needs_information"]);

export function PlatformSellerAlertsMenu({
  labels,
  triggerLabel,
}: {
  labels: PlatformSellerAlertLabels;
  triggerLabel: string;
}) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [items, setItems] = useState<Item[]>([]);

  async function load() {
    setPhase("loading");
    try {
      const [partnersRes, settlementsRes, messagesRes] = await Promise.all([
        fetch("/api/platform/sellers/partners", { cache: "no-store" }),
        fetch("/api/platform/sellers/settlements", { cache: "no-store" }),
        fetch("/api/platform/sellers/messages", { cache: "no-store" }),
      ]);
      if (partnersRes.status === 401 || partnersRes.status === 403) {
        setItems([]);
        setPhase("error");
        return;
      }
      const partnersBody = await partnersRes.json().catch(() => null);
      const settlementsBody = await settlementsRes.json().catch(() => null);
      const messagesBody = await messagesRes.json().catch(() => null);
      const overview = partnersRes.ok ? parseSellersOverview(partnersBody) : null;
      const settlements = settlementsRes.ok ? parseSettlementList(settlementsBody) ?? [] : [];
      const messages = Array.isArray((messagesBody as { rows?: unknown } | null)?.rows)
        ? ((messagesBody as { rows: Array<Record<string, unknown>> }).rows)
        : [];
      const next: Item[] = [];
      for (const partner of overview?.partners ?? []) {
        if (!PENDING.has(partner.status)) continue;
        next.push({
          id: `partner-${partner.id}`,
          href: `/platform/sellers/partners/${partner.id}`,
          title: labels.applications,
          detail: partner.name || partner.legalBusinessName || partner.id.slice(0, 8),
        });
      }
      for (const settlement of settlements) {
        if (settlement.status !== "open" && settlement.status !== "approved") continue;
        next.push({
          id: `settlement-${settlement.id}`,
          href: "/platform/sellers/settlements",
          title: labels.settlements,
          detail: settlement.periodMonth || settlement.id.slice(0, 8),
        });
      }
      for (const message of messages) {
        if (message.direction !== "partner_to_admin") continue;
        const partnerId = typeof message.partner_id === "string" ? message.partner_id : "";
        const preview = typeof message.body === "string" ? message.body : "";
        next.push({
          id: `message-${String(message.id ?? next.length)}`,
          href: partnerId ? `/platform/sellers/messages?partner=${encodeURIComponent(partnerId)}` : "/platform/sellers/messages",
          title: labels.messages,
          detail: preview.slice(0, 80) || labels.messages,
        });
        if (next.filter((item) => item.id.startsWith("message-")).length >= 8) break;
      }
      setItems(next.slice(0, 20));
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && phase === "idle") void load();
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-labelledby={titleId}
          className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-3 shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-sm font-semibold text-gray-900">{labels.title}</h2>
            <button type="button" className="text-xs font-semibold text-violet-700" onClick={() => setOpen(false)}>
              {labels.close}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">{labels.readBlocked}</p>
          {phase === "loading" ? <p className="mt-3 text-sm text-gray-600">{labels.loading}</p> : null}
          {phase === "error" ? (
            <button type="button" className="mt-3 text-sm font-semibold text-violet-700" onClick={() => void load()}>
              {labels.retry}
            </button>
          ) : null}
          {phase === "ready" && items.length === 0 ? <p className="mt-3 text-sm text-gray-600">{labels.empty}</p> : null}
          {phase === "ready" && items.length > 0 ? (
            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="block rounded-xl px-2 py-2 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="truncate text-xs text-gray-600">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
