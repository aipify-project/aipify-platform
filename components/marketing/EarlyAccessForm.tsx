"use client";

import { FormEvent, useState } from "react";
import { AipifyHumanVerification, PublicFormHoneypot } from "@/components/ui/aipify-human-verification";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { trackEvent } from "@/lib/marketing/analytics";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

type EarlyAccessLabels = {
  title: string;
  subtitle: string;
  name: string;
  company: string;
  email: string;
  companySize: string;
  industry: string;
  interest: string;
  message: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  privacy: string;
  companySizes: Record<string, string>;
  interests: Record<string, string>;
};

type EarlyAccessFormProps = {
  labels: EarlyAccessLabels;
  verificationLabels: HumanVerificationLabels;
  variant?: "light" | "dark";
};

export default function EarlyAccessForm({ labels, verificationLabels, variant = "dark" }: EarlyAccessFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requireVerification()) return;

    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    try {
      const res = await fetch("/api/marketing/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guardFields(email, {
            name: data.get("name"),
            company: data.get("company"),
            email,
            company_size: data.get("company_size"),
            industry: data.get("industry"),
            interest_area: data.get("interest_area"),
            message: data.get("message"),
            _honeypot: data.get("_honeypot"),
          }),
        ),
      });

      if (!res.ok) throw new Error("submit failed");

      trackEvent("early_access_submit", { interest: String(data.get("interest_area") ?? "") });
      setStatus("success");
      form.reset();
      onVerificationReset();
    } catch {
      setStatus("error");
    }
  }

  const isLight = variant === "light";
  const labelClass = isLight ? "block text-sm font-medium text-aipify-text" : "block text-sm font-medium text-aipify-text-secondary";
  const inputClass = isLight
    ? `mt-1.5 w-full ${AipifyShellClasses.input} px-4 py-3 text-sm`
    : "mt-1.5 w-full rounded-xl border border-aipify-border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-aipify-text-muted focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50";
  const optionClass = isLight ? "" : "bg-[#111827]";
  const alertClass = isLight ? "text-sm text-amber-800" : "text-sm text-amber-300";
  const errorClass = isLight ? "text-sm text-red-700" : "text-sm text-red-400";
  const successClass = isLight
    ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
    : "rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-8 text-center";
  const submitClass = isLight
    ? `w-full ${AipifyShellClasses.primaryButton} px-6 py-3.5 text-sm sm:w-auto`
    : "w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 sm:w-auto";

  if (status === "success") {
    return (
      <div className={successClass}>
        <p className="text-lg font-semibold text-aipify-text">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <PublicFormHoneypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ea-name" className={labelClass}>
            {labels.name}
          </label>
          <input id="ea-name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="ea-company" className={labelClass}>
            {labels.company}
          </label>
          <input id="ea-company" name="company" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="ea-email" className={labelClass}>
          {labels.email}
        </label>
        <input id="ea-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ea-size" className={labelClass}>
            {labels.companySize}
          </label>
          <select id="ea-size" name="company_size" required className={inputClass}>
            {Object.entries(labels.companySizes).map(([value, label]) => (
              <option key={value} value={value} className={optionClass}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ea-industry" className={labelClass}>
            {labels.industry}
          </label>
          <input id="ea-industry" name="industry" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="ea-interest" className={labelClass}>
          {labels.interest}
        </label>
        <select id="ea-interest" name="interest_area" required className={inputClass}>
          {Object.entries(labels.interests).map(([value, label]) => (
            <option key={value} value={value} className={optionClass}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ea-message" className={labelClass}>
          {labels.message}
        </label>
        <textarea id="ea-message" name="message" rows={4} className={inputClass} />
      </div>

      <AipifyHumanVerification
        labels={verificationLabels}
        variant={variant}
        onVerified={onVerified}
        onReset={onVerificationReset}
      />

      {verificationRequired ? (
        <p className={alertClass} role="alert">
          {verificationLabels.required}
        </p>
      ) : null}

      {status === "error" && (
        <p className={errorClass} role="alert">
          {labels.error}
        </p>
      )}

      <p className="text-xs text-aipify-text-muted">{labels.privacy}</p>

      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
