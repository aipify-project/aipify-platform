"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Bell, MessageSquare, Settings2, UserRound } from "lucide-react";
import { AppLanguageSelector } from "@/components/app/AppLanguageSelector";
import { TopbarShareFeedbackButton } from "@/components/app/voice-of-the-customer/TopbarShareFeedbackButton";
import type { AppLocale } from "@/lib/i18n/app-locales";
import type { PartnersPortalTopbarLabels } from "@/lib/partners-portal/shell-labels";
import { SELLER_PORTAL_LAYOUT } from "@/lib/partners-portal/design-tokens";
import {
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
} from "@/lib/platform-presentation-quality/date-time";
import { subscribeCspUnreadInvalidate } from "@/lib/certified-sales-partner/unread-invalidate";
import { usePollingTask } from "@/lib/polling/use-polling-task";
import {
  CSP_TOPBAR_UNREAD_TIMEOUT_MS,
  mapPartnersHrefToAppHost,
} from "@/lib/sales-partner-app-migration/phase-c-shared-surfaces";
import { PARTNER_FEEDBACK_POLICY_ARTICLE_PATH } from "@/lib/voice-of-the-customer/constants";

const ICON_LINK =
  `relative inline-flex h-11 min-h-11 min-w-11 items-center justify-center overflow-visible rounded-xl border bg-white transition hover:border-[#7C3AED]/35 hover:text-[#7C3AED] sm:h-12 sm:min-w-12 ${SELLER_PORTAL_LAYOUT.focusRing}`;

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

type UnreadPreview = {
  id: string;
  sender: string;
  subject: string | null;
  excerpt: string;
  created_at: string;
  href: string;
};

type Props = {
  locale: AppLocale;
  labels: PartnersPortalTopbarLabels;
  /** Same-origin pointer to the partner's own profile photo, when set. */
  avatarUrl?: string | null;
};

/**
 * Seller-portal topbar actions — language, feedback, messages, notifications, profile menu.
 * Unread badge uses real admin→partner messages only; never invents counts.
 */
export function PartnersPortalTopbarActions({ locale, labels, avatarUrl = null }: Props) {
  const pathname = usePathname() || "/partners";
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unread, setUnread] = useState<UnreadPreview[]>([]);
  const menuId = useId();
  const bellId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadSeqRef = useRef(0);

  const abortUnreadRef = useRef<AbortController | null>(null);

  const refreshUnread = useCallback(async () => {
    const seq = ++unreadSeqRef.current;
    abortUnreadRef.current?.abort();
    const controller = new AbortController();
    abortUnreadRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), CSP_TOPBAR_UNREAD_TIMEOUT_MS);
    try {
      // Parallel fetches — do not serialize messages behind email CRM latency.
      const [msgRes, emailRes] = await Promise.all([
        fetch("/api/certified-sales-partner/messages?limit=40", {
          cache: "no-store",
          signal: controller.signal,
        }),
        fetch("/api/certified-sales-partner/email/notifications", {
          cache: "no-store",
          signal: controller.signal,
        }).catch(() => null),
      ]);
      const body = (await msgRes.json().catch(() => null)) as {
        found?: boolean;
        backend_ready?: boolean;
        messages?: Array<Record<string, unknown>>;
      } | null;
      if (seq !== unreadSeqRef.current) return false;
      if (!msgRes.ok || !body?.found || body.backend_ready === false) {
        setUnread([]);
        return false;
      }
      const rows = Array.isArray(body.messages) ? body.messages : [];
      const messagesHref = mapPartnersHrefToAppHost("/partners/account/messages");
      const next = rows.flatMap((row) => {
        // Own partner→admin messages must never count as unread for the sender.
        if (row.direction !== "admin_to_partner") return [];
        if (typeof row.read_at === "string" && row.read_at.trim()) return [];
        const id = typeof row.id === "string" ? row.id : "";
        if (!id) return [];
        const bodyText = typeof row.body === "string" ? row.body : "";
        return [
          {
            id,
            sender: labels.messages,
            subject: typeof row.subject === "string" ? row.subject : null,
            excerpt: bodyText.slice(0, 120),
            created_at: typeof row.created_at === "string" ? row.created_at : "",
            href: messagesHref,
          },
        ];
      });
      let emailRows: UnreadPreview[] = [];
      if (emailRes) {
        try {
          const emailBody = (await emailRes.json().catch(() => null)) as {
            found?: boolean;
            backend_ready?: boolean;
            unread?: Array<Record<string, unknown>>;
          } | null;
          if (seq !== unreadSeqRef.current) return false;
          emailRows =
            emailRes.ok &&
            emailBody?.found &&
            emailBody.backend_ready === true &&
            Array.isArray(emailBody.unread)
              ? emailBody.unread.flatMap((row) => {
                  const id = typeof row.id === "string" ? row.id : "";
                  const leadId = typeof row.lead_id === "string" ? row.lead_id : "";
                  if (!id || !leadId) return [];
                  const subject = typeof row.product_key === "string" ? row.product_key : null;
                  return [
                    {
                      id: `email:${id}`,
                      sender: labels.notifications,
                      subject,
                      excerpt: subject || labels.notifications,
                      created_at: typeof row.created_at === "string" ? row.created_at : "",
                      href: `/partners/marketing/email-inbox?lead=${encodeURIComponent(leadId)}`,
                    },
                  ];
                })
              : [];
        } catch {
          emailRows = [];
        }
      }
      if (seq !== unreadSeqRef.current) return false;
      setUnread(
        [...next, ...emailRows].sort((a, b) => compareTimestampsDesc(a.created_at, b.created_at)),
      );
      return true;
    } catch {
      if (seq !== unreadSeqRef.current) return false;
      // Keep prior badge state on transient errors — do not flash empty.
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }, [labels.messages, labels.notifications]);

  const pollUnread = useCallback(async () => refreshUnread(), [refreshUnread]);

  usePollingTask({
    taskKey: "csp-partner-topbar-unread",
    intervalMs: 90_000,
    hiddenIntervalMs: 180_000,
    enabled: true,
    runImmediately: true,
    execute: pollUnread,
  });

  useEffect(() => {
    return () => {
      abortUnreadRef.current?.abort();
      unreadSeqRef.current += 1;
    };
  }, []);

  // Soft-nav must not re-fetch the full messages+email unread payload on every
  // menu click — polling + visibility already keep the badge fresh. Only force
  // a refresh when entering communication surfaces where the unread set matters.
  useEffect(() => {
    const onMessages =
      pathname.includes("/account/messages") || pathname.includes("/sales-partner/messages");
    const onNotifications =
      pathname.includes("/account/notifications") ||
      pathname.includes("/sales-partner/notifications");
    if (onMessages || onNotifications) {
      void refreshUnread();
    }
  }, [refreshUnread, pathname]);

  useEffect(() => {
    return subscribeCspUnreadInvalidate((detail) => {
      if (detail.partner === false) return;
      void refreshUnread();
    });
  }, [refreshUnread]);

  useEffect(() => {
    if (!menuOpen && !bellOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (bellOpen && bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setBellOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setBellOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, bellOpen]);

  const unreadCount = unread.length;
  const messageUnreadCount = unread.filter((row) => !row.id.startsWith("email:")).length;
  const unreadLabel =
    unreadCount > 0
      ? `${labels.notifications} (${formatBadgeCount(unreadCount)})`
      : labels.notifications;
  const messagesLabel =
    messageUnreadCount > 0
      ? `${labels.messages} (${formatBadgeCount(messageUnreadCount)})`
      : labels.messages;
  const messagesHref = mapPartnersHrefToAppHost("/partners/account/messages");
  const notificationsHref = mapPartnersHrefToAppHost("/partners/account/notifications");
  const profileHref = mapPartnersHrefToAppHost("/partners/account/profile");
  const helpHref = mapPartnersHrefToAppHost("/partners/account/settings");
  const messagesActive =
    pathname.includes("/account/messages") || pathname.includes("/sales-partner/messages");
  const notificationsActive =
    pathname.includes("/account/notifications") ||
    pathname.includes("/sales-partner/notifications");

  return (
    <>
      <TopbarShareFeedbackButton
        labels={labels.feedback}
        pageContext={pathname}
        failureMessage={labels.feedbackUnavailable}
        policyHref={PARTNER_FEEDBACK_POLICY_ARTICLE_PATH}
      />
      <AppLanguageSelector
        currentLocale={locale}
        labels={labels.language}
        variant="header"
        navigationMode="soft"
      />

      <Link
        href={messagesHref}
        aria-label={messagesLabel}
        aria-current={messagesActive ? "page" : undefined}
        title={messagesLabel}
        className={`${ICON_LINK} ${
          messagesActive ? "border-[#7C3AED]/50 text-[#7C3AED]" : "border-[#E8E4F2] text-[#64748B]"
        }`}
      >
        <MessageSquare className="h-[22px] w-[22px]" aria-hidden />
        {messageUnreadCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-bold leading-none text-white ring-2 ring-white">
            {formatBadgeCount(messageUnreadCount)}
          </span>
        ) : null}
      </Link>

      <div className="relative" ref={bellRef}>
        <button
          type="button"
          aria-label={unreadLabel}
          aria-haspopup="menu"
          aria-expanded={bellOpen}
          aria-controls={bellId}
          title={unreadLabel}
          onClick={() => {
            setBellOpen((open) => !open);
            setMenuOpen(false);
            void refreshUnread();
          }}
          className={`relative ${ICON_LINK} ${
            unreadCount > 0
              ? "border-rose-300 text-rose-600"
              : bellOpen || notificationsActive
                ? "border-[#7C3AED]/50 text-[#7C3AED]"
                : "border-[#E8E4F2] text-[#64748B]"
          }`}
        >
          <Bell className={`h-[22px] w-[22px] ${unreadCount > 0 ? "text-rose-600" : ""}`} aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-bold leading-none text-white ring-2 ring-white">
              {formatBadgeCount(unreadCount)}
            </span>
          ) : null}
        </button>
        {bellOpen ? (
          <div
            id={bellId}
            role="menu"
            className="absolute right-0 z-40 mt-2 w-[min(28rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#E8E4F2] bg-white shadow-xl"
          >
            <div className="border-b border-[#E8E4F2] px-4 py-3">
              <p className="text-sm font-semibold text-[#1E293B]">{labels.notifications}</p>
            </div>
            {unreadCount === 0 ? (
              <p className="px-4 py-5 text-sm text-[#64748B]">{labels.notificationsEmpty}</p>
            ) : (
              <ul className="max-h-[28rem] space-y-1 overflow-y-auto p-2">
                {unread.slice(0, 20).map((row) => (
                  <li key={row.id}>
                    <Link
                      role="menuitem"
                      href={row.href}
                      className="block rounded-2xl border border-transparent px-3 py-3 hover:border-rose-200 hover:bg-rose-50/70"
                      onClick={() => setBellOpen(false)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-[#1E293B]">{row.sender}</p>
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                          {labels.unread}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-[#334155]">
                        {row.subject || labels.messages}
                      </p>
                      {row.excerpt ? (
                        <p className="mt-1 line-clamp-2 text-sm font-normal text-[#64748B]">{row.excerpt}</p>
                      ) : null}
                      {row.created_at ? (
                        <time
                          className="mt-2 block text-xs font-normal text-[#94A3B8]"
                          dateTime={row.created_at}
                        >
                          {formatPlatformDateTimeClock(row.created_at, {
                            locale,
                            emptyFallback: "",
                            invalidFallback: "",
                          })}
                        </time>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-[#E8E4F2] p-2">
              <Link
                role="menuitem"
                href={notificationsHref}
                className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-[#7C3AED] hover:bg-[#F6F4FB]"
                onClick={() => setBellOpen(false)}
              >
                {labels.notificationsViewAll}
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label={labels.profile}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          title={labels.profile}
          onClick={() => {
            setMenuOpen((open) => !open);
            setBellOpen(false);
          }}
          className={`${ICON_LINK} ${
            menuOpen ||
            pathname.includes("/account/profile") ||
            pathname.includes("/sales-partner/profile")
              ? "border-[#7C3AED]/50 text-[#7C3AED]"
              : "border-[#E8E4F2] text-[#64748B]"
          }`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- private same-origin pointer, not optimizable
            <img src={avatarUrl} alt={labels.avatarAlt} className="h-full w-full object-cover" />
          ) : (
            <UserRound className="h-5 w-5" aria-hidden />
          )}
        </button>
        {menuOpen ? (
          <div
            id={menuId}
            role="menu"
            className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-[#E8E4F2] bg-white py-1 shadow-lg"
          >
            <Link
              role="menuitem"
              href={profileHref}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#1E293B] hover:bg-[#F6F4FB]"
              onClick={() => setMenuOpen(false)}
            >
              <UserRound className="h-4 w-4 text-[#7C3AED]" aria-hidden />
              {labels.profile}
            </Link>
            <Link
              role="menuitem"
              href={helpHref}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#1E293B] hover:bg-[#F6F4FB]"
              onClick={() => setMenuOpen(false)}
            >
              <Settings2 className="h-4 w-4 text-[#7C3AED]" aria-hidden />
              {labels.settingsMenu}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
