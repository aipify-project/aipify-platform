"use client";

import { useState, type FormEvent } from "react";

export type CspRegistrationFormLabels = {
  title: string;
  fullName: string;
  email: string;
  country: string;
  legalBusinessName: string;
  businessRegistrationNumber: string;
  phone: string;
  address: string;
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
};

export function CertifiedSalesPartnerRegistrationForm({ labels }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string; title?: string } | null>(
    null,
  );

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
    <section className="mt-16 max-w-2xl rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <input type="hidden" name="_form_started_at" value={String(Date.now() - 3000)} />
        <div className="hidden" aria-hidden="true">
          <label>
            Company website
            <input name="_honeypot" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Field name="full_name" label={labels.fullName} required />
        <Field name="email" label={labels.email} type="email" required />
        <Field name="country" label={labels.country} placeholder="NO" required maxLength={2} />
        <Field name="legal_business_name" label={labels.legalBusinessName} required />
        <Field name="business_registration_number" label={labels.businessRegistrationNumber} required />
        <Field name="phone" label={labels.phone} />
        <Field name="address" label={labels.address} />
        <Checkbox name="registered_business_confirmed" label={labels.confirmBusiness} />
        <Checkbox name="terms_accepted" label={labels.confirmTerms} />
        <Checkbox name="certification_understood" label={labels.confirmCertification} />
        <Checkbox name="info_accurate_confirmed" label={labels.confirmAccuracy} />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? labels.submitting : labels.submit}
        </button>
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
  placeholder,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block text-sm text-aipify-text">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 w-full rounded-xl border border-aipify-border bg-white px-3 py-2 text-aipify-text"
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
