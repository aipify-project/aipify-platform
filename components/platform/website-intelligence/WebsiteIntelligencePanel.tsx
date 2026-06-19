"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWebsiteIntelligence,
  WEBSITE_INTELLIGENCE_SECTIONS,
  type WebsiteIntelligenceBundle,
  type WebsiteIntelligenceLabels,
  type WebsiteIntelligenceSection,
} from "@/lib/marketing/website-intelligence";

type WebsiteIntelligencePanelProps = {
  labels: WebsiteIntelligenceLabels;
  initialSection?: WebsiteIntelligenceSection;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">—</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-b border-gray-100">
              {row.map((cell, i) => (
                <td key={`${row[0]}-${i}`} className="px-3 py-2 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WebsiteIntelligencePanel({ labels, initialSection = "overview" }: WebsiteIntelligencePanelProps) {
  const [section, setSection] = useState<WebsiteIntelligenceSection>(initialSection);
  const [bundle, setBundle] = useState<WebsiteIntelligenceBundle | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (activeSection: WebsiteIntelligenceSection) => {
    setLoading(true);
    const res = await fetch(`/api/platform/website-intelligence?section=${activeSection}`);
    if (res.ok) setBundle(parseWebsiteIntelligence(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(section);
  }, [section, load]);

  if (loading && !bundle) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!bundle) {
    return <p className="p-6 text-sm text-gray-500">{labels.empty}</p>;
  }

  const { overview } = bundle;

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 text-xs text-gray-500">
          {labels.periodLabel}: {bundle.period_days} days
        </p>
        <p className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.privacyNote}
        </p>
        <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {labels.optimizationRule}
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {WEBSITE_INTELLIGENCE_SECTIONS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              section === id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {labels.sections[id]}
          </button>
        ))}
      </nav>

      {section === "overview" ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label={labels.overview.visitors} value={overview.visitors} />
            <MetricCard label={labels.overview.pageViews} value={overview.page_views} />
            <MetricCard label={labels.overview.conversions} value={overview.conversions} />
            <MetricCard label={labels.overview.demoRequests} value={overview.demo_requests} />
            <MetricCard label={labels.overview.partnerApplications} value={overview.partner_applications} />
            <MetricCard label={labels.overview.organicGrowth} value={overview.organic_sessions} />
          </div>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.overview.topPages}</h2>
            <div className="mt-4">
              <Table
                headers={["Page", "Views"]}
                rows={bundle.traffic.top_pages.slice(0, 8).map((r) => [r.page_path, String(r.views ?? 0)])}
              />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.overview.advisorTitle}</h2>
            <ul className="mt-4 space-y-4">
              {bundle.companion_advisor.map((item) => (
                <li key={item.question} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="font-medium text-gray-900">{item.question}</p>
                  <p className="mt-2 text-sm text-gray-600">{item.recommendation}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-indigo-600">{item.priority}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.growthLoopTitle}</h2>
            <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-700">
              {bundle.growth_loop.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">{step.replace(/_/g, " ")}</span>
                  {i < bundle.growth_loop.length - 1 ? <span aria-hidden="true">↓</span> : null}
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : null}

      {section === "traffic" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.traffic.topPages}</h2>
            <div className="mt-4">
              <Table
                headers={["Page", "Views"]}
                rows={bundle.traffic.top_pages.map((r) => [r.page_path, String(r.views ?? 0)])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.traffic.landingPages}</h2>
            <div className="mt-4">
              <Table
                headers={["Page", "Sessions"]}
                rows={bundle.traffic.landing_pages.map((r) => [r.page_path, String(r.sessions ?? 0)])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.traffic.exitPages}</h2>
            <div className="mt-4">
              <Table
                headers={["Page", "Views", "Exits", "Exit rate"]}
                rows={bundle.traffic.exit_pages.map((r) => [
                  r.page_path,
                  String(r.views ?? 0),
                  String(r.exit_events ?? 0),
                  `${r.exit_rate ?? 0}%`,
                ])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.leadSources.title}</h2>
            <div className="mt-4">
              <Table
                headers={[labels.leadSources.source, labels.leadSources.sessions, labels.leadSources.conversions]}
                rows={bundle.lead_sources.map((r) => [r.source, String(r.sessions), String(r.conversions)])}
              />
            </div>
          </section>
        </div>
      ) : null}

      {section === "conversions" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label={labels.conversions.total} value={bundle.conversions.total} />
          <MetricCard label={labels.conversions.demos} value={bundle.conversions.demo_requests} />
          <MetricCard label={labels.conversions.partners} value={bundle.conversions.partner_applications} />
        </div>
      ) : null}

      {section === "funnels" ? (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">{labels.funnels.title}</h2>
          <div className="mt-4 space-y-3">
            {bundle.funnels.stages.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-4">
                <div className="w-40 shrink-0 text-sm font-medium capitalize text-gray-900">
                  {stage.stage.replace(/_/g, " ")}
                </div>
                <div className="h-3 flex-1 rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-indigo-500" style={{ width: `${Math.min(stage.rate, 100)}%` }} />
                </div>
                <div className="w-24 text-right text-sm text-gray-600">
                  {stage.count} ({stage.rate}%)
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {section === "content" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.content.title}</h2>
            <div className="mt-4">
              <Table
                headers={[labels.content.type, labels.content.views, labels.content.engagement, labels.content.conversions]}
                rows={bundle.content.map((r) => [
                  r.content_type,
                  String(r.views),
                  String(r.engagement_events),
                  String(r.conversions),
                ])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.ctas.title}</h2>
            <div className="mt-4">
              <Table
                headers={[labels.ctas.label, labels.ctas.views, labels.ctas.clicks, labels.ctas.conversionRate]}
                rows={bundle.ctas.map((r) => [r.label, String(r.views), String(r.clicks), `${r.conversion_rate}%`])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.content.gaps}</h2>
            <div className="mt-4">
              <Table
                headers={["Page", "Exit rate"]}
                rows={bundle.content_gaps.map((r) => [r.page_path, `${r.exit_rate ?? 0}%`])}
              />
            </div>
          </section>
        </div>
      ) : null}

      {section === "partners" ? (
        <div className="space-y-6">
          <MetricCard label={labels.partners.applications} value={bundle.partners.applications} />
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.partners.byCountry}</h2>
            <div className="mt-4">
              <Table
                headers={["Country", "Applications"]}
                rows={bundle.partners.by_country.map((r) => [r.country, String(r.count)])}
              />
            </div>
          </section>
        </div>
      ) : null}

      {section === "campaigns" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.campaigns.title}</h2>
            <div className="mt-4">
              <Table
                headers={[labels.campaigns.source, labels.campaigns.events]}
                rows={bundle.campaigns.map((r) => [r.campaign, String(r.events)])}
              />
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.demos.title}</h2>
            <MetricCard label={labels.conversions.demos} value={bundle.demos.total_requests} />
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              <Table
                headers={[labels.demos.byIndustry, "Count"]}
                rows={bundle.demos.by_industry.map((r) => [r.industry, String(r.count)])}
              />
              <Table
                headers={[labels.demos.byCountry, "Count"]}
                rows={bundle.demos.by_country.map((r) => [r.country, String(r.count)])}
              />
              <Table
                headers={[labels.demos.byPack, "Count"]}
                rows={bundle.demos.by_pack_interest.map((r) => [r.pack, String(r.count)])}
              />
            </div>
          </section>
        </div>
      ) : null}

      {section === "reports" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.reports.title}</h2>
            <ul className="mt-4 space-y-2">
              {bundle.reports.available.map((report) => (
                <li key={report} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm capitalize text-gray-700">
                  {report.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.heatmap.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{labels.heatmap.status}: architecture ready</p>
            <p className="mt-2 text-xs text-gray-500">{labels.heatmap.privacyNote}</p>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">{labels.advisor.title}</h2>
            <ul className="mt-4 space-y-3">
              {bundle.companion_advisor.map((item) => (
                <li key={item.question} className="text-sm text-gray-700">
                  <span className="font-medium">{item.question}</span> — {item.recommendation}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      <p className="text-xs text-gray-500">
        <Link href="/platform/marketing/seo" className="text-indigo-600 hover:underline">
          SEO & Organic Discovery
        </Link>
      </p>
    </div>
  );
}
