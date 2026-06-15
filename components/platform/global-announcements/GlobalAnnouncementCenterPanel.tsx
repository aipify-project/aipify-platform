"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENT_STATUSES,
  buildAnnouncementFilterQuery,
  DELIVERY_CHANNELS,
  parseGlobalAnnouncementCenter,
  STATUS_BADGES,
  TARGET_AUDIENCES,
  type AnnouncementFilters,
  type AnnouncementRow,
  type GlobalAnnouncementCenter,
  type GlobalAnnouncementLabels,
} from "@/lib/global-announcements";

type GlobalAnnouncementCenterPanelProps = {
  labels: GlobalAnnouncementLabels;
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

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

const EMPTY_FORM = {
  title: "",
  summary: "",
  full_content: "",
  category: "system_update",
  audience: "all_customers",
  requires_approval: false,
  country: "",
  language: "",
  plan: "",
};

export function GlobalAnnouncementCenterPanel({
  labels,
  backHref,
}: GlobalAnnouncementCenterPanelProps) {
  const [center, setCenter] = useState<GlobalAnnouncementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnnouncementFilters>({});
  const [draftFilters, setDraftFilters] = useState<AnnouncementFilters>({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState<AnnouncementRow | null>(null);

  const load = useCallback(async (activeFilters: AnnouncementFilters) => {
    setLoading(true);
    const query = buildAnnouncementFilterQuery(activeFilters);
    const res = await fetch(`/api/global-announcements/overview${query}`);
    if (res.ok) setCenter(parseGlobalAnnouncementCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.announcement_id ?? "create");
      setBusyId(id);
      try {
        const res = await fetch("/api/global-announcements/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setForm(EMPTY_FORM);
          await load(filters);
        }
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle}
        </p>
      </div>

      {center.is_empty && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
          {labels.emptyState}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.category ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  category: e.target.value as AnnouncementFilters["category"],
                }))
              }
            >
              <option value="">{labels.filters.allCategories}</option>
              {ANNOUNCEMENT_CATEGORIES.map((key) => (
                <option key={key} value={key}>
                  {labels.categories[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.audience}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.audience ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  audience: e.target.value as AnnouncementFilters["audience"],
                }))
              }
            >
              <option value="">{labels.filters.allAudiences}</option>
              {TARGET_AUDIENCES.map((key) => (
                <option key={key} value={key}>
                  {labels.audiences[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  status: e.target.value as AnnouncementFilters["status"],
                }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {ANNOUNCEMENT_STATUSES.map((key) => (
                <option key={key} value={key}>
                  {labels.statuses[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.country}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.country ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, country: e.target.value || undefined }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.language}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.language ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, language: e.target.value || undefined }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.plan}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.plan ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, plan: e.target.value || undefined }))
              }
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => setFilters({ ...draftFilters })}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.filters.apply}
        </button>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.active} value={overview.active_announcements} />
          <OverviewCard label={labels.overview.scheduled} value={overview.scheduled_messages} />
          <OverviewCard label={labels.overview.drafts} value={overview.draft_messages} />
          <OverviewCard label={labels.overview.campaigns} value={overview.targeted_campaigns} />
          <OverviewCard
            label={labels.overview.deliveryRate}
            value={`${overview.delivery_success_rate}%`}
          />
          <OverviewCard
            label={labels.overview.requiringReview}
            value={overview.messages_requiring_review}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.create}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="text-xs text-gray-500">{labels.form.title}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-xs text-gray-500">{labels.form.summary}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.summary}
              onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-xs text-gray-500">{labels.form.fullContent}</span>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.full_content}
              onChange={(e) => setForm((prev) => ({ ...prev, full_content: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.form.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              {ANNOUNCEMENT_CATEGORIES.map((key) => (
                <option key={key} value={key}>
                  {labels.categories[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.form.audience}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.audience}
              onChange={(e) => setForm((prev) => ({ ...prev, audience: e.target.value }))}
            >
              {TARGET_AUDIENCES.map((key) => (
                <option key={key} value={key}>
                  {labels.audiences[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.form.country}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.form.language}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.language}
              onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.requires_approval}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, requires_approval: e.target.checked }))
              }
            />
            {labels.form.requiresApproval}
          </label>
        </div>
        <button
          type="button"
          disabled={busyId === "create" || !form.title.trim()}
          onClick={() =>
            void handleAction({
              action: "create",
              title: form.title,
              summary: form.summary,
              full_content: form.full_content,
              category: form.category,
              audience: form.audience,
              requires_approval: form.requires_approval,
              delivery_channels: DELIVERY_CHANNELS.slice(0, 2),
              audience_filters: {
                country: form.country || undefined,
                language: form.language || undefined,
                plan: form.plan || undefined,
              },
            })
          }
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.form.create}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.announcements}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.title}</th>
                <th className="px-3 py-2">{labels.table.category}</th>
                <th className="px-3 py-2">{labels.table.audience}</th>
                <th className="px-3 py-2">{labels.table.status}</th>
                <th className="px-3 py-2">{labels.table.scheduledDate}</th>
                <th className="px-3 py-2">{labels.table.createdBy}</th>
                <th className="px-3 py-2">{labels.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {center.announcements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.announcements.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-3 py-3">{labels.categories[row.category]}</td>
                    <td className="px-3 py-3">{labels.audiences[row.audience]}</td>
                    <td className="px-3 py-3">
                      <StatusPill
                        label={labels.statuses[row.status]}
                        className={STATUS_BADGES[row.status]}
                      />
                    </td>
                    <td className="px-3 py-3">
                      {formatDate(row.scheduled_at ?? row.publish_at)}
                    </td>
                    <td className="px-3 py-3">{row.created_by || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {labels.actions.view}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({ action: "duplicate", announcement_id: row.id })
                          }
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.duplicate}
                        </button>
                        {row.requires_approval && row.approval_status === "pending" && (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() =>
                              void handleAction({ action: "approve", announcement_id: row.id })
                            }
                            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
                          >
                            {labels.actions.approve}
                          </button>
                        )}
                        {row.status !== "published" && (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() =>
                              void handleAction({ action: "publish", announcement_id: row.id })
                            }
                            className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          >
                            {labels.actions.publish}
                          </button>
                        )}
                        {row.status === "draft" && (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() =>
                              void handleAction({ action: "schedule", announcement_id: row.id })
                            }
                            className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          >
                            {labels.actions.schedule}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({ action: "archive", announcement_id: row.id })
                          }
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.archive}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-semibold text-gray-900">{selected.title}</h2>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{selected.summary}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{selected.full_content}</p>
          <p className="mt-3 text-xs text-gray-500">
            {selected.delivery_channels.map((c) => labels.channels[c]).join(" · ")}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.analytics}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.title}</th>
                <th className="px-3 py-2">{labels.table.views}</th>
                <th className="px-3 py-2">{labels.table.emailOpens}</th>
                <th className="px-3 py-2">{labels.table.clickRate}</th>
                <th className="px-3 py-2">{labels.table.deliverySuccess}</th>
              </tr>
            </thead>
            <tbody>
              {center.analytics_summary.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.analytics_summary.map((row) => (
                  <tr key={row.announcement_id} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-3 py-3">{row.views}</td>
                    <td className="px-3 py-3">{row.email_opens}</td>
                    <td className="px-3 py-3">{row.click_rate}%</td>
                    <td className="px-3 py-3">{row.delivery_success_rate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.audit.length === 0 ? (
            <li className="text-gray-500">{labels.emptyState}</li>
          ) : (
            center.audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700">
                <span className="font-medium text-gray-900">{entry.summary}</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {labels.table.event}: {entry.event_type.replace(/_/g, " ")} ·{" "}
                  {formatDate(entry.created_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
