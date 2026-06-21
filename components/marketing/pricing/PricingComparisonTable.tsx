"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Cloud,
  CreditCard,
  LifeBuoy,
  Package,
  Scale,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { PublicMarketingPlanKey } from "@/lib/marketing/public-pricing";
import type { ResolvedComparisonCell, ResolvedPricingComparison } from "@/lib/marketing/pricing-comparison/types";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

const CATEGORY_ICONS: Record<ResolvedPricingComparison["categories"][number]["icon"], LucideIcon> = {
  "credit-card": CreditCard,
  building: Building2,
  package: Package,
  settings: Settings,
  sparkles: Sparkles,
  scale: Scale,
  "life-buoy": LifeBuoy,
  cloud: Cloud,
};

type Props = {
  comparison: ResolvedPricingComparison;
};

function ComparisonCell({ cell }: { cell: ResolvedComparisonCell }) {
  if (cell.visual === "included") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <span className="text-base leading-none" aria-hidden="true">
          ✓
        </span>
        <span className="sr-only">{cell.label}</span>
        <span aria-hidden="true">{cell.label}</span>
      </span>
    );
  }

  if (cell.visual === "not_included") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-aipify-text-muted">
        <span className="text-base leading-none" aria-hidden="true">
          —
        </span>
        <span className="sr-only">{cell.label}</span>
        <span aria-hidden="true">{cell.label}</span>
      </span>
    );
  }

  if (cell.visual === "badge") {
    const variant = cell.badgeVariant ?? "custom";
    const badgeClass =
      variant === "addon"
        ? "border-aipify-companion/30 bg-aipify-accent-soft text-aipify-companion"
        : variant === "upgrade"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : variant === "contact"
            ? "border-aipify-border bg-aipify-surface-muted text-aipify-text-secondary"
            : "border-aipify-border bg-aipify-surface-muted text-aipify-text";

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
      >
        {cell.label}
      </span>
    );
  }

  return <span className="text-sm font-medium text-aipify-text">{cell.label}</span>;
}

function PlanCta({
  href,
  label,
  popular,
}: {
  href: string;
  label: string;
  popular?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        popular ? AipifyMarketingClasses.primaryCta : AipifyMarketingClasses.secondaryCta
      }`}
    >
      {label}
    </Link>
  );
}

export default function PricingComparisonTable({ comparison }: Props) {
  const [mobilePlan, setMobilePlan] = useState<PublicMarketingPlanKey>("starter");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(comparison.categories.map((c) => c.id)),
  );

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div id={comparison.anchorId} className="scroll-mt-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className={PublicMarketingClasses.eyebrow}>{comparison.header.eyebrow}</p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {comparison.header.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{comparison.header.description}</p>
        <p className="mt-4 text-sm text-aipify-text-secondary">
          {comparison.header.helpChoosing}{" "}
          <Link href={comparison.header.bookDemoHref} className={`font-semibold ${PublicMarketingClasses.link}`}>
            {comparison.header.bookDemo}
          </Link>
        </p>
      </header>

      {/* Mobile */}
      <div className="mt-10 lg:hidden">
        <label className="block text-sm font-medium text-aipify-text-secondary">
          {comparison.mobile.selectPlan}
          <select
            value={mobilePlan}
            onChange={(e) => setMobilePlan(e.target.value as PublicMarketingPlanKey)}
            className="mt-2 w-full rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-base font-semibold text-aipify-text shadow-sm"
          >
            {comparison.plans.map((plan) => (
              <option key={plan.key} value={plan.key}>
                {plan.name}
              </option>
            ))}
          </select>
        </label>

        {(() => {
          const plan = comparison.plans.find((p) => p.key === mobilePlan)!;
          return (
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                plan.isPopular ? "border-aipify-companion/40 bg-aipify-accent-soft/40" : "border-aipify-border bg-aipify-surface"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{plan.name}</p>
              <p className="mt-2 text-2xl font-bold text-aipify-text">{plan.price}</p>
              <p className="mt-2 text-sm text-aipify-text-secondary">{plan.audience}</p>
              <div className="mt-4">
                <PlanCta href={plan.ctaHref} label={plan.cta} popular={plan.isPopular} />
              </div>
            </div>
          );
        })()}

        <div className="mt-6 space-y-3">
          {comparison.categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            const isOpen = openCategories.has(category.id);
            return (
              <div key={category.id} className="overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft text-aipify-companion">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-aipify-text">{category.label}</span>
                  <span className="text-aipify-text-muted" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <dl className="border-t border-aipify-border px-4 py-2">
                    {category.capabilities.map((capability) => (
                      <div key={capability.id} className="border-b border-aipify-border py-3 last:border-0">
                        <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-secondary">
                          {capability.label}
                        </dt>
                        <dd className="mt-2">
                          <ComparisonCell cell={capability.cells[mobilePlan]} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop */}
      <div className="mt-10 hidden lg:block">
        <div className="overflow-x-auto rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-20 w-[220px] border-b border-aipify-border bg-aipify-canvas px-5 py-4"
                >
                  <span className="sr-only">{comparison.mobile.capabilityColumn}</span>
                </th>
                {comparison.plans.map((plan) => (
                  <th
                    key={plan.key}
                    scope="col"
                    className={`sticky top-0 z-10 min-w-[180px] border-b border-aipify-border px-4 py-4 align-top ${
                      plan.isPopular ? "bg-aipify-accent-soft/60" : "bg-aipify-canvas"
                    }`}
                  >
                    <div className="space-y-3">
                      {plan.isPopular ? (
                        <span className="inline-block rounded-full bg-aipify-companion px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          {comparison.popularBadge}
                        </span>
                      ) : (
                        <span className="block h-5" aria-hidden="true" />
                      )}
                      <p className="text-lg font-bold text-aipify-text">{plan.name}</p>
                      <p className="text-xl font-bold tracking-tight text-aipify-text">{plan.price}</p>
                      <p className="text-xs leading-relaxed text-aipify-text-secondary">{plan.audience}</p>
                      <PlanCta href={plan.ctaHref} label={plan.cta} popular={plan.isPopular} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.categories.map((category) => {
                const Icon = CATEGORY_ICONS[category.icon];
                return [
                  <tr key={`${category.id}-header`} className="bg-aipify-surface-muted">
                    <th
                      colSpan={comparison.plans.length + 1}
                      scope="colgroup"
                      className="sticky left-0 px-5 py-3"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-aipify-companion">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {category.label}
                      </span>
                    </th>
                  </tr>,
                  ...category.capabilities.map((capability) => (
                    <tr key={capability.id} className="border-b border-aipify-border last:border-0">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-aipify-surface px-5 py-3.5 text-sm font-medium text-aipify-text"
                      >
                        {capability.label}
                      </th>
                      {comparison.plans.map((plan) => (
                        <td
                          key={plan.key}
                          className={`px-4 py-3.5 ${plan.isPopular ? "bg-aipify-accent-soft/20" : ""}`}
                        >
                          <ComparisonCell cell={capability.cells[plan.key]} />
                        </td>
                      ))}
                    </tr>
                  )),
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-aipify-border bg-aipify-surface-muted px-6 py-8 text-center sm:px-10">
        <h3 className="text-lg font-semibold text-aipify-text">{comparison.finalCta.headline}</h3>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={comparison.finalCta.primaryHref} className={`${AipifyMarketingClasses.primaryCta} px-6 py-3 text-sm`}>
            {comparison.finalCta.primary}
          </Link>
          <Link
            href={comparison.finalCta.secondaryHref}
            className={`${AipifyMarketingClasses.secondaryCta} px-6 py-3 text-sm`}
          >
            {comparison.finalCta.secondary}
          </Link>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-aipify-text-secondary">{comparison.supportingText}</p>
      </div>
    </div>
  );
}
