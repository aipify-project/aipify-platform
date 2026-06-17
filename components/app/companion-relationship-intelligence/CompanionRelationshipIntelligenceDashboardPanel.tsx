"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  parseRelationshipIntelligenceDashboard,
  parseRelationshipOpportunities,
  parseRelationshipReminders,
  type CompanionRelationshipIntelligenceLabels,
  type RecognitionOpportunity,
  type RelationshipIntelligenceDashboard,
  type RelationshipOpportunity,
  type RelationshipProfile,
  type RelationshipReminder,
} from "@/lib/aipify/companion-relationship-intelligence";

type Props = { labels: CompanionRelationshipIntelligenceLabels };

export function CompanionRelationshipIntelligenceDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<RelationshipIntelligenceDashboard | null>(null);
  const [opportunities, setOpportunities] = useState<RelationshipOpportunity[]>([]);
  const [reminders, setReminders] = useState<RelationshipReminder[]>([]);
  const [recognition, setRecognition] = useState<RecognitionOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [healthLevel, setHealthLevel] = useState("");
  const [engagementLevel, setEngagementLevel] = useState("");
  const [owner, setOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (relationshipType) p.set("relationship_type", relationshipType);
    if (healthLevel) p.set("health_level", healthLevel);
    if (engagementLevel) p.set("engagement_level", engagementLevel);
    if (owner) p.set("owner", owner);
    if (department) p.set("department", department);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, oppRes, remRes] = await Promise.all([
      fetch(`/api/aipify/relationship-intelligence?${p}`),
      fetch("/api/aipify/relationship-intelligence/opportunities"),
      fetch("/api/aipify/relationship-intelligence/reminders"),
    ]);

    if (dashRes.ok) {
      setData(parseRelationshipIntelligenceDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (oppRes.ok) setOpportunities(parseRelationshipOpportunities(await oppRes.json()).opportunities);
    if (remRes.ok) {
      const r = parseRelationshipReminders(await remRes.json());
      setReminders(r.reminders);
      setRecognition(r.recognition);
    }
    setLoading(false);
  }, [relationshipType, healthLevel, engagementLevel, owner, department, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const profiles = data?.profiles ?? [];
  const empty = !data?.has_relationships;
  const strategic = profiles.filter((p) =>
    ["customers", "partners", "growth_partners", "strategic_contacts", "executives"].includes(p.relationship_type),
  );
  const needsAttention = profiles.filter((p) => p.health_level === "needs_attention" || p.health_level === "at_risk");
  const recent = [...profiles]
    .filter((p) => p.last_interaction_at)
    .sort((a, b) => (b.last_interaction_at ?? "").localeCompare(a.last_interaction_at ?? ""))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/assistant/relationships"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <ScoreCard label={labels.dashboard.healthScore} value={data?.relationship_health_score ?? 0} />
          <ScoreCard label={labels.dashboard.strategicRelationships} value={data?.strategic_count ?? strategic.length} />
          <ScoreCard label={labels.dashboard.needsAttention} value={data?.attention_count ?? needsAttention.length} />
          <ScoreCard label={labels.dashboard.recentInteractions} value={recent.length} />
          <ScoreCard label={labels.dashboard.upcomingActivities} value={reminders.length} />
          <ScoreCard label={labels.dashboard.engagementTrends} value={profiles.filter((p) => p.engagement_level === "high").length} />
        </section>
      )}

      {!empty && needsAttention.length > 0 ? (
        <Section title={labels.sections.needsAttention}>
          <div className="grid gap-3 lg:grid-cols-2">
            {needsAttention.map((p) => (
              <ProfileCard key={p.id} profile={p} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && strategic.length > 0 ? (
        <Section title={labels.sections.strategicRelationships}>
          <div className="grid gap-3 lg:grid-cols-2">
            {strategic.map((p) => (
              <ProfileCard key={p.id} profile={p} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && recent.length > 0 ? (
        <Section title={labels.sections.recentInteractions}>
          <div className="grid gap-3 lg:grid-cols-2">
            {recent.map((p) => (
              <ProfileCard key={p.id} profile={p} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {opportunities.length > 0 ? (
        <Section title={labels.sections.opportunities}>
          <div className="grid gap-3 lg:grid-cols-2">
            {opportunities.map((o) => (
              <article key={o.id} className="rounded-lg border border-slate-100 p-4 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {labels.opportunityTypes[o.opportunity_type as keyof typeof labels.opportunityTypes] ?? o.opportunity_type}
                </p>
                <h3 className="mt-1 font-medium text-slate-900">{o.title}</h3>
                <p className="mt-1 text-slate-600">{o.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {reminders.length > 0 ? (
        <Section title={labels.sections.reminders}>
          <ul className="space-y-2 text-sm text-slate-700">
            {reminders.map((r) => (
              <li key={r.id}>
                {r.title} · {labels.reminderTypes[r.reminder_type as keyof typeof labels.reminderTypes] ?? r.reminder_type} · {r.due_date}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {recognition.length > 0 ? (
        <Section title={labels.sections.recognitionCenter}>
          <div className="grid gap-3 lg:grid-cols-2">
            {recognition.map((r) => (
              <article key={r.id} className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm">
                <p className="text-xs uppercase tracking-wide text-amber-800">
                  {labels.recognitionTypes[r.recognition_type as keyof typeof labels.recognitionTypes] ?? r.recognition_type}
                </p>
                <h3 className="mt-1 font-medium text-slate-900">{r.title}</h3>
                <p className="mt-1 text-slate-600">{r.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && profiles.length > 0 ? (
        <Section title={labels.sections.allRelationships}>
          <div className="grid gap-3 lg:grid-cols-2">
            {profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={relationshipType} onChange={(e) => setRelationshipType(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.relationshipType}</option>
          {Object.entries(labels.relationshipTypes).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={healthLevel} onChange={(e) => setHealthLevel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.healthLevel}</option>
          {Object.entries(labels.healthLevels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={engagementLevel} onChange={(e) => setEngagementLevel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.engagementLevel}</option>
          {Object.entries(labels.engagementLevels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input value={owner} onChange={(e) => setOwner(e.target.value)}
          placeholder={labels.filters.owner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {(data?.timeline?.length ?? 0) > 0 ? (
        <Section title={labels.sections.timeline}>
          <ul className="space-y-2 text-sm text-slate-700">
            {data!.timeline!.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data?.usage_example ? (
        <Section title={labels.sections.usageExamples}>
          <p className="text-sm italic text-slate-700">{data.usage_example}</p>
        </Section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoManage}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoManageAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ProfileCard({ profile, labels }: { profile: RelationshipProfile; labels: CompanionRelationshipIntelligenceLabels }) {
  return (
    <article className="rounded-lg border border-slate-100 p-4 text-sm">
      <h3 className="font-medium text-slate-900">{profile.contact_name}</h3>
      <p className="text-slate-600">{profile.organization_name}</p>
      {profile.contact_role ? (
        <p className="mt-1 text-xs text-slate-500">{labels.card.role}: {profile.contact_role}</p>
      ) : null}
      {profile.insight ? (
        <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-slate-700">
          <span className="font-medium">{labels.card.insight}: </span>{profile.insight}
        </p>
      ) : null}
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.health}: </dt>
          <dd className="inline">{labels.healthLevels[profile.health_level as keyof typeof labels.healthLevels] ?? profile.health_level}</dd></div>
        <div><dt className="inline">{labels.card.engagement}: </dt>
          <dd className="inline">{labels.engagementLevels[profile.engagement_level as keyof typeof labels.engagementLevels] ?? profile.engagement_level}</dd></div>
        {profile.last_interaction_at ? (
          <div><dt className="inline">{labels.card.lastInteraction}: </dt><dd className="inline">{profile.last_interaction_at}</dd></div>
        ) : null}
      </dl>
    </article>
  );
}
