"use client";

import { useCallback, useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { partnerStatusKind } from "@/lib/certified-sales-partner/platform-sellers-view";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality/date-time";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";

export type PartnerDetailsDrawerLabels = {
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
  sectionActivity: string;
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
  errors: Record<string, string>;
  partnerStatus: Record<string, string>;
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
  businessIdentityStored: boolean;
};

type ActivityRow = {
  action: string;
  actorKind: string | null;
  createdAt: string | null;
};

type Props = {
  partnerId: string;
  locale: string;
  labels: PartnerDetailsDrawerLabels;
  actionLabels: SellersActionLabels;
  onClose: () => void;
  onDecisionSuccess: () => void;
};

type LoadPhase = "loading" | "ready" | "error" | "not_found";

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

export function CertifiedSellersPartnerDetailsDrawer({
  partnerId,
  locale,
  labels,
  actionLabels,
  onClose,
  onDecisionSuccess,
}: Props) {
  const titleId = useId();
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string } | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setPhase("loading");
    setMessage(null);
    try {
      const res = await fetch(`/api/platform/sellers/partners/${encodeURIComponent(partnerId)}`, {
        cache: "no-store",
      });
      const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      if (res.status === 404 || body?.found === false) {
        setPartner(null);
        setPhase("not_found");
        return;
      }
      if (!res.ok || !body?.partner || typeof body.partner !== "object") {
        setPhase("error");
        return;
      }
      const p = body.partner as Record<string, unknown>;
      const persistence =
        body.persistence && typeof body.persistence === "object"
          ? (body.persistence as Record<string, unknown>)
          : {};
      setPartner({
        id: String(p.id ?? partnerId),
        status: String(p.status ?? "unknown"),
        displayName: typeof p.displayName === "string" ? p.displayName : null,
        country: typeof p.country === "string" ? p.country : null,
        createdAt: typeof p.createdAt === "string" ? p.createdAt : null,
        updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : null,
        email: typeof p.email === "string" ? p.email : null,
        emailVerified: typeof p.emailVerified === "boolean" ? p.emailVerified : null,
        legalBusinessName: typeof p.legalBusinessName === "string" ? p.legalBusinessName : null,
        businessRegistrationNumber:
          typeof p.businessRegistrationNumber === "string" ? p.businessRegistrationNumber : null,
        businessAddress: typeof p.businessAddress === "string" ? p.businessAddress : null,
        phone: typeof p.phone === "string" ? p.phone : null,
        businessIdentityStored: persistence.businessIdentityStored === true,
      });
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
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, [partnerId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      if (
        partner.businessIdentityStored &&
        (!partner.legalBusinessName || !partner.businessRegistrationNumber)
      ) {
        setMessage({ kind: "error", text: labels.approveCompanyDetailsMissing });
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
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
      };
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
      onDecisionSuccess();
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

  const dateOpts = { locale, emptyFallback: labels.emptyValue, invalidFallback: labels.emptyValue };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" role="presentation" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-[720px] flex-col border-l border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface,#fff)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[color:var(--aipify-border)] px-6 py-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-[#1F2937]">
              {labels.title}
            </h2>
            {partner?.displayName ? (
              <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{partner.displayName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]"
          >
            {labels.close}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {phase === "loading" ? <AipifyLoader centered size="sm" label={labels.loading} /> : null}
          {phase === "error" ? (
            <Notice title={labels.errorTitle} body={labels.errorBody} actionLabel={labels.retry} onAction={load} />
          ) : null}
          {phase === "not_found" ? (
            <Notice title={labels.notFoundTitle} body={labels.notFoundBody} />
          ) : null}

          {phase === "ready" && partner ? (
            <div className="grid gap-6 lg:grid-cols-12">
              <section className="space-y-4 lg:col-span-7">
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
                      label={labels.partnerStatus[partner.status] ?? labels.partnerStatus.unknown ?? partner.status}
                    />
                  </div>
                  <Field
                    label={labels.fieldApplied}
                    value={formatPlatformDateTimeFull(partner.createdAt, dateOpts)}
                  />
                  <Field
                    label={labels.fieldUpdated}
                    value={formatPlatformDateTimeFull(partner.updatedAt, dateOpts)}
                  />
                </DetailCard>

                <DetailCard title={labels.sectionActivity}>
                  {activity.length === 0 ? (
                    <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.activityEmpty}</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {activity.map((row, i) => (
                        <li
                          key={`${row.action}-${row.createdAt ?? i}`}
                          className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                        >
                          <p className="font-medium text-[#1F2937]">
                            {labels.activityLabels[row.action] ?? labels.activityUnknown}
                          </p>
                          <p className="text-[color:var(--aipify-text-secondary)]">
                            {formatPlatformDateTimeFull(row.createdAt, dateOpts)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailCard>
              </section>

              <section className="lg:col-span-5">
                <div className="sticky top-0 rounded-2xl border border-[color:var(--aipify-border)] bg-[#F6F8FC] p-5">
                  <h3 className="text-lg font-semibold text-[#1F2937]">{labels.actionsTitle}</h3>
                  <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{labels.actionsHint}</p>

                  <div className="mt-4 grid gap-2">
                    {(
                      [
                        ["approved", labels.approve, labels.confirmApprove],
                        ["needs_information", labels.requestInfo, labels.confirmNeedsInfo],
                        ["rejected", labels.reject, labels.confirmReject],
                        ["suspended", labels.suspend, labels.confirmSuspend],
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
                    <form className="mt-4 space-y-3 rounded-xl border border-[color:var(--aipify-border)] bg-white p-4" onSubmit={onConfirm}>
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
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
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
      <p className="mt-0.5 text-sm text-[#1F2937]">{value}</p>
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

/** Keyboard activation for a table row that opens the drawer. */
export function partnerRowKeyDown(e: KeyboardEvent, open: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    open();
  }
}
