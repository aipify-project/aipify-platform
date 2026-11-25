"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  buildCspLoginUrl,
  CSP_CREATE_ACCOUNT_URL,
  classifyCspRegistrationResponse,
  resolveCspExistingStatusKey,
  type CspExistingStatusKey,
} from "@/lib/certified-sales-partner/registration-outcome";
import { listIsoAlpha2Countries } from "@/lib/platform-portal/countries";

export type CspRegistrationFormLabels = {
  title: string;
  sectionContact: string;
  sectionCompany: string;
  sectionTerms: string;
  fullName: string;
  email: string;
  country: string;
  countryPlaceholder: string;
  countryHint: string;
  legalBusinessName: string;
  businessRegistrationNumber: string;
  phone: string;
  address: string;
  optional: string;
  required: string;
  confirmBusiness: string;
  confirmTerms: string;
  confirmCertification: string;
  confirmAccuracy: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  backendClosedTitle: string;
  backendClosedBody: string;
  errorGeneric: string;
  /** Sign-in bridge: the Core application RPC needs an authenticated session. */
  loginRequiredTitle: string;
  loginRequiredBody: string;
  loginCta: string;
  createAccountCta: string;
  /** Existing application (already applied) — message per partner status. */
  existingTitle: string;
  existingBody: Record<CspExistingStatusKey, string>;
  openPortalCta: string;
  /** Validation / confirmation error code → translated message. Unknown codes use `errorGeneric`. */
  errors: Record<string, string>;
};

type FormMessage = {
  kind: "ok" | "closed" | "error" | "login" | "existing";
  text: string;
  title?: string;
  links?: Array<{ href: string; label: string; primary: boolean }>;
};

type Props = {
  labels: CspRegistrationFormLabels;
  locale: string;
};

export function CertifiedSalesPartnerRegistrationForm({ labels, locale }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const countries = useMemo(() => listIsoAlpha2Countries(locale || "en"), [locale]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // React nulls `currentTarget` once the handler yields — keep the form element for the async tail.
    const formElement = event.currentTarget;
    setPending(true);
    setMessage(null);
    const form = new FormData(formElement);
    const payload = {
      full_name: String(form.get("full_name") ?? ""),
      email: String(form.get("email") ?? ""),
      country: String(form.get("country") ?? ""),
      legal_business_name: String(form.get("legal_business_name") ?? ""),
      business_registration_number: String(form.get("business_registration_number") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      registered_business_confirmed: form.get("registered_business_confirmed") === "on",
      terms_accepted: form.get("terms_accepted") === "on",
      certification_understood: form.get("certification_understood") === "on",
      info_accurate_confirmed: form.get("info_accurate_confirmed") === "on",
      _honeypot: String(form.get("_honeypot") ?? ""),
      _form_started_at: String(form.get("_form_started_at") ?? ""),
    };

    try {
      const response = await fetch("/api/certified-sales-partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as unknown;
      const outcome = classifyCspRegistrationResponse(response.status, data);
      switch (outcome.kind) {
        case "backend_closed":
          setMessage({ kind: "closed", title: labels.backendClosedTitle, text: labels.backendClosedBody });
          return;
        case "login_required":
          // Calm guidance only — nothing was stored, so no success is claimed.
          setMessage({
            kind: "login",
            title: labels.loginRequiredTitle,
            text: labels.loginRequiredBody,
            links: [
              { href: outcome.loginUrl || buildCspLoginUrl(), label: labels.loginCta, primary: true },
              { href: CSP_CREATE_ACCOUNT_URL, label: labels.createAccountCta, primary: false },
            ],
          });
          return;
        case "invalid":
        case "error":
          setMessage({ kind: "error", text: labels.errors[outcome.code] ?? labels.errorGeneric });
          return;
        case "existing": {
          const key = resolveCspExistingStatusKey(outcome.partnerStatus);
          setMessage({
            kind: "existing",
            title: labels.existingTitle,
            text: labels.existingBody[key] ?? labels.existingBody.other,
            links: key === "approved" ? [{ href: "/partners", label: labels.openPortalCta, primary: true }] : undefined,
          });
          return;
        }
        case "created":
          setMessage({ kind: "ok", title: labels.successTitle, text: labels.successBody });
          formElement.reset();
          return;
      }
    } catch {
      setMessage({ kind: "error", text: labels.errorGeneric });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="w-full rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
        <input type="hidden" name="_form_started_at" value={String(Date.now() - 3000)} />
        <div className="hidden" aria-hidden="true">
          <label>
            Company website
            <input name="_honeypot" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="sm:col-span-2 text-sm font-semibold text-aipify-text">{labels.sectionContact}</p>
        <Field name="full_name" label={labels.fullName} requiredMark={labels.required} required className="sm:col-span-1" />
        <Field name="email" label={labels.email} type="email" requiredMark={labels.required} required className="sm:col-span-1" />
        <Field
          name="phone"
          label={labels.phone}
          optionalMark={labels.optional}
          className="sm:col-span-1"
        />
        <label className="block text-sm text-aipify-text sm:col-span-1">
          <span className="font-medium">
            {labels.country} <span className="text-aipify-text-muted">({labels.required})</span>
          </span>
          <select
            name="country"
            required
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-aipify-border bg-white px-3 py-2.5 text-aipify-text"
          >
            <option value="" disabled>
              {labels.countryPlaceholder}
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-aipify-text-muted">{labels.countryHint}</span>
        </label>
        <p className="sm:col-span-2 mt-2 text-sm font-semibold text-aipify-text">{labels.sectionCompany}</p>
        <Field
          name="legal_business_name"
          label={labels.legalBusinessName}
          requiredMark={labels.required}
          required
          className="sm:col-span-1"
        />
        <Field
          name="business_registration_number"
          label={labels.businessRegistrationNumber}
          requiredMark={labels.required}
          required
          className="sm:col-span-1"
        />
        <Field
          name="address"
          label={labels.address}
          optionalMark={labels.optional}
          className="sm:col-span-2"
        />
        <p className="sm:col-span-2 mt-2 text-sm font-semibold text-aipify-text">{labels.sectionTerms}</p>
        <div className="space-y-3 sm:col-span-2">
          <Checkbox name="registered_business_confirmed" label={labels.confirmBusiness} />
          <Checkbox name="terms_accepted" label={labels.confirmTerms} />
          <Checkbox name="certification_understood" label={labels.confirmCertification} />
          <Checkbox name="info_accurate_confirmed" label={labels.confirmAccuracy} />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
          >
            {pending ? labels.submitting : labels.submit}
          </button>
        </div>
      </form>
      {message ? (
        <div
          className="mt-4 rounded-xl border border-aipify-border bg-aipify-canvas p-4 text-sm"
          role={message.kind === "error" ? "alert" : "status"}
        >
          {message.title ? <p className="font-semibold text-aipify-text">{message.title}</p> : null}
          <p className="mt-1 text-aipify-text-secondary">{message.text}</p>
          {message.links?.length ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {message.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.primary
                      ? "inline-flex items-center justify-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white"
                      : "inline-flex items-center justify-center rounded-xl border border-aipify-border px-4 py-2 text-sm font-semibold text-aipify-text"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  requiredMark,
  optionalMark,
  placeholder,
  maxLength,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  requiredMark?: string;
  optionalMark?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`block text-sm text-aipify-text ${className}`}>
      <span className="font-medium">
        {label}
        {required && requiredMark ? (
          <span className="text-aipify-text-muted"> ({requiredMark})</span>
        ) : null}
        {!required && optionalMark ? (
          <span className="text-aipify-text-muted"> ({optionalMark})</span>
        ) : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 w-full rounded-xl border border-aipify-border bg-white px-3 py-2.5 text-aipify-text"
      />
    </label>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-aipify-text-secondary">
      <input name={name} type="checkbox" className="mt-1" required />
      <span>{label}</span>
    </label>
  );
}
