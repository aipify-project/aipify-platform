"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MARKETING_LANGUAGES,
  RESOURCE_TYPES,
  STATUS_BADGES,
  TARGET_AUDIENCES,
  WORKFLOW_BADGES,
  parseGrowthPartnerContentRequestCenter,
  type ContentLanguage,
  type ContentSurface,
  type GrowthPartnerContentRequestCenter,
  type GrowthPartnerContentRequestLabels,
  type ResourceType,
  type TargetAudience,
} from "@/lib/growth-partner-content-requests";

type GrowthPartnerContentRequestPanelProps = {
  surface: ContentSurface;
  labels: GrowthPartnerContentRequestLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function GrowthPartnerContentRequestPanel({
  surface,
  labels,
  backHref,
}: GrowthPartnerContentRequestPanelProps) {
  const [center, setCenter] = useState<GrowthPartnerContentRequestCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({
    request_title: "",
    resource_type: "presentation_deck" as ResourceType,
    industry: "",
    target_audience: "small_business" as TargetAudience,
    country: "NO",
    language: "en" as ContentLanguage,
    business_objective: "",
    additional_notes: "",
    desired_completion_date: "",
  });
  const [assignOwner, setAssignOwner] = useState("");
  const [assignPartner, setAssignPartner] = useState("");
  const [clarifyMessage, setClarifyMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/growth-partner-content-requests/overview?surface=${surface}`);
    if (res.ok) setCenter(parseGrowthPartnerContentRequestCenter(await res.json()));
    setLoading(false);
  }, [surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const id = String(payload.request_id ?? action);
      setBusyId(id);
      try {
        const res = await fetch("/api/growth-partner-content-requests/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload, surface }),
        });
        const data = (await res.json()) as { center?: GrowthPartnerContentRequestCenter };
        if (data.center) setCenter(data.center);
        else await load();
      } finally {
        setBusyId(null);
      }
    },
    [load, surface]
  );

  if (loading && !center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  if (!center?.has_access) {
    return <p className="text-sm text-gray-600">{labels.emptyState}</p>;
  }

  const overview = center.overview;
  const isSuper = surface === "super";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          </div>
          <Link href={backHref} className="text-sm text-indigo-700 hover:text-indigo-900">
            {labels.back}
          </Link>
        </div>
        {center.principle ? (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
            {center.principle}
          </p>
        ) : null}
      </header>

      {overview ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.overview}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewCard label={labels.overview.openRequests} value={overview.open_requests} />
            <OverviewCard label={labels.overview.inProduction} value={overview.in_production} />
            <OverviewCard label={labels.overview.awaitingReview} value={overview.awaiting_review} />
            <OverviewCard label={labels.overview.completedRequests} value={overview.completed_requests} />
            <OverviewCard
              label={labels.overview.recentlyPublishedAssets}
              value={overview.recently_published_assets}
            />
            <OverviewCard
              label={labels.overview.averageDeliveryTime}
              value={`${overview.average_delivery_time}d`}
            />
          </dl>
        </section>
      ) : null}

      {center.workflow_stages && center.workflow_stages.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.workflow}</h2>
          <ol className="mt-4 flex flex-wrap gap-2">
            {center.workflow_stages.map((step, index) => (
              <li key={step.stage} className="flex items-center gap-2">
                <Pill label={labels.workflowStages[step.stage]} className={WORKFLOW_BADGES[step.stage]} />
                {index < center.workflow_stages!.length - 1 ? (
                  <span className="text-gray-300">↓</span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {!isSuper ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.requestForm}</h2>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAction("submit_request", form).then(() => {
                setForm({
                  request_title: "",
                  resource_type: "presentation_deck",
                  industry: "",
                  target_audience: "small_business",
                  country: "NO",
                  language: "en",
                  business_objective: "",
                  additional_notes: "",
                  desired_completion_date: "",
                });
              });
            }}
          >
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-gray-700">{labels.requestForm.title}</span>
              <input
                required
                value={form.request_title}
                onChange={(e) => setForm((f) => ({ ...f, request_title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.resourceType}</span>
              <select
                value={form.resource_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, resource_type: e.target.value as ResourceType }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {labels.resourceTypes[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.targetAudience}</span>
              <select
                value={form.target_audience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, target_audience: e.target.value as TargetAudience }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {TARGET_AUDIENCES.map((audience) => (
                  <option key={audience} value={audience}>
                    {labels.targetAudiences[audience]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.industry}</span>
              <input
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.country}</span>
              <input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.language}</span>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm((f) => ({ ...f, language: e.target.value as ContentLanguage }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {MARKETING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {labels.languages[lang]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.requestForm.desiredCompletionDate}</span>
              <input
                type="date"
                value={form.desired_completion_date}
                onChange={(e) => setForm((f) => ({ ...f, desired_completion_date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-gray-700">{labels.requestForm.businessObjective}</span>
              <textarea
                required
                rows={2}
                value={form.business_objective}
                onChange={(e) => setForm((f) => ({ ...f, business_objective: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-gray-700">{labels.requestForm.additionalNotes}</span>
              <textarea
                rows={2}
                value={form.additional_notes}
                onChange={(e) => setForm((f) => ({ ...f, additional_notes: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busyId === "submit_request"}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {labels.requestForm.submit}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {center.notifications && center.notifications.length > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.notifications}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.notifications.map((note) => (
              <li key={note.id} className="rounded-lg border border-indigo-100 bg-white px-3 py-2">
                <span className="font-medium">{labels.notifications[note.notification_type]}</span>
                <span className="ml-2">{note.message}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.requests && center.requests.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.requests}</h2>
          <div className="mt-4 space-y-4">
            {center.requests.map((request) => (
              <article key={request.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{request.request_title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.resourceTypes[request.resource_type]} · {request.industry || "—"} ·{" "}
                      {labels.targetAudiences[request.target_audience]}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{request.business_objective}</p>
                    {request.clarification_required ? (
                      <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {request.clarification_message}
                      </p>
                    ) : null}
                    {request.duplicate_recommendations.length > 0 ? (
                      <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
                        <p className="font-medium">{labels.duplicates.heading}</p>
                        <ul className="mt-1 list-disc pl-4">
                          {request.duplicate_recommendations.map((dup) => (
                            <li key={`${dup.kind}-${dup.id}`}>
                              {dup.title} — {labels.duplicates.recommend}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Pill
                      label={labels.requestStatuses[request.status]}
                      className={STATUS_BADGES[request.status]}
                    />
                    <span className="text-xs text-gray-500">
                      {labels.table.priority}: {request.priority_score}
                    </span>
                    {request.status === "in_production" || request.status === "internal_review" ? (
                      <div className="w-32">
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{ width: `${request.production_progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{request.production_progress}%</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                {isSuper && request.status !== "published" && request.status !== "declined" ? (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-4">
                    {request.status === "submitted" || request.status === "under_review" ? (
                      <>
                        <button
                          type="button"
                          disabled={busyId === request.id}
                          onClick={() => handleAction("approve_request", { request_id: request.id })}
                          className="rounded-lg bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {labels.quickActions.approve}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === request.id}
                          onClick={() => handleAction("decline_request", { request_id: request.id })}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-800 hover:bg-red-50 disabled:opacity-50"
                        >
                          {labels.quickActions.decline}
                        </button>
                      </>
                    ) : null}
                    <input
                      placeholder={labels.table.owner}
                      value={assignOwner}
                      onChange={(e) => setAssignOwner(e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      disabled={busyId === request.id || !assignOwner}
                      onClick={() =>
                        handleAction("assign_owner", {
                          request_id: request.id,
                          assigned_owner: assignOwner,
                        })
                      }
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                      {labels.quickActions.assignOwner}
                    </button>
                    <input
                      placeholder={labels.table.partner}
                      value={assignPartner}
                      onChange={(e) => setAssignPartner(e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      disabled={busyId === request.id || !assignPartner}
                      onClick={() =>
                        handleAction("assign_partner", {
                          request_id: request.id,
                          assigned_partner: assignPartner,
                        })
                      }
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                      {labels.quickActions.assignPartner}
                    </button>
                    <input
                      placeholder={labels.quickActions.clarify}
                      value={clarifyMessage}
                      onChange={(e) => setClarifyMessage(e.target.value)}
                      className="min-w-[12rem] flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      disabled={busyId === request.id || !clarifyMessage}
                      onClick={() =>
                        handleAction("request_clarification", {
                          request_id: request.id,
                          message: clarifyMessage,
                        })
                      }
                      className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                    >
                      {labels.quickActions.clarify}
                    </button>
                    {request.status === "approved" ? (
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() => handleAction("start_production", { request_id: request.id })}
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {labels.quickActions.startProduction}
                      </button>
                    ) : null}
                    {request.status === "in_production" ? (
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() =>
                          handleAction("advance_production", {
                            request_id: request.id,
                            progress_delta: 25,
                          })
                        }
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {labels.quickActions.advanceProduction}
                      </button>
                    ) : null}
                    {request.status === "internal_review" ? (
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() =>
                          handleAction("publish_request", {
                            request_id: request.id,
                            delivery_method: "marketing_center",
                          })
                        }
                        className="rounded-lg bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {labels.quickActions.publish}
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {isSuper && request.status === "published" && request.published_asset_id ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={busyId === request.id}
                      onClick={() =>
                        handleAction("archive_published_asset", { request_id: request.id })
                      }
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {labels.quickActions.archive}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {center.delivery_methods && center.delivery_methods.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.delivery}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {center.delivery_methods.map((method) => (
              <li key={method} className="text-sm text-gray-700">
                · {labels.deliveryMethods[method]}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.reporting ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.reporting}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-700">{labels.reporting.mostRequested}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {center.reporting.most_requested_types.map((item) => (
                  <li key={item.resource_type}>
                    {labels.resourceTypes[item.resource_type] ?? item.resource_type} ({item.request_count})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">{labels.reporting.industryDemand}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {center.reporting.industry_demand.map((item) => (
                  <li key={item.industry}>
                    {item.industry} ({item.request_count})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {labels.reporting.avgProduction}: {center.reporting.average_production_days}d
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {labels.reporting.satisfaction}: {center.reporting.partner_satisfaction}%
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {center.audit && center.audit.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.audit.map((entry) => (
              <li key={entry.id} className="border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-800">{entry.summary}</span>
                <span className="ml-2 text-xs text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.foundation_principle ? (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          {center.foundation_principle || labels.foundationPrinciple}
        </p>
      ) : null}
    </div>
  );
}
