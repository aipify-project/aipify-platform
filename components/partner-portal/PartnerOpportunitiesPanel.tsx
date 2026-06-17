"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  healthLabel,
  parsePartnerOpportunitiesForecast,
  parsePartnerOpportunitiesOverview,
  parsePartnerOpportunitiesPipeline,
  parsePartnerOpportunityDetail,
  stageLabel,
  type PartnerOpportunitiesForecast,
  type PartnerOpportunitiesOverview,
  type PartnerOpportunity,
} from "@/lib/partner-opportunities";

type Props = {
  labels: Record<string, string>;
};

type ViewMode = "table" | "pipeline" | "forecast";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function OpportunityRow({
  opp,
  labels,
  canWrite,
  onSelect,
}: {
  opp: PartnerOpportunity;
  labels: Record<string, string>;
  canWrite: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-3 font-medium text-slate-900">{opp.company_name}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{opp.contact_person || "—"}</td>
      <td className="px-4 py-3 text-sm">{stageLabel(labels, opp.stage_key, opp.stage_label)}</td>
      <td className="px-4 py-3 text-sm">{formatMoney(opp.opportunity_value)}</td>
      <td className="px-4 py-3 text-sm">{healthLabel(labels, opp.health_score_label)}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{opp.next_action || "—"}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onSelect(opp.id)}
          className="text-sm text-slate-900 underline"
        >
          {labels.viewDetails}
        </button>
      </td>
    </tr>
  );
}

export function PartnerOpportunitiesPanel({ labels }: Props) {
  const [overview, setOverview] = useState<PartnerOpportunitiesOverview | null>(null);
  const [forecast, setForecast] = useState<PartnerOpportunitiesForecast | null>(null);
  const [pipeline, setPipeline] = useState<Record<string, PartnerOpportunity[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReturnType<typeof parsePartnerOpportunityDetail>>(null);
  const [view, setView] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    contact_email: "",
    country_code: "",
    industry: "",
    opportunity_value: "",
    next_action: "Initial outreach",
    next_action_due: "",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (stage) params.set("stage", stage);
    if (country.trim()) params.set("country", country.trim());
    return params.toString();
  }, [country, search, stage]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const [overviewRes, forecastRes, pipelineRes] = await Promise.all([
        fetch(`/api/partner/opportunities${queryString ? `?${queryString}` : ""}`),
        fetch("/api/partner/opportunities/forecast"),
        fetch("/api/partner/opportunities/pipeline"),
      ]);
      const overviewJson = overviewRes.ok ? await overviewRes.json() : null;
      if (!overviewJson?.has_access) {
        setDenied(Boolean(overviewJson?.access_denied ?? !overviewJson?.has_access));
        setLoading(false);
        return;
      }
      setOverview(parsePartnerOpportunitiesOverview(overviewJson));
      if (forecastRes.ok) setForecast(parsePartnerOpportunitiesForecast(await forecastRes.json()));
      if (pipelineRes.ok) {
        const pipe = parsePartnerOpportunitiesPipeline(await pipelineRes.json());
        setPipeline(pipe?.kanban ?? {});
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadDetail = async (id: string) => {
    setSelectedId(id);
    const res = await fetch(`/api/partner/opportunities/${id}`);
    if (res.ok) setDetail(parsePartnerOpportunityDetail(await res.json()));
  };

  const createOpportunity = async () => {
    if (!form.company_name.trim()) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        opportunity_value: Number(form.opportunity_value) || 0,
      }),
    });
    if (res.ok) {
      setMessage(labels.created);
      setShowCreate(false);
      setForm({
        company_name: "",
        contact_person: "",
        contact_email: "",
        country_code: "",
        industry: "",
        opportunity_value: "",
        next_action: "Initial outreach",
        next_action_due: "",
      });
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !overview) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return <PlatformEmptyState title={labels.accessDenied} message={labels.subtitle} />;
  }

  if (error) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const dash = overview?.dashboard;
  const perf = overview?.performance;
  const canWrite = overview?.can_write ?? false;
  const opps = overview?.opportunities ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
          <p className="max-w-3xl text-sm text-slate-600">{labels.subtitle}</p>
          {overview?.positioning ? (
            <p className="max-w-3xl text-sm text-slate-500">{overview.positioning}</p>
          ) : null}
        </div>
        {canWrite ? (
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {labels.createOpportunity}
          </button>
        ) : null}
      </header>

      {message ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}

      {dash ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <MetricCard label={labels.activeOpportunities} value={dash.active_opportunities} />
          <MetricCard label={labels.newOpportunities} value={dash.new_opportunities} />
          <MetricCard label={labels.qualifiedOpportunities} value={dash.qualified_opportunities} />
          <MetricCard label={labels.proposalOpportunities} value={dash.proposal_opportunities} />
          <MetricCard label={labels.closedWon} value={dash.closed_won} />
          <MetricCard label={labels.closedLost} value={dash.closed_lost} />
          <MetricCard label={labels.pipelineValue} value={formatMoney(dash.pipeline_value)} />
        </section>
      ) : null}

      {perf ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.conversionRate} value={`${perf.conversion_rate_pct}%`} />
          <MetricCard label={labels.averageDealSize} value={formatMoney(perf.average_deal_size)} />
          <MetricCard label={labels.winRate} value={`${perf.win_rate_pct}%`} />
          <MetricCard label={labels.pipelineGrowth} value={perf.pipeline_growth} />
        </section>
      ) : null}

      {forecast ? (
        <section className="grid gap-3 sm:grid-cols-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <MetricCard label={labels.expectedRevenue} value={formatMoney(forecast.expected_revenue)} />
          <MetricCard label={labels.weightedRevenue} value={formatMoney(forecast.weighted_revenue)} />
          <MetricCard label={labels.potentialCommission} value={formatMoney(forecast.potential_commission)} />
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterAll}</option>
            {overview?.stages.map((s) => (
              <option key={s.stage_key} value={s.stage_key}>
                {stageLabel(labels, s.stage_key, s.stage_label)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={labels.country}
            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase"
          />
          <div className="flex gap-2">
            {(["table", "pipeline", "forecast"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  view === mode
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {mode === "table"
                  ? labels.tableView
                  : mode === "pipeline"
                    ? labels.pipelineView
                    : labels.forecastView}
              </button>
            ))}
          </div>
        </div>
      </section>

      {showCreate && canWrite ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.createOpportunity}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["company_name", labels.companyName],
                ["contact_person", labels.contactPerson],
                ["contact_email", labels.contactEmail],
                ["country_code", labels.country],
                ["industry", labels.industry],
                ["opportunity_value", labels.opportunityValue],
                ["next_action", labels.nextAction],
                ["next_action_due", labels.nextActionDue],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="text-slate-600">{label}</span>
                <input
                  type={key === "next_action_due" ? "date" : key === "opportunity_value" ? "number" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void createOpportunity()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {labels.createOpportunity}
          </button>
        </section>
      ) : null}

      {opps.length === 0 ? (
        <PlatformEmptyState
          title={overview?.empty_state?.title ?? labels.emptyTitle}
          message={overview?.empty_state?.message ?? labels.emptyMessage}
          primaryAction={
            canWrite
              ? { label: labels.createOpportunity, onClick: () => setShowCreate(true) }
              : undefined
          }
        />
      ) : view === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">{labels.companyName}</th>
                <th className="px-4 py-3">{labels.contactPerson}</th>
                <th className="px-4 py-3">{labels.currentStage}</th>
                <th className="px-4 py-3">{labels.opportunityValue}</th>
                <th className="px-4 py-3">{labels.healthScore}</th>
                <th className="px-4 py-3">{labels.nextAction}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {opps.map((opp) => (
                <OpportunityRow
                  key={opp.id}
                  opp={opp}
                  labels={labels}
                  canWrite={canWrite}
                  onSelect={(id) => void loadDetail(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : view === "pipeline" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {overview?.stages.map((s) => (
            <div key={s.stage_key} className="min-w-[240px] rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {stageLabel(labels, s.stage_key, s.stage_label)}
              </h3>
              <ul className="mt-3 space-y-2">
                {(pipeline[s.stage_key] ?? []).map((opp) => (
                  <li
                    key={opp.id}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm hover:border-slate-300"
                    onClick={() => void loadDetail(opp.id)}
                  >
                    <p className="font-medium text-slate-900">{opp.company_name}</p>
                    <p className="text-slate-600">{formatMoney(opp.opportunity_value)}</p>
                    <p className="mt-1 text-xs text-slate-500">{opp.next_action}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.forecastView}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {forecast?.by_month.map((row) => (
              <li key={row.month} className="flex justify-between border-b border-slate-100 py-2">
                <span>{row.month}</span>
                <span>
                  {formatMoney(row.weighted)} / {formatMoney(row.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {selectedId && detail?.opportunity ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{detail.opportunity.company_name}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <dt className="text-slate-500">{labels.contactPerson}</dt>
              <dd>{detail.opportunity.contact_person}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.currentStage}</dt>
              <dd>{stageLabel(labels, detail.opportunity.stage_key, detail.opportunity.stage_label)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.opportunityValue}</dt>
              <dd>{formatMoney(detail.opportunity.opportunity_value)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.potentialCommission}</dt>
              <dd>{formatMoney(detail.opportunity.potential_commission)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.nextAction}</dt>
              <dd>{detail.opportunity.next_action}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.healthScore}</dt>
              <dd>{healthLabel(labels, detail.opportunity.health_score_label)}</dd>
            </div>
          </dl>
          {(detail.opportunity.insights.length ?? 0) > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900">{labels.insightsTitle}</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                {detail.opportunity.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(detail.timeline?.length ?? 0) > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900">{labels.timelineTitle}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {detail.timeline?.map((item) => (
                  <li key={item.id} className="border-b border-slate-100 pb-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-slate-600">{item.summary}</p>
                    <p className="text-xs text-slate-400">{item.created_at}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqWhatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhyTrack}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqWhyTrackAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqRecommendations}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqRecommendationsAnswer}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
