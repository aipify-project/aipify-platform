"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  complianceStatusLabel,
  documentStatusLabel,
  eligibilityLabel,
  healthLabel,
  parsePartnerComplianceAgreements,
  parsePartnerComplianceDocuments,
  parsePartnerComplianceOverview,
  parsePartnerComplianceTaxProfile,
  type PartnerComplianceAgreements,
  type PartnerComplianceDocuments,
  type PartnerComplianceOverview,
  type PartnerComplianceTaxProfile,
} from "@/lib/partner-compliance";

type Props = {
  labels: Record<string, string>;
};

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function PartnerCompliancePanel({ labels }: Props) {
  const [overview, setOverview] = useState<PartnerComplianceOverview | null>(null);
  const [documents, setDocuments] = useState<PartnerComplianceDocuments | null>(null);
  const [taxProfile, setTaxProfile] = useState<PartnerComplianceTaxProfile | null>(null);
  const [agreements, setAgreements] = useState<PartnerComplianceAgreements | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    registration_number: "",
    vat_number: "",
    country_code: "",
    registered_address: "",
    legal_representative: "",
    account_holder: "",
    account_number: "",
    iban: "",
    swift_bic: "",
    bank_country_code: "",
    vat_registered: false,
    tax_classification: "business",
    reverse_charge_eligible: false,
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (country.trim()) params.set("country", country.trim());
    return params.toString();
  }, [country, search]);

  const hydrateForm = useCallback((data: PartnerComplianceOverview) => {
    setForm({
      company_name: data.business?.company_name ?? "",
      registration_number: data.business?.registration_number ?? "",
      vat_number: data.business?.vat_number ?? "",
      country_code: data.business?.country_code ?? "",
      registered_address: data.business?.registered_address ?? "",
      legal_representative: data.business?.legal_representative ?? "",
      account_holder: data.banking?.account_holder ?? "",
      account_number: data.banking?.account_number ?? "",
      iban: data.banking?.iban ?? "",
      swift_bic: data.banking?.swift_bic ?? "",
      bank_country_code: data.banking?.country_code ?? "",
      vat_registered: false,
      tax_classification: "business",
      reverse_charge_eligible: false,
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const overviewRes = await fetch(
        `/api/partner/compliance${queryString ? `?${queryString}` : ""}`,
      );
      const overviewJson = overviewRes.ok ? await overviewRes.json() : null;
      if (!overviewJson?.has_access) {
        setDenied(Boolean(overviewJson?.access_denied ?? !overviewJson?.has_access));
        setLoading(false);
        return;
      }
      const parsed = parsePartnerComplianceOverview(overviewJson);
      setOverview(parsed);
      if (parsed) hydrateForm(parsed);

      const [docRes, taxRes, agrRes] = await Promise.all([
        fetch("/api/partner/compliance/documents"),
        fetch("/api/partner/compliance/tax-profile"),
        fetch("/api/partner/compliance/agreements"),
      ]);
      if (docRes.ok) setDocuments(parsePartnerComplianceDocuments(await docRes.json()));
      if (taxRes.ok) {
        const tax = parsePartnerComplianceTaxProfile(await taxRes.json());
        setTaxProfile(tax);
        if (tax) {
          setForm((prev) => ({
            ...prev,
            vat_registered: tax.tax_profile.vat_registered,
            tax_classification: tax.tax_profile.tax_classification,
            reverse_charge_eligible: tax.tax_profile.reverse_charge_eligible,
            vat_number: tax.tax_profile.vat_number || prev.vat_number,
            country_code: tax.tax_profile.country_code || prev.country_code,
          }));
        }
      }
      if (agrRes.ok) setAgreements(parsePartnerComplianceAgreements(await agrRes.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [hydrateForm, queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProfile = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/compliance/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const parsed = parsePartnerComplianceOverview(await res.json());
      setOverview(parsed);
      setMessage(labels.profileSaved);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const submitVerification = async (type: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/compliance/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_type: type }),
    });
    if (res.ok) {
      setOverview(parsePartnerComplianceOverview(await res.json()));
      setMessage(labels.verificationSubmitted);
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
    return (
      <PlatformEmptyState title={labels.accessDenied} message={labels.subtitle} />
    );
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
  const showEmpty = dash && !dash.requirements_approved;
  const canWrite = overview?.can_write ?? false;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600">{labels.subtitle}</p>
        {overview?.positioning ? (
          <p className="max-w-3xl text-sm text-slate-500">{overview.positioning}</p>
        ) : null}
        {!canWrite ? (
          <p className="text-sm text-amber-700">{labels.readOnlyNote}</p>
        ) : null}
      </header>

      {message ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}

      {dash ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={labels.complianceStatus}
            value={complianceStatusLabel(labels, dash.compliance_status)}
          />
          <MetricCard
            label={labels.healthScore}
            value={`${healthLabel(labels, dash.health_score_label)} (${dash.health_score_pct}%)`}
          />
          <MetricCard
            label={labels.settlementEligibility}
            value={eligibilityLabel(labels, dash.settlement_eligibility)}
          />
          <MetricCard
            label={labels.selfBillingAgreement}
            value={complianceStatusLabel(labels, dash.self_billing_agreement_status)}
          />
          <MetricCard
            label={labels.businessVerification}
            value={complianceStatusLabel(labels, dash.business_verification_status)}
          />
          <MetricCard
            label={labels.identityVerification}
            value={complianceStatusLabel(labels, dash.identity_verification_status)}
          />
          <MetricCard
            label={labels.taxInformation}
            value={complianceStatusLabel(labels, dash.tax_information_status)}
          />
          <MetricCard
            label={labels.bankingVerification}
            value={complianceStatusLabel(labels, dash.banking_verification_status)}
          />
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">{labels.filterCountry}</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={labels.country}
            className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase"
          />
        </div>
      </section>

      {(overview?.alerts?.length ?? 0) > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{labels.alertsTitle}</h2>
          <ul className="space-y-2">
            {overview?.alerts?.map((alert) => (
              <li
                key={alert.alert_key}
                className={`rounded-lg border px-4 py-3 text-sm ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                }`}
              >
                {alert.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showEmpty ? (
        <PlatformEmptyState
          title={overview?.empty_state?.title ?? labels.emptyTitle}
          message={overview?.empty_state?.message ?? labels.emptyMessage}
          primaryAction={{
            label: labels.completeSetup,
            onClick: canWrite ? () => void submitVerification("business") : undefined,
          }}
        />
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.businessTitle}</h2>
          <div className="grid gap-3">
            {(
              [
                ["company_name", labels.companyName],
                ["registration_number", labels.registrationNumber],
                ["vat_number", labels.vatNumber],
                ["country_code", labels.country],
                ["registered_address", labels.registeredAddress],
                ["legal_representative", labels.legalRepresentative],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="text-slate-600">{label}</span>
                <input
                  type="text"
                  disabled={!canWrite || busy}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
                />
              </label>
            ))}
          </div>
          {overview?.business ? (
            <StatusBadge
              label={complianceStatusLabel(labels, overview.business.verification_status)}
            />
          ) : null}
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.bankingTitle}</h2>
          <div className="grid gap-3">
            {(
              [
                ["account_holder", labels.accountHolder],
                ["account_number", labels.accountNumber],
                ["iban", labels.iban],
                ["swift_bic", labels.swiftBic],
                ["bank_country_code", labels.country],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="text-slate-600">{label}</span>
                <input
                  type="text"
                  disabled={!canWrite || busy}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
                />
              </label>
            ))}
          </div>
          {overview?.banking ? (
            <StatusBadge
              label={complianceStatusLabel(labels, overview.banking.verification_status)}
            />
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.taxTitle}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div>
            <dt className="text-slate-500">{labels.vatRegistered}</dt>
            <dd>{taxProfile?.tax_profile.vat_registered ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.vatNumber}</dt>
            <dd>{taxProfile?.tax_profile.vat_number || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.taxClassification}</dt>
            <dd>{taxProfile?.tax_profile.tax_classification || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.reverseCharge}</dt>
            <dd>{taxProfile?.tax_profile.reverse_charge_eligible ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.country}</dt>
            <dd>{taxProfile?.tax_profile.country_code || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.complianceStatus}</dt>
            <dd>
              {taxProfile
                ? complianceStatusLabel(labels, taxProfile.tax_profile.profile_status)
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.agreementsTitle}</h2>
        {agreements?.current ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-slate-500">{labels.agreementVersion}</dt>
              <dd>{agreements.current.agreement_version}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.complianceStatus}</dt>
              <dd>{complianceStatusLabel(labels, agreements.current.status)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.acceptedAt}</dt>
              <dd>{agreements.current.accepted_at || "—"}</dd>
            </div>
          </dl>
        ) : null}
        {(agreements?.history.length ?? 0) > 1 ? (
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            {agreements?.history.map((row) => (
              <li key={row.agreement_version}>
                v{row.agreement_version} — {complianceStatusLabel(labels, row.status)}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {(documents?.documents.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.documentsTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">{labels.documentsTitle}</th>
                  <th className="px-3 py-2">{labels.complianceStatus}</th>
                </tr>
              </thead>
              <tbody>
                {documents?.documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{doc.file_name}</td>
                    <td className="px-3 py-2">
                      {documentStatusLabel(labels, doc.document_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {(overview?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.timelineTitle}</h2>
          <ul className="mt-4 space-y-3">
            {overview?.timeline?.map((item) => (
              <li key={item.id} className="border-b border-slate-100 pb-3 text-sm">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-slate-600">{item.summary}</p>
                <p className="text-xs text-slate-400">{item.created_at}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canWrite ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void saveProfile()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {labels.saveProfile}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submitVerification("business")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            {labels.submitVerification}
          </button>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhyRequired}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqWhyRequiredAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqPaymentsWithoutVerification}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqPaymentsWithoutVerificationAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqSelfBilling}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqSelfBillingAnswer}</dd>
          </div>
        </dl>
      </section>

      <p className="text-sm text-slate-500">
        <Link href="/partner/settlements" className="text-slate-900 underline">
          {labels.viewSettlements}
        </Link>
      </p>
    </div>
  );
}
