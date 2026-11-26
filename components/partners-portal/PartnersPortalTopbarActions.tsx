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

const ICON_LINK =
  `inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-white transition hover:border-[#7C3AED]/35 hover:text-[#7C3AED] sm:h-11 sm:w-11 ${SELLER_PORTAL_LAYOUT.focusRing}`;

type UnreadPreview = {
  id: string;
  subject: string | null;
  created_at: string;
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

  const refreshUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/certified-sales-partner/messages", { cache: "no-store" });
      const body = (await res.json().catch(() => null)) as {
        found?: boolean;
        backend_ready?: boolean;
        messages?: Array<Record<string, unknown>>;
      } | null;
      if (!res.ok || !body?.found || body.backend_ready === false) {
        setUnread([]);
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
    } catch {
      setUnread([]);
    }
  }, []);

  useEffect(() => {
    void refreshUnread();
    const timer = window.setInterval(() => void refreshUnread(), 60_000);
    return () => window.clearInterval(timer);
  }, [refreshUnread, pathname]);

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
  const unreadLabel =
    unreadCount > 0
      ? `${labels.notifications} (${unreadCount > 9 ? "9+" : unreadCount})`
      : labels.notifications;
  const messagesActive =
    pathname === "/partners/account/messages" || pathname.startsWith("/partners/account/messages/");
  const notificationsActive =
    pathname === "/partners/account/notifications" ||
    pathname.startsWith("/partners/account/notifications/");

  return (
    <>
      <TopbarShareFeedbackButton
        labels={labels.feedback}
        pageContext={pathname}
        failureMessage={labels.feedbackUnavailable}
      />
      <AppLanguageSelector
        currentLocale={locale}
        labels={labels.language}
        variant="header"
        navigationMode="soft"
      />

      <Link
        href="/partners/account/messages"
        aria-label={labels.messages}
        aria-current={messagesActive ? "page" : undefined}
        title={labels.messages}
        className={`${ICON_LINK} ${
          messagesActive ? "border-[#7C3AED]/50 text-[#7C3AED]" : "border-[#E8E4F2] text-[#64748B]"
        }`}
      >
        <MessageSquare className="h-5 w-5" aria-hidden />
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
            bellOpen || notificationsActive
              ? "border-[#7C3AED]/50 text-[#7C3AED]"
              : "border-[#E8E4F2] text-[#64748B]"
          }`}
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[0.65rem] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
        {bellOpen ? (
          <div
            id={bellId}
            role="menu"
            className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-[#E8E4F2] bg-white shadow-lg"
          >
            <div className="border-b border-[#E8E4F2] px-3 py-2.5">
              <p className="text-sm font-semibold text-[#1E293B]">{labels.notifications}</p>
            </div>
            {unreadCount === 0 ? (
              <p className="px-3 py-4 text-sm text-[#64748B]">{labels.notificationsEmpty}</p>
            ) : (
              <ul className="max-h-72 overflow-y-auto py-1">
                {unread.slice(0, 8).map((row) => (
                  <li key={row.id}>
                    <Link
                      role="menuitem"
                      href="/partners/account/messages"
                      className="block px-3 py-2.5 hover:bg-[#F6F4FB]"
                      onClick={() => setBellOpen(false)}
                    >
                      <p className="truncate text-sm font-medium text-[#1E293B]">
                        {row.subject || labels.messages}
                      </p>
                      {row.created_at ? (
                        <time className="text-xs text-[#94A3B8]" dateTime={row.created_at}>
                          {new Date(row.created_at).toLocaleString()}
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
                href="/partners/account/notifications"
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
            menuOpen || pathname.startsWith("/partners/account/profile")
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
              href="/partners/account/profile"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#1E293B] hover:bg-[#F6F4FB]"
              onClick={() => setMenuOpen(false)}
            >
              <UserRound className="h-4 w-4 text-[#7C3AED]" aria-hidden />
              {labels.profile}
            </Link>
            <Link
              role="menuitem"
              href="/partners/account/settings"
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
