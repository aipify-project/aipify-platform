"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageSquare, UserRound } from "lucide-react";
import { AppLanguageSelector } from "@/components/app/AppLanguageSelector";
import { TopbarShareFeedbackButton } from "@/components/app/voice-of-the-customer/TopbarShareFeedbackButton";
import type { AppLocale } from "@/lib/i18n/app-locales";
import type { PartnersPortalTopbarLabels } from "@/lib/partners-portal/shell-labels";

const ICON_LINK =
  "inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-aipify-surface transition hover:border-aipify-companion/35 hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus sm:h-11 sm:w-11";

type Props = {
  locale: AppLocale;
  labels: PartnersPortalTopbarLabels;
  /** Same-origin pointer to the partner's own profile photo, when set. */
  avatarUrl?: string | null;
};

/**
 * Seller-portal topbar actions — reuses the APP language selector (central locale registry,
 * `/api/locale` app scope) and the Voice of the Customer feedback dialog.
 * Messages and notifications only link to the signed-in partner's own pages.
 */
export function PartnersPortalTopbarActions({ locale, labels, avatarUrl = null }: Props) {
  const pathname = usePathname() || "/partners";

  const items = [
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
    {
      key: "profile",
      href: "/partners/account/profile",
      label: labels.profile,
      icon: avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- private same-origin pointer, not optimizable
        <img src={avatarUrl} alt={labels.avatarAlt} className="h-full w-full object-cover" />
      ) : (
        <UserRound className="h-5 w-5" aria-hidden />
      ),
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
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={`${ICON_LINK} ${
              active
                ? "border-aipify-companion/50 text-aipify-companion"
                : "border-aipify-border text-aipify-text-secondary"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}
    </>
  );
}
