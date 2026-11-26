"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";
import { parseSellersOverview, parseSettlementList } from "@/lib/certified-sales-partner/platform-sellers-view";
import {
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
} from "@/lib/platform-presentation-quality/date-time";
import { usePollingTask } from "@/lib/polling/use-polling-task";

export type PlatformSellerAlertLabels = {
  title: string;
  empty: string;
  applications: string;
  settlements: string;
  messages: string;
  /** Short helper under the title — no longer claims read-state is missing. */
  readBlocked: string;
  loading: string;
  error: string;
  retry: string;
  close: string;
  locale: string;
  dateEmpty: string;
  dateInvalid: string;
  unread: string;
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

type Item = {
  id: string;
  href: string;
  title: string;
  sender: string;
  detail: string;
  createdAt: string;
  kind: "message" | "application" | "settlement";
  messageId?: string;
};

const PENDING = new Set(["registered", "under_review", "needs_information"]);

function isUnreadMessage(row: Record<string, unknown>): boolean {
  if (row.direction !== "partner_to_admin") return false;
  const readAt = row.read_at;
  return !(typeof readAt === "string" && readAt.trim());
}

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
  const dateOptions = {
    locale: labels.locale,
    emptyFallback: labels.dateEmpty,
    invalidFallback: labels.dateInvalid,
  };

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setPhase("loading");
    try {
      const [partnersRes, settlementsRes, messagesRes] = await Promise.all([
        fetch("/api/platform/sellers/partners", { cache: "no-store" }),
        fetch("/api/platform/sellers/settlements", { cache: "no-store" }),
        fetch("/api/platform/sellers/messages", { cache: "no-store" }),
      ]);
      if (partnersRes.status === 401 || partnersRes.status === 403) {
        setItems([]);
        setPhase("error");
        return false;
      }
      const partnersBody = await partnersRes.json().catch(() => null);
      const settlementsBody = await settlementsRes.json().catch(() => null);
      const messagesBody = await messagesRes.json().catch(() => null);
      const overview = partnersRes.ok ? parseSellersOverview(partnersBody) : null;
      const settlements = settlementsRes.ok ? parseSettlementList(settlementsBody) ?? [] : [];
      const messages = Array.isArray((messagesBody as { rows?: unknown } | null)?.rows)
        ? ((messagesBody as { rows: Array<Record<string, unknown>> }).rows)
        : [];
      const partnerName = new Map<string, string>();
      for (const partner of overview?.partners ?? []) {
        partnerName.set(
          partner.id,
          partner.name || partner.legalBusinessName || partner.id.slice(0, 8),
        );
      }

      const next: Item[] = [];
      for (const message of messages) {
        if (!isUnreadMessage(message)) continue;
        const partnerId = typeof message.partner_id === "string" ? message.partner_id : "";
        const preview = typeof message.body === "string" ? message.body : "";
        const messageId = typeof message.id === "string" ? message.id : "";
        const createdAt = typeof message.created_at === "string" ? message.created_at : "";
        next.push({
          id: `message-${messageId || next.length}`,
          href: partnerId
            ? `/platform/sellers/messages?partner=${encodeURIComponent(partnerId)}`
            : "/platform/sellers/messages",
          title: labels.messages,
          sender: (partnerId && partnerName.get(partnerId)) || labels.messages,
          detail: preview.slice(0, 120) || labels.messages,
          createdAt,
          kind: "message",
          messageId: messageId || undefined,
        });
      }
      for (const partner of overview?.partners ?? []) {
        if (!PENDING.has(partner.status)) continue;
        next.push({
          id: `partner-${partner.id}`,
          href: `/platform/sellers/partners/${partner.id}`,
          title: labels.applications,
          sender: partner.name || partner.legalBusinessName || partner.id.slice(0, 8),
          detail: partner.name || partner.legalBusinessName || partner.id.slice(0, 8),
          createdAt: "",
          kind: "application",
        });
      }
      for (const settlement of settlements) {
        if (settlement.status !== "open" && settlement.status !== "approved") continue;
        next.push({
          id: `settlement-${settlement.id}`,
          href: "/platform/sellers/settlements",
          title: labels.settlements,
          sender: labels.settlements,
          detail: settlement.periodMonth || settlement.id.slice(0, 8),
          createdAt: "",
          kind: "settlement",
        });
      }

      next.sort((a, b) => {
        if (a.kind === "message" && b.kind !== "message") return -1;
        if (b.kind === "message" && a.kind !== "message") return 1;
        return compareTimestampsDesc(a.createdAt, b.createdAt);
      });
      setItems(next.slice(0, 30));
      setPhase("ready");
      return true;
    } catch {
      setPhase("error");
      return false;
    }
  }, [labels.applications, labels.messages, labels.settlements]);

  usePollingTask({
    taskKey: "platform-seller-alerts",
    intervalMs: 20_000,
    hiddenIntervalMs: 60_000,
    enabled: true,
    runImmediately: true,
    execute: () => load({ silent: phase !== "idle" && phase !== "loading" }),
  });

  useEffect(() => {
    if (open) void load({ silent: true });
  }, [open, load]);

  async function openItem(item: Item) {
    setOpen(false);
    if (item.kind === "message" && item.messageId) {
      try {
        await fetch("/api/platform/sellers/messages/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message_id: item.messageId }),
        });
        setItems((prev) => prev.filter((row) => row.id !== item.id));
      } catch {
        // Navigation still proceeds; unread retry on next poll.
      }
    }
  }

  const unreadCount = items.filter((item) => item.kind === "message").length;
  const badgeCount = items.length;
  const ariaLabel =
    badgeCount > 0
      ? `${triggerLabel} (${badgeCount > 9 ? "9+" : badgeCount})`
      : triggerLabel;

  return (
    <div className="relative">
      <button
        type="button"
        className={`relative inline-flex items-center justify-center rounded-xl border bg-white p-2.5 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
          unreadCount > 0
            ? "border-rose-300 text-rose-600"
            : "border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          className={`h-5 w-5 ${unreadCount > 0 ? "text-rose-600" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {badgeCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-bold text-white ring-2 ring-white">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-labelledby={titleId}
          className="absolute right-0 z-30 mt-2 w-[min(28rem,calc(100vw-1.5rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-gray-900">
                {labels.title}
              </h2>
              <p className="mt-1 text-xs font-normal text-gray-500">{labels.readBlocked}</p>
            </div>
            <button type="button" className="text-xs font-semibold text-violet-700" onClick={() => setOpen(false)}>
              {labels.close}
            </button>
          </div>
          {phase === "loading" || phase === "idle" ? (
            <p className="mt-4 text-sm text-gray-600">{labels.loading}</p>
          ) : null}
          {phase === "error" ? (
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-violet-700"
              onClick={() => void load()}
            >
              {labels.retry}
            </button>
          ) : null}
          {phase === "ready" && items.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">{labels.empty}</p>
          ) : null}
          {phase === "ready" && items.length > 0 ? (
            <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="block rounded-2xl border border-gray-100 px-3 py-3 hover:border-rose-200 hover:bg-rose-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                    onClick={() => void openItem(item)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{item.sender}</p>
                      {item.kind === "message" ? (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                          {labels.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs font-medium text-violet-700">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-normal text-gray-600">{item.detail}</p>
                    {item.createdAt ? (
                      <time className="mt-2 block text-xs font-normal text-gray-500" dateTime={item.createdAt}>
                        {formatPlatformDateTimeClock(item.createdAt, dateOptions)}
                      </time>
                    ) : null}
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
