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
import { formatEconomyCount, type EconomyPhrases } from "@/lib/platform/economy-display";

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
    stats: string;
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
    locale?: string;
    economy?: EconomyPhrases;
  };
};

function OverviewStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: keyof typeof PlatformStatusToneClasses;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(32,35,54,0.04),0_8px_24px_rgba(32,35,54,0.05)] sm:p-5 dark:border-slate-700 dark:bg-slate-950/40">
      <dt className="text-xs font-semibold tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1.5 text-2xl font-semibold ${PlatformStatusToneClasses[tone]}`}>{value}</dd>
    </div>
  );
}

function ModuleCard({
  item,
  title,
  description,
  openLabel,
}: {
  item: BillingCommerceNavItem;
  title: string;
  description: string;
  openLabel: string;
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
}: {
  title: string;
  hint?: string;
  items: BillingCommerceNavItem[];
  labels: BillingCommerceOverviewPanelProps["labels"];
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
  const locale = labels.locale ?? "en";
  const unavailable = labels.economy?.unavailable ?? "—";
  const countText = (value: unknown) => {
    if (value === null || value === undefined || value === "") return unavailable;
    const formatted = formatEconomyCount(value as number | string, locale);
    return formatted.state === "value" ? formatted.text : unavailable;
  };
  const overdueRaw = stats.overdue_customers;
  const overdueNumber = typeof overdueRaw === "number" ? overdueRaw : Number(overdueRaw);
  const productItems = getBillingCommerceNavByPlacement("relatedProduct").filter(
    (item) => item.id !== "businessPacks",
  );
  const sellerItems = getBillingCommerceNavByPlacement("relatedSellers").map((item) =>
    item.id === "growthPartnerAttribution"
      ? { ...item, href: "/platform/sellers/attribution" }
      : item,
  );

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
            value={countText(stats.active_customers)}
            tone="positive"
          />
          <OverviewStat
            label={labels.overviewStats.overdueCustomers}
            value={countText(overdueRaw)}
            tone={Number.isFinite(overdueNumber) && overdueNumber > 0 ? "warning" : "neutral"}
          />
          <OverviewStat
            label={labels.overviewStats.openInvoices}
            value={countText(stats.open_invoices)}
          />
          <OverviewStat
            label={labels.overviewStats.draftCheckouts}
            value={countText(stats.checkout_sessions)}
          />
        </dl>
      </section>

      <ModuleSection
        title={labels.sections.finance}
        items={getBillingCommercePrimaryNav()}
        labels={labels}
      />

      <ModuleSection
        title={labels.sections.customers}
        hint={labels.sections.customersHint}
        items={getBillingCommerceNavByPlacement("relatedCustomers")}
        labels={labels}
      />

      <ModuleSection
        title={labels.sections.product}
        hint={labels.sections.productHint}
        items={productItems}
        labels={labels}
      />
      <p className="text-sm text-slate-700">
        <Link href="/platform/product/business-packs" className="font-medium text-sky-800 hover:text-sky-900">
          {labels.economy?.seeProductCatalog ?? labels.openModule}
        </Link>
      </p>

      <ModuleSection
        title={labels.sections.sellers}
        hint={labels.sections.sellersHint}
        items={sellerItems}
        labels={labels}
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
