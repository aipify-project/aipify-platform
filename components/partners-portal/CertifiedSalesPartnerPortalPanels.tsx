"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Award, GraduationCap, Link2, ShoppingBag, UserRound, Wallet } from "lucide-react";
import { GuidedEmptyState, LearningPath, SalesActionCard, SalesExperienceHero, SalesGuidanceStepper } from "./sales-experience";
import type { EmptyStateModel, GuidanceStepModel, LearningStageModel, SalesHeroModel, SuggestionModel } from "./sales-experience";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { buildCspPublicLinkPath } from "@/lib/certified-sales-partner/attribution-policy";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import { isCspShareLocale } from "@/lib/certified-sales-partner/share-locale";
import {
  CSP_SALES_MATERIAL_CATEGORIES,
  getPublishedProductImage,
  listPublishedSalesCopyForLocale,
  listPublishedSalesMaterials,
} from "@/lib/certified-sales-partner/sales-materials-catalog";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import {
  buildCspSocialShareUrl,
  composeCspShareText,
  cspSocialPlatformSupportsWebShare,
  type CspSocialPlatform,
} from "@/lib/certified-sales-partner/social-share";
import {
  deriveCspNextAction,
  parseCspSaleRows,
  parseCspSettlementRows,
  type CspSaleRow,
  type CspSettlementRow,
} from "@/lib/certified-sales-partner/portal-view";
import { readCspResponse } from "@/lib/certified-sales-partner/ui-support";
import { AipifyCard, AipifyStatCard, AipifyStatusBadge } from "./design";
import { CertifiedSalesPartnerSignaturePreview } from "./CertifiedSalesPartnerSignaturePreview";
import { CspSocialPlatformPicker } from "./CspSocialPlatformPicker";
import { writeClipboard } from "./csp-sales-links-client";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";
import { CommissionStatementPreview } from "@/components/certified-sales-partner/CommissionStatementPreview";
import type { SettlementStatementLabels } from "@/lib/certified-sales-partner/settlement-statement-labels";

/** Shared label shapes — built from `partnersPortal.certifiedSalesPartner.*` (see csp-workspace-labels.ts). */
export type CspStatusLabels = Record<string, string>;

export type CspOverviewLabels = {
  title: string;
  welcome: string;
  welcomeFallback: string;
  intro: string;
  shortcutSales: string;
  shortcutLinks: string;
  shortcutCerts: string;
  shortcutProfile: string;
  statusLabel: string;
  partnerStatus: CspStatusLabels;
  certificationsLabel: string;
  /** Template with {passed} and {total}. */
  certificationsValue: string;
  certificationsNone: string;
  linksLabel: string;
  salesLabel: string;
  salesNone: string;
  balanceLabel: string;
  balanceNone: string;
  nextTitle: string;
  nextBody: CspStatusLabels;
  nextCta: CspStatusLabels;
};

export type CspCertificationsLabels = {
  title: string;
  intro: string;
  productCol: string;
  statusCol: string;
  scoreCol: string;
  passedOnCol: string;
  status: CspStatusLabels;
  download: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  unknownProduct: string;
  signatureTitle: string;
  signatureIntro: string;
  signatureLockedNote: string;
  signatureBadgeActive: string;
  signatureBadgeInactive: string;
  signatureCopyHtml: string;
  signatureCopyText: string;
  signatureCopyLink: string;
  signatureMissing: string;
  signatureCopied: string;
};

export type CspSalesLabels = {
  title: string;
  intro: string;
  productCol: string;
  statusCol: string;
  periodsCol: string;
  commissionCol: string;
  registeredCol: string;
  status: CspStatusLabels;
  commissionPending: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  loadError: string;
  retry: string;
};

export type CspSettlementsLabels = {
  title: string;
  intro: string;
  periodCol: string;
  statusCol: string;
  linesCol: string;
  totalCol: string;
  status: CspStatusLabels;
  balanceTitle: string;
  balanceNone: string;
  emptyTitle: string;
  emptyBody: string;
  loadError: string;
  retry: string;
};

export type CspMarketingLabels = {
  title: string;
  intro: string;
  centerTitle: string;
  centerIntro: string;
  tabBanners: string;
  tabTexts: string;
  tabShare: string;
  bannerIntro: string;
  bannerNotPublished: string;
  bannerCopyHtml: string;
  bannerHtmlCopied: string;
  bannerFormats: Record<string, string>;
  marketingLocaleNote: string;
  copyTextAndLink: string;
  certRequired: string;
  productName: Record<string, string>;
  linkTitle: string;
  linkEmpty: string;
  linkCta: string;
  assetsTitle: string;
  assetsEmptyTitle: string;
  assetsEmptyBody: string;
  productTabs: string;
  localeTabs: string;
  voiceNote: string;
  signatureNote: string;
  filterKompisWeb: string;
  filterKompisBedrift: string;
  filterVoice: string;
  materialsTitle: string;
  materialsIntro: string;
  materialsDownload: string;
  materialsCopy: string;
  materialsCopied: string;
  materialsEmptyCategory: string;
  materialsLanguageNote: string;
  toolsTab: string;
  libraryTab: string;
  missingLocale: string;
  materialsCategories: Record<string, string>;
  social: import("./CspSocialPlatformPicker").CspSocialPickerLabels;
  shareWorkspaceTitle: string;
  shareCopyText: string;
  shareCopyLink: string;
  shareDownloadImage: string;
  shareOpen: string;
  shareNoWeb: string;
  shareTextCopied: string;
  shareLinkCopied: string;
  sharePickPlatform: string;
  shareApprovedCopy: string;
  shareNoCopy: string;
  shareNoImage: string;
  sharePreview: string;
};

export const CARD = "rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm";
export const TH = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]";
export const TD = "px-3 py-2 text-sm text-[color:var(--aipify-text-primary)]";

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Confirmed empty commission balance — owner-requested exact Norwegian zero form. */
export function formatEmptyCommissionBalance(currency = "NOK"): string {
  if (currency === "NOK") return "NOK 00,00";
  return formatMoney(0, currency, "nb-NO");
}

export function formatDate(value: string | null, locale: string, month = false): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(locale, month ? { year: "numeric", month: "long", timeZone: "UTC" } : { dateStyle: "medium" }).format(d);
  } catch {
    return value;
  }
}

export function lookup(map: CspStatusLabels, key: string | null): string {
  return (key && map[key]) || map.unknown || "—";
}

function Icon({ kind }: { kind: "ok" | "info" | "warn" }) {
  const common = {
    "aria-hidden": true as const,
    viewBox: "0 0 24 24",
    className: "h-4 w-4 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "ok") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12.5 2.8 2.8L16 9.5" />
      </svg>
    );
  }
  if (kind === "warn") {
    return (
      <svg {...common}>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 10v4.5M12 17.5v.01" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function Pill({ kind, children }: { kind: "ok" | "info" | "warn"; children: ReactNode }) {
  const tone =
    kind === "ok"
      ? "border-teal-300 bg-teal-50 text-teal-900"
      : kind === "warn"
        ? "border-orange-300 bg-orange-50 text-orange-900"
        : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] text-[color:var(--aipify-text-secondary)]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${tone}`}>
      <Icon kind={kind} />
      {children}
    </span>
  );
}

export function EmptyState({ title, body, cta, href }: { title: string; body: string; cta?: string; href?: string }) {
  const model: EmptyStateModel = {
    title,
    body,
    action: cta && href ? { href, label: cta } : undefined,
  };
  return <GuidedEmptyState model={model} />;
}

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-subtle)] p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[color:var(--aipify-text-primary)]">{children}</dd>
    </div>
  );
}

function BalanceText({
  balances,
  none,
  locale,
  emptyAsZero = false,
}: {
  balances: Record<string, number>;
  none: string;
  locale: string;
  /** When Core returned a ready portal with no ledger rows — show NOK 00,00 as the value. */
  emptyAsZero?: boolean;
}) {
  const entries = Object.entries(balances);
  if (entries.length === 0) {
    return <>{emptyAsZero ? formatEmptyCommissionBalance("NOK") : none}</>;
  }
  return (
    <>
      {entries
        .map(([currency, amount]) =>
          amount === 0 && currency === "NOK"
            ? formatEmptyCommissionBalance("NOK")
            : formatMoney(amount, currency, locale),
        )
        .join(" · ")}
    </>
  );
}

export type CspHomeExperience = {
  hero: SalesHeroModel;
  stepsLabel: string;
  whyLabel: string;
  sayLabel: string;
  exampleLabel: string;
  notice: string;
  steps: GuidanceStepModel[];
  suggestionsTitle: string;
  suggestionNotice: string;
  suggestions: SuggestionModel[];
  metricsNote: string;
};

/** Partner dashboard — real metrics from the Core portal bundle; absent data is never faked. */
export function CertifiedSalesPartnerOverviewPanel({
  labels,
  locale,
  experience,
}: {
  labels: CspOverviewLabels;
  locale: string;
  experience?: CspHomeExperience;
}) {
  const portal = useCspPortal();
  if (!portal) return null;

  const next = deriveCspNextAction(portal);
  const status = portal.overview.partnerStatus;
  const approved = status === "approved" || status === "active" || status === "certified";
  const activeLinks = portal.links.filter((l) => l.active).length;
  const firstName = (portal.overview.displayName ?? "").trim().split(/\s+/)[0] || null;
  const welcome = firstName
    ? fill(labels.welcome, { name: firstName })
    : labels.welcomeFallback;
  const certValue =
    portal.publishedProductCount === 0
      ? labels.certificationsNone
      : fill(labels.certificationsValue, {
          passed: portal.passedCertificationCount,
          total: portal.publishedProductCount,
        });

  const shortcuts = [
    { href: "/partners/customers/pipeline", label: labels.shortcutSales, icon: ShoppingBag },
    { href: "/partners/referrals/links", label: labels.shortcutLinks, icon: Link2 },
    { href: "/partners/academy/certifications", label: labels.shortcutCerts, icon: Award },
    { href: "/partners/account/profile", label: labels.shortcutProfile, icon: UserRound },
  ] as const;

  return (
    <div className="space-y-5">
      {experience ? (
        <SalesExperienceHero hero={experience.hero} />
      ) : (
        <AipifyCard aria-labelledby="csp-overview-title">
          <h2 id="csp-overview-title" className="text-xl font-semibold text-[#1E293B]">
            {welcome}
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">{labels.intro}</p>
        </AipifyCard>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <AipifyStatusBadge tone={approved ? "success" : "info"} label={lookup(labels.partnerStatus, status)} />
        <span className="text-sm text-[#64748B]">
          {labels.statusLabel}
          {experience ? ` · ${welcome}` : ""}
        </span>
      </div>

      {experience ? (
        <>
          <SalesGuidanceStepper
            label={experience.stepsLabel}
            steps={experience.steps}
            whyLabel={experience.whyLabel}
            sayLabel={experience.sayLabel}
            exampleLabel={experience.exampleLabel}
            notice={experience.notice}
          />
          <section aria-labelledby="csp-today-title" className="space-y-3">
            <div>
              <h2 id="csp-today-title" className="text-xl font-semibold text-[#1E293B]">
                {experience.suggestionsTitle}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">{experience.suggestionNotice}</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {experience.suggestions.map((item) => (
                <SalesActionCard key={item.id} title={item.title} body={item.body} action={item.action} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E8E4F2] bg-white px-3 text-sm font-semibold text-[#1E293B]"
              >
                <Icon className="h-4 w-4 text-[#7C3AED]" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {experience?.metricsNote ? <p className="text-xs text-[#64748B]">{experience.metricsNote}</p> : null}
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AipifyStatCard
          label={labels.certificationsLabel}
          value={certValue}
          icon={<GraduationCap className="h-5 w-5" aria-hidden />}
        />
        <AipifyStatCard
          label={labels.linksLabel}
          value={activeLinks}
          icon={<Link2 className="h-5 w-5" aria-hidden />}
        />
        <AipifyStatCard
          label={labels.salesLabel}
          value={portal.salesTotal}
          hint={portal.salesTotal === 0 ? labels.salesNone : undefined}
          icon={<ShoppingBag className="h-5 w-5" aria-hidden />}
        />
        <AipifyStatCard
          label={labels.balanceLabel}
          value={
            <BalanceText
              balances={portal.ledgerByCurrency}
              none={labels.balanceNone}
              locale={locale}
              emptyAsZero
            />
          }
          hint={
            Object.keys(portal.ledgerByCurrency).length === 0 ||
            Object.values(portal.ledgerByCurrency).every((amount) => amount === 0)
              ? labels.balanceNone
              : undefined
          }
          icon={<Wallet className="h-5 w-5" aria-hidden />}
        />
      </dl>

      <AipifyCard aria-labelledby="csp-next-title">
        <h2 id="csp-next-title" className="text-lg font-semibold text-[#1E293B]">
          {labels.nextTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.nextBody[next.key]}</p>
        {next.href && labels.nextCta[next.key] ? (
          <Link
            href={next.href}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
          >
            {labels.nextCta[next.key]}
          </Link>
        ) : null}
      </AipifyCard>
    </div>
  );
}

/** Certifications page — per-product status from the Core portal bundle. */
export function CertifiedSalesPartnerCertificationsPanel({
  labels,
  locale,
  learning,
}: {
  labels: CspCertificationsLabels;
  locale: string;
  learning?: { title: string; support: string; stages: LearningStageModel[]; passedStatus: string; notPassedStatus: string };
}) {
  const portal = useCspPortal();
  const names = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) map[p.key] = p.title;
    return map;
  }, [locale]);
  if (!portal) return null;

  const rows = portal.overview.products.map((product) => {
    const cert = portal.overview.certifications.find(
      (c) => (product.id !== null && c.productId === product.id) || (product.productKey !== null && c.productKey === product.productKey),
    );
    return {
      key: product.productKey ?? product.id ?? "",
      status: cert?.status ?? product.certificationStatus,
      score: cert?.score ?? null,
      passedAt: cert?.passedAt ?? null,
      productKey: product.productKey,
    };
  });

  const anyPassed = rows.some((row) => row.status === "passed");
  const kompisPassed = rows.some((row) => row.productKey === "kompis_web" && row.status === "passed");
  const partnerActive = ["approved", "active", "certified"].includes(portal.overview.partnerStatus ?? "");
  const activeLink = portal.links.find((link) => link.active && link.code);
  const salesLink = activeLink?.code
    ? `https://aipify.ai/p/${encodeURIComponent(activeLink.code)}/kompis_web?channel=referral_link&lang=${encodeURIComponent(locale)}`
    : null;

  return (
    <div className="space-y-6">
      {learning ? (
        <LearningPath
          title={learning.title}
          support={learning.support}
          stages={learning.stages.map((stage) =>
            stage.id === "pass"
              ? { ...stage, status: anyPassed ? learning.passedStatus : learning.notPassedStatus }
              : stage,
          )}
        />
      ) : null}
      <section className={CARD} aria-labelledby="csp-certs-title">
        <h2 id="csp-certs-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        {rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={labels.emptyTitle} body={labels.emptyBody} cta={labels.emptyCta} href="/partners/academy/training" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
              <thead>
                <tr>
                  <th className={TH}>{labels.productCol}</th>
                  <th className={TH}>{labels.statusCol}</th>
                  <th className={TH}>{labels.scoreCol}</th>
                  <th className={TH}>{labels.passedOnCol}</th>
                  <th className={TH}>
                    <span className="sr-only">{labels.download}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--aipify-border)]">
                {rows.map((row) => {
                  const passed = row.status === "passed";
                  return (
                    <tr key={row.key}>
                      <td className={TD}>{names[row.key] ?? labels.unknownProduct}</td>
                      <td className={TD}>
                        <Pill kind={passed ? "ok" : row.status === "expired" || row.status === "revoked" ? "warn" : "info"}>
                          {lookup(labels.status, row.status)}
                        </Pill>
                      </td>
                      <td className={TD}>{row.score === null ? "—" : `${row.score}%`}</td>
                      <td className={TD}>{formatDate(row.passedAt, locale)}</td>
                      <td className={TD}>
                        {passed && row.productKey === "kompis_web" ? (
                          <a
                            href={`/api/certified-sales-partner/academy/certificate?locale=${encodeURIComponent(locale)}`}
                            className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                          >
                            {labels.download}
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <CertifiedSalesPartnerSignaturePreview
        labels={{
          title: labels.signatureTitle,
          intro: labels.signatureIntro,
          lockedNote: labels.signatureLockedNote,
          badgeActive: labels.signatureBadgeActive,
          badgeInactive: labels.signatureBadgeInactive,
          copyHtml: labels.signatureCopyHtml,
          copyText: labels.signatureCopyText,
          copyLink: labels.signatureCopyLink,
          missingRequirements: labels.signatureMissing,
          copied: labels.signatureCopied,
        }}
        certificationActive={kompisPassed}
        partnerActive={partnerActive}
        partnerName={portal.overview.displayName ?? ""}
        companyName={portal.overview.legalBusinessName ?? portal.overview.displayName ?? ""}
        productLabel={names.kompis_web ?? "Buddy Web"}
        salesLink={salesLink}
      />
    </div>
  );
}

type ListState<T> = { phase: "loading" } | { phase: "error" } | { phase: "ready"; rows: T[] };

export function useCspList<T>(url: string, parse: (payload: unknown) => T[], enabled: boolean) {
  const [state, setState] = useState<ListState<T>>({ phase: "loading" });
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setState({ phase: "loading" });
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        const outcome = await readCspResponse(res);
        if (cancelled) return;
        setState(outcome.kind === "ready" ? { phase: "ready", rows: parse(outcome.body) } : { phase: "error" });
      } catch {
        if (!cancelled) setState({ phase: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
    // `parse` is a stable module-level function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, nonce]);
  return { state, reload: () => setNonce((n) => n + 1) };
}

export function ErrorState({ message, retry, onRetry }: { message: string; retry: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900" role="alert">
      <p className="flex items-start gap-2">
        <Icon kind="warn" />
        <span>{message}</span>
      </p>
      <button type="button" onClick={onRetry} className="mt-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]">
        {retry}
      </button>
    </div>
  );
}

const EARNED_STATUSES = new Set(["earned", "approved_for_payout", "queued_for_payout", "paid"]);

/** Sales page — partner's own qualified sales; commission only shown once earned. */
export function CertifiedSalesPartnerSalesPanel({
  labels,
  locale,
  guide,
  emptyModel,
}: {
  labels: CspSalesLabels;
  locale: string;
  guide?: SalesHeroModel;
  emptyModel?: EmptyStateModel;
}) {
  const portal = useCspPortal();
  const names = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) map[p.key] = p.title;
    return map;
  }, [locale]);
  const { state, reload } = useCspList<CspSaleRow>("/api/certified-sales-partner/sales", parseCspSaleRows, portal !== null);
  if (!portal) return null;

  return (
    <section className="space-y-5" aria-labelledby="csp-sales-title">
      {guide ? <SalesExperienceHero hero={guide} /> : null}
      <div className={CARD}>
      <h2 id="csp-sales-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
      <div className="mt-4">
        {state.phase === "error" ? <ErrorState message={labels.loadError} retry={labels.retry} onRetry={reload} /> : null}
        {state.phase === "ready" && state.rows.length === 0 ? (
          emptyModel ? (
            <GuidedEmptyState model={emptyModel} />
          ) : (
            <EmptyState title={labels.emptyTitle} body={labels.emptyBody} cta={labels.emptyCta} href="/partners/marketing/product-catalog" />
          )
        ) : null}
        {state.phase === "ready" && state.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
              <thead>
                <tr>
                  <th className={TH}>{labels.productCol}</th>
                  <th className={TH}>{labels.statusCol}</th>
                  <th className={TH}>{labels.periodsCol}</th>
                  <th className={TH}>{labels.commissionCol}</th>
                  <th className={TH}>{labels.registeredCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--aipify-border)]">
                {state.rows.map((row, index) => {
                  const earned = row.status !== null && EARNED_STATUSES.has(row.status);
                  const bad = row.status === "reversed" || row.status === "rejected";
                  return (
                    <tr key={row.id ?? index}>
                      <td className={TD}>{(row.productKey && names[row.productKey]) || row.productKey || "—"}</td>
                      <td className={TD}>
                        <Pill kind={earned ? "ok" : bad ? "warn" : "info"}>{lookup(labels.status, row.status)}</Pill>
                      </td>
                      <td className={TD}>{row.paidPeriodsCount ?? "—"}</td>
                      <td className={TD}>
                        {earned && row.snapshotAmount !== null && row.snapshotCurrency
                          ? formatMoney(row.snapshotAmount, row.snapshotCurrency, locale)
                          : labels.commissionPending}
                      </td>
                      <td className={TD}>{formatDate(row.attributedAt, locale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      </div>
    </section>
  );
}

/** Settlement page — read-only monthly settlements and Core ledger balance. */
export function CertifiedSalesPartnerSettlementsPanel({
  labels,
  statementLabels,
  locale,
}: {
  labels: CspSettlementsLabels;
  statementLabels: SettlementStatementLabels;
  locale: string;
}) {
  const portal = useCspPortal();
  const { state, reload } = useCspList<CspSettlementRow>(
    "/api/certified-sales-partner/settlements",
    parseCspSettlementRows,
    portal !== null,
  );
  const [previewId, setPreviewId] = useState<string | null>(null);
  if (!portal) return null;
  const preview = state.phase === "ready" ? state.rows.find((row) => row.id === previewId) ?? null : null;

  return (
    <div className="space-y-6">
      <section className={CARD} aria-labelledby="csp-balance-title">
        <h2 id="csp-balance-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.balanceTitle}
        </h2>
        <p className="mt-2 text-sm font-semibold text-[color:var(--aipify-text-primary)]">
          <BalanceText
            balances={portal.ledgerByCurrency}
            none={labels.balanceNone}
            locale={locale}
            emptyAsZero
          />
        </p>
        {Object.keys(portal.ledgerByCurrency).length === 0 ||
        Object.values(portal.ledgerByCurrency).every((amount) => amount === 0) ? (
          <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">{labels.balanceNone}</p>
        ) : null}
      </section>

      <section className={CARD} aria-labelledby="csp-settlements-title">
        <h2 id="csp-settlements-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        <div className="mt-4">
          {state.phase === "error" ? <ErrorState message={labels.loadError} retry={labels.retry} onRetry={reload} /> : null}
          {state.phase === "ready" && state.rows.length === 0 ? (
            <EmptyState title={labels.emptyTitle} body={labels.emptyBody} />
          ) : null}
          {state.phase === "ready" && state.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
                <thead>
                  <tr>
                    <th className={TH}>{labels.periodCol}</th>
                    <th className={TH}>{labels.statusCol}</th>
                    <th className={TH}>{labels.linesCol}</th>
                    <th className={TH}>{labels.totalCol}</th>
                    <th className={TH}>{statementLabels.documentNumber}</th>
                    <th className={TH}>{statementLabels.preview}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--aipify-border)]">
                  {state.rows.map((row, index) => (
                    <tr key={row.id ?? index}>
                      <td className={TD}>{formatDate(row.periodMonth, locale, true)}</td>
                      <td className={TD}>
                        <Pill kind={row.status === "paid" ? "ok" : row.status === "voided" ? "warn" : "info"}>
                          {lookup(labels.status, row.status)}
                        </Pill>
                      </td>
                      <td className={TD}>{row.lineCount ?? "—"}</td>
                      <td className={TD}>
                        {row.totalAmount !== null && row.currency ? formatMoney(row.totalAmount, row.currency, locale) : "—"}
                      </td>
                      <td className={TD}>{statementLabels.notIssued}</td>
                      <td className={TD}>
                        {row.id ? (
                          <button type="button" className="font-semibold text-[#7C3AED]" onClick={() => setPreviewId(row.id)}>
                            {statementLabels.preview}
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{statementLabels.currencyNote}</p>
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{statementLabels.earnIntervalNote}</p>
      {preview?.id ? (
        <CommissionStatementPreview
          locale={locale}
          labels={statementLabels}
          statusLabel={lookup(labels.status, preview.status)}
          previewHref={`/api/certified-sales-partner/settlements/${preview.id}/preview`}
          source={{
            settlementId: preview.id,
            periodMonth: preview.periodMonth,
            status: preview.status,
            totalAmount: preview.totalAmount,
            currency: preview.currency,
            lineCount: preview.lineCount,
            partnerReference: null,
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * Sales tools — approved materials registry + social share workspace.
 * Never invents assets or auto-publishes; Aipify never posts on the partner's behalf.
 */
export function CertifiedSalesPartnerMarketingPanel({
  labels,
  locale,
}: {
  labels: CspMarketingLabels;
  locale: string;
}) {
  const portal = useCspPortal();
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<"kompis_web" | "kompis_bedrift" | "aipify_voice">("kompis_web");
  const [marketingLocale, setMarketingLocale] = useState<Locale>(isCspShareLocale(locale) ? locale : "en");
  const [section, setSection] = useState<"tools" | "library">("tools");
  const [platforms, setPlatforms] = useState<CspSocialPlatform[]>([]);
  const [copyId, setCopyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
    const query = new URLSearchParams(window.location.search);
    setSection(query.get("section") === "library" ? "library" : "tools");
  }, []);

  function chooseSection(next: "tools" | "library") {
    setSection(next);
    const query = new URLSearchParams(window.location.search);
    if (next === "library") query.set("section", "library");
    else query.delete("section");
    const suffix = query.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }

  const activeLink = portal?.links.find((l) => l.active && l.code) ?? null;
  const publicPath =
    activeLink?.code && product !== "aipify_voice"
      ? (() => {
          const path = buildCspPublicLinkPath({
            code: activeLink.code,
            productKey: product,
            channel: "referral_link",
          });
          return path ? `${path}&lang=${marketingLocale}` : null;
        })()
      : null;
  const publicUrl = publicPath ? `${origin || ""}${publicPath}` : null;
  const [coreMaterials, setCoreMaterials] = useState<ReturnType<typeof listPublishedSalesMaterials> | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (product === "aipify_voice") {
      setCoreMaterials([]);
      return;
    }
    void (async () => {
      try {
        const res = await fetch(
          `/api/certified-sales-partner/materials?product_key=${encodeURIComponent(product)}`,
          { cache: "no-store" },
        );
        const body = (await res.json().catch(() => null)) as {
          found?: boolean;
          materials?: Array<{
            material_key?: string;
            category?: string;
            asset_path?: string;
            version?: string;
            mime_hint?: string;
            published?: boolean;
            product_keys?: string[];
          }>;
        } | null;
        if (cancelled) return;
        if (res.status === 403 || res.status === 503) {
          // Portal blocked / Core unavailable — show empty, never invent materials.
          setCoreMaterials([]);
          return;
        }
        if (!res.ok || !body?.found || !Array.isArray(body.materials)) {
          setCoreMaterials([]);
          return;
        }
        setCoreMaterials(
          body.materials
            .filter(
              (m) =>
                m.published !== false &&
                typeof m.asset_path === "string" &&
                CSP_SALES_MATERIAL_CATEGORIES.some((category) => category === m.category),
            )
            .map((m) => ({
              id: String(m.material_key ?? m.asset_path),
              category: CSP_SALES_MATERIAL_CATEGORIES.find((category) => category === m.category) ?? "pdf_sheets",
              labelKey: String(m.material_key ?? "material"),
              href: String(m.asset_path),
              format: String(m.asset_path).endsWith(".pdf")
                ? ("pdf" as const)
                : String(m.asset_path).endsWith(".svg")
                  ? ("svg" as const)
                  : ("png" as const),
              assetPath: String(m.asset_path),
              version: Number(m.version) || 1,
              mimeHint: String(m.mime_hint ?? ""),
              published: true,
              productKeys: Array.isArray(m.product_keys) ? m.product_keys : [],
            })),
        );
      } catch {
        if (!cancelled) setCoreMaterials([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);
  const materials = useMemo(() => {
    if (product === "aipify_voice") return [];
    // Core publish gate only — no fictional catalog rows when Core answered.
    return coreMaterials ?? [];
  }, [product, coreMaterials]);
  const copyItems = useMemo(
    () =>
      product === "aipify_voice"
        ? []
        : listPublishedSalesCopyForLocale({ productKey: product, locale: marketingLocale }),
    [product, marketingLocale],
  );
  const selectedCopy = copyItems.find((c) => c.id === copyId) ?? copyItems[0] ?? null;
  const productImage = product === "aipify_voice" ? null : getPublishedProductImage(product);

  async function copyText() {
    if (!selectedCopy) {
      setNotice(labels.shareNoCopy);
      return;
    }
    const payload = publicUrl ? composeCspShareText(selectedCopy.text, publicUrl) : selectedCopy.text;
    setNotice((await writeClipboard(payload)) ? labels.shareTextCopied : labels.shareNoCopy);
  }

  async function copyLink() {
    if (!publicUrl) {
      setNotice(labels.linkEmpty);
      return;
    }
    setNotice((await writeClipboard(publicUrl)) ? labels.shareLinkCopied : labels.linkEmpty);
  }

  function openShare(platform: CspSocialPlatform) {
    if (!publicUrl) {
      setNotice(labels.linkEmpty);
      return;
    }
    if (!cspSocialPlatformSupportsWebShare(platform)) {
      setNotice(labels.shareNoWeb);
      return;
    }
    const shareUrl = buildCspSocialShareUrl(platform, {
      url: publicUrl,
      text: selectedCopy?.text ?? "",
    });
    if (!shareUrl) {
      setNotice(labels.shareNoWeb);
      return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  const filledCategories = CSP_SALES_MATERIAL_CATEGORIES.filter((category) =>
    materials.some((item) => item.category === category),
  );

  return (
    <div className="w-full space-y-6">
      <section className={CARD}>
        <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</h2>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.signatureNote}</p>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={labels.title}>
          <button
            type="button"
            role="tab"
            aria-selected={section === "tools"}
            onClick={() => chooseSection("tools")}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
              section === "tools"
                ? "bg-[color:var(--aipify-companion-purple)] text-white"
                : "border border-[color:var(--aipify-border)] text-[color:var(--aipify-text-secondary)]"
            }`}
          >
            {labels.toolsTab}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={section === "library"}
            onClick={() => chooseSection("library")}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
              section === "library"
                ? "bg-[color:var(--aipify-companion-purple)] text-white"
                : "border border-[color:var(--aipify-border)] text-[color:var(--aipify-text-secondary)]"
            }`}
          >
            {labels.libraryTab}
          </button>
        </div>
      </section>

      {section === "tools" ? (
      <>
      <section className={CARD} aria-labelledby="csp-marketing-link">
        <h3 id="csp-marketing-link" className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.linkTitle}
        </h3>
        {publicPath ? (
          <p className="mt-3 break-all rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] px-3 py-2 font-mono text-sm text-[color:var(--aipify-text-primary)]">
            <a href={publicPath} className="underline-offset-2 hover:underline">
              {publicUrl || publicPath}
            </a>
          </p>
        ) : (
          <EmptyState title={labels.linkEmpty} body={labels.linkEmpty} cta={labels.linkCta} href="/partners/referrals/links" />
        )}
      </section>

      <section className={CARD} aria-labelledby="csp-share-workspace">
        <h3 id="csp-share-workspace" className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.shareWorkspaceTitle}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={labels.productTabs}>
          {(
            [
              ["kompis_web", labels.filterKompisWeb],
              ["kompis_bedrift", labels.filterKompisBedrift],
              ["aipify_voice", labels.filterVoice],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={product === key}
              onClick={() => {
                setProduct(key);
                setCopyId(null);
                setNotice(null);
              }}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                product === key
                  ? "bg-[color:var(--aipify-companion-purple)] text-white"
                  : "border border-[color:var(--aipify-border)] text-[color:var(--aipify-text-secondary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium text-[color:var(--aipify-text-primary)]">
          {labels.localeTabs}
          <select
            className="mt-2 block w-full max-w-xs rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
            value={marketingLocale}
            onChange={(event) => {
              const next = event.target.value;
              if (!isCspShareLocale(next)) return;
              setMarketingLocale(next);
              setCopyId(null);
              setNotice(null);
            }}
          >
            {LOCALES.map((code) => (
              <option key={code} value={code}>
                {LOCALE_LABELS[code]}
              </option>
            ))}
          </select>
        </label>

        {product === "aipify_voice" ? (
          <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]">{labels.voiceNote}</p>
        ) : (
          <div className="mt-5 space-y-5">
            <CspSocialPlatformPicker labels={labels.social} value={platforms} onChange={setPlatforms} />

            <div>
              <p className="text-sm font-medium text-[color:var(--aipify-text-primary)]">{labels.shareApprovedCopy}</p>
              {copyItems.length === 0 ? (
                <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.missingLocale}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {copyItems.map((item) => {
                    const selected = (selectedCopy?.id ?? null) === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setCopyId(item.id)}
                          className={`w-full rounded-xl border-2 px-3 py-3 text-left text-sm transition ${
                            selected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                              : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] text-[color:var(--aipify-text-primary)]"
                          }`}
                        >
                          {item.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[color:var(--aipify-text-primary)]">{labels.sharePreview}</p>
              {productImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- static brand asset
                <img
                  src={productImage.href}
                  alt=""
                  className="mt-3 h-40 w-full max-w-md rounded-xl border border-[color:var(--aipify-border)] object-cover"
                />
              ) : (
                <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.shareNoImage}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText()}
                className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white"
              >
                {labels.shareCopyText}
              </button>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold"
              >
                {labels.shareCopyLink}
              </button>
              {productImage ? (
                <a
                  href={productImage.href}
                  download
                  className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold"
                >
                  {labels.shareDownloadImage}
                </a>
              ) : null}
              {platforms.length === 0 ? (
                <p className="self-center text-xs text-[color:var(--aipify-text-secondary)]">{labels.sharePickPlatform}</p>
              ) : (
                platforms.map((platform) =>
                  cspSocialPlatformSupportsWebShare(platform) ? (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => openShare(platform)}
                      className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold"
                    >
                      {labels.shareOpen}: {labels.social.platforms[platform]}
                    </button>
                  ) : (
                    <p key={platform} className="self-center text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.social.platforms[platform]}: {labels.shareNoWeb}
                    </p>
                  ),
                )
              )}
            </div>
            {notice ? (
              <p className="text-sm text-[color:var(--aipify-text-secondary)]" role="status">
                {notice}
              </p>
            ) : null}
          </div>
        )}
      </section>
      </>
      ) : null}

      {section === "library" ? (
      <section className={CARD} aria-labelledby="csp-materials">
        <h3 id="csp-materials" className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.materialsTitle}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.materialsIntro}</p>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.materialsLanguageNote}</p>
        {product === "aipify_voice" ? (
          <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]">{labels.voiceNote}</p>
        ) : filledCategories.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={labels.assetsEmptyTitle} body={labels.assetsEmptyBody} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filledCategories.map((category) => {
              const items = materials.filter((item) => item.category === category);
              return (
                <div key={category} className="rounded-xl border border-[color:var(--aipify-border)] p-4">
                  <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">
                    {labels.materialsCategories[category] ?? category}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-[color:var(--aipify-text-primary)]">{item.href.split("/").pop()}</span>
                        <a
                          href={item.href}
                          download
                          className="font-semibold text-[color:var(--aipify-companion-purple)]"
                        >
                          {labels.materialsDownload}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
      ) : null}
    </div>
  );
}
