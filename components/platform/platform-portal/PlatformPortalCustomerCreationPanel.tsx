"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { PlatformPortalCustomerCreationLabels } from "@/lib/platform-portal";
import {
  isReservedCustomerSlug,
  normalizeCustomerSlug,
  normalizeOrganizationNumber,
  suggestCustomerSlug,
  type PlatformPortalCustomerCreationErrorCode,
} from "@/lib/platform-portal/create-customer";

type Props = {
  labels: PlatformPortalCustomerCreationLabels;
};

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; legalName: string; organizationNumber: string }
  | { kind: "not_found" }
  | { kind: "unavailable" }
  | { kind: "invalid" };

type FormErrorCode =
  | PlatformPortalCustomerCreationErrorCode
  | "lookup_invalid"
  | null;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: FormErrorCode };

function errorMessage(
  labels: PlatformPortalCustomerCreationLabels,
  code: FormErrorCode,
): string {
  switch (code) {
    case "invalid_organization_number":
    case "lookup_invalid":
      return labels.invalidOrganizationNumber;
    case "duplicate_organization_number":
      return labels.duplicateOrganizationNumber;
    case "invalid_slug":
      return labels.invalidSlug;
    case "duplicate_slug":
      return labels.duplicateSlug;
    case "reserved_slug":
      return labels.reservedSlug;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    default:
      return labels.error;
  }
}

export function PlatformPortalCustomerCreationPanel({ labels }: Props) {
  const router = useRouter();
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [country, setCountry] = useState("NO");
  const [legalNameLocked, setLegalNameLocked] = useState(false);
  const [lookup, setLookup] = useState<LookupState>({ kind: "idle" });
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [localError, setLocalError] = useState<FormErrorCode>(null);

  useEffect(() => {
    if (slugTouched) return;
    const suggested = suggestCustomerSlug(displayName || legalName);
    setSlug(suggested === "customer" ? "" : suggested);
  }, [displayName, legalName, slugTouched]);

  const normalizedOrg = useMemo(
    () => normalizeOrganizationNumber(organizationNumber),
    [organizationNumber],
  );
  const normalizedSlug = useMemo(() => normalizeCustomerSlug(slug), [slug]);

  const slugStatus = useMemo(() => {
    if (!slug.trim()) return "empty" as const;
    if (!normalizedSlug) return "invalid" as const;
    if (isReservedCustomerSlug(normalizedSlug)) return "reserved" as const;
    return "ok" as const;
  }, [slug, normalizedSlug]);

  async function runLookup() {
    setLocalError(null);
    if (!normalizedOrg) {
      setLookup({ kind: "invalid" });
      setLocalError("invalid_organization_number");
      return;
    }

    setLookup({ kind: "loading" });
    try {
      const response = await fetch("/api/platform-portal/customers/company-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ organizationNumber: normalizedOrg }),
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
        legalName?: string | null;
        organizationNumber?: string | null;
      };

      if (data.status === "valid" && data.legalName) {
        setLookup({
          kind: "success",
          legalName: data.legalName,
          organizationNumber: data.organizationNumber ?? normalizedOrg,
        });
        setLegalName(data.legalName);
        setLegalNameLocked(true);
        if (!displayName.trim()) {
          setDisplayName(data.legalName);
        }
        return;
      }

      if (data.status === "invalid") {
        setLookup({ kind: "not_found" });
        setLegalNameLocked(false);
        return;
      }

      setLookup({ kind: "unavailable" });
      setLegalNameLocked(false);
    } catch {
      setLookup({ kind: "unavailable" });
      setLegalNameLocked(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submit.kind === "submitting" || submit.kind === "success") return;

    setLocalError(null);

    if (!normalizedOrg) {
      setLocalError("invalid_organization_number");
      return;
    }
    if (!legalName.trim()) {
      setLocalError("invalid_legal_name");
      return;
    }
    if (!normalizedSlug) {
      setLocalError("invalid_slug");
      return;
    }
    if (isReservedCustomerSlug(normalizedSlug)) {
      setLocalError("reserved_slug");
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
          displayName: (displayName.trim() || legalName.trim()),
          slug: normalizedSlug,
          country,
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
        error?: string;
      } | null;

      if (!response.ok) {
        setSubmit({
          kind: "error",
          code: payload?.code ?? "unknown",
        });
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
    submit.kind === "error"
      ? errorMessage(labels, submit.code)
      : localError
        ? errorMessage(labels, localError)
        : null;

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

      <form onSubmit={(event) => void onSubmit(event)} className="w-full space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionIdentity}
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label
                htmlFor="organizationNumber"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {labels.organizationNumber}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="organizationNumber"
                  name="organizationNumber"
                  value={organizationNumber}
                  onChange={(event) => {
                    setOrganizationNumber(event.target.value);
                    setLookup({ kind: "idle" });
                    setLegalNameLocked(false);
                  }}
                  inputMode="numeric"
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
              {lookup.kind === "success" ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{labels.lookupSuccess}</p>
              ) : null}
              {lookup.kind === "not_found" ? (
                <p className="text-sm text-amber-700 dark:text-amber-300">{labels.lookupNotFound}</p>
              ) : null}
              {lookup.kind === "unavailable" ? (
                <p className="text-sm text-amber-700 dark:text-amber-300">{labels.lookupUnavailable}</p>
              ) : null}
              {lookup.kind === "invalid" ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {labels.invalidOrganizationNumber}
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
                onChange={(event) => setLegalName(event.target.value)}
                readOnly={legalNameLocked}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 read-only:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50 dark:read-only:bg-slate-900/60"
              />
            </div>

            <div className="space-y-2">
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionPlatform}
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
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
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
              />
              {slugStatus === "ok" && normalizedSlug ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {labels.slugPreview}: {normalizedSlug}
                </p>
              ) : null}
              {slugStatus === "invalid" ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">{labels.invalidSlug}</p>
              ) : null}
              {slugStatus === "reserved" ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">{labels.reservedSlug}</p>
              ) : null}
            </div>

            <div className="space-y-2">
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
                onChange={(event) => setCountry(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-violet-900/50"
              >
                <option value="NO">NO</option>
                <option value="SE">SE</option>
                <option value="DK">DK</option>
                <option value="FI">FI</option>
                <option value="PL">PL</option>
                <option value="UA">UA</option>
                <option value="GB">GB</option>
                <option value="US">US</option>
              </select>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {labels.addressUnavailableNote}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {labels.sectionSummary}
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryItem label={labels.customerName} value={displayName || legalName || "—"} />
            <SummaryItem label={labels.legalName} value={legalName || "—"} />
            <SummaryItem
              label={labels.organizationNumber}
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
            disabled={isSubmitting || submit.kind === "success"}
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
