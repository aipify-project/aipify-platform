"use client";

import Link from "next/link";

type AccountNotificationsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    back: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    emptyActionHref: string;
    secondaryAction: string;
    secondaryActionHref: string;
  };
};

export function AccountNotificationsPanel({ labels }: AccountNotificationsPanelProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <header className="space-y-3">
        <Link
          href="/app/account/preferences"
          className="text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
        >
          {labels.back}
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-lg font-semibold text-gray-900">{labels.emptyTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{labels.emptyDescription}</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={labels.emptyActionHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              {labels.emptyAction}
            </Link>
            <Link
              href={labels.secondaryActionHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {labels.secondaryAction}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
