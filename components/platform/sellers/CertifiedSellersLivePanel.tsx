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
  type SellersSettlementRow,
} from "@/lib/certified-sales-partner/platform-sellers-view";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import type { SellersLiveLabels } from "@/lib/partners-portal/csp-workspace-labels";

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
}: Props) {
  const [state, setState] = useState<LoadState>(EMPTY_STATE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selection, setSelection] = useState<{
    id: string;
    seq: number;
    fromStatus?: string;
    toStatus?: string;
  } | null>(null);

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
        navLabel={labels.text.sectionsTitle}
        navLabels={{
          overview: labels.sectionTitles.overview,
          partners: labels.sectionTitles.partners,
          products: labels.sectionTitles.products,
          commissionRates: labels.sectionTitles.commissionRates,
          attribution: labels.sectionTitles.attribution,
          academy: labels.sectionTitles.academy,
          materials: labels.sectionTitles.materials,
          leadsSales: labels.sectionTitles.leadsSales,
          commissions: labels.sectionTitles.commissions,
          settlements: labels.sectionTitles.settlements,
          messages: labels.sectionTitles.messages,
          audit: labels.sectionTitles.audit,
          settings: labels.sectionTitles.settings,
        }}
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
                  const rows = overview.partners!.filter((p) => statusFilter === "all" || p.status === statusFilter);
                  if (rows.length === 0) return <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.partnersFilterEmpty}</p>;
                  // Country column only when Core returned a country for at least one partner.
                  const showCountry = rows.some((p) => p.country !== null);
                  return (
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
                  );
                })()}
              </Card>
            )}
          </>
        ) : null}

        {ready && section === "products" && overview ? (
          <>
            {overview.products === null ? (
              <EmptyCard title={l.productsListMissingTitle} body={l.productsListMissingBody} />
            ) : overview.products.length === 0 ? (
              <EmptyCard title={l.productsEmptyTitle} body={l.productsEmptyBody} />
            ) : (
              <Card title={labels.sectionTitles.products}>
                <DataTable
                  caption={labels.sectionTitles.products}
                  headers={[l.colProduct, l.colCommission, l.colStatus]}
                >
                  {overview.products.map((p) => (
                    <tr key={p.id} className="border-t border-[color:var(--aipify-border)]">
                      <td className="px-3 py-2">
                        <p className="font-medium text-[color:var(--aipify-text-primary)]">{p.title}</p>
                        <details className="text-xs text-[color:var(--aipify-text-secondary)]">
                          <summary>{l.referenceLabel}</summary>
                          <p className="mt-1 font-mono">{p.productKey}</p>
                        </details>
                      </td>
                      <td className="px-3 py-2">
                        {formatMoney(p.fixedCommissionAmount, p.currency, locale, l.notReported)}
                      </td>
                      <td className="px-3 py-2">
                        <AipifyStatusBadge
                          kind={p.published ? "completed" : "waiting"}
                          label={p.published ? l.productPublished : l.productDraft}
                        />
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </Card>
            )}
            <CertifiedSellersActionPanel section="products" labels={actionLabels} onSuccess={() => void load()} />
          </>
        ) : null}

        {ready && section === "commissions" ? (
          <>
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.commissionsReportNote}</p>
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
            {(settlements ?? []).length === 0 ? (
              <EmptyCard title={l.settlementsEmptyTitle} body={l.settlementsEmptyBody} />
            ) : (
              <Card title={labels.sectionTitles.settlements}>
                <DataTable
                  caption={labels.sectionTitles.settlements}
                  headers={[l.colPeriod, l.colPartner, l.colStatus, l.colTotal, l.colLines, l.colAction]}
                >
                  {(settlements ?? []).map((s) => {
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
                        <td className="px-3 py-2">
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
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
              </Card>
            )}
            {(settlements ?? []).length > 0 ? (
              selection ? (
                <CertifiedSellersActionPanel
                  key={`${selection.id}:${selection.seq}`}
                  section="settlements"
                  labels={actionLabels}
                  initialSettlementId={selection.id}
                  initialFromStatus={selection.fromStatus}
                  initialToStatus={selection.toStatus}
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
