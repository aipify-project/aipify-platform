"use client";

import Link from "next/link";
import type { SeoPerformanceSnapshot } from "@/lib/marketing/knowledge/seo-metrics";

type PlatformSeoDashboardPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    authorityRule: string;
    inventoryTitle: string;
    metricsTitle: string;
    localesTitle: string;
    supportedLocales: string;
    futureLocales: string;
    articles: string;
    categories: string;
    industries: string;
    businessPacks: string;
  };
  snapshot: SeoPerformanceSnapshot;
};

export function PlatformSeoDashboardPanel({ labels, snapshot }: PlatformSeoDashboardPanelProps) {
  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">{labels.authorityRule}</p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.inventoryTitle}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">{labels.articles}</dt>
            <dd className="text-2xl font-bold text-gray-900">{snapshot.publishedArticles}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.categories}</dt>
            <dd className="text-2xl font-bold text-gray-900">{snapshot.knowledgeCategories}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.industries}</dt>
            <dd className="text-2xl font-bold text-gray-900">{snapshot.industryHubs}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.businessPacks}</dt>
            <dd className="text-2xl font-bold text-gray-900">{snapshot.businessPackPages}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.metricsTitle}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {snapshot.metrics.map((metric) => (
            <div key={metric.key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">{metric.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="mt-2 text-xs text-gray-500">{metric.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.localesTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {labels.supportedLocales}: {snapshot.supportedLocales}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.futureLocales}: {snapshot.futureLocales.join(", ")}
        </p>
        <p className="mt-4">
          <Link href="/platform/website-intelligence" className="text-sm font-medium text-indigo-600 hover:underline">
            Website Intelligence Center →
          </Link>
        </p>
      </section>
    </div>
  );
}
