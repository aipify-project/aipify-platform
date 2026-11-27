"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import {
  CertifiedSellersActionPanel,
  type SellersActionLabels,
} from "@/components/platform/sellers/CertifiedSellersActionPanel";
import { UnifiedProductRegisterTable } from "@/components/platform/sellers/UnifiedProductRegisterTable";
import { buildUnifiedCatalog, type ProductCatalogLocaleCode, type UnifiedCatalogProduct } from "@/lib/product-catalog";
import {
  filterProductCenterView,
  parseProductCenterView,
  PRODUCT_CENTER_VIEWS,
  type ProductCenterView,
} from "@/lib/platform/product-center-views";
import { SELLERS_ADMIN_FRAME } from "@/lib/platform/sellers-admin-nav";
import { CertifiedSellersOverviewRanking } from "@/components/platform/sellers/CertifiedSellersOverviewRanking";
import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import { classifyCspApiResponse } from "@/lib/certified-sales-partner/ui-support";
import {
  countPendingApplications,
  isFinalSettlementStatus,
  nextSettlementStep,
  parseSellersOverview,
  parseSettlementList,
  partnerStatusKind,
  settlementStatusKind,
  shortReference,
  type SellersOverview,
  type SellersProductRow,
  type SellersSettlementRow,
} from "@/lib/certified-sales-partner/platform-sellers-view";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import type { SellersLiveLabels } from "@/lib/partners-portal/csp-workspace-labels";
import type { SettlementStatementLabels } from "@/lib/certified-sales-partner/settlement-statement-labels";
import { CommissionStatementPreview } from "@/components/certified-sales-partner/CommissionStatementPreview";

export type SellersLiveSection = "overview" | "partners" | "products" | "settlements" | "commissions" | "academy";

type Props = {
  section: SellersLiveSection;
  locale: string;
  title: string;
  subtitle: string;
  notReadyTitle: string;
  notReadyBody: string;
  labels: SellersLiveLabels;
  actionLabels: SellersActionLabels;
  statementLabels: SettlementStatementLabels;
};

type Phase = "loading" | "ready" | "closed" | "forbidden" | "error";

type CommissionLine = {
  id: string;
  partnerId: string;
  partnerName: string | null;
  productKey: string | null;
  status: string | null;
  amount: number | null;
  currency: string | null;
  attributedAt: string | null;
};

type LoadState = {
  phase: Phase;
  overview: SellersOverview | null;
  settlements: SellersSettlementRow[] | null;
  commissionLines: CommissionLine[] | null;
};

const PARTNER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EMPTY_STATE: LoadState = { phase: "loading", overview: null, settlements: null, commissionLines: null };

const PARTNER_STATUS_ORDER = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
] as const;

async function fetchJson(url: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

function phaseFor(status: number, body: unknown): Phase {
  const outcome = classifyCspApiResponse(status, body);
  switch (outcome.kind) {
    case "ready":
      return "ready";
    case "unauthorized":
    case "forbidden":
      return "forbidden";
    case "not_ready":
      return outcome.code === "forbidden" ? "forbidden" : "closed";
    default:
      return "error";
  }
}

function formatMoney(amount: number | null, currency: string | null, locale: string, fallback: string): string {
  if (amount === null) return fallback;
  const bcp = toBcp47Locale(locale);
  if (currency && /^[A-Z]{3}$/.test(currency)) {
    try {
      return new Intl.NumberFormat(bcp, { style: "currency", currency }).format(amount);
    } catch {
      /* fall through */
    }
  }
  return new Intl.NumberFormat(bcp).format(amount) + (currency ? ` ${currency}` : "");
}

/** ISO 3166-1 alpha-2 → localized country name; falls back to the code Core returned. */
function formatCountry(code: string | null, locale: string, fallback: string): string {
  if (!code) return fallback;
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return code;
  try {
    return new Intl.DisplayNames([toBcp47Locale(locale)], { type: "region" }).of(upper) ?? upper;
  } catch {
    return upper;
  }
}

function parseCommissionLines(body: unknown): CommissionLine[] {
  if (!body || typeof body !== "object" || !Array.isArray((body as { rows?: unknown }).rows)) return [];
  return (body as { rows: unknown[] }).rows.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const row = raw as Record<string, unknown>;
    if (row.kind !== "qualified_sale") return [];
    const id = typeof row.id === "string" ? row.id : "";
    const partnerId = typeof row.partnerId === "string" ? row.partnerId : "";
    if (!id || !partnerId) return [];
    return [
      {
        id,
        partnerId,
        partnerName: typeof row.partnerName === "string" ? row.partnerName : null,
        productKey: typeof row.productKey === "string" ? row.productKey : null,
        status: typeof row.status === "string" ? row.status : null,
        amount: typeof row.amount === "number" ? row.amount : null,
        currency: typeof row.currency === "string" ? row.currency : null,
        attributedAt: typeof row.attributedAt === "string" ? row.attributedAt : null,
      },
    ];
  });
}

function formatPeriod(value: string | null, locale: string, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(toBcp47Locale(locale), { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function CertifiedSellersLivePanel({
  section,
  locale,
  title,
  subtitle,
  notReadyTitle,
  notReadyBody,
  labels,
  actionLabels,
  statementLabels,
}: Props) {
  const [state, setState] = useState<LoadState>(EMPTY_STATE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partnerQuery, setPartnerQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selection, setSelection] = useState<{
    id: string;
    seq: number;
    fromStatus?: string;
    toStatus?: string;
  } | null>(null);
  const [settlementFilter, setSettlementFilter] = useState<string>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const partnerParam = searchParams.get("partner");
  const statusParam = searchParams.get("status");

  useEffect(() => {
    if (statusParam && (PARTNER_STATUS_ORDER as readonly string[]).includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  useEffect(() => {
    if (partnerParam && PARTNER_ID_RE.test(partnerParam.trim())) {
      router.replace(`/platform/sellers/partners/${partnerParam.trim()}`);
    }
  }, [partnerParam, router]);

  const l = labels.text;
  const nf = useMemo(() => new Intl.NumberFormat(toBcp47Locale(locale)), [locale]);
  const count = useCallback((n: number | null) => (n === null ? l.notReported : nf.format(n)), [l.notReported, nf]);

  const load = useCallback(async () => {
    // Keep already-loaded content (and any form feedback) mounted while refreshing in the background.
    setState((prev) => (prev.phase === "ready" ? prev : { ...prev, phase: "loading" }));
    try {
      if (section === "commissions") {
        const { status, body } = await fetchJson("/api/platform/sellers/leads-sales");
        const phase = phaseFor(status, body);
        setState({
          phase,
          overview: null,
          settlements: null,
          commissionLines: phase === "ready" ? parseCommissionLines(body) : null,
        });
        return;
      }
      if (section === "settlements") {
        const { status, body } = await fetchJson("/api/platform/sellers/settlements");
        const phase = phaseFor(status, body);
        setState({
          phase,
          overview: null,
          settlements: phase === "ready" ? (parseSettlementList(body) ?? []) : null,
          commissionLines: null,
        });
        return;
      }
      const url = section === "products" ? "/api/platform/sellers/products" : "/api/platform/sellers/partners";
      const { status, body } = await fetchJson(url);
      const phase = phaseFor(status, body);
      setState({
        phase,
        overview: phase === "ready" ? parseSellersOverview(body) : null,
        settlements: null,
        commissionLines: null,
      });
    } catch {
      setState({ phase: "error", overview: null, settlements: null, commissionLines: null });
    }
  }, [section]);

  useEffect(() => {
    void load();
  }, [load]);

  const { phase, overview, settlements, commissionLines } = state;
  const ready = phase === "ready";

  const metrics = useMemo(() => {
    if (!ready) return [];
    if (section === "commissions") {
      const rows = commissionLines ?? [];
      return [{ label: labels.sectionTitles.commissions, value: nf.format(rows.length) }];
    }
    if (section === "settlements") {
      const rows = settlements ?? [];
      const by = (statuses: string[]) => rows.filter((r) => statuses.includes(r.status)).length;
      return [
        { label: l.kpiInReview, value: nf.format(by(["open"])) },
        { label: l.kpiAwaitingPayout, value: nf.format(by(["approved", "closed"])) },
        { label: l.kpiPaid, value: nf.format(by(["paid"])) },
      ];
    }
    if (!overview) return [];
    if (section === "products") {
      return [
        { label: l.kpiProductsPublished, value: count(overview.productsPublished) },
        { label: l.kpiProductsTotal, value: count(overview.productsTotal) },
      ];
    }
    if (section === "partners") {
      return [
        {
          label: l.kpiApplications,
          value: nf.format(countPendingApplications(overview.partnersByStatus)),
          note: l.kpiApplicationsNote,
        },
        { label: l.kpiApprovedPartners, value: nf.format(overview.partnersByStatus.approved ?? 0) },
        { label: l.kpiPartnersTotal, value: count(overview.partnersTotal) },
      ];
    }
    if (section === "academy") {
      return [
        { label: l.kpiCertified, value: count(overview.certifiedPartners), note: overview.certifiedPartners === null ? l.notReportedNote : undefined },
      ];
    }
    // overview
    return [
      {
        label: l.kpiApplications,
        value: nf.format(countPendingApplications(overview.partnersByStatus)),
        note: l.kpiApplicationsNote,
      },
      { label: l.kpiApprovedPartners, value: nf.format(overview.partnersByStatus.approved ?? 0) },
      {
        label: l.kpiCertified,
        value: count(overview.certifiedPartners),
        note: overview.certifiedPartners === null ? l.notReportedNote : undefined,
      },
      {
        label: l.kpiSales,
        value: count(overview.qualifiedSales),
        note: overview.qualifiedSales === null ? l.notReportedNote : undefined,
      },
      { label: l.kpiOpenSettlements, value: count(overview.openSettlementsCount) },
      { label: l.kpiUnpaidSettlements, value: count(overview.unpaidSettlementsCount) },
      { label: l.kpiProductsPublished, value: count(overview.productsPublished) },
      // Academy figures only when Core reports them (`overview.academy`).
      ...(overview.academy
        ? [
            { label: l.academyAttempts, value: count(overview.academy.attemptsTotal) },
            { label: l.academyPassed, value: count(overview.academy.attemptsPassed) },
            { label: l.academyCertifications, value: count(overview.academy.certificationsActive) },
          ]
        : []),
    ];
  }, [ready, section, overview, settlements, commissionLines, l, nf, count, labels.sectionTitles.commissions]);

  const dateOptions = {
    locale,
    emptyFallback: l.dateEmpty,
    invalidFallback: l.dateInvalid,
  };

  return (
    <>
      <CertifiedSellersSectionPanel
        title={title}
        subtitle={subtitle}
        backendReady={phase !== "closed"}
        notReadyTitle={notReadyTitle}
        notReadyBody={notReadyBody}
        metrics={metrics}
      />
      <div className={`${SELLERS_ADMIN_FRAME} space-y-6 px-6 pb-8 lg:px-8`}>
        {phase === "loading" ? <AipifyLoader centered size="sm" label={l.loading} /> : null}

        {phase === "forbidden" ? (
          <Notice role="alert" title={l.forbiddenTitle} body={l.forbiddenBody} retryLabel={l.retry} onRetry={load} />
        ) : null}
        {phase === "error" ? (
          <Notice role="alert" title={l.errorTitle} body={l.errorBody} retryLabel={l.retry} onRetry={load} />
        ) : null}
        {phase === "closed" ? (
          <button type="button" onClick={() => void load()} className={SECONDARY_BUTTON}>
            {l.retry}
          </button>
        ) : null}

        {ready && section === "overview" && overview ? (
          <>
            <Card title={l.followUpTitle}>
              <ul className="grid gap-3 md:grid-cols-3">
                <li>
                  <Link href="/platform/sellers/partners?status=under_review" className={LINK_BUTTON}>
                    {l.followUpApplications}: {nf.format(countPendingApplications(overview.partnersByStatus))}
                  </Link>
                </li>
                <li>
                  <Link href="/platform/sellers/settlements" className={LINK_BUTTON}>
                    {l.followUpSettlements}: {overview.openSettlementsCount === null ? l.notReported : nf.format(overview.openSettlementsCount)}
                  </Link>
                </li>
                <li>
                  <Link href="/platform/sellers/messages" className={LINK_BUTTON}>
                    {l.followUpMessages}
                  </Link>
                </li>
              </ul>
            </Card>
            <Card title={l.searchSellers}>
              <label className="block text-sm">
                <span className="sr-only">{l.searchSellers}</span>
                <input
                  value={partnerQuery}
                  onChange={(event) => {
                    setPartnerQuery(event.target.value);
                    setPage(0);
                  }}
                  className="w-full max-w-xl rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                />
              </label>
              <ul className="mt-3 space-y-2">
                {(overview.partners ?? [])
                  .filter((partner) => {
                    const q = partnerQuery.trim().toLowerCase();
                    if (!q) return false;
                    return [partner.name, partner.legalBusinessName, partner.country, partner.email, partner.id]
                      .filter(Boolean)
                      .join(" ")
                      .toLowerCase()
                      .includes(q);
                  })
                  .slice(0, 8)
                  .map((partner) => (
                    <li key={partner.id}>
                      <Link href={`/platform/sellers/partners/${partner.id}`} className={LINK_BUTTON}>
                        {partner.name || partner.legalBusinessName || l.partnerUnnamed}
                      </Link>
                    </li>
                  ))}
              </ul>
            </Card>
            <CertifiedSellersOverviewRanking
              locale={locale}
              labels={labels}
              onOpenProfile={(id) => router.push(`/platform/sellers/partners/${id}`)}
            />
            <StatusBreakdown overview={overview} labels={labels} nf={nf} />
            {overview.openSettlementsCount ? (
              <Card title={l.settlementsOpenByCurrency}>
                <ul className="flex flex-wrap gap-3 text-sm">
                  {Object.entries(overview.openSettlementsByCurrency).map(([currency, total]) => (
                    <li key={currency} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5">
                      {formatMoney(total, currency, locale, l.notReported)}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </>
        ) : null}

        {ready && section === "partners" && overview ? (
          <>
            <StatusBreakdown overview={overview} labels={labels} nf={nf} />
            {overview.partners === null ? (
              <EmptyCard title={l.partnersListMissingTitle} body={l.partnersListMissingBody} />
            ) : overview.partners.length === 0 ? (
              <EmptyCard title={l.partnersEmptyTitle} body={l.partnersEmptyBody} />
            ) : (
              <Card title={labels.sectionTitles.partners}>
                <label className="mb-4 block max-w-xs text-sm">
                  <span className="font-medium">{l.filterLabel}</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                  >
                    <option value="all">{l.filterAll}</option>
                    {PARTNER_STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {labels.partnerStatus[s]}
                      </option>
                    ))}
                  </select>
                </label>
                {(() => {
                  const matched = overview.partners!.filter((p) => {
                    if (statusFilter !== "all" && p.status !== statusFilter) return false;
                    const q = partnerQuery.trim().toLowerCase();
                    if (!q) return true;
                    return [p.name, p.legalBusinessName, p.country, p.email, p.id].filter(Boolean).join(" ").toLowerCase().includes(q);
                  });
                  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
                  const safePage = Math.min(page, pageCount - 1);
                  const rows = matched.slice(safePage * pageSize, safePage * pageSize + pageSize);
                  if (matched.length === 0) return <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.partnersFilterEmpty}</p>;
                  // Country column only when Core returned a country for at least one partner.
                  const showCountry = rows.some((p) => p.country !== null);
                  return (
                    <>
                    <DataTable
                      caption={labels.sectionTitles.partners}
                      headers={
                        showCountry
                          ? [l.colPartner, l.colCountry, l.colStatus, l.colApplied, l.colAction]
                          : [l.colPartner, l.colStatus, l.colApplied, l.colAction]
                      }
                    >
                      {rows.map((p) => {
                        const profileHref = `/platform/sellers/partners/${p.id}${statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`}`;
                        return (
                          <tr key={p.id} className="border-t border-[color:var(--aipify-border)]">
                            <td className="px-3 py-2">
                              <p className="font-medium text-[color:var(--aipify-text-primary)]">{p.name ?? l.partnerUnnamed}</p>
                              {p.legalBusinessName ? (
                                <p className="text-sm text-[color:var(--aipify-text-secondary)]">{p.legalBusinessName}</p>
                              ) : null}
                              <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                                {l.referenceLabel}: {shortReference(p.id)}
                              </p>
                            </td>
                            {showCountry ? (
                              <td className="px-3 py-2">{formatCountry(p.country, locale, l.dateEmpty)}</td>
                            ) : null}
                            <td className="px-3 py-2">
                              <AipifyStatusBadge
                                kind={partnerStatusKind(p.status)}
                                label={labels.partnerStatus[p.status] ?? labels.partnerStatus.unknown}
                              />
                            </td>
                            <td className="px-3 py-2">{formatPlatformDateTimeShort(p.createdAt, dateOptions)}</td>
                            <td className="px-3 py-2">
                              <Link href={profileHref} className={LINK_BUTTON}>
                                {l.viewApplication}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </DataTable>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <label>
                        {l.pageRows}
                        <select
                          value={pageSize}
                          onChange={(event) => {
                            setPageSize(Number(event.target.value));
                            setPage(0);
                          }}
                          className="ml-2 rounded-lg border border-[color:var(--aipify-border)] px-2 py-1"
                        >
                          {[10, 25, 50].map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </label>
                      <button type="button" className={LINK_BUTTON} onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={safePage === 0}>
                        {l.previousPage}
                      </button>
                      <button type="button" className={LINK_BUTTON} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={safePage >= pageCount - 1}>
                        {l.nextPage}
                      </button>
                    </div>
                    </>
                  );
                })()}
              </Card>
            )}
          </>
        ) : null}

        {ready && section === "products" && overview ? (
          <ProductCenterWorkspace
            locale={locale}
            overview={overview}
            labels={l}
            actionLabels={actionLabels}
            onReload={() => void load()}
          />
        ) : null}

        {ready && section === "commissions" ? (
          <>
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.commissionsReportNote}</p>
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{statementLabels.earnIntervalNote}</p>
            {(commissionLines ?? []).length === 0 ? (
              <EmptyCard title={l.commissionsEmptyTitle} body={l.commissionsReportNote} />
            ) : (
              <Card title={labels.sectionTitles.commissions}>
                <DataTable
                  caption={labels.sectionTitles.commissions}
                  headers={[l.colPartner, l.colProduct, l.colStatus, l.colTotal, l.colRecorded]}
                >
                  {(commissionLines ?? []).map((line) => (
                    <tr key={line.id} className="border-t border-[color:var(--aipify-border)]">
                      <td className="px-3 py-2">
                        <Link href={`/platform/sellers/partners/${line.partnerId}`} className={LINK_BUTTON}>
                          {line.partnerName || l.partnerUnnamed}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        <p>{l.notReported}</p>
                        {line.productKey ? (
                          <details className="text-xs text-[color:var(--aipify-text-secondary)]">
                            <summary>{l.colProduct}</summary>
                            <p className="mt-1 font-mono">{line.productKey}</p>
                          </details>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">
                        <p>{l.qualifiedSaleLabel}</p>
                        {line.status ? (
                          <details className="text-xs text-[color:var(--aipify-text-secondary)]">
                            <summary>{l.colStatus}</summary>
                            <p className="mt-1 font-mono">{line.status}</p>
                          </details>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">{formatMoney(line.amount, line.currency, locale, l.notReported)}</td>
                      <td className="px-3 py-2">{formatPlatformDateTimeShort(line.attributedAt, dateOptions)}</td>
                    </tr>
                  ))}
                </DataTable>
              </Card>
            )}
          </>
        ) : null}

        {ready && section === "settlements" ? (
          <>
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{statementLabels.currencyNote}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={statementLabels.status}>
              {["all", "open", "approved", "closed", "paid", "voided"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    settlementFilter === status
                      ? "min-h-11 rounded-full bg-[#7C3AED] px-3 text-sm font-semibold text-white"
                      : "min-h-11 rounded-full border border-[color:var(--aipify-border)] px-3 text-sm font-semibold text-[color:var(--aipify-text-primary)]"
                  }
                  onClick={() => setSettlementFilter(status)}
                >
                  {status === "all" ? statementLabels.filterAll : (labels.settlementStatus[status] ?? labels.settlementStatus.unknown)}
                </button>
              ))}
            </div>
            {(settlements ?? []).filter((row) => settlementFilter === "all" || row.status === settlementFilter).length === 0 ? (
              <EmptyCard title={l.settlementsEmptyTitle} body={l.settlementsEmptyBody} />
            ) : (
              <Card title={labels.sectionTitles.settlements}>
                <DataTable
                  caption={labels.sectionTitles.settlements}
                  headers={[l.colPeriod, l.colPartner, l.colStatus, l.colTotal, l.colLines, statementLabels.documentNumber, l.colAction]}
                >
                  {(settlements ?? [])
                    .filter((row) => settlementFilter === "all" || row.status === settlementFilter)
                    .map((s) => {
                    const next = nextSettlementStep(s.status);
                    return (
                      <tr key={s.id} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">{formatPeriod(s.periodMonth, locale, l.dateEmpty)}</td>
                        <td className="px-3 py-2 text-xs text-[color:var(--aipify-text-secondary)]">
                          {s.partnerId ? `${l.referenceLabel}: ${shortReference(s.partnerId)}` : l.dateEmpty}
                        </td>
                        <td className="px-3 py-2">
                          <AipifyStatusBadge
                            kind={settlementStatusKind(s.status)}
                            label={labels.settlementStatus[s.status] ?? labels.settlementStatus.unknown}
                          />
                        </td>
                        <td className="px-3 py-2">{formatMoney(s.totalAmount, s.currency, locale, l.notReported)}</td>
                        <td className="px-3 py-2">{s.lineCount === null ? l.dateEmpty : nf.format(s.lineCount)}</td>
                        <td className="px-3 py-2 text-sm text-[color:var(--aipify-text-secondary)]">{statementLabels.notIssued}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className={LINK_BUTTON} onClick={() => setPreviewId(s.id)}>
                              {statementLabels.preview}
                            </button>
                            {isFinalSettlementStatus(s.status) || !next ? (
                              <span className="text-xs text-[color:var(--aipify-text-secondary)]">
                                {l.settlementsNoFurtherSteps}
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={LINK_BUTTON}
                                onClick={() =>
                                  setSelection((prev) => ({
                                    id: s.id,
                                    seq: (prev?.seq ?? 0) + 1,
                                    fromStatus: s.status,
                                    toStatus: next,
                                  }))
                                }
                              >
                                {l.selectAction}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
              </Card>
            )}
            {previewId ? (
              <CommissionStatementPreview
                locale={locale}
                labels={statementLabels}
                statusLabel={
                  labels.settlementStatus[(settlements ?? []).find((row) => row.id === previewId)?.status ?? ""] ??
                  labels.settlementStatus.unknown
                }
                previewHref={`/api/platform/sellers/settlements/${previewId}/preview`}
                source={{
                  settlementId: previewId,
                  periodMonth: (settlements ?? []).find((row) => row.id === previewId)?.periodMonth ?? null,
                  status: (settlements ?? []).find((row) => row.id === previewId)?.status ?? null,
                  totalAmount: (settlements ?? []).find((row) => row.id === previewId)?.totalAmount ?? null,
                  currency: (settlements ?? []).find((row) => row.id === previewId)?.currency ?? null,
                  lineCount: (settlements ?? []).find((row) => row.id === previewId)?.lineCount ?? null,
                  partnerReference: (settlements ?? []).find((row) => row.id === previewId)?.partnerId ?? null,
                }}
              />
            ) : null}
            {(settlements ?? []).length > 0 ? (
              selection ? (
                <CertifiedSellersActionPanel
                  key={`${selection.id}:${selection.seq}`}
                  section="settlements"
                  labels={actionLabels}
                  initialSettlementId={selection.id}
                  initialFromStatus={selection.fromStatus}
                  initialToStatus={selection.toStatus}
                  paidConfirmationLabel={statementLabels.paidConfirm}
                  paidConfirmationRequired={statementLabels.paidConfirmRequired}
                  onSuccess={() => void load()}
                />
              ) : (
                <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.chooseSettlement}</p>
              )
            ) : null}
          </>
        ) : null}

        {ready && section === "academy" && overview ? (
          <>
            {overview.academy ? (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [l.academyAttempts, overview.academy.attemptsTotal],
                  [l.academyPassed, overview.academy.attemptsPassed],
                  [l.academyFailed, overview.academy.attemptsFailed],
                  [l.academyCertifications, overview.academy.certificationsActive],
                ].map(([label, value]) => (
                  <article
                    key={String(label)}
                    className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-5 shadow-sm"
                  >
                    <p className="text-sm text-[color:var(--aipify-text-secondary)]">{String(label)}</p>
                    <p className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text-primary)]">
                      {count(value as number | null)}
                    </p>
                  </article>
                ))}
              </section>
            ) : (
              <EmptyCard title={l.academyEmptyTitle} body={l.academyEmptyBody} />
            )}
            <Card title={l.academyCatalogTitle}>
              <p className="mb-4 text-sm text-[color:var(--aipify-text-secondary)]">{l.academyTotalsNote}</p>
              {overview.products === null ? (
                <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.productsListMissingBody}</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {academyCatalog(overview.products, l).map((item) => (
                    <article key={item.key} className="rounded-xl border border-[color:var(--aipify-border)] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-[color:var(--aipify-text-primary)]">{item.title}</h3>
                        {item.published === null ? null : (
                          <AipifyStatusBadge
                            kind={item.published ? "completed" : "waiting"}
                            label={item.published ? l.productPublished : l.productDraft}
                          />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{item.body}</p>
                    </article>
                  ))}
                </div>
              )}
            </Card>
            <Card title={l.academyNoteTitle}>
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.academyNoteBody}</p>
            </Card>
          </>
        ) : null}
      </div>
    </>
  );
}

const SECONDARY_BUTTON =
  "inline-flex rounded-xl border border-[color:var(--aipify-border)] px-4 py-2 text-sm font-semibold text-[color:var(--aipify-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]";

const LINK_BUTTON =
  "text-sm font-semibold text-[color:var(--aipify-companion-purple)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]";

function academyKind(productKey: string): "web" | "bedrift" | "voice" | "other" {
  const key = productKey.toLowerCase();
  if (key.includes("voice")) return "voice";
  if (key.includes("bedrift")) return "bedrift";
  if (key.includes("kompis_web") || key === "web") return "web";
  return "other";
}

function academyCatalog(
  products: SellersProductRow[],
  l: SellersLiveLabels["text"],
): Array<{ key: string; title: string; body: string; published: boolean | null }> {
  const cards: Array<{ key: string; title: string; body: string; published: boolean | null }> = products.map((product) => {
    const kind = academyKind(product.productKey);
    const body =
      kind === "web"
        ? l.academyWebStatus
        : kind === "voice"
          ? l.academyVoiceStatus
          : kind === "bedrift"
            ? product.published
              ? l.academyBedriftStatus
              : l.academyNotForSellers
            : l.academyGenericStatus;
    return { key: product.id, title: product.title, body, published: product.published };
  });
  if (!products.some((product) => academyKind(product.productKey) === "voice")) {
    cards.push({
      key: "voice-future",
      title: l.academyVoiceTitle,
      body: l.academyVoiceStatus,
      published: null,
    });
  }
  return cards;
}

function ProductCenterWorkspace({
  locale,
  overview,
  labels: l,
  actionLabels,
  onReload,
}: {
  locale: string;
  overview: SellersOverview;
  labels: SellersLiveLabels["text"];
  actionLabels: SellersActionLabels;
  onReload: () => void;
}) {
  const search = useSearchParams();
  const router = useRouter();
  const view = parseProductCenterView(search.get("view"));

  const catalogLocale = (
    ["en", "no", "sv", "da", "pl", "uk", "es"].includes(locale) ? locale : "en"
  ) as ProductCatalogLocaleCode;
  const listFromCore = overview.products !== null;
  const catalog: UnifiedCatalogProduct[] = useMemo(
    () =>
      buildUnifiedCatalog({
        locale: catalogLocale,
        coreProducts: listFromCore
          ? (overview.products ?? []).map((p: SellersProductRow) => ({
              id: p.id,
              productKey: p.productKey,
              title: p.title,
              currency: p.currency,
              fixedCommissionAmount: p.fixedCommissionAmount,
              published: p.published,
              publishSale: p.publishSale,
              publishApp: p.publishApp,
            }))
          : null,
      }),
    [catalogLocale, listFromCore, overview.products],
  );
  const visible = useMemo(() => filterProductCenterView(catalog, view), [catalog, view]);

  const tabLabels: Record<ProductCenterView, string> = {
    products: l.productCenterTabProducts ?? "Products",
    categories: l.productCenterTabCategories ?? "Categories",
    app: l.productCenterTabApp ?? "APP panel",
    sale: l.productCenterTabSale ?? "Sale partner",
    media: l.productCenterTabMedia ?? "Media",
  };

  function setView(next: ProductCenterView) {
    const params = new URLSearchParams(search.toString());
    if (next === "products") params.delete("view");
    else params.set("view", next);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={l.productCenterNavLabel ?? "Product center"}>
        {PRODUCT_CENTER_VIEWS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            onClick={() => setView(id)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              view === id
                ? "bg-[color:var(--aipify-companion-purple)] text-white"
                : "border border-[color:var(--aipify-border)] text-[color:var(--aipify-text-secondary)]"
            }`}
          >
            {tabLabels[id]}
          </button>
        ))}
      </div>

      {view === "categories" ? (
        <EmptyCard
          title={l.productCenterCategoriesTitle ?? l.productsEmptyTitle}
          body={l.productCenterCategoriesBody ?? l.registerChannelNote}
        />
      ) : null}

      {view === "media" ? (
        <EmptyCard title={l.productCenterMediaTitle ?? actionLabels.productTabMedia} body={actionLabels.mediaBlocked} />
      ) : null}

      {view === "products" || view === "app" || view === "sale" ? (
        <UnifiedProductRegisterTable
          locale={locale}
          products={visible}
          listFromCore={listFromCore}
          onNewProduct={() => {
            router.push("/platform/sellers/products/new");
          }}
          onEditProduct={(productKey) => {
            router.push(`/platform/sellers/products/${encodeURIComponent(productKey)}`);
          }}
          labels={{
            colImage: l.registerColImage,
            colName: l.registerColName,
            colSku: l.registerColSku,
            colType: l.registerColType,
            colAppStatus: l.registerColAppStatus,
            colSaleStatus: l.registerColSaleStatus,
            colChannels: l.productCenterColChannels,
            colCustomerPrice: l.registerColCustomerPrice,
            colCommission: l.colCommission,
            colUpdated: l.productCenterColUpdated,
            colActions: l.productCenterColActions,
            appPublished: l.registerAppPublished,
            appUnpublished: l.registerAppUnpublished,
            appRegistryFallback: l.registerAppRegistryFallback,
            salePublished: l.productPublished,
            saleDraft: l.productDraft,
            saleNotConfigured: l.registerSaleNotConfigured,
            channelsBoth: l.productCenterChannelsBoth,
            channelsAppOnly: l.productCenterChannelsAppOnly,
            channelsSaleOnly: l.productCenterChannelsSaleOnly,
            channelsNone: l.productCenterChannelsNone,
            pricePlanned: l.registerPricePlanned,
            priceUnavailable: actionLabels.priceNotPublished,
            commissionUnknown: l.notReported,
            percentBlocked: actionLabels.percentUnavailable,
            empty: l.productsEmptyBody,
            channelNote: l.registerChannelNote,
            newProduct: l.productCenterNewProduct,
            editProduct: l.productCenterEditProduct,
            searchPlaceholder: l.productCenterSearch,
            countTotal: l.productCenterCountTotal,
            countApp: l.productCenterCountApp,
            countSale: l.productCenterCountSale,
            countDraft: l.productCenterCountDraft,
            listPendingNote: listFromCore ? undefined : l.productsListMissingBody,
          }}
        />
      ) : null}
    </>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      {children}
    </section>
  );
}

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <section
      className="rounded-2xl border border-dashed border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6"
      role="status"
    >
      <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{body}</p>
    </section>
  );
}

function Notice({
  title,
  body,
  retryLabel,
  onRetry,
  role,
}: {
  title: string;
  body: string;
  retryLabel: string;
  onRetry: () => void | Promise<void>;
  role: "alert" | "status";
}) {
  return (
    <section
      className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm"
      role={role}
    >
      <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{body}</p>
      <button type="button" onClick={() => void onRetry()} className={`mt-4 ${SECONDARY_BUTTON}`}>
        {retryLabel}
      </button>
    </section>
  );
}

function DataTable({ caption, headers, children }: { caption: string; headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-xs uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function StatusBreakdown({
  overview,
  labels,
  nf,
}: {
  overview: SellersOverview;
  labels: SellersLiveLabels;
  nf: Intl.NumberFormat;
}) {
  const known = new Set<string>(PARTNER_STATUS_ORDER);
  const extra = Object.keys(overview.partnersByStatus).filter((s) => !known.has(s));
  const statuses = [...PARTNER_STATUS_ORDER, ...extra];
  return (
    <Card title={labels.text.statusBreakdownTitle}>
      <ul className="flex flex-wrap gap-3">
        {statuses.map((s) => (
          <li
            key={s}
            className="flex items-center gap-2 rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
          >
            <AipifyStatusBadge
              kind={partnerStatusKind(s)}
              label={labels.partnerStatus[s] ?? labels.partnerStatus.unknown}
            />
            <span className="font-semibold">{nf.format(overview.partnersByStatus[s] ?? 0)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[color:var(--aipify-text-secondary)]">{labels.text.statusBreakdownNote}</p>
    </Card>
  );
}
