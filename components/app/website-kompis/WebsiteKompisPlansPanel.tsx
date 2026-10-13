import Link from "next/link";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import {
  WEBSITE_KOMPIS_PLAN_CATALOG,
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

/**
 * Presentation-only Kompis Web plans.
 * No Stripe checkout, no invented usage meters, no entitlement writes.
 */
export function WebsiteKompisPlansPanel({
  labels,
}: {
  labels: WebsiteKompisPlanLabels;
}) {
  return (
    <section className="space-y-6" aria-labelledby="wk-plans-heading">
      <div className="space-y-2">
        <h2 id="wk-plans-heading" className="text-2xl font-semibold text-[var(--app-text,#202336)]">
          {labels.title}
        </h2>
        <p className="max-w-3xl text-base text-[var(--app-text-muted,#5C6275)]">{labels.subtitle}</p>
      </div>

      <div className={`${AppVisualClasses.card} border-amber-200 bg-amber-50/50`}>
        <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">
          {labels.usageUnavailableTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted,#5C6275)]">
          {labels.usageUnavailableBody}
        </p>
      </div>

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
