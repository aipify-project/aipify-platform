"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  APPROVAL_PROFILES_CORE_PRINCIPLE,
  APPROVAL_PROFILES_PHILOSOPHY,
  APPROVAL_PROFILES_VISION,
  parseApprovalProfilesCenter,
  type ApprovalProfilesCenter,
} from "@/lib/approval-profiles";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  activeTitle: string;
  reviewsTitle: string;
  recommendationsTitle: string;
  activityTitle: string;
  savingsTitle: string;
  governanceTitle: string;
  accept: string;
  dismiss: string;
  disable: string;
  delete: string;
  completeReview: string;
  privacyNote: string;
  approvalsLink: string;
  actionMemoryLink: string;
  governanceLink: string;
  profileTypes: Record<string, string>;
  approvalModes: Record<string, string>;
  reviewStates: Record<string, string>;
};

type ApprovalProfilesPanelProps = {
  labels: PanelLabels;
};

function reviewBadge(state: string) {
  switch (state) {
    case "needs_review":
      return "bg-amber-100 text-amber-800";
    case "suspended":
      return "bg-rose-100 text-rose-800";
    case "expired":
      return "bg-stone-100 text-stone-700";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

export function ApprovalProfilesPanel({ labels }: ApprovalProfilesPanelProps) {
  const [center, setCenter] = useState<ApprovalProfilesCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/approval-profiles/center");
    if (res.ok) setCenter(parseApprovalProfilesCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/approval-profiles/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-slate-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
        {center?.links?.action_memory && (
          <Link href={center.links.action_memory} className="text-slate-600 hover:underline">
            {labels.actionMemoryLink}
          </Link>
        )}
        {center?.links?.governance && (
          <Link href={center.links.governance} className="text-slate-600 hover:underline">
            {labels.governanceLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {APPROVAL_PROFILES_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {APPROVAL_PROFILES_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {APPROVAL_PROFILES_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {center?.time_savings && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.savingsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {Object.entries(center.time_savings).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-emerald-100 bg-white p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center?.governance_indicators && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.governanceTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.governance_indicators).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.recommendations.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.recommendationsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.recommendations.map((rec) => (
              <li key={rec.recommendation_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-gray-800">{rec.message}</p>
                {center.can_record && rec.status === "pending" && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          recommendation_key: rec.recommendation_key,
                          decision: "accept",
                        })
                      }
                      className="text-indigo-700 hover:underline"
                    >
                      {labels.accept}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          recommendation_key: rec.recommendation_key,
                          decision: "dismiss",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.pending_reviews.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.reviewsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.pending_reviews.map((profile) => (
              <li key={profile.profile_key} className="rounded-xl border border-amber-100 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{profile.profile_name}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${reviewBadge(profile.review_state)}`}>
                    {labels.reviewStates[profile.review_state] ?? profile.review_state}
                  </span>
                </div>
                {center.can_manage && (
                  <button
                    type="button"
                    onClick={() =>
                      void postAction({
                        action: "event",
                        profile_key: profile.profile_key,
                        decision: "complete_review",
                      })
                    }
                    className="mt-2 text-xs text-amber-800 hover:underline"
                  >
                    {labels.completeReview}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.active_profiles.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.activeTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.active_profiles.map((profile) => (
              <li key={profile.profile_key} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{profile.profile_name}</p>
                    <p className="text-xs text-gray-500">
                      {labels.profileTypes[profile.profile_type] ?? profile.profile_type} ·{" "}
                      {labels.approvalModes[profile.approval_mode] ?? profile.approval_mode}
                    </p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs ${reviewBadge(profile.review_state)}`}>
                    {labels.reviewStates[profile.review_state] ?? profile.review_state}
                  </span>
                </div>
                {center.can_manage && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          profile_key: profile.profile_key,
                          decision: "disable",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.disable}
                    </button>
                    {center.can_delete && (
                      <button
                        type="button"
                        onClick={() =>
                          void postAction({
                            action: "event",
                            profile_key: profile.profile_key,
                            decision: "delete",
                          })
                        }
                        className="text-rose-700 hover:underline"
                      >
                        {labels.delete}
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.approval_activity.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.activityTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.approval_activity.map((activity) => (
              <li key={activity.activity_key} className="rounded-lg border border-violet-100 bg-white px-3 py-2">
                {activity.action_category} via {activity.profile_key}
                {activity.time_saved_minutes > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    · {activity.time_saved_minutes} min saved
                  </span>
                )}
                {activity.override_used && (
                  <span className="ml-2 text-xs text-amber-700">override</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
