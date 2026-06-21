"use client";

import Link from "next/link";
import { AppLanguageSelector, coerceClientAppLocale } from "@/components/app/AppLanguageSelector";
import type { AppLanguageSelectorLabels } from "@/components/app/AppLanguageSelector";
import { AipifyWebAppInstallAction } from "@/components/pwa/AipifyWebAppInstallAction";
import type { AppLocale } from "@/lib/i18n/app-locales";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type AccountPreferencesPanelProps = {
  currentLocale: AppLocale;
  languageLabels: AppLanguageSelectorLabels;
  pwaLabels: PwaInstallLabels;
  labels: {
    title: string;
    subtitle: string;
    languageSection: string;
    languageHint: string;
    timezoneSection: string;
    timezoneHint: string;
    notificationsLink: string;
    notificationsHint: string;
    webAppSection: string;
    webAppHint: string;
    webAppGuideLink: string;
    back: string;
  };
};

export function AccountPreferencesPanel({
  currentLocale,
  languageLabels,
  pwaLabels,
  labels,
}: AccountPreferencesPanelProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <header className="space-y-3">
        <Link
          href="/app/settings"
          className="text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
        >
          {labels.back}
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.languageSection}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.languageHint}</p>
        <div className="mt-4">
          <AppLanguageSelector
            currentLocale={coerceClientAppLocale(currentLocale)}
            labels={languageLabels}
            variant="settings"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.timezoneSection}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.timezoneHint}</p>
        <Link
          href="/app/settings"
          className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {labels.back}
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.webAppSection}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.webAppHint}</p>
        <div className="mt-4">
          <AipifyWebAppInstallAction labels={pwaLabels} variant="button" />
        </div>
        <Link
          href="/knowledge/articles/installing-aipify-web-app"
          className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {labels.webAppGuideLink}
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.notificationsHint}</h2>
        <Link
          href="/app/account/notifications"
          className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {labels.notificationsLink}
        </Link>
      </section>
    </div>
  );
}
