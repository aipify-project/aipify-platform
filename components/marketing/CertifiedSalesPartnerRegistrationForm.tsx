"use client";

import { useMemo, useState, type FormEvent } from "react";
import { listIsoAlpha2Countries } from "@/lib/platform-portal/countries";

export type CspRegistrationFormLabels = {
  title: string;
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
};

type Props = {
  labels: CspRegistrationFormLabels;
  locale: string;
};

export function CertifiedSalesPartnerRegistrationForm({ labels, locale }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string; title?: string } | null>(
    null,
  );
  const countries = useMemo(() => listIsoAlpha2Countries(locale || "en"), [locale]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
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
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
        message?: string;
      };
      if (response.status === 503 || data.backend_ready === false) {
        setMessage({
          kind: "closed",
          title: labels.backendClosedTitle,
          text: labels.backendClosedBody,
        });
        return;
      }
      if (!response.ok) {
        setMessage({ kind: "error", text: data.error ?? labels.errorGeneric });
        return;
      }
      setMessage({ kind: "ok", title: labels.successTitle, text: labels.successBody });
      event.currentTarget.reset();
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
        <Field name="full_name" label={labels.fullName} requiredMark={labels.required} required className="sm:col-span-1" />
        <Field name="email" label={labels.email} type="email" requiredMark={labels.required} required className="sm:col-span-1" />
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
        <Field
          name="phone"
          label={labels.phone}
          optionalMark={labels.optional}
          className="sm:col-span-1"
        />
        <Field
          name="legal_business_name"
          label={labels.legalBusinessName}
          requiredMark={labels.required}
          required
          className="sm:col-span-2"
        />
        <Field
          name="business_registration_number"
          label={labels.businessRegistrationNumber}
          requiredMark={labels.required}
          required
          className="sm:col-span-2"
        />
        <Field
          name="address"
          label={labels.address}
          optionalMark={labels.optional}
          className="sm:col-span-2"
        />
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
          role="status"
        >
          {message.title ? <p className="font-semibold text-aipify-text">{message.title}</p> : null}
          <p className="mt-1 text-aipify-text-secondary">{message.text}</p>
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
