"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AipifyHumanVerification, PublicFormHoneypot } from "@/components/ui/aipify-human-verification";
import {
  GROWTH_PARTNER_COUNTRY_OPTIONS,
  GROWTH_PARTNER_PHONE_COUNTRIES,
  dialForCountry,
  parseGrowthPartnerSignupResult,
} from "@/lib/growth-partner-signup";
import {
  AUTH_REDIRECT_PATHS,
  buildClientAuthCallbackRedirectUrl,
} from "@/lib/auth/auth-redirect-urls";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/marketing/analytics";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { GrowthPartnerFormLabels } from "./types";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

const INPUT_CLASS =
  "mt-2 w-full min-h-[48px] rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-aipify-focus";
const LABEL_CLASS = "block text-sm font-medium text-aipify-text-secondary";

type Props = {
  labels: GrowthPartnerFormLabels;
  verificationLabels: HumanVerificationLabels;
  id?: string;
};

type Step = 1 | 2 | 3;

type FieldErrors = Record<string, string>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export default function GrowthPartnerApplicationForm({ labels, verificationLabels, id = "apply" }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [country, setCountry] = useState("NO");
  const [phoneDial, setPhoneDial] = useState("+47");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/app/growth-partner");

  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  const regHelper = labels.businessRegistrationHelpers[country] ?? labels.businessRegistrationHelper;
  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  function onCountryChange(next: string) {
    setCountry(next);
    setPhoneDial(dialForCountry(next));
  }

  function clearFieldError(name: string) {
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validateStep(form: HTMLFormElement, currentStep: Step): FieldErrors {
    const data = new FormData(form);
    const errors: FieldErrors = {};

    if (currentStep === 1) {
      if (!String(data.get("full_name") ?? "").trim()) errors.full_name = labels.errorRequired;
      if (!String(data.get("email") ?? "").trim()) errors.email = labels.errorRequired;
      if (!String(data.get("phone_number") ?? "").trim()) errors.phone_number = labels.errorRequired;
      if (!country) errors.country = labels.errorRequired;
    }

    if (currentStep === 2) {
      if (!String(data.get("company_name") ?? "").trim()) errors.company_name = labels.errorRequired;
      if (!String(data.get("address") ?? "").trim()) errors.address = labels.errorRequired;
    }

    if (currentStep === 3) {
      const password = String(data.get("password") ?? "");
      const passwordConfirm = String(data.get("password_confirm") ?? "");
      if (password.length < 8 || password !== passwordConfirm) {
        errors.password = labels.errorPasswordMismatch;
      }
      if (data.get("registered_business") !== "on") errors.registered_business = labels.errorRequired;
      if (data.get("certification_understood") !== "on") errors.certification_understood = labels.errorRequired;
      if (data.get("info_accurate") !== "on") errors.info_accurate = labels.errorRequired;
      if (data.get("terms_accepted") !== "on") errors.terms_accepted = labels.errorRequired;
    }

    return errors;
  }

  function handleContinue(form: HTMLFormElement) {
    const errors = validateStep(form, step);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errors = validateStep(form, 3);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!requireVerification()) return;

    setStatus("loading");
    setError(null);

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
        options: {
          emailRedirectTo: buildClientAuthCallbackRedirectUrl(AUTH_REDIRECT_PATHS.login),
          data: { full_name: payload.full_name },
        },
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

      const raw = asRecord(json);
      const profileId = typeof raw.profile_id === "string" ? raw.profile_id : null;
      setReferenceId(profileId);
      setRedirectPath(result.redirectPath ?? "/app/growth-partner");
      setStatus("success");
      trackEvent("growth_partner_signup", { country });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : labels.errorGeneric);
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  }

  if (status === "success") {
    return (
      <div id={id} className="rounded-[20px] border border-aipify-border bg-aipify-surface p-6 shadow-lg sm:rounded-3xl sm:p-8">
        <div className="text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600"
            aria-hidden="true"
          >
            ✓
          </div>
          <h2 className="mt-5 text-xl font-bold text-aipify-text">{labels.successTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{labels.successBody}</p>
          {referenceId ? (
            <p className="mt-4 text-sm text-aipify-text-secondary">
              <span className="font-medium text-aipify-text">{labels.successReferenceLabel}:</span>{" "}
              <span className="font-mono text-xs">{referenceId}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-5">
          <h3 className="text-sm font-semibold text-aipify-text">{labels.successNextStepsTitle}</h3>
          <ol className="mt-3 space-y-2">
            {labels.successNextSteps.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                <span className="text-aipify-companion" aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 text-sm text-aipify-text-secondary">{labels.successContact}</p>

        <Link
          href={redirectPath}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-aipify-companion px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-aipify-companion-hover"
        >
          {labels.successPortalCta}
        </Link>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleContinue(e.currentTarget); }}
      className="rounded-[20px] border border-aipify-border bg-aipify-surface p-6 shadow-lg sm:rounded-3xl sm:p-8"
      noValidate
    >
      <PublicFormHoneypot />
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-aipify-text">{labels.title}</h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
          {labels.stepCounter.replace("{current}", String(step)).replace("{total}", "3")}
        </span>
      </div>

      <div className="mt-4" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-1.5 w-full rounded-full bg-aipify-surface-muted">
          <div
            className="h-1.5 rounded-full bg-aipify-companion transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-aipify-text-muted">
          <span>{labels.stepAbout}</span>
          <span>{labels.stepBusiness}</span>
          <span>{labels.stepAccount}</span>
        </div>
      </div>

      <div className={step === 1 ? "mt-6 space-y-5" : "hidden"} aria-hidden={step !== 1}>
          <div>
            <label htmlFor="gp-full-name" className={LABEL_CLASS}>{labels.fullName}</label>
            <input
              id="gp-full-name"
              name="full_name"
              required
              className={INPUT_CLASS}
              autoComplete="name"
              aria-describedby={fieldErrors.full_name ? "gp-full-name-error" : undefined}
              onChange={() => clearFieldError("full_name")}
            />
            {fieldErrors.full_name ? (
              <p id="gp-full-name-error" className="mt-1.5 text-xs text-amber-800" role="alert">{fieldErrors.full_name}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="gp-email" className={LABEL_CLASS}>{labels.email}</label>
            <input
              id="gp-email"
              name="email"
              required
              type="email"
              className={INPUT_CLASS}
              autoComplete="email"
              aria-describedby={fieldErrors.email ? "gp-email-error" : undefined}
              onChange={() => clearFieldError("email")}
            />
            {fieldErrors.email ? (
              <p id="gp-email-error" className="mt-1.5 text-xs text-amber-800" role="alert">{fieldErrors.email}</p>
            ) : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="gp-dial" className={LABEL_CLASS}>{labels.phoneCountryCode}</label>
              <select
                id="gp-dial"
                value={phoneDial}
                onChange={(e) => setPhoneDial(e.target.value)}
                className={INPUT_CLASS}
              >
                {GROWTH_PARTNER_PHONE_COUNTRIES.map((c) => (
                  <option key={c.dial} value={c.dial} className="bg-aipify-canvas">
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gp-phone" className={LABEL_CLASS}>{labels.phoneNumber}</label>
              <input
                id="gp-phone"
                name="phone_number"
                required
                type="tel"
                className={INPUT_CLASS}
                autoComplete="tel-national"
                aria-describedby={fieldErrors.phone_number ? "gp-phone-error" : undefined}
                onChange={() => clearFieldError("phone_number")}
              />
              {fieldErrors.phone_number ? (
                <p id="gp-phone-error" className="mt-1.5 text-xs text-amber-800" role="alert">{fieldErrors.phone_number}</p>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="gp-country" className={LABEL_CLASS}>{labels.country}</label>
            <select
              id="gp-country"
              name="country"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              className={INPUT_CLASS}
            >
              {GROWTH_PARTNER_COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code} className="bg-aipify-canvas">
                  {labels.countryOptions[c.code] ?? c.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gp-role" className={LABEL_CLASS}>
              {labels.professionalRole}{" "}
              <span className="font-normal text-aipify-text-muted">({labels.professionalRoleOptional})</span>
            </label>
            <input id="gp-role" name="professional_role" className={INPUT_CLASS} autoComplete="organization-title" />
          </div>
      </div>

      <div className={step === 2 ? "mt-6 space-y-5" : "hidden"} aria-hidden={step !== 2}>
          <div>
            <label htmlFor="gp-company" className={LABEL_CLASS}>{labels.companyName}</label>
            <input
              id="gp-company"
              name="company_name"
              required
              className={INPUT_CLASS}
              autoComplete="organization"
              aria-describedby={fieldErrors.company_name ? "gp-company-error" : undefined}
              onChange={() => clearFieldError("company_name")}
            />
            {fieldErrors.company_name ? (
              <p id="gp-company-error" className="mt-1.5 text-xs text-amber-800" role="alert">{fieldErrors.company_name}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="gp-reg" className={LABEL_CLASS}>{labels.businessRegistrationNumber}</label>
            <input id="gp-reg" name="business_registration_number" className={INPUT_CLASS} />
            <p className="mt-1.5 text-xs text-aipify-text-muted">{regHelper}</p>
          </div>
          <div>
            <label htmlFor="gp-address" className={LABEL_CLASS}>{labels.address}</label>
            <input
              id="gp-address"
              name="address"
              required
              className={INPUT_CLASS}
              autoComplete="street-address"
              aria-describedby={fieldErrors.address ? "gp-address-error" : undefined}
              onChange={() => clearFieldError("address")}
            />
            {fieldErrors.address ? (
              <p id="gp-address-error" className="mt-1.5 text-xs text-amber-800" role="alert">{fieldErrors.address}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="gp-website" className={LABEL_CLASS}>
              {labels.website}{" "}
              <span className="font-normal text-aipify-text-muted">({labels.websiteOptional})</span>
            </label>
            <input id="gp-website" name="website" type="url" className={INPUT_CLASS} autoComplete="url" />
          </div>
          <div>
            <label htmlFor="gp-market" className={LABEL_CLASS}>
              {labels.market}{" "}
              <span className="font-normal text-aipify-text-muted">({labels.marketOptional})</span>
            </label>
            <input id="gp-market" name="market" className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="gp-experience" className={LABEL_CLASS}>
              {labels.experience}{" "}
              <span className="font-normal text-aipify-text-muted">({labels.experienceOptional})</span>
            </label>
            <textarea id="gp-experience" name="experience" rows={3} className={INPUT_CLASS} />
          </div>
      </div>

      <div className={step === 3 ? "mt-6 space-y-5" : "hidden"} aria-hidden={step !== 3}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="gp-password" className={LABEL_CLASS}>{labels.password}</label>
              <input
                id="gp-password"
                name="password"
                required
                type="password"
                minLength={8}
                className={INPUT_CLASS}
                autoComplete="new-password"
                aria-describedby={fieldErrors.password ? "gp-password-error" : undefined}
                onChange={() => clearFieldError("password")}
              />
            </div>
            <div>
              <label htmlFor="gp-password-confirm" className={LABEL_CLASS}>{labels.passwordConfirm}</label>
              <input
                id="gp-password-confirm"
                name="password_confirm"
                required
                type="password"
                minLength={8}
                className={INPUT_CLASS}
                autoComplete="new-password"
              />
            </div>
          </div>
          {fieldErrors.password ? (
            <p id="gp-password-error" className="text-xs text-amber-800" role="alert">{fieldErrors.password}</p>
          ) : null}

          <div className="space-y-3 border-t border-aipify-border pt-5">
            <label className="flex gap-3 text-sm text-aipify-text-secondary">
              <input name="registered_business" type="checkbox" required className="mt-1 rounded border-aipify-border text-aipify-companion" />
              <span>{labels.checkboxRegisteredBusiness}</span>
            </label>
            <label className="flex gap-3 text-sm text-aipify-text-secondary">
              <input name="certification_understood" type="checkbox" required className="mt-1 rounded border-aipify-border text-aipify-companion" />
              <span>{labels.checkboxCertification}</span>
            </label>
            <label className="flex gap-3 text-sm text-aipify-text-secondary">
              <input name="info_accurate" type="checkbox" required className="mt-1 rounded border-aipify-border text-aipify-companion" />
              <span>{labels.checkboxInfoAccurate}</span>
            </label>
            <label className="flex gap-3 text-sm text-aipify-text-secondary">
              <input name="terms_accepted" type="checkbox" required className="mt-1 rounded border-aipify-border text-aipify-companion" />
              <span>
                {labels.checkboxTerms}{" "}
                <Link href="/growth-partner-terms" className="font-medium text-aipify-companion hover:underline" target="_blank">
                  {labels.termsLinkLabel}
                </Link>
              </span>
            </label>
          </div>

          <AipifyHumanVerification
            labels={verificationLabels}
            variant="light"
            compact
            onVerified={onVerified}
            onReset={onVerificationReset}
          />

          {verificationRequired ? (
            <p className="text-sm text-amber-800" role="alert">{verificationLabels.required}</p>
          ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-amber-800" role="alert">{error}</p> : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            className="rounded-xl border border-aipify-border bg-aipify-surface px-6 py-3 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
          >
            {labels.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-aipify-companion px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-aipify-companion-hover disabled:opacity-60 sm:min-w-[200px]"
        >
          {status === "loading" ? labels.submitting : step === 3 ? labels.submit : labels.continue}
        </button>
      </div>

      {step === 3 ? (
        <p className="mt-4 text-xs leading-relaxed text-aipify-text-muted">{labels.legalNote}</p>
      ) : null}
    </form>
  );
}
