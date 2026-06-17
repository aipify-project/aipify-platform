"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  categoryLabel,
  horizonLabel,
  parseFutureStatePlanDetail,
  parseFutureStateTimeline,
  type FutureStatePlanningLabels,
  type FutureStatePlanDetail,
} from "@/lib/app-portal/future-state-planning";

type Props = { planId: string; labels: FutureStatePlanningLabels };

export function FutureStatePlanningDetailPanel({ planId, labels }: Props) {
  const [data, setData] = useState<FutureStatePlanDetail | null>(null);
  const [timeline, setTimeline] = useState<ReturnType<typeof parseFutureStateTimeline>["timeline"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [detailRes, timeRes] = await Promise.all([
      fetch(`/api/aipify/future-state-planning/${planId}`),
      fetch(`/api/aipify/future-state-planning/timeline?plan_id=${planId}`),
    ]);
    if (detailRes.ok) {
      setData(parseFutureStatePlanDetail(await detailRes.json()));
    } else {
      const b = (await detailRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (timeRes.ok) setTimeline(parseFutureStateTimeline(await timeRes.json()).timeline);
    setLoading(false);
  }, [planId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  if (loading && !data) return <p className="text-sm text-slate-600">{labels.loading}</p>;

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/future-state-planning"
          className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  const jsonList = (items: unknown[] | undefined) =>
    (items ?? []).map((x) => (typeof x === "string" ? x : String(x)));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/future-state-planning"
        className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>

      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {categoryLabel(labels, data.category)} · {horizonLabel(labels, data.time_horizon)}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label={labels.dashboard.progressScore} value={`${data.progress_score}%`} />
        <Metric label={labels.dashboard.alignmentScore} value={`${data.alignment_score}%`} />
        <Metric label={labels.dashboard.completenessScore} value={`${data.completeness_score}%`} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.detail.blueprint}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium text-slate-700">{labels.blueprint.visionStatement}</dt><dd className="mt-1 text-slate-600">{data.vision_statement || "—"}</dd></div>
          <div><dt className="font-medium text-slate-700">{labels.blueprint.currentState}</dt><dd className="mt-1 text-slate-600">{data.current_state || "—"}</dd></div>
          <div><dt className="font-medium text-slate-700">{labels.blueprint.desiredFutureState}</dt><dd className="mt-1 text-slate-600">{data.desired_future_state || "—"}</dd></div>
          <div><dt className="font-medium text-slate-700">{labels.blueprint.estimatedTimeline}</dt><dd className="mt-1 text-slate-600">{data.estimated_timeline || "—"}</dd></div>
          {jsonList(data.desired_outcomes).length > 0 ? (
            <div><dt className="font-medium text-slate-700">{labels.blueprint.desiredOutcomes}</dt>
              <dd className="mt-1"><ul className="list-disc pl-5 text-slate-600">{jsonList(data.desired_outcomes).map((o) => <li key={o}>{o}</li>)}</ul></dd></div>
          ) : null}
          {jsonList(data.strategic_priorities).length > 0 ? (
            <div><dt className="font-medium text-slate-700">{labels.blueprint.strategicPriorities}</dt>
              <dd className="mt-1"><ul className="list-disc pl-5 text-slate-600">{jsonList(data.strategic_priorities).map((o) => <li key={o}>{o}</li>)}</ul></dd></div>
          ) : null}
          {jsonList(data.executive_sponsors).length > 0 ? (
            <div><dt className="font-medium text-slate-700">{labels.blueprint.executiveSponsors}</dt>
              <dd className="mt-1 text-slate-600">{jsonList(data.executive_sponsors).join(", ")}</dd></div>
          ) : null}
          {jsonList(data.departments_involved).length > 0 ? (
            <div><dt className="font-medium text-slate-700">{labels.blueprint.departmentsInvolved}</dt>
              <dd className="mt-1 text-slate-600">{jsonList(data.departments_involved).join(", ")}</dd></div>
          ) : null}
        </dl>
      </section>

      {(data.alignment?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.detail.alignment}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2 pr-4">{labels.alignment.department}</th>
                  <th className="py-2 pr-4">{labels.alignment.currentAlignment}</th>
                  <th className="py-2 pr-4">{labels.alignment.targetAlignment}</th>
                  <th className="py-2 pr-4">{labels.alignment.progress}</th>
                  <th className="py-2">{labels.alignment.owner}</th>
                </tr>
              </thead>
              <tbody>
                {data.alignment!.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{row.department}</td>
                    <td className="py-2 pr-4">{row.current_alignment}%</td>
                    <td className="py-2 pr-4">{row.target_alignment}%</td>
                    <td className="py-2 pr-4">{row.progress}%</td>
                    <td className="py-2">{row.owner || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {(data.milestones?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.detail.milestones}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {data.milestones!.map((m) => (
              <li key={m.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-900">{m.title}</p>
                <p className="mt-1 text-slate-600">
                  {labels.milestoneStatuses[m.status as keyof typeof labels.milestoneStatuses] ?? m.status}
                  {m.target_date ? ` · ${m.target_date}` : ""}
                </p>
                {m.success_indicator ? (
                  <p className="mt-1 text-xs text-slate-500">{labels.milestone.successIndicator}: {m.success_indicator}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data.reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.detail.reviewHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.reviews!.map((r) => (
              <li key={r.id}>{r.review_notes}{r.reviewed_at ? ` · ${new Date(r.reviewed_at).toLocaleDateString()}` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.advisory_note ? (
        <p className="text-sm text-slate-600">{labels.detail.advisoryNote}</p>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{value}</p>
    </div>
  );
}
