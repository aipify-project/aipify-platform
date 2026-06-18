"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseImplementationOnboardingCenter,
  type ImplementationOnboardingCenter,
  type ImplementationOnboardingSection,
} from "@/lib/implementation-onboarding-center";
import type { ImplementationOnboardingCenterLabels } from "@/lib/implementation-onboarding-center/labels";
import { ImplementationOnboardingStatusBadge } from "./ImplementationOnboardingStatusBadge";

type Props = {
  labels: ImplementationOnboardingCenterLabels;
  activeSection: ImplementationOnboardingSection;
};

function ItemCard({
  title,
  summary,
  statusKey,
  labels,
  extra,
}: {
  title: string;
  summary?: string;
  statusKey: string;
  labels: ImplementationOnboardingCenterLabels;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        <ImplementationOnboardingStatusBadge statusKey={statusKey} labels={labels.status} />
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function ImplementationOnboardingCenterPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<ImplementationOnboardingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/onboarding/implementation-center");
    if (res.ok) setCenter(parseImplementationOnboardingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleLaunch = async () => {
    setLaunching(true);
    setLaunchMessage(null);
    const res = await fetch("/api/onboarding/implementation-center/launch", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.ok) {
      setLaunchMessage(labels.launchSuccess);
      await load();
    } else {
      setLaunchMessage(data.error ?? labels.launchError);
    }
    setLaunching(false);
  };

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
  const launchStatusLabel =
    labels.launchStatus[center.launchStatus as keyof typeof labels.launchStatus] ??
    labels.launchStatus.setup_in_progress;

  const progressLabel = (state: string) => {
    if (state === "complete") return labels.progress.complete;
    if (state === "in_progress") return labels.progress.inProgress;
    return labels.progress.notStarted;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {activeSection === "welcome" ? (
        <>
          <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-teal-950">{labels.welcomeHeadline}</h3>
            <p className="mt-2 text-teal-900">{labels.welcomeSubheadline}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.organizationName}</p>
                <p className="mt-1 font-semibold text-zinc-900">{center.organizationName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.plan}</p>
                <p className="mt-1 font-semibold text-zinc-900">{center.planLabel}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.owner}</p>
                <p className="mt-1 font-semibold text-zinc-900">{center.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.daysSinceSignup}</p>
                <p className="mt-1 font-semibold text-zinc-900">{center.daysSinceSignup}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.setupProgress}</p>
                <p className="text-3xl font-bold text-teal-900">{center.setupProgressPct ?? 0}%</p>
              </div>
              <ImplementationOnboardingStatusBadge statusKey="waiting" labels={labels.status} />
              <span className="text-sm text-zinc-700">{launchStatusLabel}</span>
            </div>
          </section>

          {center.companionGuidance.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.companionGuidanceTitle}</h3>
              <ul className="mt-4 space-y-3">
                {center.companionGuidance.map((g) => (
                  <li key={g.id} className="rounded-lg border border-blue-100 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-zinc-900">{g.title}</p>
                      <ImplementationOnboardingStatusBadge statusKey={g.statusKey} labels={labels.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{g.insight}</p>
                    {g.recommendation ? (
                      <p className="mt-2 text-sm font-medium text-teal-800">{g.recommendation}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {center.topRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.topRecommendations}</h3>
              <ul className="mt-4 space-y-2">
                {center.topRecommendations.map((rec) => (
                  <li key={rec.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-white p-3">
                    <div>
                      <p className="font-medium text-zinc-900">{rec.title}</p>
                      <p className="text-sm text-zinc-600">{rec.insight}</p>
                    </div>
                    <ImplementationOnboardingStatusBadge statusKey={rec.statusKey} labels={labels.status} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-semibold text-zinc-900">{labels.relatedLinks}</h3>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/app/onboarding/first-day-experience" className="font-medium text-teal-700 hover:underline">
                {labels.firstDayExperience}
              </Link>
              <Link href="/app/onboarding/aipify-install" className="font-medium text-teal-700 hover:underline">
                {labels.aipifyInstall}
              </Link>
              <Link href="/app/customer-onboarding-engine" className="font-medium text-teal-700 hover:underline">
                {labels.customerOnboardingEngine}
              </Link>
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "setup" ? (
        <div className="space-y-3">
          {center.checklist.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="text-sm text-zinc-600">{item.summary}</p>
                </div>
                <ImplementationOnboardingStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
              <p className="mt-2 text-xs capitalize text-zinc-500">{progressLabel(item.progressState)}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "organization" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.organizationSetup.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              statusKey={item.statusKey}
              labels={labels}
              extra={
                item.valueLabel ? (
                  <p className="mt-2 text-sm font-medium text-teal-800">{item.valueLabel}</p>
                ) : null
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "users" ? (
        <div className="space-y-3">
          {center.userSetup.map((item) => (
            <ItemCard
              key={item.id}
              title={item.inviteeLabel}
              summary={`${item.roleLabel} · ${item.inviteStatus.replace(/_/g, " ")}`}
              statusKey={item.statusKey}
              labels={labels}
            />
          ))}
          <Link href="/app/team" className="inline-block text-sm font-medium text-teal-700 hover:underline">
            /app/team
          </Link>
        </div>
      ) : null}

      {activeSection === "companion" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.companionSetup.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              statusKey={item.statusKey}
              labels={labels}
              extra={
                item.valueLabel ? (
                  <p className="mt-2 text-sm font-medium text-teal-800">{item.valueLabel}</p>
                ) : null
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "knowledge" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.knowledgeSetup.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              statusKey={item.statusKey}
              labels={labels}
              extra={
                item.metricValue ? (
                  <p className="mt-2 text-sm text-zinc-700">
                    {item.metricLabel}: <span className="font-semibold">{item.metricValue}</span>
                  </p>
                ) : null
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "integrations" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.integrations.map((item) => (
            <ItemCard
              key={item.id}
              title={item.integrationName}
              summary={item.category.replace(/_/g, " ")}
              statusKey={item.statusKey}
              labels={labels}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "businessPacks" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.businessPacks.map((item) => (
            <ItemCard
              key={item.id}
              title={item.packName}
              summary={item.summary}
              statusKey={item.statusKey}
              labels={labels}
              extra={
                <p className="mt-2 text-xs capitalize text-zinc-500">{item.packCategory.replace(/_/g, " ")}</p>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "training" ? (
        <ul className="space-y-2">
          {center.trainingCenter.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium text-zinc-800">{item.moduleTitle}</span>
                <span className="ml-2 text-xs capitalize text-zinc-500">{item.trainingCategory.replace(/_/g, " ")}</span>
                {item.roleLabel ? <span className="ml-2 text-xs text-zinc-400">· {item.roleLabel}</span> : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{item.progressLabel}</span>
                <ImplementationOnboardingStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {activeSection === "launch" ? (
        <>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center">
            <p className="text-xs font-medium uppercase text-zinc-500">{labels.launchReadiness}</p>
            <p className="mt-2 text-5xl font-bold text-emerald-900">{center.launchReadinessScore ?? 0}%</p>
            <p className="mt-2 text-lg font-medium text-emerald-800">{center.launchReadinessLabel}</p>
          </div>
          <section>
            <h3 className="font-semibold text-zinc-900">{labels.goLiveHeadline}</h3>
            <ul className="mt-4 space-y-2">
              {center.goLiveChecklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3"
                >
                  <span className="text-sm text-zinc-800">{item.title}</span>
                  <ImplementationOnboardingStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </li>
              ))}
            </ul>
          </section>
          {center.canManage ? (
            <div className="space-y-3">
              <button
                type="button"
                disabled={launching || center.launchStatus === "launched"}
                onClick={() => void handleLaunch()}
                className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {launching ? labels.launching : labels.launchOrganization}
              </button>
              {launchMessage ? <p className="text-sm text-zinc-600">{launchMessage}</p> : null}
            </div>
          ) : null}
        </>
      ) : null}

      {activeSection === "timeline" ? (
        <div className="space-y-4">
          {center.customerSuccessTimeline.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{item.title}</p>
                <ImplementationOnboardingStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">Actions</p>
                  <p className="mt-1 text-zinc-700">{item.recommendedActions}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">Milestones</p>
                  <p className="mt-1 text-zinc-700">{item.expectedMilestones}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">Success</p>
                  <p className="mt-1 text-zinc-700">{item.successIndicators}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "executive" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.executiveOverview.map((m) => (
              <div key={m.id} className="rounded-xl border border-teal-100 bg-teal-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500 capitalize">
                  {m.metricKey.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-2xl font-bold text-teal-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2">
                  <ImplementationOnboardingStatusBadge statusKey={m.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
          {center.topRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.topRecommendations}</h3>
              <ul className="mt-4 space-y-2">
                {center.topRecommendations.map((rec) => (
                  <li key={rec.id} className="rounded-lg bg-white p-3">
                    <p className="font-medium text-zinc-900">{rec.title}</p>
                    <p className="text-sm text-zinc-600">{rec.insight}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "governance" ? (
        <>
          {center.governanceNote ? (
            <p className="rounded-xl border border-teal-100 bg-teal-50/30 p-4 text-sm text-teal-900">
              {center.governanceNote}
            </p>
          ) : null}
          {center.auditHistory.length > 0 ? (
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
          ) : (
            <p className="text-sm text-zinc-500">{labels.noAudit}</p>
          )}
        </>
      ) : null}
    </div>
  );
}
