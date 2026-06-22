"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  BarChart3,
  CheckCircle2,
  Clock3,
  Filter,
  HelpCircle,
  History,
  Plus,
  RotateCcw,
  Search,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
} from "@/components/app/design";
import { ExecutiveMetricCard } from "@/components/app/design/ExecutiveMetricCard";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatDateTime } from "@/lib/i18n/format-date";
import type { SupportRequestCategory, SupportRequestPriority } from "@/lib/app-portal/support-requests";
import {
  HISTORICAL_STATUSES,
  SUPPORT_CREATE_HREF,
  SUPPORT_HISTORY_CHANNELS,
  SUPPORT_HISTORY_LANDING_HREF,
  SUPPORT_HISTORY_SORT_OPTIONS,
  buildHistoryQueryParams,
  filterCasesExcludeActive,
  mapSupportHistoryStatusToSemantic,
  mapSupportPriorityToSeverity,
  parseHistoryFiltersFromSearchParams,
  parseSupportHistory,
  resolveCaseDetailHref,
  type SupportHistoryCase,
  type SupportHistoryLabels,
  type SupportHistoryResponse,
} from "@/lib/app-portal/support-history";

type Props = {
  labels: SupportHistoryLabels;
  locale: string;
};

const CATEGORIES: SupportRequestCategory[] = [
  "technical", "billing", "integrations", "business_packs", "account", "security", "general",
];
const PRIORITIES: SupportRequestPriority[] = ["low", "medium", "high", "urgent"];

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: BarChart3,
  filters: Filter,
  cases: History,
  insights: Clock3,
  understanding: HelpCircle,
};

function HistoryMetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className={`${AppPremiumShell.elevatedCard} p-4`}>
      <p className={AppPremiumShell.metricLabel}>{label}</p>
      <p className={`mt-1 ${AppPremiumShell.metricValue}`}>{value}</p>
    </article>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? History;
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px] stroke-[1.75]" />
      </span>
      <h2 className={AppPremiumShell.sectionTitle}>{title}</h2>
    </div>
  );
}

function SupportHistoryPanelInner({ labels, locale }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseHistoryFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const [data, setData] = useState<SupportHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftSearch, setDraftSearch] = useState(filters.search);
  const [draftStatus, setDraftStatus] = useState(filters.status);
  const [draftCategory, setDraftCategory] = useState(filters.category);
  const [draftPriority, setDraftPriority] = useState(filters.priority);
  const [draftChannel, setDraftChannel] = useState(filters.channel);
  const [draftAssigned, setDraftAssigned] = useState(filters.assigned);
  const [draftDateFrom, setDraftDateFrom] = useState(filters.dateFrom);
  const [draftDateTo, setDraftDateTo] = useState(filters.dateTo);
  const [draftSort, setDraftSort] = useState(filters.sort);

  useEffect(() => {
    setDraftSearch(filters.search);
    setDraftStatus(filters.status);
    setDraftCategory(filters.category);
    setDraftPriority(filters.priority);
    setDraftChannel(filters.channel);
    setDraftAssigned(filters.assigned);
    setDraftDateFrom(filters.dateFrom);
    setDraftDateTo(filters.dateTo);
    setDraftSort(filters.sort);
  }, [filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = buildHistoryQueryParams(filters);
    const res = await fetch(`/api/aipify/support-history?${params}`);
    if (res.ok) {
      setData(parseSupportHistory(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string; access_state?: string };
      const code = body.error ?? "";
      const mapped =
        code === "load_error" || body.access_state === "database_execution_error"
          ? labels.errorBody
          : code === "permission_missing"
            ? labels.errorBody
            : labels.errorBody;
      setError(mapped);
    }
    setLoading(false);
  }, [filters, labels.errorBody]);

  useEffect(() => {
    void load();
  }, [load]);

  const applyFilters = () => {
    const next = buildHistoryQueryParams({
      status: draftStatus,
      category: draftCategory,
      priority: draftPriority,
      channel: draftChannel,
      assigned: draftAssigned,
      dateFrom: draftDateFrom,
      dateTo: draftDateTo,
      search: draftSearch,
      sort: draftSort,
      page: 1,
    });
    router.replace(`${SUPPORT_HISTORY_LANDING_HREF}?${next.toString()}`);
  };

  const clearFilters = () => {
    router.replace(SUPPORT_HISTORY_LANDING_HREF);
  };

  const goToPage = (page: number) => {
    const next = buildHistoryQueryParams({ ...filters, page });
    router.replace(`${SUPPORT_HISTORY_LANDING_HREF}?${next.toString()}`);
  };

  const items = useMemo(
    () => filterCasesExcludeActive(data?.items ?? []),
    [data?.items]
  );
  const overview = data?.overview;
  const insights = data?.insights;
  const pagination = data?.pagination;

  if (loading && !data) {
    return (
      <div className={AppPremiumShell.page}>
        <AppLoadingState message={labels.loading} />
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className={AppPremiumShell.page}>
        <AppErrorState
          title={labels.errorTitle}
          description={labels.errorBody}
          retryLabel={labels.retry}
          onRetry={() => void load()}
          returnHref="/app"
          returnLabel={labels.backToOverview}
        />
      </div>
    );
  }

  return (
    <div className={AppPremiumShell.page}>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>{labels.breadcrumbSupport}</li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-800">{labels.breadcrumbHistory}</li>
        </ol>
      </nav>

      <header className="mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">{labels.eyebrow}</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
          </div>
          <Link
            href={SUPPORT_CREATE_HREF}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {labels.createRequest}
          </Link>
        </div>
        {data?.principle ? (
          <p className="rounded-2xl border border-violet-100 bg-violet-50/50 px-5 py-4 text-sm text-slate-800">
            {data.principle}
          </p>
        ) : null}
      </header>

      <section className="mt-8 space-y-4">
        <SectionHeading id="overview" title={labels.sections.overview} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <HistoryMetricCard label={labels.overview.totalHistorical} value={overview?.total_historical ?? 0} />
          <HistoryMetricCard label={labels.overview.resolved} value={overview?.resolved ?? 0} />
          <HistoryMetricCard label={labels.overview.closed} value={overview?.closed ?? 0} />
          <HistoryMetricCard label={labels.overview.reopened} value={overview?.reopened ?? 0} />
          <HistoryMetricCard label={labels.overview.archived} value={overview?.archived ?? 0} />
          <HistoryMetricCard
            label={labels.overview.avgResolutionDays}
            value={`${overview?.avg_resolution_days ?? 0} ${labels.overview.daysUnit}`}
          />
        </div>
      </section>

      <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading id="filters" title={labels.sections.filters} />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm lg:col-span-2">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.search}</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                placeholder={labels.filters.searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.sort}</span>
            <select
              value={draftSort}
              onChange={(e) => setDraftSort(e.target.value as typeof draftSort)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {SUPPORT_HISTORY_SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {labels.sortOptions[option]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.status}</span>
            <select
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value as typeof draftStatus)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">{labels.filters.all}</option>
              {HISTORICAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {labels.statuses[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.category}</span>
            <select
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value as typeof draftCategory)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">{labels.filters.all}</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {labels.categories[category]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.priority}</span>
            <select
              value={draftPriority}
              onChange={(e) => setDraftPriority(e.target.value as typeof draftPriority)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">{labels.filters.all}</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {labels.priorities[priority]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.channel}</span>
            <select
              value={draftChannel}
              onChange={(e) => setDraftChannel(e.target.value as typeof draftChannel)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">{labels.filters.all}</option>
              {SUPPORT_HISTORY_CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {labels.channels[channel]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.assigned}</span>
            <input
              type="text"
              value={draftAssigned}
              onChange={(e) => setDraftAssigned(e.target.value)}
              placeholder={labels.filters.assigned}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.dateFrom}</span>
            <input
              type="date"
              value={draftDateFrom}
              onChange={(e) => setDraftDateFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">{labels.filters.dateTo}</span>
            <input
              type="date"
              value={draftDateTo}
              onChange={(e) => setDraftDateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            {labels.filters.apply}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {labels.filters.clear}
          </button>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <SectionHeading id="cases" title={labels.sections.cases} />
        {items.length === 0 ? (
          <AppEmptyState
            title={labels.emptyTitle}
            description={labels.emptyBody}
            actionLabel={labels.emptyAction}
            actionHref={SUPPORT_CREATE_HREF}
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <HistoryCaseCard key={item.id} item={item} labels={labels} locale={locale} />
            ))}
          </div>
        )}
        {pagination && pagination.total_pages > 1 ? (
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              {labels.pagination.previous}
            </button>
            <p className="text-sm text-slate-600">
              {labels.pagination.page.replace("{page}", String(pagination.page)).replace("{total}", String(pagination.total_pages))}
            </p>
            <button
              type="button"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => goToPage(pagination.page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              {labels.pagination.next}
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading id="insights" title={labels.sections.insights} />
        {(insights?.top_categories?.length ?? 0) === 0 && !insights?.most_recent_resolution_at ? (
          <p className="text-sm text-slate-600">{labels.insights.noInsights}</p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-slate-700">{labels.insights.topCategories}</dt>
              <dd className="mt-2 space-y-1 text-sm text-slate-600">
                {(insights?.top_categories ?? []).map((row) => (
                  <p key={row.category}>
                    {labels.categories[row.category]} — {row.count}
                  </p>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-700">{labels.insights.reopenRate}</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-900">{insights?.reopen_rate_percent ?? 0}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-700">{labels.insights.recentResolution}</dt>
              <dd className="mt-2 text-sm text-slate-600">
                {insights?.most_recent_resolution_at
                  ? formatDateTime(insights.most_recent_resolution_at, locale)
                  : "—"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading id="understanding" title={labels.sections.understanding} />
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-900">{labels.understanding.title}</h3>
            <p className="mt-1">{labels.understanding.body}</p>
          </div>
          <div className="flex gap-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
            <Archive className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-slate-900">{labels.understanding.auditTitle}</h3>
              <p className="mt-1">{labels.understanding.auditBody}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{labels.understanding.reopenTitle}</h3>
            <p className="mt-1">{labels.understanding.reopenBody}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HistoryCaseCard({
  item,
  labels,
  locale,
}: {
  item: SupportHistoryCase;
  labels: SupportHistoryLabels;
  locale: string;
}) {
  const statusSemantic = mapSupportHistoryStatusToSemantic(item.status);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SemanticBadge
            type={statusSemantic.type}
            value={statusSemantic.value}
            label={labels.statuses[item.status]}
          />
          <SemanticBadge
            type="severity"
            value={mapSupportPriorityToSeverity(item.priority)}
            label={labels.priorities[item.priority]}
          />
        </div>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">{labels.card.category}</dt>
          <dd>{labels.categories[item.category]}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.card.channel}</dt>
          <dd>{labels.channels[item.channel ?? "app_portal"]}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.card.createdBy}</dt>
          <dd>{item.created_by}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.card.assignee}</dt>
          <dd>{item.assigned_support_owner}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.card.created}</dt>
          <dd>{formatDateTime(item.created_at, locale)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.card.updated}</dt>
          <dd>{formatDateTime(item.updated_at, locale)}</dd>
        </div>
        {item.resolved_at ? (
          <div>
            <dt className="text-slate-500">{labels.card.resolved}</dt>
            <dd>{formatDateTime(item.resolved_at, locale)}</dd>
          </div>
        ) : null}
        {item.related_module ? (
          <div>
            <dt className="text-slate-500">{labels.card.module}</dt>
            <dd>{item.related_module}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={resolveCaseDetailHref(item.id)}
        className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:underline"
      >
        {labels.card.viewCase} →
      </Link>
    </article>
  );
}

export function SupportHistoryPanel(props: Props) {
  return (
    <Suspense
      fallback={
        <div className={AppPremiumShell.page}>
          <AppLoadingState message={props.labels.loading} />
        </div>
      }
    >
      <SupportHistoryPanelInner {...props} />
    </Suspense>
  );
}
