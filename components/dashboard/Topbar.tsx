import { AipifyShellClasses } from "@/lib/design";
import TopbarPresenceSlot from "./TopbarPresenceSlot";
import TopbarProfileMenu from "./TopbarProfileMenu";
import TopbarNotificationButton from "./TopbarNotificationButton";
import { TwoFactorSecurityBadge } from "@/components/ui/TwoFactorSecurityBadge";
import {
  AppLanguageSelector,
  coerceClientAppLocale,
  type AppLanguageSelectorLabels,
} from "@/components/app/AppLanguageSelector";
import type { AppLocale } from "@/lib/i18n/app-locales";
import type { PwaInstallLabels } from "@/lib/pwa/types";
import type { ReactNode } from "react";

type TopbarProps = {
  searchPlaceholder: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  companyName: string;
  companySelectorLabel: string;
  organizationSwitcher?: ReactNode;
  notificationsLabel: string;
  profileName: string;
  profileRole: string;
  profileRoleKey?: string;
  profileLoading?: boolean;
  signOutLabel: string;
  twoFactorBadgeLabels?: {
    enabled: string;
    required: string;
  };
  onMenuClick?: () => void;
  onCommandBarClick?: () => void;
  commandBarPlaceholder?: string;
  commandBarOpenLabel?: string;
  openMenuLabel?: string;
  locale?: AppLocale;
  languageSelectorLabels?: AppLanguageSelectorLabels;
  pwaLabels?: PwaInstallLabels;
  companionButton?: ReactNode;
};

export default function Topbar({
  searchPlaceholder,
  searchQuery = "",
  onSearchChange,
  companyName,
  companySelectorLabel,
  organizationSwitcher,
  notificationsLabel,
  profileName,
  profileRole,
  profileRoleKey = "owner",
  profileLoading = false,
  signOutLabel,
  twoFactorBadgeLabels,
  onMenuClick,
  onCommandBarClick,
  commandBarPlaceholder,
  commandBarOpenLabel,
  openMenuLabel = "Open menu",
  locale = "en",
  languageSelectorLabels,
  pwaLabels,
  companionButton,
}: TopbarProps) {
  return (
    <header className={`sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8 ${AipifyShellClasses.topbar}`}>
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label={openMenuLabel}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div className="relative min-w-0 flex-1 max-w-md">
          {onCommandBarClick ? (
            <button
              type="button"
              onClick={onCommandBarClick}
              aria-label={commandBarOpenLabel ?? commandBarPlaceholder ?? "Open command bar"}
              className={`flex w-full items-center gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted py-2.5 pl-10 pr-3 text-left text-sm text-aipify-text-muted transition hover:border-aipify-accent-muted hover:bg-aipify-surface focus:border-aipify-accent focus:bg-aipify-surface focus:outline-none focus:ring-2 focus:ring-aipify-focus`}
            >
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <span className="truncate">{commandBarPlaceholder}</span>
              <span className="ml-auto hidden shrink-0 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline">
                ⌘K
              </span>
            </button>
          ) : (
            <>
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                id="app-nav-search"
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className={`w-full rounded-xl border border-aipify-border bg-aipify-surface-muted py-2.5 pl-10 pr-4 text-sm text-aipify-text placeholder:text-aipify-text-muted transition focus:border-aipify-accent focus:bg-aipify-surface focus:outline-none focus:ring-2 focus:ring-aipify-focus`}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {organizationSwitcher ?? (
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 md:inline-flex"
            aria-label={companySelectorLabel}
          >
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
            <span className="max-w-[8rem] truncate">{companyName}</span>
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}

        <TopbarPresenceSlot />

        {languageSelectorLabels ? (
          <AppLanguageSelector
            currentLocale={coerceClientAppLocale(locale)}
            labels={languageSelectorLabels}
          />
        ) : null}

        {twoFactorBadgeLabels ? (
          <TwoFactorSecurityBadge labels={twoFactorBadgeLabels} />
        ) : null}

        {companionButton}

        <TopbarNotificationButton label={notificationsLabel} />

        <TopbarProfileMenu
          profileName={profileName}
          companyName={companyName}
          profileRole={profileRole}
          profileRoleKey={profileRoleKey}
          profileLoading={profileLoading}
          signOutLabel={signOutLabel}
          pwaLabels={pwaLabels}
        />
      </div>
    </header>
  );
}
