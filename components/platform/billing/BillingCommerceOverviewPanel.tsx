"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { BillingCommerceModuleIcon } from "@/components/platform/billing/BillingCommerceIcons";
import {
  getBillingCommerceNavByPlacement,
  getBillingCommercePrimaryNav,
  type BillingCommerceNavItem,
} from "@/lib/platform/billing-commerce-center/config";
import type { BillingCommerceCenterPayload } from "@/lib/platform/billing-commerce-center/types";
import { PlatformLayoutClasses, PlatformStatusToneClasses } from "@/lib/design";

type BillingCommerceOverviewPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    privacyNote: string;
    loading: string;
    empty: string;
    openModule: string;
    overview: string;
    modules: Record<string, string>;
    moduleDescriptions: Record<string, string>;
    relatedOperations: string;
    relatedLinks: Record<string, string>;
    overviewStats: Record<string, string>;
    sections: {
      finance: string;
      customers: string;
      product: string;
      sellers: string;
      customersHint: string;
      productHint: string;
      sellersHint: string;
    };
  };
};

function OverviewStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: keyof typeof PlatformStatusToneClasses;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(32,35,54,0.04),0_8px_24px_rgba(32,35,54,0.05)] sm:p-5 dark:border-slate-700 dark:bg-slate-950/40">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1.5 text-2xl font-semibold ${PlatformStatusToneClasses[tone]}`}>{value}</dd>
    </div>
  );
}

function ModuleCard({
  item,
  title,
  description,
  openLabel,
  stat,
}: {
  item: BillingCommerceNavItem;
  title: string;
  description: string;
  openLabel: string;
  stat: number | string;
}) {
  return (
    <Link
      href={item.href}
      className="block rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(32,35,54,0.04),0_8px_24px_rgba(32,35,54,0.05)] transition hover:border-sky-200 hover:shadow-md sm:p-5 dark:border-slate-700 dark:bg-slate-950/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
            <BillingCommerceModuleIcon icon={item.icon} />
          </span>
          <div className="min-w-0">
            <h3 className="font-medium text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          {stat}
        </span>
      </div>
      <span className="mt-3 inline-block text-sm font-medium text-sky-700">
        {openLabel} →
      </span>
    </Link>
  );
}

function ModuleSection({
  title,
  hint,
  items,
  labels,
  moduleStats,
}: {
  title: string;
  hint?: string;
  items: BillingCommerceNavItem[];
  labels: BillingCommerceOverviewPanelProps["labels"];
  moduleStats: Map<string, number | string>;
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {hint ? <p className="mt-0.5 max-w-3xl text-sm text-slate-600">{hint}</p> : null}
      </div>
      <div className={PlatformLayoutClasses.navCardGrid}>
        {items.map((item) => (
          <ModuleCard
            key={item.id}
            item={item}
            title={labels.modules[item.id] ?? item.id}
            description={labels.moduleDescriptions[item.id] ?? ""}
            openLabel={labels.openModule}
            stat={moduleStats.get(item.section) ?? 0}
          />
        ))}
      </div>
    </section>
  );
}

export function BillingCommerceOverviewPanel({ labels }: BillingCommerceOverviewPanelProps) {
  const [center, setCenter] = useState<BillingCommerceCenterPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/billing/commerce-center?section=overview");
    if (res.ok) setCenter((await res.json()) as BillingCommerceCenterPayload);
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className={`text-sm ${PlatformStatusToneClasses.negative}`}>{labels.empty}</p>;
  }

  const stats = center.stats ?? {};
  const moduleStats = new Map((center.modules ?? []).map((m) => [m.id, m.stat]));
  const overdue = Number(stats.overdue_customers ?? 0);

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className={PlatformLayoutClasses.pageHeader}>
        <h1 className={PlatformLayoutClasses.pageTitle}>{labels.overview}</h1>
        <p className={PlatformLayoutClasses.pageSubtitle}>{labels.subtitle}</p>
      </header>

      <section aria-label={labels.stats}>
        <dl className={PlatformLayoutClasses.metricGrid}>
          <OverviewStat
            label={labels.overviewStats.activeCustomers}
            value={Number(stats.active_customers ?? 0)}
            tone="positive"
          />
          <OverviewStat
            label={labels.overviewStats.overdueCustomers}
            value={overdue}
            tone={overdue > 0 ? "warning" : "neutral"}
          />
          <OverviewStat
            label={labels.overviewStats.openInvoices}
            value={Number(stats.open_invoices ?? 0)}
          />
          <OverviewStat
            label={labels.overviewStats.draftCheckouts}
            value={Number(stats.checkout_sessions ?? 0)}
          />
        </dl>
      </section>

      <ModuleSection
        title={labels.sections.finance}
        items={getBillingCommercePrimaryNav()}
        labels={labels}
        moduleStats={moduleStats}
      />

      <ModuleSection
        title={labels.sections.customers}
        hint={labels.sections.customersHint}
        items={getBillingCommerceNavByPlacement("relatedCustomers")}
        labels={labels}
        moduleStats={moduleStats}
      />

      <ModuleSection
        title={labels.sections.product}
        hint={labels.sections.productHint}
        items={getBillingCommerceNavByPlacement("relatedProduct")}
        labels={labels}
        moduleStats={moduleStats}
      />

      <ModuleSection
        title={labels.sections.sellers}
        hint={labels.sections.sellersHint}
        items={getBillingCommerceNavByPlacement("relatedSellers")}
        labels={labels}
        moduleStats={moduleStats}
      />

      <section className="space-y-2.5">
        <h2 className="text-base font-semibold text-slate-900">{labels.relatedOperations}</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/platform/billing/payment-operations"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {labels.relatedLinks.paymentOperations}
          </Link>
          <Link
            href="/platform/billing/revenue-operations"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {labels.relatedLinks.revenueOperations}
          </Link>
          <Link
            href="/platform/billing/subscription-operations"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {labels.relatedLinks.subscriptionOperations}
          </Link>
        </div>
      </section>

      <p className="text-xs text-slate-500">{center.privacy_note ?? labels.privacyNote}</p>
    </div>
  );
}
