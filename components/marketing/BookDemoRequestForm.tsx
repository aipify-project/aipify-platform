"use client";

import { FormEvent, useState } from "react";
import { AipifyHumanVerification, PublicFormHoneypot } from "@/components/ui/aipify-human-verification";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { trackEvent } from "@/lib/marketing/analytics";
import {
  BOOK_DEMO_CHALLENGES,
  BOOK_DEMO_COMPANY_SIZES,
  BOOK_DEMO_INDUSTRIES,
  BOOK_DEMO_MEETING_TYPES,
  parseBookDemoSubmission,
} from "@/lib/book-demo-discovery-center";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

export type BookDemoFormLabels = {
  title: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  businessEmail: string;
  phone: string;
  country: string;
  companySize: string;
  industry: string;
  currentChallenge: string;
  additionalNotes: string;
  meetingTypeTitle: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  error: string;
  companySizes: Record<string, string>;
  industries: Record<string, string>;
  challenges: Record<string, string>;
  meetingTypes: Record<string, string>;
  integrationsNote: string;
};

type Props = {
  labels: BookDemoFormLabels;
  verificationLabels: HumanVerificationLabels;
  variant?: "light" | "dark";
};

export default function BookDemoRequestForm({ labels, verificationLabels, variant = "light" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [confirmation, setConfirmation] = useState("");
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
    const businessEmail = String(data.get("business_email") ?? "").trim();

    try {
      const res = await fetch("/api/marketing/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guardFields(businessEmail, {
            first_name: data.get("first_name"),
            last_name: data.get("last_name"),
            company_name: data.get("company_name"),
            job_title: data.get("job_title"),
            business_email: businessEmail,
            phone: data.get("phone"),
            country: data.get("country"),
            company_size: data.get("company_size"),
            industry: data.get("industry"),
            current_challenge: data.get("current_challenge"),
            additional_notes: data.get("additional_notes"),
            meeting_type: data.get("meeting_type"),
            _honeypot: data.get("_honeypot"),
          }),
        ),
      });

      const result = parseBookDemoSubmission(await res.json());
      if (!res.ok || !result.ok) throw new Error(result.error ?? "submit failed");

      trackEvent("book_demo_submit", { industry: String(data.get("industry") ?? "") });
      setConfirmation(result.confirmationNote ?? labels.successBody);
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
    : "mt-1.5 w-full rounded-xl border border-aipify-border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-aipify-text-muted focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30";
  const titleClass = isLight ? "text-xl font-semibold text-aipify-text" : "text-xl font-semibold text-white";
  const fieldsetClass = isLight
    ? "rounded-xl border border-aipify-border bg-aipify-surface-muted/60 p-5"
    : "rounded-xl border border-aipify-border bg-white/[0.02] p-5";
  const legendClass = isLight ? "px-1 text-sm font-semibold text-aipify-text" : "px-1 text-sm font-semibold text-white";
  const radioLabelClass = isLight
    ? "flex cursor-pointer items-center gap-3 rounded-lg border border-aipify-border px-4 py-3 text-sm text-aipify-text-secondary hover:bg-aipify-surface-muted"
    : "flex cursor-pointer items-center gap-3 rounded-lg border border-aipify-border px-4 py-3 text-sm text-aipify-text-secondary hover:bg-white/5";
  const alertClass = isLight ? "text-sm text-amber-800" : "text-sm text-amber-300";
  const errorClass = isLight ? "text-sm text-red-700" : "text-sm text-red-300";
  const successClass = isLight
    ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
    : "rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center";
  const submitClass = isLight
    ? `w-full ${AipifyShellClasses.primaryButton} px-8 py-4 text-base sm:w-auto`
    : "w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 disabled:opacity-60 sm:w-auto";

  if (status === "success") {
    return (
      <div className={successClass}>
        <p className="text-lg font-semibold text-aipify-text">{labels.successTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{confirmation}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <PublicFormHoneypot />
      <h3 className={titleClass}>{labels.title}</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bd-first" className={labelClass}>
            {labels.firstName}
          </label>
          <input id="bd-first" name="first_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-last" className={labelClass}>
            {labels.lastName}
          </label>
          <input id="bd-last" name="last_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-company" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.companyName}
          </label>
          <input id="bd-company" name="company_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-title" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.jobTitle}
          </label>
          <input id="bd-title" name="job_title" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-email" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.businessEmail}
          </label>
          <input id="bd-email" name="business_email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-phone" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.phone}
          </label>
          <input id="bd-phone" name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-country" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.country}
          </label>
          <input id="bd-country" name="country" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bd-size" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.companySize}
          </label>
          <select id="bd-size" name="company_size" required className={inputClass}>
            <option value="">—</option>
            {BOOK_DEMO_COMPANY_SIZES.map((key) => (
              <option key={key} value={key}>
                {labels.companySizes[key] ?? key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bd-industry" className="block text-sm font-medium text-aipify-text-secondary">
            {labels.industry}
          </label>
          <select id="bd-industry" name="industry" required className={inputClass}>
            <option value="">—</option>
            {BOOK_DEMO_INDUSTRIES.map((key) => (
              <option key={key} value={key}>
                {labels.industries[key] ?? key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bd-challenge" className={labelClass}>
            {labels.currentChallenge}
          </label>
          <select id="bd-challenge" name="current_challenge" required className={inputClass}>
            <option value="">—</option>
            {BOOK_DEMO_CHALLENGES.map((key) => (
              <option key={key} value={key}>
                {labels.challenges[key] ?? key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="bd-notes" className={labelClass}>
          {labels.additionalNotes}
        </label>
        <textarea id="bd-notes" name="additional_notes" rows={4} className={inputClass} />
      </div>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>{labels.meetingTypeTitle}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {BOOK_DEMO_MEETING_TYPES.map((key) => (
            <label key={key} className={radioLabelClass}>
              <input
                type="radio"
                name="meeting_type"
                value={key}
                defaultChecked={key === "no_preference"}
                className="text-cyan-500"
              />
              {labels.meetingTypes[key] ?? key}
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs text-aipify-text-muted">{labels.integrationsNote}</p>
      </fieldset>

      <AipifyHumanVerification
        labels={verificationLabels}
        variant={isLight ? "light" : "dark"}
        onVerified={onVerified}
        onReset={onVerificationReset}
      />

      {verificationRequired ? (
        <p className={`text-sm ${isLight ? "text-amber-800" : "text-amber-300"}`} role="alert">
          {verificationLabels.required}
        </p>
      ) : null}

      {status === "error" ? <p className={`text-sm ${isLight ? "text-red-700" : "text-red-300"}`}>{labels.error}</p> : null}

      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
