"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  STATUS_BADGES,
  parsePlatformBusinessPackFactoryCenter,
  type PackBlueprint,
  type PlatformBusinessPackFactoryCenter,
  type PlatformBusinessPackFactoryLabels,
  type PlatformBusinessPackFactoryTab,
} from "@/lib/platform-business-pack-factory";

type Props = {
  labels: PlatformBusinessPackFactoryLabels;
  backHref: string;
  initialTab?: PlatformBusinessPackFactoryTab;
  visibleTabs?: PlatformBusinessPackFactoryTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function PackCard({
  pack,
  labels,
  onAction,
  busy,
}: {
  pack: PackBlueprint;
  labels: PlatformBusinessPackFactoryLabels;
  onAction: (action: string, packKey: string) => void;
  busy: boolean;
}) {
  const status = pack.blueprint_status ?? "development";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-zinc-900">{pack.pack_name}</p>
        <StatusPill
          label={labels.blueprintStatuses[status] ?? status}
          className={STATUS_BADGES[status] ?? STATUS_BADGES.development}
        />
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {pack.pack_key} · {pack.industry_key} · v{pack.version ?? "0.1.0"}
      </p>
      {Array.isArray(pack.modules) && pack.modules.length ? (
        <p className="mt-2 text-sm text-zinc-600">{pack.modules.join(" · ")}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {status !== "published" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction("advance_status", pack.pack_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          >
            {labels.actions.advanceReview}
          </button>
        ) : null}
        {status === "certified" || status === "marketplace_ready" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction("publish_pack", pack.pack_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.actions.publishPack}
          </button>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => onAction("run_test", pack.pack_key)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.runTest}
        </button>
      </div>
    </div>
  );
}

const ALL_TABS: PlatformBusinessPackFactoryTab[] = [
  "overview",
  "templates",
  "industry_frameworks",
  "pack_builder",
  "dependencies",
  "testing",
  "certification",
  "marketplace",
  "executive",
  "reports",
];

export function PlatformBusinessPackFactoryPanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<PlatformBusinessPackFactoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PlatformBusinessPackFactoryTab>(initialTab);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-business-pack-factory/overview");
    if (res.ok) setCenter(parsePlatformBusinessPackFactoryCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const performAction = useCallback(
    async (action: string, packKey: string) => {
      setBusyId(packKey);
      try {
        const res = await fetch("/api/platform-business-pack-factory/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            pack_key: packKey,
            blueprint_status: action === "advance_status" ? "review" : undefined,
            test_type: "simulation",
            simulation_ref: "phase_543",
            status: "passed",
          }),
        });
        if (res.ok) await load();
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const packs = center.pack_blueprints ?? [];
  const recommendations =
    (center.companion_recommendations?.recommendations as string[]) ?? [];
  const certificationReviews =
    (center.certification_engine?.reviews as Record<string, unknown>[]) ?? [];
  const testRuns = (center.testing_center?.test_runs as Record<string, unknown>[]) ?? [];
  const reusableEngines = (center.reports?.reusable_engines as string[]) ?? [];
  const publishingWorkflow =
    (center.marketplace_publishing?.workflow as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          {titleOverride ?? labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
        {center.routes?.legacy_product ? (
          <p className="mt-3 text-sm text-zinc-600">
            <Link
              href={center.routes.legacy_product}
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              {labels.legacyLink}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/platform/business-pack-factory/builder"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.actions.openBuilder}
        </Link>
        <Link
          href="/platform/business-pack-factory/skills"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openSkills}
        </Link>
        <Link
          href="/platform/business-pack-factory/testing"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openTesting}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.industryFrameworks} value={overview.industry_frameworks ?? 0} />
          <OverviewCard label={labels.overview.packBlueprints} value={overview.pack_blueprints ?? 0} />
          <OverviewCard label={labels.overview.inDevelopment} value={overview.in_development ?? 0} />
          <OverviewCard label={labels.overview.inReview} value={overview.in_review ?? 0} />
          <OverviewCard label={labels.overview.certified} value={overview.certified ?? 0} />
          <OverviewCard label={labels.overview.marketplaceReady} value={overview.marketplace_ready ?? 0} />
          <OverviewCard label={labels.overview.companionSkills} value={overview.companion_skills ?? 0} />
          <OverviewCard label={labels.overview.knowledgeTemplates} value={overview.knowledge_templates ?? 0} />
          <OverviewCard label={labels.overview.catalogListings} value={overview.catalog_listings ?? 0} />
        </dl>
      ) : null}

      {tab === "industry_frameworks" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {(center.industry_frameworks ?? []).map((f) => (
            <div key={f.framework_key} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase text-zinc-500">{f.industry_category}</p>
              <p className="mt-1 font-semibold text-zinc-900">{f.title}</p>
              {f.description ? <p className="mt-2 text-sm text-zinc-600">{f.description}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {["templates", "pack_builder"].includes(tab) ? (
        <section className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {packs.map((pack) => (
              <PackCard
                key={pack.pack_key}
                pack={pack}
                labels={labels}
                busy={busyId === pack.pack_key}
                onAction={(action, key) => void performAction(action, key)}
              />
            ))}
          </div>
          {(center.companion_skills ?? []).length ? (
            <div className="space-y-3">
              <h2 className="font-semibold text-zinc-900">{labels.skillsPage.title}</h2>
              {(center.companion_skills ?? []).map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
                  <p className="font-medium text-zinc-900">{skill.skill_name}</p>
                  <p className="text-zinc-500">{skill.pack_key} · {skill.industry_context}</p>
                  {skill.description ? <p className="mt-1 text-zinc-600">{skill.description}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "dependencies" ? (
        <section className="space-y-3">
          {(center.dependencies ?? []).map((d) => (
            <div key={String(d.pack_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(d.pack_key)}</p>
              <p className="text-zinc-600">{JSON.stringify(d.dependencies)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "testing" ? (
        <section className="space-y-3">
          {testRuns.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">
                {String(t.pack_key)} · {String(t.test_type)}
              </p>
              <p className="text-zinc-600">{String(t.summary ?? t.status)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "certification" ? (
        <section className="space-y-3">
          {certificationReviews.map((c, i) => (
            <div key={`${String(c.pack_key)}-${String(c.review_type)}-${i}`} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">
                {String(c.pack_key)} · {String(c.review_type)}
              </p>
              <p className="text-zinc-600">{String(c.status)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "marketplace" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.tabs.marketplace}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
            {publishingWorkflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Reusable engines</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {reusableEngines.map((engine) => (
                <li key={engine}>{engine}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion recommendations</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
