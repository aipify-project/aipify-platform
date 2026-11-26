"use client";

import Link from "next/link";

export type CspNotificationsLabels = {
  title: string;
  intro: string;
  emptyTitle: string;
  emptyBody: string;
  messagesCta: string;
  homeCta: string;
};

export function CertifiedSalesPartnerNotificationsPanel({ labels }: { labels: CspNotificationsLabels }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
        <p className="max-w-3xl text-sm text-aipify-text-secondary">{labels.intro}</p>
      </header>
      <section className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm" role="status">
        <h3 className="font-semibold text-aipify-text">{labels.emptyTitle}</h3>
        <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/partners/account/messages"
            className="inline-flex rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white"
          >
            {labels.messagesCta}
          </Link>
          <Link
            href="/partners"
            className="inline-flex rounded-xl border border-aipify-border px-4 py-2 text-sm font-semibold text-aipify-text"
          >
            {labels.homeCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

export function buildCspNotificationsLabels(t: (key: string) => string): CspNotificationsLabels {
  const p = "partnersPortal.certifiedSalesPartner.notifications";
  return {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    messagesCta: t(`${p}.messagesCta`),
    homeCta: t(`${p}.homeCta`),
  };
}
