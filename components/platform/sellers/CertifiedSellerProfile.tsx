"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { SellerAvatar } from "@/components/platform/sellers/SellerAvatar";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import { safeAvatarUrl } from "@/lib/certified-sales-partner/seller-avatar";
import { isCspMessageRecipientEligible } from "@/lib/certified-sales-partner/message-recipient-picker";
import {
  partnerStatusKind,
  settlementStatusKind,
  shortReference,
} from "@/lib/certified-sales-partner/platform-sellers-view";
import type { SellerProfileLabels } from "@/lib/certified-sales-partner/seller-profile-labels";
import {
  buildSellerProfileKpis,
  parseSellerProfileData,
  type SellerProfileData,
} from "@/lib/certified-sales-partner/seller-profile-view";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import {
  formatPlatformDateTimeFull,
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
  formatPlatformDateTimeShort,
} from "@/lib/platform-presentation-quality/date-time";

export type CertifiedSellerProfileLabels = {
  title: string;
  close: string;
  loading: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  notFoundTitle: string;
  notFoundBody: string;
  sectionContact: string;
  sectionCompany: string;
  sectionStatus: string;
  sectionCertifications: string;
  sectionActivity: string;
  certificationsEmpty: string;
  fieldProduct: string;
  fieldCertStatus: string;
  fieldScore: string;
  fieldPassedAt: string;
  fieldCertificateId: string;
  productLabels: Record<string, string>;
  certStatusLabels: Record<string, string>;
  fieldName: string;
  fieldEmail: string;
  fieldEmailVerified: string;
  fieldPhone: string;
  fieldCountry: string;
  fieldLegalBusiness: string;
  fieldRegistration: string;
  fieldAddress: string;
  fieldStatus: string;
  fieldApplied: string;
  fieldUpdated: string;
  emailVerifiedYes: string;
  emailVerifiedNo: string;
  notSavedYet: string;
  emptyValue: string;
  activityEmpty: string;
  /** Business labels for known audit action codes; unknown codes use a controlled fallback. */
  activityLabels: Record<string, string>;
  activityUnknown: string;
  actionsTitle: string;
  actionsHint: string;
  approve: string;
  requestInfo: string;
  reject: string;
  suspend: string;
  reason: string;
  reasonHint: string;
  confirmApprove: string;
  confirmReject: string;
  confirmNeedsInfo: string;
  confirmSuspend: string;
  confirmSubmit: string;
  submitting: string;
  success: string;
  failClosed: string;
  /** Shown when Approve is blocked because email is not verified. */
  approveRequiresVerifiedEmail: string;
  /** Shown when company identity columns are not available in Core yet (SQL pending). */
  companyIdentityPendingSql: string;
  /** Shown when Core can store company identity but this row is missing required fields. */
  approveCompanyDetailsMissing: string;
  /** Warning when the applicant is also an active APP customer. */
  approveActiveAppCustomerWarning: string;
  /** Checkbox label to confirm dual-identity seller approval. */
  confirmActiveAppCustomer: string;
  errors: Record<string, string>;
  partnerStatus: Record<string, string>;
  /** Canonical seller profile copy (`platform.sellers.profile.*`). */
  profile: SellerProfileLabels;
};

type PartnerDetail = {
  id: string;
  status: string;
  displayName: string | null;
  country: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  email: string | null;
  emailVerified: boolean | null;
  legalBusinessName: string | null;
  businessRegistrationNumber: string | null;
  businessAddress: string | null;
  phone: string | null;
  avatarUrl: string | null;
  businessIdentityStored: boolean;
  hasActiveAppMembership: boolean;
};

type ActivityRow = { action: string; actorKind: string | null; createdAt: string | null };

type CertificationRow = {
  productKey: string;
  status: string;
  score: number | null;
  passedAt: string | null;
  certificateId: string | null;
};

type LoadPhase = "loading" | "ready" | "error" | "not_found";
type ProfileTab = "overview" | "sales" | "academy" | "commissions" | "messages" | "history";
const TABS: readonly ProfileTab[] = ["overview", "sales", "academy", "commissions", "messages", "history"];

export type CertifiedSellerProfileProps = {
  partnerId: string;
  locale: string;
  labels: CertifiedSellerProfileLabels;
  actionLabels: SellersActionLabels;
  /** `drawer` sits inside the slide-over; `page` is the standalone profile route. */
  variant?: "drawer" | "page";
  /** Called after Core accepted a status decision so surrounding lists can reload. */
  onDecisionSuccess?: () => void;
};

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

function formatPeriod(value: string | null, locale: string, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(/^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(toBcp47Locale(locale), { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function parseDetail(body: Record<string, unknown>, partnerId: string): PartnerDetail | null {
  if (!body.partner || typeof body.partner !== "object") return null;
  const p = body.partner as Record<string, unknown>;
  const persistence =
    body.persistence && typeof body.persistence === "object" ? (body.persistence as Record<string, unknown>) : {};
  const s = (v: unknown) => (typeof v === "string" ? v : null);
  return {
    id: String(p.id ?? partnerId),
    status: String(p.status ?? "unknown"),
    displayName: s(p.displayName),
    country: s(p.country),
    createdAt: s(p.createdAt),
    updatedAt: s(p.updatedAt),
    email: s(p.email),
    emailVerified: typeof p.emailVerified === "boolean" ? p.emailVerified : null,
    legalBusinessName: s(p.legalBusinessName),
    businessRegistrationNumber: s(p.businessRegistrationNumber),
    businessAddress: s(p.businessAddress),
    phone: s(p.phone),
    avatarUrl: safeAvatarUrl(p.avatarUrl, partnerId),
    businessIdentityStored: persistence.businessIdentityStored === true,
    hasActiveAppMembership: p.hasActiveAppMembership === true,
  };
}

export function CertifiedSellerProfile({
  partnerId,
  locale,
  labels,
  actionLabels,
  variant = "drawer",
  onDecisionSuccess,
}: CertifiedSellerProfileProps) {
  const p = labels.profile;
  const tabsId = useId();
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [certifications, setCertifications] = useState<CertificationRow[]>([]);
  /** `undefined` = still loading, `null` = Core could not provide it. */
  const [profileData, setProfileData] = useState<SellerProfileData | null | undefined>(undefined);
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [manageOpen, setManageOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string } | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmActiveAppCustomer, setConfirmActiveAppCustomer] = useState(false);
  const [msgRows, setMsgRows] = useState<Array<Record<string, unknown>>>([]);
  const [msgPhase, setMsgPhase] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgBusy, setMsgBusy] = useState(false);
  const [msgNotice, setMsgNotice] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const nf = useMemo(() => new Intl.NumberFormat(toBcp47Locale(locale)), [locale]);

  const loadMessages = useCallback(async () => {
    setMsgPhase("loading");
    try {
      const res = await fetch(
        `/api/platform/sellers/messages?partner_id=${encodeURIComponent(partnerId)}`,
        { cache: "no-store" },
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMsgRows([]);
        setMsgPhase("error");
        return;
      }
      const rows =
        body && typeof body === "object" && Array.isArray((body as { rows?: unknown }).rows)
          ? ((body as { rows: unknown[] }).rows.filter(
              (r): r is Record<string, unknown> => !!r && typeof r === "object" && !Array.isArray(r),
            ) as Array<Record<string, unknown>>)
          : [];
      setMsgRows(
        [...rows].sort((a, b) =>
          compareTimestampsDesc(
            typeof a.created_at === "string" ? a.created_at : "",
            typeof b.created_at === "string" ? b.created_at : "",
          ),
        ),
      );
      setMsgPhase("ready");
    } catch {
      setMsgRows([]);
      setMsgPhase("error");
    }
  }, [partnerId]);

  useEffect(() => {
    if (tab === "messages") void loadMessages();
  }, [tab, loadMessages]);

  async function sendProfileMessage() {
    const text = msgBody.trim();
    if (!text || msgBusy || !partner) return;
    if (!isCspMessageRecipientEligible(partner.status)) {
      setMsgNotice(p.sendMessageBlocked);
      return;
    }
    setMsgBusy(true);
    setMsgNotice(null);
    try {
      const res = await fetch("/api/platform/sellers/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: partnerId,
          subject: msgSubject.trim() || null,
          body: text,
          idempotency_key: `profile-msg-${partnerId}-${Date.now()}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 403 && body && (body as { error?: string }).error === "partner_not_active") {
        setMsgNotice(p.sendMessageBlocked);
        return;
      }
      if (!res.ok) {
        setMsgNotice(p.sendMessageError);
        return;
      }
      setMsgBody("");
      setMsgNotice(p.sendMessageOk);
      await loadMessages();
    } catch {
      setMsgNotice(p.sendMessageError);
    } finally {
      setMsgBusy(false);
    }
  }

  const load = useCallback(async () => {
    setPhase("loading");
    setProfileData(undefined);
    setMessage(null);
    const id = encodeURIComponent(partnerId);
    // Partner-scoped profile data loads in parallel; it never blocks the header.
    const profilePromise = fetch(`/api/platform/sellers/partners/${id}/profile`, { cache: "no-store" })
      .then(async (res) => (res.ok ? parseSellerProfileData(await res.json().catch(() => null)) : null))
      .catch(() => null);
    try {
      const res = await fetch(`/api/platform/sellers/partners/${id}`, { cache: "no-store" });
      const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      if (res.status === 404 || body?.found === false) {
        setPartner(null);
        setPhase("not_found");
        return;
      }
      const detail = body && res.ok ? parseDetail(body, partnerId) : null;
      if (!body || !detail) {
        setPhase("error");
        return;
      }
      setPartner(detail);
      setConfirmActiveAppCustomer(false);
      const rows = Array.isArray(body.activity) ? body.activity : [];
      setActivity(
        rows.flatMap((row) => {
          if (!row || typeof row !== "object") return [];
          const r = row as Record<string, unknown>;
          const action = typeof r.action === "string" ? r.action : null;
          if (!action) return [];
          return [
            {
              action,
              actorKind: typeof r.actorKind === "string" ? r.actorKind : null,
              createdAt: typeof r.createdAt === "string" ? r.createdAt : null,
            },
          ];
        }),
      );
      const certRows = Array.isArray(body.certifications) ? body.certifications : [];
      setCertifications(
        certRows.flatMap((row) => {
          if (!row || typeof row !== "object") return [];
          const r = row as Record<string, unknown>;
          const productKey = typeof r.productKey === "string" ? r.productKey : null;
          const status = typeof r.status === "string" ? r.status : null;
          if (!productKey || !status) return [];
          return [
            {
              productKey,
              status,
              score: typeof r.score === "number" ? r.score : null,
              passedAt: typeof r.passedAt === "string" ? r.passedAt : null,
              certificateId: typeof r.certificateId === "string" ? r.certificateId : null,
            },
          ];
        }),
      );
      setPhase("ready");
    } catch {
      setPhase("error");
    }
    setProfileData(await profilePromise);
  }, [partnerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const kpis = useMemo(
    () => buildSellerProfileKpis(profileData ?? null, phase === "ready" ? certifications : null),
    [profileData, certifications, phase],
  );

  function errorText(code?: string): string {
    return (code && labels.errors[code]) || actionLabels.errors[code ?? ""] || actionLabels.error;
  }

  async function submitDecision(status: string) {
    const needsReason = status === "rejected" || status === "needs_information" || status === "suspended";
    if (needsReason && reason.trim().length < 3) {
      setMessage({ kind: "error", text: errorText("reason_required") });
      return;
    }
    if (status === "approved" && partner) {
      if (partner.emailVerified === false) {
        setMessage({ kind: "error", text: labels.approveRequiresVerifiedEmail });
        return;
      }
      // When Core can store company identity, require it before approval.
      if (partner.businessIdentityStored && (!partner.legalBusinessName || !partner.businessRegistrationNumber)) {
        setMessage({ kind: "error", text: labels.approveCompanyDetailsMissing });
        return;
      }
      if (partner.hasActiveAppMembership && !confirmActiveAppCustomer) {
        setMessage({ kind: "error", text: labels.approveActiveAppCustomerWarning });
        return;
      }
    }
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/platform/sellers/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: partnerId,
          status,
          reason: reason.trim() || "Platform decision",
          ...(status === "approved" && partner?.hasActiveAppMembership ? { confirm_active_app_customer: true } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; backend_ready?: boolean };
      if (res.status === 401 || res.status === 403 || data.error === "forbidden") {
        setMessage({ kind: "error", text: errorText("forbidden") });
        return;
      }
      if (res.status === 503 || data.backend_ready === false) {
        setMessage({ kind: "closed", text: labels.failClosed });
        return;
      }
      if (!res.ok) {
        setMessage({ kind: "error", text: errorText(data.error) });
        return;
      }
      setMessage({ kind: "ok", text: labels.success });
      setConfirmStatus(null);
      setReason("");
      onDecisionSuccess?.();
      void load();
    } catch {
      setMessage({ kind: "error", text: errorText() });
    } finally {
      setPending(false);
    }
  }

  function onConfirm(e: FormEvent) {
    e.preventDefault();
    if (!confirmStatus) return;
    void submitDecision(confirmStatus);
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, current: ProfileTab) {
    const index = TABS.indexOf(current);
    let next: ProfileTab | null = null;
    if (e.key === "ArrowRight") next = TABS[(index + 1) % TABS.length];
    else if (e.key === "ArrowLeft") next = TABS[(index - 1 + TABS.length) % TABS.length];
    else if (e.key === "Home") next = TABS[0];
    else if (e.key === "End") next = TABS[TABS.length - 1];
    if (!next) return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  const dateOpts = { locale, emptyFallback: labels.emptyValue, invalidFallback: labels.emptyValue };
  const tabLabel: Record<ProfileTab, string> = {
    overview: p.tabOverview,
    sales: p.tabSales,
    academy: p.tabAcademy,
    commissions: p.tabCommissions,
    messages: p.tabMessages,
    history: p.tabHistory,
  };

  if (phase === "loading" && !partner) return <AipifyLoader centered size="sm" label={labels.loading} />;
  if (phase === "error") {
    return <Notice title={labels.errorTitle} body={labels.errorBody} actionLabel={labels.retry} onAction={load} />;
  }
  if (phase === "not_found" || !partner) {
    return <Notice title={labels.notFoundTitle} body={labels.notFoundBody} />;
  }

  const displayName = partner.displayName?.trim() || p.unnamedSeller;
  const certifiedCount = kpis.certifications;
  const commissionsValue = formatEarned(kpis.commissionsEarnedByCurrency, locale, nf, p.notReported);
  const profileLoading = profileData === undefined;
  const count = (n: number | null) => (profileLoading && n === null ? "…" : n === null ? p.notReported : nf.format(n));

  const kpiChips: Array<{ key: string; label: string; value: string; unreported: boolean; tab: ProfileTab }> = [
    { key: "clicks", label: p.kpiClicks, value: count(kpis.clicks), unreported: kpis.clicks === null, tab: "sales" },
    {
      key: "registrations",
      label: p.kpiRegistrations,
      value: count(kpis.registrations),
      unreported: kpis.registrations === null,
      tab: "sales",
    },
    { key: "sales", label: p.kpiSales, value: count(kpis.sales), unreported: kpis.sales === null, tab: "sales" },
    {
      key: "commissions",
      label: p.kpiCommissions,
      value: profileLoading && commissionsValue === null ? "…" : (commissionsValue ?? p.notReported),
      unreported: commissionsValue === null,
      tab: "commissions",
    },
    {
      key: "certifications",
      label: p.kpiCertifications,
      value: certifiedCount === null ? p.notReported : nf.format(certifiedCount),
      unreported: certifiedCount === null,
      tab: "academy",
    },
    {
      key: "openSettlements",
      label: p.kpiOpenSettlements,
      value: count(kpis.openSettlements),
      unreported: kpis.openSettlements === null,
      tab: "commissions",
    },
  ];

  const isCertified = certifiedCount !== null && certifiedCount > 0;
  const messagesHref = `/platform/sellers/messages?partner=${encodeURIComponent(partner.id)}`;
  const canMessage = isCspMessageRecipientEligible(partner.status);
  const subline = [
    partner.legalBusinessName,
    partner.country ? formatCountry(partner.country, locale, labels.emptyValue) : null,
  ].filter((v): v is string => !!v);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <SellerAvatar name={partner.displayName} imageUrl={partner.avatarUrl} alt={p.avatarAlt} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-[#1F2937]">{displayName}</h2>
            <p className="mt-0.5 truncate text-sm text-[color:var(--aipify-text-secondary)]">
              {subline.length > 0 ? subline.join(" · ") : labels.notSavedYet}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AipifyStatusBadge
                kind={partnerStatusKind(partner.status)}
                label={labels.partnerStatus[partner.status] ?? labels.partnerStatus.unknown ?? labels.emptyValue}
              />
              {certifiedCount !== null ? (
                <AipifyStatusBadge
                  kind={isCertified ? "verified" : "waiting"}
                  label={isCertified ? p.certifiedBadge : p.notCertifiedBadge}
                />
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={PRIMARY_BUTTON}
              onClick={() => setTab("messages")}
            >
              {p.sendMessage}
            </button>
            <button
              type="button"
              aria-expanded={manageOpen}
              aria-controls={`${tabsId}-manage`}
              onClick={() => setManageOpen((v) => !v)}
              className={SECONDARY_BUTTON}
            >
              {manageOpen ? p.hideManage : p.managePartner}
            </button>
          </div>
        </div>

        <ul
          aria-label={p.kpiRegionLabel}
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6"
        >
          {kpiChips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={() => setTab(chip.tab)}
                className="flex h-full w-full flex-col rounded-xl border border-[color:var(--aipify-border)] bg-[#F6F8FC] px-3 py-2 text-left hover:border-[#7253EA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]"
              >
                <span className="text-xs text-[color:var(--aipify-text-secondary)]">{chip.label}</span>
                <span
                  className={
                    chip.unreported
                      ? "mt-0.5 text-sm font-medium text-[color:var(--aipify-text-secondary)]"
                      : "mt-0.5 text-lg font-semibold text-[#1F2937]"
                  }
                >
                  {chip.value}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </header>

      {manageOpen ? (
        <section
          id={`${tabsId}-manage`}
          className="rounded-2xl border border-[color:var(--aipify-border)] bg-[#F6F8FC] p-5"
        >
          <h3 className="text-lg font-semibold text-[#1F2937]">{p.manageTitle}</h3>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{p.manageHint}</p>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{labels.actionsHint}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["approved", labels.approve],
                ["needs_information", labels.requestInfo],
                ["rejected", labels.reject],
                ["suspended", labels.suspend],
              ] as const
            ).map(([status, label]) => (
              <button
                key={status}
                type="button"
                disabled={pending}
                onClick={() => {
                  setConfirmStatus(status);
                  setMessage(null);
                }}
                className={
                  status === "approved"
                    ? "rounded-xl bg-[#027A48] px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#027A48] disabled:opacity-60"
                    : status === "rejected"
                      ? "rounded-xl border border-[#B42318] bg-white px-4 py-2.5 text-sm font-semibold text-[#B42318] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42318] disabled:opacity-60"
                      : "rounded-xl border border-[color:var(--aipify-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA] disabled:opacity-60"
                }
              >
                {label}
              </button>
            ))}
          </div>

          {confirmStatus ? (
            <form
              className="mt-4 space-y-3 rounded-xl border border-[color:var(--aipify-border)] bg-white p-4"
              onSubmit={onConfirm}
            >
              <p className="text-sm font-medium text-[#1F2937]">
                {confirmStatus === "approved"
                  ? labels.confirmApprove
                  : confirmStatus === "rejected"
                    ? labels.confirmReject
                    : confirmStatus === "needs_information"
                      ? labels.confirmNeedsInfo
                      : labels.confirmSuspend}
              </p>
              <label className="block text-sm">
                <span className="font-medium text-[#1F2937]">{labels.reason}</span>
                <span className="mt-0.5 block text-xs text-[color:var(--aipify-text-secondary)]">
                  {labels.reasonHint}
                </span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                  required={confirmStatus !== "approved"}
                  minLength={confirmStatus === "approved" ? 0 : 3}
                />
              </label>
              {confirmStatus === "approved" && partner.hasActiveAppMembership ? (
                <label className="flex items-start gap-2 rounded-xl border border-[#B54708]/40 bg-[#FFFAEB] px-3 py-2 text-sm text-[#1F2937]">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={confirmActiveAppCustomer}
                    onChange={(e) => setConfirmActiveAppCustomer(e.target.checked)}
                  />
                  <span>
                    <span className="block font-medium">{labels.approveActiveAppCustomerWarning}</span>
                    <span className="mt-1 block text-[color:var(--aipify-text-secondary)]">
                      {labels.confirmActiveAppCustomer}
                    </span>
                  </span>
                </label>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-xl bg-[#7253EA] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {pending ? labels.submitting : labels.confirmSubmit}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirmStatus(null)}
                  className="rounded-xl border border-[color:var(--aipify-border)] px-4 py-2 text-sm font-semibold"
                >
                  {labels.close}
                </button>
              </div>
            </form>
          ) : null}

          {message ? (
            <p
              role="status"
              className={
                message.kind === "ok"
                  ? "mt-3 rounded-xl bg-[#ECFDF3] px-3 py-2 text-sm text-[#027A48]"
                  : "mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-[#B42318]"
              }
            >
              {message.text}
            </p>
          ) : null}
        </section>
      ) : null}

      <div>
        <div
          role="tablist"
          aria-label={p.tabsLabel}
          className="flex gap-1 overflow-x-auto border-b border-[color:var(--aipify-border)]"
        >
          {TABS.map((id) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                type="button"
                role="tab"
                id={`${tabsId}-tab-${id}`}
                aria-selected={selected}
                aria-controls={`${tabsId}-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={(e) => onTabKeyDown(e, id)}
                className={
                  selected
                    ? "-mb-px whitespace-nowrap border-b-2 border-[#7253EA] px-3 py-2.5 text-sm font-semibold text-[#7253EA] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#7253EA]"
                    : "-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-[color:var(--aipify-text-secondary)] hover:text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#7253EA]"
                }
              >
                {tabLabel[id]}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tabsId}-panel-${tab}`}
          aria-labelledby={`${tabsId}-tab-${tab}`}
          tabIndex={0}
          className={`pt-5 focus-visible:outline-none ${variant === "page" ? "min-h-[320px]" : ""}`}
        >
          {tab === "overview" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <DetailCard title={labels.sectionContact}>
                <Field label={labels.fieldName} value={partner.displayName ?? labels.emptyValue} />
                <Field label={labels.fieldEmail} value={partner.email ?? labels.notSavedYet} />
                <Field
                  label={labels.fieldEmailVerified}
                  value={
                    partner.emailVerified === true
                      ? labels.emailVerifiedYes
                      : partner.emailVerified === false
                        ? labels.emailVerifiedNo
                        : labels.notSavedYet
                  }
                />
                <Field label={labels.fieldPhone} value={partner.phone ?? labels.notSavedYet} />
                <Field
                  label={labels.fieldCountry}
                  value={formatCountry(partner.country, locale, labels.emptyValue)}
                />
              </DetailCard>

              <DetailCard title={labels.sectionCompany}>
                {!partner.businessIdentityStored ? (
                  <p className="rounded-xl bg-[#F6F8FC] px-3 py-2 text-sm text-[color:var(--aipify-text-secondary)]">
                    {labels.companyIdentityPendingSql}
                  </p>
                ) : null}
                <Field label={labels.fieldLegalBusiness} value={partner.legalBusinessName ?? labels.notSavedYet} />
                <Field
                  label={labels.fieldRegistration}
                  value={partner.businessRegistrationNumber ?? labels.notSavedYet}
                />
                <Field label={labels.fieldAddress} value={partner.businessAddress ?? labels.notSavedYet} />
              </DetailCard>

              <DetailCard title={labels.sectionStatus}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.fieldStatus}</span>
                  <AipifyStatusBadge
                    kind={partnerStatusKind(partner.status)}
                    label={labels.partnerStatus[partner.status] ?? labels.partnerStatus.unknown ?? labels.emptyValue}
                  />
                </div>
                <Field label={labels.fieldApplied} value={formatPlatformDateTimeFull(partner.createdAt, dateOpts)} />
                <Field label={labels.fieldUpdated} value={formatPlatformDateTimeFull(partner.updatedAt, dateOpts)} />
              </DetailCard>

              <DetailCard title={p.overviewRecentActivity}>
                {activity.length === 0 ? (
                  <EmptyText>{labels.activityEmpty}</EmptyText>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {activity.slice(0, 5).map((row, i) => (
                      <ActivityItem key={`${row.action}-${row.createdAt ?? i}`} row={row} labels={labels} dateOpts={dateOpts} />
                    ))}
                  </ul>
                )}
              </DetailCard>
            </div>
          ) : null}

          {tab === "sales" ? (
            <div className="space-y-4">
              <DetailCard title={p.linksTitle}>
                {profileLoading ? (
                  <AipifyLoader centered size="sm" label={labels.loading} />
                ) : !profileData?.links ? (
                  <EmptyText>{p.sectionUnavailable}</EmptyText>
                ) : profileData.links.length === 0 ? (
                  <EmptyText>{p.linksEmpty}</EmptyText>
                ) : (
                  <Table
                    caption={p.linksTitle}
                    headers={[p.colCode, p.colChannel, p.colClicks, p.colRegistrations, p.colLinkStatus]}
                  >
                    {profileData.links.map((link) => (
                      <tr key={link.id} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2 font-mono text-xs">{link.code}</td>
                        <td className="px-3 py-2">
                          {link.channelOrigin
                            ? (p.channelLabels[link.channelOrigin] ?? p.channelLabels.unknown)
                            : p.channelLabels.unknown}
                        </td>
                        <td className="px-3 py-2">{nf.format(link.clicks)}</td>
                        <td className="px-3 py-2">{nf.format(link.registrations)}</td>
                        <td className="px-3 py-2">
                          <AipifyStatusBadge
                            kind={link.active ? "completed" : "waiting"}
                            label={link.active ? p.linkActive : p.linkInactive}
                          />
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </DetailCard>

              <DetailCard title={p.salesTitle}>
                {profileLoading ? (
                  <AipifyLoader centered size="sm" label={labels.loading} />
                ) : !profileData?.sales ? (
                  <EmptyText>{p.sectionUnavailable}</EmptyText>
                ) : profileData.sales.length === 0 ? (
                  <EmptyText>{p.salesEmpty}</EmptyText>
                ) : (
                  <Table
                    caption={p.salesTitle}
                    headers={[p.colProduct, p.colSaleStatus, p.colDate, p.colAmount, p.colPaidPeriods]}
                  >
                    {profileData.sales.map((sale) => (
                      <tr key={sale.id} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">
                          {sale.productKey
                            ? (labels.productLabels[sale.productKey] ?? labels.productLabels.unknown)
                            : labels.productLabels.unknown}
                        </td>
                        <td className="px-3 py-2">
                          {sale.status
                            ? (p.saleStatusLabels[sale.status] ?? p.saleStatusLabels.unknown)
                            : p.saleStatusLabels.unknown}
                        </td>
                        <td className="px-3 py-2">{formatPlatformDateTimeShort(sale.attributedAt, dateOpts)}</td>
                        <td className="px-3 py-2">{formatMoney(sale.amount, sale.currency, locale, p.notReported)}</td>
                        <td className="px-3 py-2">
                          {sale.paidPeriodsCount === null ? p.notReported : nf.format(sale.paidPeriodsCount)}
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </DetailCard>
            </div>
          ) : null}

          {tab === "academy" ? (
            <DetailCard title={p.academyTitle}>
              {certifications.length === 0 ? (
                <EmptyText>{labels.certificationsEmpty}</EmptyText>
              ) : (
                <ul className="space-y-3 text-sm">
                  {certifications.map((row, i) => (
                    <li
                      key={`${row.productKey}-${row.status}-${row.passedAt ?? i}`}
                      className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-3"
                    >
                      <p className="font-medium text-[#1F2937]">
                        {labels.productLabels[row.productKey] ?? labels.productLabels.unknown ?? row.productKey}
                      </p>
                      <div className="mt-2 space-y-1 text-[color:var(--aipify-text-secondary)]">
                        <p>
                          {labels.fieldCertStatus}: {labels.certStatusLabels[row.status] ?? labels.emptyValue}
                        </p>
                        {row.score != null ? (
                          <p>
                            {labels.fieldScore}: {row.score}
                          </p>
                        ) : null}
                        {row.passedAt ? (
                          <p>
                            {labels.fieldPassedAt}: {formatPlatformDateTimeFull(row.passedAt, dateOpts)}
                          </p>
                        ) : null}
                        {row.certificateId ? (
                          <p className="break-all font-mono text-xs text-[#1F2937]">
                            {labels.fieldCertificateId}: {row.certificateId}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DetailCard>
          ) : null}

          {tab === "commissions" ? (
            <div className="space-y-4">
              <DetailCard title={p.commissionsEarnedTitle}>
                {profileLoading ? (
                  <AipifyLoader centered size="sm" label={labels.loading} />
                ) : commissionsValue === null ? (
                  <EmptyText>{p.sectionUnavailable}</EmptyText>
                ) : Object.keys(kpis.commissionsEarnedByCurrency ?? {}).length === 0 ? (
                  <EmptyText>{p.commissionsEarnedEmpty}</EmptyText>
                ) : (
                  <ul className="flex flex-wrap gap-3 text-sm">
                    {Object.entries(kpis.commissionsEarnedByCurrency ?? {}).map(([currency, total]) => (
                      <li key={currency} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 font-semibold">
                        {formatMoney(total, currency, locale, p.notReported)}
                      </li>
                    ))}
                  </ul>
                )}
              </DetailCard>

              <DetailCard title={p.settlementsTitle}>
                {profileLoading ? (
                  <AipifyLoader centered size="sm" label={labels.loading} />
                ) : !profileData?.settlements ? (
                  <EmptyText>{p.sectionUnavailable}</EmptyText>
                ) : profileData.settlements.length === 0 ? (
                  <EmptyText>{p.settlementsEmpty}</EmptyText>
                ) : (
                  <Table caption={p.settlementsTitle} headers={[p.colPeriod, p.colSettlementStatus, p.colTotal]}>
                    {profileData.settlements.map((s) => (
                      <tr key={s.id} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">{formatPeriod(s.periodMonth, locale, labels.emptyValue)}</td>
                        <td className="px-3 py-2">
                          <AipifyStatusBadge
                            kind={settlementStatusKind(s.status)}
                            label={p.settlementStatusLabels[s.status] ?? p.settlementStatusLabels.unknown}
                          />
                        </td>
                        <td className="px-3 py-2">{formatMoney(s.totalAmount, s.currency, locale, p.notReported)}</td>
                      </tr>
                    ))}
                  </Table>
                )}
              </DetailCard>

              <DetailCard title={p.ledgerTitle}>
                {profileLoading ? (
                  <AipifyLoader centered size="sm" label={labels.loading} />
                ) : !profileData?.ledger ? (
                  <EmptyText>{p.sectionUnavailable}</EmptyText>
                ) : profileData.ledger.entries.length === 0 ? (
                  <EmptyText>{p.ledgerEmpty}</EmptyText>
                ) : (
                  <>
                    <Table caption={p.ledgerTitle} headers={[p.colEntryType, p.colDate, p.colAmount]}>
                      {profileData.ledger.entries.slice(0, 25).map((e) => (
                        <tr key={e.id} className="border-t border-[color:var(--aipify-border)]">
                          <td className="px-3 py-2">{p.ledgerTypeLabels[e.entryType] ?? p.ledgerTypeLabels.unknown}</td>
                          <td className="px-3 py-2">{formatPlatformDateTimeShort(e.createdAt, dateOpts)}</td>
                          <td className="px-3 py-2">{formatMoney(e.amount, e.currency, locale, p.notReported)}</td>
                        </tr>
                      ))}
                    </Table>
                    <p className="text-xs text-[color:var(--aipify-text-secondary)]">{p.ledgerNote}</p>
                  </>
                )}
              </DetailCard>
            </div>
          ) : null}

          {tab === "messages" ? (
            <div className="space-y-4">
              <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-base font-semibold text-[#1F2937]">{p.messagesGateTitle}</h3>
                <p className="max-w-2xl text-sm text-[color:var(--aipify-text-secondary)]">{p.messagesGateBody}</p>
                {!canMessage ? (
                  <p className="text-sm text-[color:var(--aipify-text-secondary)]" role="status">
                    {p.sendMessageBlocked}
                  </p>
                ) : (
                  <>
                    <input
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder={p.sendMessageSubject}
                      className="w-full max-w-xl rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                    />
                    <textarea
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      placeholder={p.sendMessageBody}
                      rows={4}
                      className="w-full max-w-xl rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={msgBusy || !msgBody.trim()}
                      onClick={() => void sendProfileMessage()}
                      className={`${PRIMARY_BUTTON} disabled:opacity-50`}
                    >
                      {p.sendMessageCta}
                    </button>
                  </>
                )}
                {msgNotice ? (
                  <p className="text-sm text-[color:var(--aipify-text-secondary)]">{msgNotice}</p>
                ) : null}
                <Link href={messagesHref} className={`inline-flex ${SECONDARY_BUTTON}`}>
                  {p.openMessages}
                </Link>
              </section>

              <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-[#1F2937]">{p.conversationTitle}</h3>
                {msgPhase === "loading" || msgPhase === "idle" ? (
                  <div className="mt-4">
                    <AipifyLoader centered size="sm" label={labels.loading} />
                  </div>
                ) : null}
                {msgPhase === "error" ? (
                  <div className="mt-4 space-y-2">
                    <EmptyText>{labels.errorBody}</EmptyText>
                    <button type="button" onClick={() => void loadMessages()} className={SECONDARY_BUTTON}>
                      {labels.retry}
                    </button>
                  </div>
                ) : null}
                {msgPhase === "ready" && msgRows.length === 0 ? (
                  <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{p.messagesEmpty}</p>
                ) : null}
                {msgPhase === "ready" && msgRows.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {msgRows.map((row) => {
                      const direction = typeof row.direction === "string" ? row.direction : "";
                      const subject = typeof row.subject === "string" ? row.subject : "";
                      const body = typeof row.body === "string" ? row.body : "";
                      const createdAt = typeof row.created_at === "string" ? row.created_at : null;
                      const readAt = typeof row.read_at === "string" ? row.read_at : null;
                      const id = typeof row.id === "string" ? row.id : `${createdAt}-${body.slice(0, 12)}`;
                      return (
                        <li key={id} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2">
                          <p className="text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                            {direction === "partner_to_admin" ? p.directionPartner : p.directionAdmin}
                            {" · "}
                            <span className="font-normal">
                              {formatPlatformDateTimeClock(createdAt, dateOpts)}
                            </span>
                            {" · "}
                            {readAt ? p.readYes : p.readNo}
                          </p>
                          {subject ? <p className="mt-1 font-medium text-[#1F2937]">{subject}</p> : null}
                          <p className="mt-1 whitespace-pre-wrap text-sm text-[color:var(--aipify-text-secondary)]">
                            {body}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            </div>
          ) : null}

          {tab === "history" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <DetailCard title={p.historyTitle}>
                {(() => {
                  const audit = profileData?.audit ?? null;
                  if (profileLoading) return <AipifyLoader centered size="sm" label={labels.loading} />;
                  const rows = audit ?? activity.map((a, i) => ({ id: `${a.action}-${i}`, ...a }));
                  if (rows.length === 0) return <EmptyText>{p.historyEmpty}</EmptyText>;
                  return (
                    <ul className="space-y-2 text-sm">
                      {rows.map((row) => (
                        <li key={row.id} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2">
                          <p className="font-medium text-[#1F2937]">
                            {labels.activityLabels[row.action] ?? labels.activityUnknown}
                          </p>
                          <p className="text-[color:var(--aipify-text-secondary)]">
                            {row.actorKind
                              ? `${p.actorLabels[row.actorKind] ?? p.actorLabels.unknown} · `
                              : ""}
                            {formatPlatformDateTimeFull(row.createdAt, dateOpts)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </DetailCard>

              <DetailCard title={p.accessTitle}>
                <Field label={labels.fieldEmail} value={partner.email ?? labels.notSavedYet} />
                <Field
                  label={labels.fieldEmailVerified}
                  value={
                    partner.emailVerified === true
                      ? labels.emailVerifiedYes
                      : partner.emailVerified === false
                        ? labels.emailVerifiedNo
                        : labels.notSavedYet
                  }
                />
                <Field label={labels.fieldApplied} value={formatPlatformDateTimeFull(partner.createdAt, dateOpts)} />
                <div className="rounded-xl border border-[color:var(--aipify-border)] bg-[#F6F8FC] px-3 py-3 text-sm">
                  <p className="font-medium text-[#1F2937]">{p.dualIdentityTitle}</p>
                  <p className="mt-1 text-[color:var(--aipify-text-secondary)]">{p.dualIdentityBody}</p>
                  <p className="mt-2 font-medium text-[#1F2937]">
                    {partner.hasActiveAppMembership ? p.dualIdentityActive : p.dualIdentityNone}
                  </p>
                </div>
                <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                  {p.referenceLabel}: {shortReference(partner.id)}
                </p>
              </DetailCard>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** `null` = Core did not report; empty currency map = reported with no earned commission. */
function formatEarned(
  byCurrency: Record<string, number> | null,
  locale: string,
  nf: Intl.NumberFormat,
  fallback: string,
): string | null {
  if (!byCurrency) return null;
  const entries = Object.entries(byCurrency);
  if (entries.length === 0) return nf.format(0);
  return entries.map(([currency, total]) => formatMoney(total, currency, locale, fallback)).join(" · ");
}

const PRIMARY_BUTTON =
  "inline-flex items-center rounded-xl bg-[#7253EA] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5F42D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]";
const SECONDARY_BUTTON =
  "inline-flex items-center rounded-xl border border-[color:var(--aipify-border)] bg-white px-4 py-2 text-sm font-semibold text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]";

function ActivityItem({
  row,
  labels,
  dateOpts,
}: {
  row: ActivityRow;
  labels: CertifiedSellerProfileLabels;
  dateOpts: { locale: string; emptyFallback: string; invalidFallback: string };
}) {
  return (
    <li className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2">
      <p className="font-medium text-[#1F2937]">{labels.activityLabels[row.action] ?? labels.activityUnknown}</p>
      <p className="text-[color:var(--aipify-text-secondary)]">{formatPlatformDateTimeFull(row.createdAt, dateOpts)}</p>
    </li>
  );
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-[#1F2937]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">{label}</p>
      <p className="mt-0.5 break-words text-sm text-[#1F2937]">{value}</p>
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="text-sm text-[color:var(--aipify-text-secondary)]">{children}</p>;
}

function Table({ caption, headers, children }: { caption: string; headers: string[]; children: ReactNode }) {
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

function Notice({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--aipify-border)] p-5" role="status">
      <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
      <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{body}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={() => onAction()} className="mt-3 text-sm font-semibold text-[#7253EA]">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
