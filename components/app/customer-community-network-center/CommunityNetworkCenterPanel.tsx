"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCommunityNetworkCenter,
  type CommunityNetworkCenter,
  type CommunityNetworkSection,
} from "@/lib/customer-community-network-center";
import type { CommunityNetworkCenterLabels } from "@/lib/customer-community-network-center/labels";
import { CommunityNetworkStatusBadge } from "./CommunityNetworkStatusBadge";

type Props = { labels: CommunityNetworkCenterLabels; activeSection: CommunityNetworkSection };

function Card({
  title, summary, statusKey, labels, extra,
}: {
  title: string; summary?: string; statusKey: string;
  labels: CommunityNetworkCenterLabels; extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        <CommunityNetworkStatusBadge statusKey={statusKey} labels={labels.status} />
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function CommunityNetworkCenterPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<CommunityNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/community/network-center");
    if (res.ok) setCenter(parseCommunityNetworkCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const sectionTitle = labels.sections[activeSection] ?? labels.title;
  const catLabel = (c: string) =>
    labels.discussionCategory[c as keyof typeof labels.discussionCategory] ?? c.replace(/_/g, " ");
  const tierLabel = (t: string) =>
    labels.reputationTier[t as keyof typeof labels.reputationTier] ?? t.replace(/_/g, " ");
  const upcoming = center.events.filter((e) => e.eventTiming === "upcoming");
  const past = center.events.filter((e) => e.eventTiming === "past");
  const approvedPractices = center.bestPractices.filter((p) => p.moderationStatus === "approved");
  const pendingPractices = center.bestPractices.filter((p) => p.moderationStatus !== "approved");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.refresh}
        </button>
      </div>

      {activeSection === "overview" ? (
        <>
          {center.corePrinciple ? (
            <p className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">{center.corePrinciple}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-600">{labels.yourReputation}:</span>
            <CommunityNetworkStatusBadge statusKey={center.memberReputationStatusKey ?? "waiting"} labels={labels.status} />
            <span className="text-sm font-medium text-zinc-900">{tierLabel(center.memberReputationTier ?? "new_member")}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.executiveOverview.slice(0, 4).map((m) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
          {center.hubHighlights.length > 0 ? (
            <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.sections.overview}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {center.hubHighlights.map((h) => (
                  <Card key={h.id} title={h.title} summary={h.summary} statusKey={h.statusKey} labels={labels}
                    extra={<p className="mt-2 text-xs capitalize text-zinc-500">{h.highlightType.replace(/_/g, " ")}</p>}
                  />
                ))}
              </ul>
            </section>
          ) : null}
          {center.companionGuidance.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.companionTitle}</h3>
              <ul className="mt-4 space-y-3">
                {center.companionGuidance.map((g) => (
                  <li key={g.id} className="rounded-lg border border-blue-100 bg-white p-4">
                    <p className="font-medium text-zinc-900">&ldquo;{g.exampleQuestion}&rdquo;</p>
                    <p className="mt-2 text-sm text-zinc-600">{g.answerSummary}</p>
                    {g.relatedContent ? <p className="mt-2 text-xs text-violet-700">{labels.relatedContent}: {g.relatedContent}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "discussions" ? (
        <div className="space-y-3">
          {center.discussions.map((d) => (
            <Card key={d.id} title={d.title} summary={d.summary} statusKey={d.statusKey} labels={labels}
              extra={
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded bg-zinc-100 px-2 py-0.5">{catLabel(d.category)}</span>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 capitalize">{d.discussionType.replace(/_/g, " ")}</span>
                  {d.repliesLabel ? <span>{labels.replies}: {d.repliesLabel}</span> : null}
                </div>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "knowledge" ? (
        <div className="space-y-3">
          {center.communityIntelligence.map((i) => (
            <Card key={i.id} title={i.title} summary={i.insight} statusKey={i.statusKey} labels={labels}
              extra={<p className="mt-2 text-xs text-zinc-500">{labels.feedTarget}: {i.feedTarget.replace(/_/g, " ")}</p>}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "bestPractices" ? (
        <>
          {approvedPractices.length > 0 ? (
            <div className="space-y-3">
              {approvedPractices.map((p) => (
                <Card key={p.id} title={p.title} summary={p.summary} statusKey={p.statusKey} labels={labels}
                  extra={
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="capitalize text-zinc-500">{p.practiceType.replace(/_/g, " ")}</span>
                      <span className="text-emerald-700">{labels.moderation}: {p.moderationStatus}</span>
                    </div>
                  }
                />
              ))}
            </div>
          ) : null}
          {pendingPractices.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-700">{labels.moderation}</p>
              {pendingPractices.map((p) => (
                <Card key={p.id} title={p.title} summary={p.summary} statusKey={p.statusKey} labels={labels} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {activeSection === "industryGroups" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.industryGroups.map((g) => (
            <Card key={g.id} title={g.groupName} summary={g.summary} statusKey={g.statusKey} labels={labels}
              extra={
                <div className="mt-2 text-sm text-zinc-600">
                  <p>{labels.members}: {g.membersLabel}</p>
                  <p className="mt-1 font-medium text-violet-800">{g.joined ? labels.joined : labels.notJoined}</p>
                </div>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "partnerNetwork" ? (
        <>
          <p className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-900">{labels.partnerRestricted}</p>
          <div className="space-y-3">
            {center.partnerNetwork.map((p) => (
              <Card key={p.id} title={p.title} summary={p.summary} statusKey={p.statusKey} labels={labels}
                extra={<p className="mt-2 text-xs capitalize text-zinc-500">{p.partnerArea.replace(/_/g, " ")}</p>}
              />
            ))}
          </div>
        </>
      ) : null}

      {activeSection === "events" ? (
        <>
          {upcoming.length > 0 ? (
            <section>
              <h3 className="mb-3 font-semibold text-zinc-900">{labels.upcomingEvents}</h3>
              <div className="space-y-3">
                {upcoming.map((e) => (
                  <Card key={e.id} title={e.title} summary={e.summary} statusKey={e.statusKey} labels={labels}
                    extra={
                      <div className="mt-2 text-sm text-zinc-600">
                        <p>{e.dateLabel}</p>
                        {e.registrationLabel ? <p>{labels.registration}: {e.registrationLabel}</p> : null}
                      </div>
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}
          {past.length > 0 ? (
            <section>
              <h3 className="mb-3 font-semibold text-zinc-900">{labels.pastEvents}</h3>
              <div className="space-y-3">
                {past.map((e) => (
                  <Card key={e.id} title={e.title} summary={e.summary} statusKey={e.statusKey} labels={labels}
                    extra={<p className="mt-2 text-sm text-zinc-600">{e.registrationLabel}</p>}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "certifications" ? (
        <div className="space-y-3">
          {center.certifications.map((c) => (
            <Card key={c.id} title={c.title} summary={c.summary} statusKey={c.statusKey} labels={labels}
              extra={c.progressLabel ? <p className="mt-2 text-sm font-medium text-violet-800">{labels.progress}: {c.progressLabel}</p> : null}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "reputation" ? (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/30 p-4">
            <span className="text-sm text-zinc-600">{labels.yourReputation}:</span>
            <span className="font-semibold text-violet-900">{tierLabel(center.memberReputationTier ?? "new_member")}</span>
            <CommunityNetworkStatusBadge statusKey={center.memberReputationStatusKey ?? "waiting"} labels={labels.status} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.reputationMetrics.map((r) => (
              <Card key={r.id} title={r.title} summary={undefined} statusKey={r.statusKey} labels={labels}
                extra={<p className="mt-2 text-2xl font-bold text-violet-900">{r.valueLabel}</p>}
              />
            ))}
          </div>
        </>
      ) : null}

      {activeSection === "intelligence" ? (
        <>
          <div className="space-y-3">
            {center.communityIntelligence.map((i) => (
              <Card key={i.id} title={i.title} summary={i.insight} statusKey={i.statusKey} labels={labels}
                extra={<p className="mt-2 text-xs text-zinc-500">{labels.feedTarget}: {i.feedTarget.replace(/_/g, " ")}</p>}
              />
            ))}
          </div>
          <p className="text-sm">
            <Link href="/app/community/legacy-intelligence" className="font-medium text-violet-700 hover:underline">
              {labels.openLegacyIntelligence}
            </Link>
          </p>
        </>
      ) : null}

      {activeSection === "successStories" ? (
        <div className="space-y-3">
          {center.successStories.map((s) => (
            <Card key={s.id} title={s.title} summary={s.summary} statusKey={s.statusKey} labels={labels}
              extra={<p className="mt-2 text-xs capitalize text-zinc-500">{s.storyType.replace(/_/g, " ")}</p>}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "executive" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.executiveOverview.map((m) => (
            <div key={m.id} className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
              <p className="text-xs font-medium uppercase text-zinc-500">{m.metricKey.replace(/_/g, " ")}</p>
              <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
              {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              <div className="mt-2"><CommunityNetworkStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "governance" ? (
        <>
          {center.governanceNote ? (
            <p className="rounded-xl border border-violet-100 bg-violet-50/30 p-4 text-sm text-violet-900">{center.governanceNote}</p>
          ) : null}
          <div className="space-y-3">
            {center.governanceControls.map((g) => (
              <Card key={g.id} title={g.title} summary={g.summary} statusKey={g.statusKey} labels={labels}
                extra={<p className="mt-2 text-xs capitalize text-zinc-500">{g.roleScope.replace(/_/g, " ")}</p>}
              />
            ))}
          </div>
          {center.canModerate ? (
            <p className="text-sm">
              <Link href="/app/community/admin" className="font-medium text-violet-700 hover:underline">{labels.openAdmin}</Link>
            </p>
          ) : null}
          {center.auditHistory.length > 0 ? (
            <>
              <h3 className="font-semibold text-zinc-900">{labels.auditHistory}</h3>
              <ul className="space-y-3">
                {center.auditHistory.map((a) => (
                  <li key={a.id} className="rounded-lg border border-zinc-100 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium capitalize text-zinc-900">{a.action.replace(/_/g, " ")}</p>
                      <span className="text-xs text-zinc-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</span>
                    </div>
                    <p className="mt-1 text-zinc-600">{a.description}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-zinc-500">{labels.noAudit}</p>
          )}
        </>
      ) : null}

      {activeSection === "marketplace" ? (
        <>
          <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">{labels.marketplaceDisabled}</p>
          <div className="space-y-3">
            {center.marketplacePrep.map((m) => (
              <Card key={m.id} title={m.title} summary={m.summary} statusKey={m.statusKey} labels={labels}
                extra={m.architectureNote ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.architectureNote}:</span> {m.architectureNote}</p> : null}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
