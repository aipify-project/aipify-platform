"use client";

import Link from "next/link";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  title: string;
  subtitle: string;
  backendReady: boolean;
  notReadyTitle: string;
  notReadyBody: string;
  primaryActionHref?: string;
  primaryActionLabel?: string;
  metrics?: Array<{ label: string; value: string }>;
};

export function CertifiedSellersSectionPanel({
  title,
  subtitle,
  backendReady,
  notReadyTitle,
  notReadyBody,
  primaryActionHref,
  primaryActionLabel,
  metrics = [],
}: Props) {
  return (
    <div className={`${AipifyShellClasses.canvas} space-y-6 p-6 lg:p-8`}>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-companion-purple)]">
          Aipify
        </p>
        <h1 className="text-2xl font-semibold text-[color:var(--aipify-text-primary)]">{title}</h1>
        <p className="max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{subtitle}</p>
      </header>

      {!backendReady ? (
        <section
          className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm"
          role="status"
        >
          <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
            {notReadyTitle}
          </h2>
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{notReadyBody}</p>
        </section>
      ) : null}

      {metrics.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-5 shadow-sm"
            >
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text-primary)]">
                {metric.value}
              </p>
            </article>
          ))}
        </section>
      ) : null}

      {primaryActionHref && primaryActionLabel ? (
        <div>
          <Link
            href={primaryActionHref}
            className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
          >
            {primaryActionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
