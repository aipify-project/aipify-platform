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

const ICON_LINK =
  `inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-white transition hover:border-[#7C3AED]/35 hover:text-[#7C3AED] sm:h-11 sm:w-11 ${SELLER_PORTAL_LAYOUT.focusRing}`;

type Props = {
  locale: AppLocale;
  labels: PartnersPortalTopbarLabels;
  /** Same-origin pointer to the partner's own profile photo, when set. */
  avatarUrl?: string | null;
};

/**
 * Seller-portal topbar actions — language, feedback, messages, notifications, profile menu.
 * Counts are not hardcoded; unread badges require a real data source before display.
 */
export function PartnersPortalTopbarActions({ locale, labels, avatarUrl = null }: Props) {
  const pathname = usePathname() || "/partners";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
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

  const iconItems = [
    {
      key: "messages",
      href: "/partners/account/messages",
      label: labels.messages,
      icon: <MessageSquare className="h-5 w-5" aria-hidden />,
    },
    {
      key: "notifications",
      href: "/partners/account/notifications",
      label: labels.notifications,
      icon: <Bell className="h-5 w-5" aria-hidden />,
    },
  ] as const;

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
      {iconItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={`${ICON_LINK} ${
              active ? "border-[#7C3AED]/50 text-[#7C3AED]" : "border-[#E8E4F2] text-[#64748B]"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}

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
