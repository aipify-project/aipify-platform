"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  CHANNEL_STATUS_BADGES,
  PERSONALITY_TABS,
  TRAIT_CATEGORY_BADGES,
  parsePlatformCompanionPersonalityCenter,
  type PlatformCompanionPersonalityCenter,
  type PlatformCompanionPersonalityLabels,
  type PlatformCompanionPersonalityTab,
} from "@/lib/platform-companion-personality";

type Props = {
  labels: PlatformCompanionPersonalityLabels;
  backHref: string;
  initialTab?: PlatformCompanionPersonalityTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-zinc-900">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(item.trait_title ?? item.rule_title ?? item.role_title ?? item.style_title ?? item.profile_title ?? item.model_title ?? item.rule_key ?? item.channel_title ?? item.integration_title ?? item.contribution_title ?? item.cue_title ?? item.layer_title ?? item.locale_title ?? item.summary ?? i)}
          </p>
          {(item.description ?? item.summary_style ?? item.example_phrase ?? item.adaptation ?? item.consistency_note) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.description ?? item.summary_style ?? item.example_phrase ?? item.adaptation ?? item.consistency_note)}
            </p>
          ) : null}
          {item.trait_category ? (
            <span
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${
                TRAIT_CATEGORY_BADGES[String(item.trait_category)] ?? TRAIT_CATEGORY_BADGES.positive
              }`}
            >
              {String(item.trait_category)}
            </span>
          ) : null}
          {item.sync_status ? (
            <span
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${
                CHANNEL_STATUS_BADGES[String(item.sync_status)] ?? CHANNEL_STATUS_BADGES.active
              }`}
            >
              {String(item.sync_status)}
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function PlatformCompanionPersonalityPanel({
  labels,
  backHref,
  initialTab = "overview",
}: Props) {
  const [center, setCenter] = useState<PlatformCompanionPersonalityCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PlatformCompanionPersonalityTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-companion-personality/overview");
    if (res.ok) setCenter(parsePlatformCompanionPersonalityCenter(await res.json()));
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
    async (payload: Record<string, string>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/platform-companion-personality/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
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
  const personality = center.personality ?? {};
  const communication = center.communication ?? {};
  const relationship = center.relationship_model ?? {};
  const interactions = center.interaction_history ?? [];
  const adaptation = center.adaptation ?? {};
  const tenantRoute = center.routes?.tenant_relationship ?? "/app/companion/relationship";

  const coreTraits = (personality.core_traits as Record<string, unknown>[]) ?? [];
  const identityRules = (personality.identity_rules as Record<string, unknown>[]) ?? [];
  const personalityLayers = (personality.personality_layers as Record<string, unknown>[]) ?? [];
  const roleProfiles = (personality.role_profiles as Record<string, unknown>[]) ?? [];
  const humorFramework = (personality.humor_framework as Record<string, unknown>[]) ?? [];
  const selfLoveFramework = (personality.self_love_framework as Record<string, unknown>[]) ?? [];
  const trustFramework = (personality.trust_framework as Record<string, unknown>[]) ?? [];
  const emotionalAwareness = (personality.emotional_awareness as Record<string, unknown>[]) ?? [];
  const communicationStyles = (communication.communication_styles as Record<string, unknown>[]) ?? [];
  const adaptiveProfiles = (communication.adaptive_profiles as Record<string, unknown>[]) ?? [];
  const consistencyEngine = (communication.consistency_engine as Record<string, unknown>[]) ?? [];
  const memoryIntegrations = (relationship.memory_integrations as Record<string, unknown>[]) ?? [];
  const businessPackContributions =
    (relationship.business_pack_contributions as Record<string, unknown>[]) ?? [];
  const adaptationRules = (adaptation.adaptation_rules as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
        {center.philosophy ? (
          <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void performAction({ action: "refresh_relationship_score" })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.actions.refreshScore}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void performAction({
              action: "publish_personality_update",
              summary: "Platform personality framework reviewed and published.",
            })
          }
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.publishUpdate}
        </button>
        <Link
          href={tenantRoute}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openTenantRelationship}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERSONALITY_TABS.map((key) => (
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
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.coreTraits} value={Number(overview.core_traits ?? 0)} />
          <OverviewCard label={labels.overview.positiveTraits} value={Number(overview.positive_traits ?? 0)} />
          <OverviewCard label={labels.overview.forbiddenTraits} value={Number(overview.forbidden_traits ?? 0)} />
          <OverviewCard
            label={labels.overview.communicationStyles}
            value={Number(overview.communication_styles ?? 0)}
          />
          <OverviewCard label={labels.overview.roleProfiles} value={Number(overview.role_profiles ?? 0)} />
          <OverviewCard
            label={labels.overview.relationshipScore}
            value={Number(overview.relationship_score ?? 0)}
          />
          <OverviewCard
            label={labels.overview.consistencyChannels}
            value={Number(overview.consistency_channels ?? 0)}
          />
          <OverviewCard
            label={labels.overview.tenantPreferences}
            value={Number(overview.tenant_user_preferences ?? 0)}
          />
        </dl>
      ) : null}

      {tab === "personality" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title={labels.sections.coreTraits}>
            <JsonList items={coreTraits} />
          </SectionCard>
          <SectionCard title={labels.sections.identityRules}>
            <JsonList items={identityRules} />
          </SectionCard>
          <SectionCard title={labels.sections.personalityLayers}>
            <JsonList items={personalityLayers} />
          </SectionCard>
          <SectionCard title={labels.sections.roleProfiles}>
            <JsonList items={roleProfiles} />
          </SectionCard>
          <SectionCard title={labels.sections.humorFramework}>
            <JsonList items={humorFramework} />
          </SectionCard>
          <SectionCard title={labels.sections.selfLoveFramework}>
            <JsonList items={selfLoveFramework} />
          </SectionCard>
          <SectionCard title={labels.sections.trustFramework}>
            <JsonList items={trustFramework} />
          </SectionCard>
          <SectionCard title={labels.sections.emotionalAwareness}>
            <JsonList items={emotionalAwareness} />
          </SectionCard>
        </div>
      ) : null}

      {tab === "communication" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title={labels.sections.communicationStyles}>
            <JsonList items={communicationStyles} />
          </SectionCard>
          <SectionCard title={labels.sections.adaptiveProfiles}>
            <JsonList items={adaptiveProfiles} />
          </SectionCard>
          <SectionCard title={labels.sections.consistencyEngine}>
            <JsonList items={consistencyEngine} />
          </SectionCard>
        </div>
      ) : null}

      {tab === "preferences" ? (
        <SectionCard title={labels.tabs.preferences}>
          <p className="text-sm text-zinc-600">
            {String((center.preferences?.mobile_access as Record<string, unknown>)?.route ?? "/platform/companion/personality")}
          </p>
          <JsonList items={(center.preferences?.personality_layers as Record<string, unknown>[]) ?? personalityLayers} />
        </SectionCard>
      ) : null}

      {tab === "relationship_model" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title={labels.tabs.relationship_model}>
            <JsonList items={(relationship.relationship_models as Record<string, unknown>[]) ?? []} />
          </SectionCard>
          <SectionCard title={labels.sections.memoryIntegrations}>
            <JsonList items={memoryIntegrations} />
          </SectionCard>
          <SectionCard title={labels.sections.businessPackContributions}>
            <JsonList items={businessPackContributions} />
          </SectionCard>
        </div>
      ) : null}

      {tab === "interaction_history" ? (
        <section className="space-y-3">
          {interactions.map((item, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-medium text-zinc-900">{item.summary}</p>
              <p className="mt-1 text-zinc-500">
                {item.interaction_type}
                {item.style_used ? ` · ${item.style_used}` : ""}
                {item.quality_score != null ? ` · Quality ${item.quality_score}` : ""}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "adaptation" ? (
        <SectionCard title={labels.sections.adaptationRules}>
          <JsonList items={adaptationRules} />
        </SectionCard>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          {center.tenant_aggregate ? (
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Tenant Relationship Aggregate</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                {Object.entries(center.tenant_aggregate).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-zinc-500">{k.replace(/_/g, " ")}</dt>
                    <dd className="text-zinc-900">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <pre className="overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(center.reports ?? {}, null, 2)}
          </pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <SectionCard title={labels.sections.audit}>
          <ul className="space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}
