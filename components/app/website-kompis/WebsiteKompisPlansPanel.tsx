import type { ReactNode } from "react";
import Link from "next/link";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import {
  WEBSITE_KOMPIS_PLAN_CATALOG,
  type WebsiteKompisLicenseQuotaRead,
  type WebsiteKompisPlanDefinition,
  type WebsiteKompisPlanLabels,
} from "@/lib/website-kompis-plans";

function PlanCard({
  plan,
  labels,
}: {
  plan: WebsiteKompisPlanDefinition;
  labels: WebsiteKompisPlanLabels;
}) {
  const copy = labels.plans[plan.id];
  const priceLine =
    plan.id === "free"
      ? labels.freePrice
      : `${labels.monthlyPrice}: ${plan.monthlyPrice?.amountDisplay} NOK · ${labels.annualPrice}: ${plan.annualPrice?.amountDisplay} NOK`;

  return (
    <article className={`${AppVisualClasses.card} flex h-full flex-col gap-4`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xl font-semibold text-[var(--app-text,#202336)]">{copy.name}</h3>
          <p className="mt-1 text-sm text-[var(--app-text-muted,#5C6275)]">{copy.tagline}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
          <span aria-hidden>!</span>
          {labels.plannedBadge}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-[var(--app-text,#202336)]">
        {copy.quotaLabel}
      </p>
      <p className="text-sm font-medium text-[var(--app-text,#202336)]">{priceLine}</p>
      {plan.annualPrice ? (
        <p className="text-xs text-[var(--app-text-muted,#5C6275)]">{labels.annualHint}</p>
      ) : null}
      <p className="text-xs text-[var(--app-text-muted,#5C6275)]">{labels.vatUnknown}</p>
      <ul className="space-y-2 text-sm text-[var(--app-text,#202336)]">
        <li className="flex gap-2">
          <span aria-hidden className="text-[var(--app-primary,#7357E8)]">
            ✓
          </span>
          {copy.feature1}
        </li>
        <li className="flex gap-2">
          <span aria-hidden className="text-[var(--app-primary,#7357E8)]">
            ✓
          </span>
          {copy.feature2}
        </li>
        <li className="flex gap-2">
          <span aria-hidden className="text-[var(--app-primary,#7357E8)]">
            ✓
          </span>
          {copy.feature3}
        </li>
      </ul>
      <p className="mt-auto rounded-xl border border-[var(--app-border,#E5E7F0)] bg-[var(--app-soft-surface,#F2F3F9)] px-3 py-2 text-xs text-[var(--app-text-muted,#5C6275)]">
        {labels.notActiveCheckout}
      </p>
    </article>
  );
}

function formatCount(value: number, locale: string): string {
  const intlLocale = locale === "no" ? "nb" : locale;
  return new Intl.NumberFormat(intlLocale).format(value);
}

function formatUtcMonth(periodKey: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(periodKey);
  if (!match) return periodKey;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  const intlLocale = locale === "no" ? "nb" : locale;
  const month = new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return month;
}

function StatusCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${AppVisualClasses.card} space-y-3`}>
      <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--app-text-muted,#5C6275)]">{body}</p>
      {children}
    </div>
  );
}

function QuotaFacts({
  read,
  labels,
  locale,
}: {
  read: Extract<WebsiteKompisLicenseQuotaRead, { kind: "known_plan" }>;
  labels: WebsiteKompisPlanLabels;
  locale: string;
}) {
  const period =
    read.periodKey === "lifetime"
      ? labels.assignment.periodLifetime
      : `${labels.assignment.periodUtcMonth}: ${formatUtcMonth(read.periodKey, locale)}`;
  const rows = [
    [labels.assignment.planLabel, labels.plans[read.plan].name],
    [labels.assignment.ceilingLabel, formatCount(read.allowance, locale)],
    [labels.assignment.usedLabel, formatCount(read.finalized, locale)],
    [labels.assignment.reservedLabel, formatCount(read.reserved, locale)],
    [labels.assignment.remainingLabel, formatCount(read.remaining, locale)],
    [labels.assignment.periodLabel, period],
  ] as const;

  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-[var(--app-soft-surface,#F2F3F9)] px-3 py-2">
          <dt className="text-xs text-[var(--app-text-muted,#5C6275)]">{label}</dt>
          <dd className="text-sm font-semibold text-[var(--app-text,#202336)]">{value}</dd>
        </div>
      ))}
      <p className="text-sm text-[var(--app-text,#202336)] sm:col-span-2">
        {read.acceptsNewAnswers ? labels.assignment.acceptsAnswers : labels.assignment.pausesAnswers}
      </p>
    </dl>
  );
}

function LicenseQuotaStatus({
  quotaRead,
  labels,
  locale,
}: {
  quotaRead: WebsiteKompisLicenseQuotaRead;
  labels: WebsiteKompisPlanLabels;
  locale: string;
}) {
  const copy = labels.assignment;
  if (quotaRead.kind === "unauthenticated") {
    return <StatusCard title={copy.unauthenticatedTitle} body={copy.unauthenticatedBody} />;
  }
  if (quotaRead.kind === "no_module") {
    return <StatusCard title={copy.noModuleTitle} body={copy.noModuleBody} />;
  }
  if (quotaRead.kind === "unknown_plan") {
    return <StatusCard title={copy.unknownPlanTitle} body={copy.unknownPlanBody} />;
  }
  if (quotaRead.kind === "unavailable") {
    return <StatusCard title={copy.unavailableTitle} body={copy.unavailableBody} />;
  }
  return (
    <StatusCard title={copy.knownTitle} body={copy.notAPurchase}>
      <QuotaFacts read={quotaRead} labels={labels} locale={locale} />
    </StatusCard>
  );
}

/**
 * Planned Kompis Web packages plus a read-only license/quota status.
 * No Stripe checkout and no entitlement writes.
 */
export function WebsiteKompisPlansPanel({
  labels,
  quotaRead,
  locale,
}: {
  labels: WebsiteKompisPlanLabels;
  quotaRead: WebsiteKompisLicenseQuotaRead;
  locale: string;
}) {
  return (
    <section className="space-y-6" aria-labelledby="wk-plans-heading">
      <div className="space-y-2">
        <h2 id="wk-plans-heading" className="text-2xl font-semibold text-[var(--app-text,#202336)]">
          {labels.title}
        </h2>
        <p className="max-w-3xl text-base text-[var(--app-text-muted,#5C6275)]">{labels.subtitle}</p>
      </div>

      <LicenseQuotaStatus quotaRead={quotaRead} labels={labels} locale={locale} />
      <p className="text-sm text-[var(--app-text-muted,#5C6275)]">{labels.assignment.catalogSeparate}</p>

      <div className="grid gap-4 lg:grid-cols-3">
        {WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => (
          <PlanCard key={plan.id} plan={plan} labels={labels} />
        ))}
      </div>

      <div className={`${AppVisualClasses.card} space-y-3`}>
        <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">
          {labels.upgradeReadinessTitle}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--app-text-muted,#5C6275)]">
          {labels.upgradeReadinessBody}
        </p>
        <p className="text-sm text-[var(--app-text-muted,#5C6275)]">{labels.multiSiteNote}</p>
        <p className="text-sm text-[var(--app-text-muted,#5C6275)]">{labels.grandfatherNote}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--app-border,#E5E7F0)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--app-text,#202336)] hover:bg-[var(--app-soft-surface,#F2F3F9)]"
          >
            {labels.openSubscription}
          </Link>
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountInvoices}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--app-border,#E5E7F0)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--app-text,#202336)] hover:bg-[var(--app-soft-surface,#F2F3F9)]"
          >
            {labels.openInvoices}
          </Link>
        </div>
      </div>
    </section>
  );
}
