"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, MessageSquare, Settings2, UserRound } from "lucide-react";
import { AppLanguageSelector } from "@/components/app/AppLanguageSelector";
import { TopbarShareFeedbackButton } from "@/components/app/voice-of-the-customer/TopbarShareFeedbackButton";
import type { AppLocale } from "@/lib/i18n/app-locales";
import type { PartnersPortalTopbarLabels } from "@/lib/partners-portal/shell-labels";
import { SELLER_PORTAL_LAYOUT } from "@/lib/partners-portal/design-tokens";
import {
  mapPartnersHrefToAppHost,
  SALES_PARTNER_PHASE_C_SHARED_SURFACES,
} from "@/lib/sales-partner-app-migration/phase-c-shared-surfaces";
import { PARTNER_MESSAGE_UNREAD_BADGE } from "@/lib/sales-partner-app-migration/messaging-performance";
import { PARTNER_FEEDBACK_POLICY_ARTICLE_PATH } from "@/lib/voice-of-the-customer/constants";

const ICON_LINK =
  `relative inline-flex h-11 min-h-11 min-w-11 items-center justify-center overflow-visible rounded-xl border bg-white transition hover:border-[#7C3AED]/35 hover:text-[#7C3AED] sm:h-12 sm:min-w-12 ${SELLER_PORTAL_LAYOUT.focusRing}`;

type Props = {
  locale: AppLocale;
  labels: PartnersPortalTopbarLabels;
  /** Same-origin pointer to the partner's own profile photo, when set. */
  avatarUrl?: string | null;
};

/**
 * Seller-portal topbar — language, feedback, messages link, shared APP notifications, profile.
 *
 * Partner message lists are NEVER fetched here (Messaging Performance V1).
 * Unread badge deferred until a lightweight count RPC ships — never invent 0.
 */
export function PartnersPortalTopbarActions({ locale, labels, avatarUrl = null }: Props) {
  const pathname = usePathname() || "/partners";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const messagesHref = mapPartnersHrefToAppHost("/partners/account/messages");
  const notificationsHref = SALES_PARTNER_PHASE_C_SHARED_SURFACES.notificationsApp.href;
  const profileHref = mapPartnersHrefToAppHost("/partners/account/profile");
  const helpHref = mapPartnersHrefToAppHost("/partners/account/settings");
  const messagesActive =
    pathname.includes("/account/messages") || pathname.includes("/sales-partner/messages");
  const notificationsActive =
    pathname === "/app/notifications" || pathname.startsWith("/app/notifications/");

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
        aria-label={labels.messages}
        aria-current={messagesActive ? "page" : undefined}
        title={labels.messages}
        className={`${ICON_LINK} ${
          messagesActive ? "border-[#7C3AED]/50 text-[#7C3AED]" : "border-[#E8E4F2] text-[#64748B]"
        }`}
      >
        <MessageSquare className="h-[22px] w-[22px]" aria-hidden />
        {PARTNER_MESSAGE_UNREAD_BADGE.status === "live_count_rpc" ? (
          // Count RPC not shipped — reserved for future badge render.
          null
        ) : null}
      </Link>

      <Link
        href={notificationsHref}
        aria-label={labels.notifications}
        aria-current={notificationsActive ? "page" : undefined}
        title={labels.notifications}
        className={`${ICON_LINK} ${
          notificationsActive
            ? "border-[#7C3AED]/50 text-[#7C3AED]"
            : "border-[#E8E4F2] text-[#64748B]"
        }`}
      >
        <Bell className="h-[22px] w-[22px]" aria-hidden />
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label={labels.profile}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          title={labels.profile}
          onClick={() => setMenuOpen((open) => !open)}
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
