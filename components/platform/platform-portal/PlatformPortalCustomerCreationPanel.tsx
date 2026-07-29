"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type {
  PlatformPortalCompanyLookupMatch,
  PlatformPortalCustomerCreationLabels,
} from "@/lib/platform-portal";
import {
  countryHasCompanyLookupProvider,
  listIsoAlpha2Countries,
} from "@/lib/platform-portal/countries";
import {
  isReservedCustomerSlug,
  normalizeCustomerSlug,
  normalizeRegistrationNumber,
  suggestCustomerSlug,
  type PlatformPortalCustomerCreationErrorCode,
} from "@/lib/platform-portal/create-customer";

type Props = {
  labels: PlatformPortalCustomerCreationLabels;
  locale: string;
};

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "results"; results: PlatformPortalCompanyLookupMatch[] }
  | { kind: "not_found" }
  | { kind: "unavailable" }
  | { kind: "timeout" }
  | { kind: "invalid_query" }
  | { kind: "lookup_unavailable" };

type FormErrorCode = PlatformPortalCustomerCreationErrorCode | "lookup_invalid" | null;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: FormErrorCode };

function errorMessage(
  labels: PlatformPortalCustomerCreationLabels,
  code: FormErrorCode,
  country: string,
): string {
  switch (code) {
    case "invalid_organization_number":
    case "lookup_invalid":
      return country === "NO"
        ? labels.invalidOrganizationNumber
        : labels.registrationNumberRequired;
    case "duplicate_organization_number":
      return labels.duplicateOrganizationNumber;
    case "invalid_slug":
      return labels.invalidSlug;
    case "duplicate_slug":
      return labels.duplicateSlug;
    case "reserved_slug":
      return labels.reservedSlug;
    case "invalid_country":
      return labels.selectCountry;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    default:
      return labels.error;
  }
}

export function PlatformPortalCustomerCreationPanel({ labels, locale }: Props) {
  const router = useRouter();
  const countries = useMemo(() => listIsoAlpha2Countries(locale), [locale]);

  const [country, setCountry] = useState("");
  const [lookupQuery, setLookupQuery] = useState("");
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [orgTouched, setOrgTouched] = useState(false);
  const [legalTouched, setLegalTouched] = useState(false);
  const [countryTouched, setCountryTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [legalNameLocked, setLegalNameLocked] = useState(false);
  const [orgLocked, setOrgLocked] = useState(false);
  const [verificationSource, setVerificationSource] = useState<"brreg" | "operator">(
    "operator",
  );
  const [selectedResult, setSelectedResult] = useState<PlatformPortalCompanyLookupMatch | null>(
    null,
  );
  const [lookup, setLookup] = useState<LookupState>({ kind: "idle" });
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  const isNorway = country === "NO";
  const hasLookup = countryHasCompanyLookupProvider(country);

  useEffect(() => {
    if (slugTouched) return;
    const suggested = suggestCustomerSlug(displayName || legalName);
    setSlug(suggested === "customer" ? "" : suggested);
  }, [displayName, legalName, slugTouched]);

  useEffect(() => {
    setLookup({ kind: "idle" });
    setSelectedResult(null);
    setLookupQuery("");
    setLegalNameLocked(false);
    setOrgLocked(false);
    setVerificationSource("operator");
  }, [country]);

  const normalizedOrg = useMemo(
    () => (country ? normalizeRegistrationNumber(country, organizationNumber) : null),
    [country, organizationNumber],
  );
  const normalizedSlug = useMemo(() => normalizeCustomerSlug(slug), [slug]);

  const showCountryError =
    (countryTouched || submitted) && !country;
  const showOrgError =
    (orgTouched || submitted) && country.length > 0 && !normalizedOrg;
  const showLegalError = (legalTouched || submitted) && !legalName.trim();
  const showSlugError =
    (slugTouched || submitted) &&
    (slug.trim().length > 0 || submitted) &&
    (!normalizedSlug || (normalizedSlug != null && isReservedCustomerSlug(normalizedSlug)));

  const canSubmit =
    Boolean(country) &&
    Boolean(normalizedOrg) &&
    Boolean(legalName.trim()) &&
    Boolean(normalizedSlug) &&
    !isReservedCustomerSlug(normalizedSlug ?? "") &&
    submit.kind !== "submitting" &&
    submit.kind !== "success";

  function applyCompanyResult(match: PlatformPortalCompanyLookupMatch) {
    setSelectedResult(match);
    setOrganizationNumber(match.registrationNumber);
    setLegalName(match.legalName);
    setLegalNameLocked(true);
    setOrgLocked(true);
    setVerificationSource("brreg");
    if (!displayName.trim()) {
      setDisplayName(match.legalName);
    }
  }

  async function runLookup() {
    if (!hasLookup) {
      setLookup({ kind: "lookup_unavailable" });
      return;
    }

    setLookup({ kind: "loading" });
    setSelectedResult(null);

    try {
      const response = await fetch("/api/platform-portal/customers/company-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          countryCode: country,
          query: lookupQuery.trim(),
        }),
      });

      if (response.status === 401) {
        setSubmit({ kind: "error", code: "unauthorized" });
        setLookup({ kind: "idle" });
        return;
      }
      if (response.status === 403) {
        setSubmit({ kind: "error", code: "forbidden" });
        setLookup({ kind: "idle" });
        return;
      }

      if (!response.ok) {
        setLookup({ kind: "unavailable" });
        return;
      }

      const data = (await response.json()) as {
        status?: string;
        results?: PlatformPortalCompanyLookupMatch[];
        organizationNumber?: string | null;
        legalName?: string | null;
      };

      if (data.status === "lookup_unavailable") {
        setLookup({ kind: "lookup_unavailable" });
        return;
      }

      if (data.status === "invalid_query") {
        setLookup({ kind: "invalid_query" });
        return;
      }

      if (data.status === "no_results" || data.status === "invalid") {
        setLookup({ kind: "not_found" });
        return;
      }

      if (data.status === "timeout") {
        setLookup({ kind: "timeout" });
        return;
      }

      if (data.status === "service_unavailable") {
        setLookup({ kind: "unavailable" });
        return;
      }

      const results = Array.isArray(data.results) ? data.results : [];
      if (results.length === 0 && data.organizationNumber && data.legalName) {
        const single: PlatformPortalCompanyLookupMatch = {
          registrationNumber: data.organizationNumber,
          legalName: data.legalName,
          organizationType: null,
          addressLine: null,
          postalCode: null,
          city: null,
          status: "active",
        };
        setLookup({ kind: "results", results: [single] });
        applyCompanyResult(single);
        return;
      }

      if (results.length === 0) {
        setLookup({ kind: "not_found" });
        return;
      }

      setLookup({ kind: "results", results });
      if (results.length === 1 && results[0]) {
        applyCompanyResult(results[0]);
      }
    } catch {
      setLookup({ kind: "unavailable" });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submit.kind === "submitting" || submit.kind === "success") return;

    setSubmitted(true);
    setSubmit({ kind: "idle" });

    if (!canSubmit || !normalizedOrg || !normalizedSlug) {
      return;
    }

    setSubmit({ kind: "submitting" });

    try {
      const response = await fetch("/api/platform-portal/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          organizationNumber: normalizedOrg,
          legalName: legalName.trim(),
          displayName: displayName.trim() || legalName.trim(),
          slug: normalizedSlug,
          country,
          verificationSource,
        }),
      });

      if (response.status === 401) {
        setSubmit({ kind: "error", code: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setSubmit({ kind: "error", code: "forbidden" });
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        customer?: { id?: string };
        code?: PlatformPortalCustomerCreationErrorCode;
      } | null;

      if (!response.ok) {
        setSubmit({ kind: "error", code: payload?.code ?? "unknown" });
        return;
      }

      const customerId = payload?.customer?.id;
      if (!customerId) {
        setSubmit({ kind: "error", code: "unknown" });
        return;
      }

      setSubmit({ kind: "success" });
      router.push(`/platform/customers/${customerId}`);
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  const isSubmitting = submit.kind === "submitting";
  const bannerError =
    submit.kind === "error" ? errorMessage(labels, submit.code, country) : null;

  const registrationLabel = isNorway
    ? labels.organizationNumber
    : labels.registrationNumber;

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {labels.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {labels.description}
          </p>
        </div>
        <Link
          href="/platform/customers"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {labels.backToCustomers}
        </Link>
      </header>

      {bannerError ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-950 dark:border-rose-800/80 dark:bg-rose-950/40 dark:text-rose-50"
        >
          {bannerError}
        </div>
      ) : null}

      {submit.kind === "success" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-50"
        >
          {labels.success}
        </div>
      ) : null}

      <form onSubmit={(event) => void onSubmit(event)} className="w-full space-y-6" noValidate>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionIdentity}
          </h2>

          <div className="mt-4 space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {labels.country}
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(event) => {
                setCountryTouched(true);
                setCountry(event.target.value);
              }}
              onBlur={() => setCountryTouched(true)}
              className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
            >
              <option value="">{labels.selectCountry}</option>
              {countries.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name} ({option.code})
                </option>
              ))}
            </select>
            {showCountryError ? (
              <p className="text-sm text-rose-700 dark:text-rose-300">{labels.selectCountry}</p>
            ) : null}
            {country && hasLookup ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {labels.lookupAvailableNorway}
              </p>
            ) : null}
            {country && !hasLookup ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {labels.lookupUnavailableCountry} {labels.enterManually}
              </p>
            ) : null}
          </div>

          {hasLookup ? (
            <div className="mt-5 space-y-3 rounded-xl border border-violet-200/80 bg-violet-50/40 p-4 dark:border-violet-800/60 dark:bg-violet-950/30">
              <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
                {labels.searchNorwegianCompany}
              </h3>
              <p className="text-sm text-violet-900/80 dark:text-violet-200/80">
                {labels.searchNameOrNumber}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="companyLookupQuery"
                  value={lookupQuery}
                  onChange={(event) => setLookupQuery(event.target.value)}
                  placeholder={labels.companyNameOrNumber}
                  autoComplete="off"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
                />
                <button
                  type="button"
                  onClick={() => void runLookup()}
                  disabled={lookup.kind === "loading" || isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-900 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-100 dark:hover:bg-violet-900/60"
                >
                  {lookup.kind === "loading" ? labels.lookupLoading : labels.lookupAction}
                </button>
              </div>

              {lookup.kind === "invalid_query" ? (
                <p className="text-sm text-amber-700 dark:text-amber-300">{labels.queryTooShort}</p>
              ) : null}
              {lookup.kind === "not_found" ? (
                <p className="text-sm text-amber-700 dark:text-amber-300">{labels.lookupNotFound}</p>
              ) : null}
              {lookup.kind === "unavailable" || lookup.kind === "timeout" ? (
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {labels.registryNoResponse}
                </p>
              ) : null}

              {lookup.kind === "results" && lookup.results.length > 1 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {labels.lookupMultiple}. {labels.selectCompany}
                  </p>
                  <ul
                    role="listbox"
                    aria-label={labels.selectCompany}
                    className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  >
                    {lookup.results.map((result) => {
                      const selected =
                        selectedResult?.registrationNumber === result.registrationNumber;
                      return (
                        <li key={result.registrationNumber}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => applyCompanyResult(result)}
                            className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition hover:bg-violet-50 dark:hover:bg-violet-950/40 ${
                              selected
                                ? "bg-violet-50 dark:bg-violet-950/50"
                                : ""
                            }`}
                          >
                            <span className="font-medium text-slate-900 dark:text-slate-50">
                              {result.legalName}
                            </span>
                            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {result.registrationNumber}
                              {result.organizationType
                                ? ` · ${result.organizationType}`
                                : ""}
                              {result.city ? ` · ${result.city}` : ""}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {selectedResult ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {labels.selectedCompany}: {selectedResult.legalName} (
                  {selectedResult.registrationNumber})
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="organizationNumber"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {registrationLabel}
              </label>
              <input
                id="organizationNumber"
                name="organizationNumber"
                value={organizationNumber}
                readOnly={orgLocked}
                onChange={(event) => {
                  setOrgTouched(true);
                  setOrganizationNumber(event.target.value);
                  setVerificationSource("operator");
                  setSelectedResult(null);
                }}
                onBlur={() => setOrgTouched(true)}
                autoComplete="off"
                disabled={!country}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:opacity-60 read-only:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50 dark:read-only:bg-slate-900/60"
              />
              {!isNorway && country ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {labels.registrationNumberHelp}
                </p>
              ) : null}
              {showOrgError ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {isNorway
                    ? labels.invalidOrganizationNumber
                    : labels.registrationNumberRequired}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="legalName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {labels.legalName}
              </label>
              <input
                id="legalName"
                name="legalName"
                value={legalName}
                onChange={(event) => {
                  setLegalTouched(true);
                  setLegalName(event.target.value);
                }}
                onBlur={() => setLegalTouched(true)}
                readOnly={legalNameLocked}
                disabled={!country}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:opacity-60 read-only:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50 dark:read-only:bg-slate-900/60"
              />
              {showLegalError ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">{labels.legalName}</p>
              ) : null}
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {labels.customerName}
              </label>
              <input
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                disabled={!country}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionPlatform}
          </h2>
          <div className="mt-4 space-y-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {labels.slug}
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              onBlur={() => setSlugTouched(true)}
              autoComplete="off"
              className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
            />
            {normalizedSlug && !showSlugError ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {labels.slugPreview}: {normalizedSlug}
              </p>
            ) : null}
            {showSlugError ? (
              <p className="text-sm text-rose-700 dark:text-rose-300">
                {normalizedSlug && isReservedCustomerSlug(normalizedSlug)
                  ? labels.reservedSlug
                  : labels.invalidSlug}
              </p>
            ) : null}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {labels.addressUnavailableNote}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionSummary}
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryItem label={labels.country} value={country || "—"} />
            <SummaryItem label={labels.customerName} value={displayName || legalName || "—"} />
            <SummaryItem label={labels.legalName} value={legalName || "—"} />
            <SummaryItem
              label={registrationLabel}
              value={normalizedOrg ?? (organizationNumber || "—")}
            />
            <SummaryItem label={labels.slug} value={normalizedSlug ?? (slug || "—")} />
          </dl>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
              <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                {labels.createsTitle}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
                {labels.createsItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {labels.createsNotTitle}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {labels.createsNotItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/platform/customers"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {labels.cancel}
          </Link>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            {isSubmitting ? labels.submitting : labels.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
        {value}
      </dd>
    </div>
  );
}
