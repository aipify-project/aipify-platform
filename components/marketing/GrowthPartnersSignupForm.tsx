"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AipifyHumanVerification, PublicFormHoneypot } from "@/components/ui/aipify-human-verification";
import {
  GROWTH_PARTNER_COUNTRY_OPTIONS,
  GROWTH_PARTNER_PHONE_COUNTRIES,
  businessRegistrationHelper,
  dialForCountry,
  parseGrowthPartnerSignupResult,
} from "@/lib/growth-partner-signup";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/marketing/analytics";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

export type GrowthPartnersSignupLabels = {
  title: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
  companyName: string;
  businessRegistrationNumber: string;
  businessRegistrationHelper: string;
  country: string;
  address: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  checkboxRegisteredBusiness: string;
  checkboxCertification: string;
  checkboxInfoAccurate: string;
  checkboxTerms: string;
  termsLinkLabel: string;
  submit: string;
  submitting: string;
  errorGeneric: string;
  errorPasswordMismatch: string;
  legalNote: string;
};

type Props = {
  labels: GrowthPartnersSignupLabels;
  verificationLabels: HumanVerificationLabels;
  id?: string;
};

const lightInputClass =
  "mt-2 w-full rounded-xl border border-aipify-border bg-aipify-surface-muted px-4 py-3 text-sm text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-accent focus:bg-aipify-surface focus:outline-none focus:ring-2 focus:ring-aipify-focus";
const lightLabelClass = "block text-sm font-medium text-aipify-text-secondary";

export default function GrowthPartnersSignupForm({ labels, verificationLabels, id = "signup-form" }: Props) {
  const router = useRouter();
  const [country, setCountry] = useState("NO");
  const [phoneDial, setPhoneDial] = useState("+47");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  const regHelper = useMemo(() => businessRegistrationHelper(country), [country]);

  function onCountryChange(next: string) {
    setCountry(next);
    setPhoneDial(dialForCountry(next));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requireVerification()) return;

    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const passwordConfirm = String(data.get("password_confirm") ?? "");
    const email = String(data.get("email") ?? "").trim().toLowerCase();

    if (password.length < 8 || password !== passwordConfirm) {
      setStatus("error");
      setError(labels.errorPasswordMismatch);
      return;
    }

    const payload = {
      full_name: String(data.get("full_name") ?? "").trim(),
      company_name: String(data.get("company_name") ?? "").trim(),
      business_registration_number: String(data.get("business_registration_number") ?? "").trim(),
      country,
      address: String(data.get("address") ?? "").trim(),
      phone_country_code: phoneDial,
      phone_number: String(data.get("phone_number") ?? "").trim(),
      email,
      registered_business_confirmed: data.get("registered_business") === "on",
      certification_understood: data.get("certification_understood") === "on",
      info_accurate_confirmed: data.get("info_accurate") === "on",
      terms_accepted: data.get("terms_accepted") === "on",
    };

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: payload.full_name } },
      });
      if (signUpError) throw signUpError;

      const res = await fetch("/api/marketing/growth-partner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guardFields(email, {
            ...payload,
            _honeypot: data.get("_honeypot"),
          }),
        ),
      });
      const json = await res.json();
      const result = parseGrowthPartnerSignupResult(json);
      if (!res.ok || !result.ok) throw new Error(result.error ?? labels.errorGeneric);

      trackEvent("growth_partner_signup", { country });
      router.push(result.redirectPath ?? "/app/growth-partner");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : labels.errorGeneric);
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="relative space-y-5 rounded-2xl border border-aipify-border bg-white/[0.03] p-6 sm:p-8">
      <PublicFormHoneypot />
      <h2 className="sr-only">{labels.title}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="gp-full-name" className={lightLabelClass}>{labels.fullName}</label>
          <input id="gp-full-name" name="full_name" required className={lightInputClass} autoComplete="name" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gp-company" className={lightLabelClass}>{labels.companyName}</label>
          <input id="gp-company" name="company_name" required className={lightInputClass} autoComplete="organization" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gp-reg" className={lightLabelClass}>{labels.businessRegistrationNumber}</label>
          <input id="gp-reg" name="business_registration_number" className={lightInputClass} />
          <p className="mt-1.5 text-xs text-aipify-text-muted">{regHelper}</p>
        </div>
        <div>
          <label htmlFor="gp-country" className={lightLabelClass}>{labels.country}</label>
          <select id="gp-country" name="country" value={country} onChange={(e) => onCountryChange(e.target.value)} className={lightInputClass}>
            {GROWTH_PARTNER_COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code} className="bg-aipify-canvas">{c.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gp-address" className={lightLabelClass}>{labels.address}</label>
          <input id="gp-address" name="address" required className={lightInputClass} autoComplete="street-address" />
        </div>
        <div>
          <label htmlFor="gp-dial" className={lightLabelClass}>{labels.phoneCountryCode}</label>
          <select id="gp-dial" value={phoneDial} onChange={(e) => setPhoneDial(e.target.value)} className={lightInputClass}>
            {GROWTH_PARTNER_PHONE_COUNTRIES.map((c) => (
              <option key={c.dial} value={c.dial} className="bg-aipify-canvas">{c.flag} {c.dial}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gp-phone" className={lightLabelClass}>{labels.phoneNumber}</label>
          <input id="gp-phone" name="phone_number" required type="tel" className={lightInputClass} autoComplete="tel-national" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gp-email" className={lightLabelClass}>{labels.email}</label>
          <input id="gp-email" name="email" required type="email" className={lightInputClass} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="gp-password" className={lightLabelClass}>{labels.password}</label>
          <input id="gp-password" name="password" required type="password" minLength={8} className={lightInputClass} autoComplete="new-password" />
        </div>
        <div>
          <label htmlFor="gp-password-confirm" className={lightLabelClass}>{labels.passwordConfirm}</label>
          <input id="gp-password-confirm" name="password_confirm" required type="password" minLength={8} className={lightInputClass} autoComplete="new-password" />
        </div>
      </div>

      <div className="space-y-3 border-t border-aipify-border pt-5">
        <label className="flex gap-3 text-sm text-aipify-text-secondary">
          <input name="registered_business" type="checkbox" required className="mt-1 rounded border-white/20" />
          <span>{labels.checkboxRegisteredBusiness}</span>
        </label>
        <label className="flex gap-3 text-sm text-aipify-text-secondary">
          <input name="certification_understood" type="checkbox" required className="mt-1 rounded border-white/20" />
          <span>{labels.checkboxCertification}</span>
        </label>
        <label className="flex gap-3 text-sm text-aipify-text-secondary">
          <input name="info_accurate" type="checkbox" required className="mt-1 rounded border-white/20" />
          <span>{labels.checkboxInfoAccurate}</span>
        </label>
        <label className="flex gap-3 text-sm text-aipify-text-secondary">
          <input name="terms_accepted" type="checkbox" required className="mt-1 rounded border-white/20" />
          <span>
            {labels.checkboxTerms}{" "}
            <Link href="/growth-partner-terms" className="text-cyan-400 hover:underline" target="_blank">
              {labels.termsLinkLabel}
            </Link>
          </span>
        </label>
      </div>

      {error ? <p className="text-sm text-amber-300">{error}</p> : null}

      <AipifyHumanVerification
        labels={verificationLabels}
        variant="light"
        onVerified={onVerified}
        onReset={onVerificationReset}
      />

      {verificationRequired ? (
        <p className="text-sm text-amber-300" role="alert">
          {verificationLabels.required}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/20 transition hover:from-cyan-400 hover:to-violet-500 disabled:opacity-60"
      >
        {status === "loading" ? labels.submitting : labels.submit}
      </button>

      <p className="text-xs leading-relaxed text-aipify-text-muted">{labels.legalNote}</p>
    </form>
  );
}
