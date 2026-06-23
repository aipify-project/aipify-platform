"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  COUNTRY_OPTIONS,
  EMPLOYEE_RANGES,
  EMPTY_REGISTRATION_DRAFT,
  INDUSTRIES,
  PACKAGE_PLANS,
  PRIMARY_USE_CASES,
  REGISTRATION_STORAGE_KEY,
  WORKSPACE_LANGUAGES,
  formatPhoneWithCountryCode,
  getPasswordStrength,
  isBusinessEmail,
  isValidPhone,
  type PackagePlan,
  type RegistrationDraft,
  type WorkspaceLanguage,
  type WorkspaceRegistrationPayload,
} from "@/lib/auth/registration";
import { SmartBillingRoutingPanel } from "@/components/shared/billing-experience";
import type { BillingExperienceLabels } from "@/lib/billing-experience";
import type { PaymentProviderLabels } from "@/lib/payment-providers";
import {
  AUTH_REDIRECT_PATHS,
  buildClientAuthCallbackRedirectUrl,
} from "@/lib/auth/auth-redirect-urls";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 5;

type RegistrationWizardLabels = {
  progress: string;
  back: string;
  continue: string;
  createWorkspace: string;
  hasAccount: string;
  signIn: string;
  checkEmail: string;
  completionTitle: string;
  completionMessage: string;
  steps: {
    owner: { title: string; subtitle: string };
    organization: { title: string; subtitle: string };
    package: { title: string; subtitle: string };
    needs: { title: string; subtitle: string };
    confirmation: { title: string; subtitle: string };
  };
  fields: Record<string, string>;
  placeholders: Record<string, string>;
  passwordStrength: Record<string, string>;
  packages: Record<PackagePlan, { name: string; description: string }>;
  languages: Record<WorkspaceLanguage, string>;
  confirmation: {
    selectedPackage: string;
    organization: string;
    trialStatus: string;
    trialActive: string;
    nextStep: string;
    nextStepDetail: string;
    securityNote: string;
  };
  security: {
    infoTitle: string;
    infoBody: string;
    skipForNow: string;
    enableAfterWorkspace: string;
    enableNote: string;
  };
  terms: {
    acceptTerms: string;
    acceptAuthority: string;
    productUpdates: string;
    termsLink: string;
    privacyLink: string;
  };
  industries: Record<string, string>;
  useCases: Record<string, string>;
  errors: Record<string, string>;
  providerLabels?: PaymentProviderLabels;
  billingExperience: BillingExperienceLabels;
};

type RegistrationWizardProps = {
  labels: RegistrationWizardLabels;
};

function loadDraft(): RegistrationDraft {
  if (typeof window === "undefined") return EMPTY_REGISTRATION_DRAFT;
  try {
    const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (!raw) return EMPTY_REGISTRATION_DRAFT;
    return { ...EMPTY_REGISTRATION_DRAFT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_REGISTRATION_DRAFT;
  }
}

function saveDraft(draft: RegistrationDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(draft));
}

function clearDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REGISTRATION_STORAGE_KEY);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100";

const labelClass = "block text-sm font-medium text-gray-700";

const ADDRESS_PENDING = "Pending — complete in workspace settings";

export default function RegistrationWizard({ labels }: RegistrationWizardProps) {
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY_REGISTRATION_DRAFT);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/app/install?onboarding=welcome");

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const updateDraft = useCallback((patch: Partial<RegistrationDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }, []);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthPercent = useMemo(() => {
    const map = { weak: 25, fair: 50, good: 75, strong: 100 };
    return map[passwordStrength];
  }, [passwordStrength]);

  const progressLabel = labels.progress
    .replace("{current}", String(draft.step))
    .replace("{total}", String(TOTAL_STEPS));

  const selectedPackageLabel = draft.package.selectedPlan
    ? labels.packages[draft.package.selectedPlan as PackagePlan]?.name ?? draft.package.selectedPlan
    : "";

  async function ensureAccountCreated(): Promise<boolean> {
    if (draft.accountCreated) return true;

    const supabase = createClient();
    const emailRedirectTo = buildClientAuthCallbackRedirectUrl(AUTH_REDIRECT_PATHS.login);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: draft.owner.businessEmail.trim(),
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: draft.owner.fullName.trim(),
        },
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("rate limit")) {
        setError(labels.errors.rateLimit);
      } else if (msg.includes("already registered") || msg.includes("already exists")) {
        setError(labels.errors.emailAlreadyRegistered);
      } else {
        setError(signUpError.message);
      }
      return false;
    }

    if (data.user?.identities?.length === 0) {
      setError(labels.errors.emailAlreadyRegistered);
      return false;
    }

    if (data.user && !data.session) {
      setSuccess(labels.checkEmail);
      return false;
    }

    updateDraft({ accountCreated: true });
    return true;
  }

  function validateStep(step: number): string | null {
    switch (step) {
      case 1: {
        if (!draft.owner.fullName.trim()) return labels.errors.requiredFields;
        if (!draft.owner.businessEmail.trim()) return labels.errors.requiredFields;
        if (!isBusinessEmail(draft.owner.businessEmail)) return labels.errors.businessEmailInvalid;
        if (!isValidPhone(draft.owner.phone)) return labels.errors.phoneInvalid;
        if (!draft.owner.country) return labels.errors.requiredFields;
        if (!password || !confirmPassword) return labels.errors.requiredFields;
        if (password.length < 8) return labels.errors.passwordTooShort;
        if (password !== confirmPassword) return labels.errors.passwordMismatch;
        return null;
      }
      case 2: {
        const org = draft.organization;
        const profile = draft.profile;
        if (!org.companyName.trim()) return labels.errors.requiredFields;
        if (!profile.industry || !profile.employeeRange) return labels.errors.requiredFields;
        if (!org.primaryLanguage) return labels.errors.requiredFields;
        return null;
      }
      case 3: {
        if (!draft.package.billingPath) return labels.errors.billingPathRequired;
        if (!draft.package.selectedPlan) return labels.errors.packageRequired;
        return null;
      }
      case 4: {
        if (draft.profile.primaryUseCases.length === 0) return labels.errors.useCasesRequired;
        return null;
      }
      case 5: {
        if (!draft.confirmation.termsAccepted || !draft.confirmation.authorityAccepted) {
          return labels.errors.termsRequired;
        }
        return null;
      }
      default:
        return null;
    }
  }

  async function handleContinue() {
    setError(null);
    setSuccess(null);

    const validationError = validateStep(draft.step);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (draft.step === 1) {
      setLoading(true);
      const ok = await ensureAccountCreated();
      setLoading(false);
      if (!ok) return;
    }

    if (draft.step < TOTAL_STEPS) {
      updateDraft({ step: draft.step + 1 });
      return;
    }

    await submitWorkspace();
  }

  async function submitWorkspace() {
    setLoading(true);
    setError(null);

    try {
      const orgCountry = draft.organization.country || draft.owner.country;
      const payload: WorkspaceRegistrationPayload = {
        owner_full_name: draft.owner.fullName.trim(),
        business_email: draft.owner.businessEmail.trim().toLowerCase(),
        owner_phone: formatPhoneWithCountryCode(draft.owner.phoneDialCode, draft.owner.phone),
        owner_country: draft.owner.country,
        company_name: draft.organization.companyName.trim(),
        organization_number: draft.organization.organizationNumber.trim(),
        business_address: draft.organization.businessAddress.trim() || ADDRESS_PENDING,
        postal_code: draft.organization.postalCode.trim() || "0000",
        city: draft.organization.city.trim() || "Pending",
        organization_country: orgCountry,
        website: draft.organization.website.trim(),
        logo_url: draft.organization.logoUrl.trim(),
        industry: draft.profile.industry,
        employee_range: draft.profile.employeeRange,
        primary_use_cases: draft.profile.primaryUseCases,
        organization_type: draft.profile.organizationType || "company",
        product_updates_opt_in: draft.confirmation.productUpdatesOptIn,
        registration_2fa_skipped: draft.security.twoFactorChoice === "skip",
        registration_2fa_enabled: draft.security.twoFactorChoice === "enable_later",
        terms_accepted: draft.confirmation.termsAccepted,
        authority_accepted: draft.confirmation.authorityAccepted,
        workspace_metadata: {
          billing_path: draft.package.billingPath,
        },
      };

      const res = await fetch("/api/auth/register-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; redirect_path?: string };

      if (!res.ok) {
        const code = data.error ?? "generic";
        setError(labels.errors[code] ?? labels.errors.generic);
        return;
      }

      clearDraft();
      setRedirectPath(data.redirect_path ?? "/app/install?onboarding=welcome");
      setCompleted(true);
    } catch {
      setError(labels.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setError(null);
    if (draft.step > 1) updateDraft({ step: draft.step - 1 });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void handleContinue();
  }

  function toggleSecondaryLanguage(lang: WorkspaceLanguage) {
    const current = draft.organization.secondaryLanguages;
    const next = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang].filter((l) => l !== draft.organization.primaryLanguage);
    updateDraft({ organization: { ...draft.organization, secondaryLanguages: next } });
  }

  useEffect(() => {
    if (!completed) return;
    const timer = window.setTimeout(() => {
      window.location.href = redirectPath;
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [completed, redirectPath]);

  if (completed) {
    return (
      <div className="space-y-4 text-center" role="status">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{labels.completionTitle}</h2>
        <p className="text-sm text-gray-600">{labels.completionMessage}</p>
      </div>
    );
  }

  const stepMeta = [
    labels.steps.owner,
    labels.steps.organization,
    labels.steps.package,
    labels.steps.needs,
    labels.steps.confirmation,
  ][draft.step - 1];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>{progressLabel}</span>
          <span>{Math.round((draft.step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300"
            style={{ width: `${(draft.step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">{stepMeta.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{stepMeta.subtitle}</p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {draft.step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className={labelClass}>{labels.fields.fullName}</label>
            <input id="fullName" type="text" autoComplete="name" value={draft.owner.fullName}
              onChange={(e) => updateDraft({ owner: { ...draft.owner, fullName: e.target.value } })}
              className={inputClass} required />
          </div>
          <div>
            <label htmlFor="businessEmail" className={labelClass}>{labels.fields.businessEmail}</label>
            <input id="businessEmail" type="email" autoComplete="email" value={draft.owner.businessEmail}
              onChange={(e) => updateDraft({ owner: { ...draft.owner, businessEmail: e.target.value } })}
              className={inputClass} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="phoneDial" className={labelClass}>{labels.fields.phoneCountry}</label>
              <select id="phoneDial" value={draft.owner.phoneDialCode}
                onChange={(e) => {
                  const dial = e.target.value;
                  const country = COUNTRY_OPTIONS.find((c) => c.dial === dial)?.code ?? draft.owner.country;
                  updateDraft({ owner: { ...draft.owner, phoneDialCode: dial, country } });
                }}
                className={inputClass}>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.dial}>{c.dial} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className={labelClass}>{labels.fields.phone}</label>
              <input id="phone" type="tel" autoComplete="tel" value={draft.owner.phone}
                onChange={(e) => updateDraft({ owner: { ...draft.owner, phone: e.target.value } })}
                className={inputClass} required />
            </div>
          </div>
          <div>
            <label htmlFor="ownerCountry" className={labelClass}>{labels.fields.country}</label>
            <select id="ownerCountry" value={draft.owner.country}
              onChange={(e) => updateDraft({ owner: { ...draft.owner, country: e.target.value } })}
              className={inputClass}>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>{labels.fields.password}</label>
            <input id="password" type="password" autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
            {password && (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${strengthPercent}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{labels.passwordStrength[passwordStrength]}</p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>{labels.fields.confirmPassword}</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
          </div>
        </div>
      )}

      {draft.step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className={labelClass}>{labels.fields.companyName}</label>
            <input id="companyName" type="text" autoComplete="organization" value={draft.organization.companyName}
              onChange={(e) => updateDraft({ organization: { ...draft.organization, companyName: e.target.value } })}
              className={inputClass} required />
          </div>
          <div>
            <label htmlFor="organizationNumber" className={labelClass}>{labels.fields.organizationNumber}</label>
            <input id="organizationNumber" type="text" value={draft.organization.organizationNumber}
              onChange={(e) => updateDraft({ organization: { ...draft.organization, organizationNumber: e.target.value } })}
              className={inputClass} placeholder={labels.placeholders.organizationNumber} />
          </div>
          <div>
            <label htmlFor="industry" className={labelClass}>{labels.fields.industry}</label>
            <select id="industry" value={draft.profile.industry}
              onChange={(e) => updateDraft({ profile: { ...draft.profile, industry: e.target.value as RegistrationDraft["profile"]["industry"] } })}
              className={inputClass} required>
              <option value="">{labels.placeholders.select}</option>
              {INDUSTRIES.map((key) => (
                <option key={key} value={key}>{labels.industries[key]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="employeeRange" className={labelClass}>{labels.fields.employeeRange}</label>
            <select id="employeeRange" value={draft.profile.employeeRange}
              onChange={(e) => updateDraft({ profile: { ...draft.profile, employeeRange: e.target.value as RegistrationDraft["profile"]["employeeRange"] } })}
              className={inputClass} required>
              <option value="">{labels.placeholders.select}</option>
              {EMPLOYEE_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="website" className={labelClass}>{labels.fields.website}</label>
            <input id="website" type="url" value={draft.organization.website}
              onChange={(e) => updateDraft({ organization: { ...draft.organization, website: e.target.value } })}
              className={inputClass} placeholder={labels.placeholders.website} />
          </div>
          <div>
            <label htmlFor="primaryLanguage" className={labelClass}>{labels.fields.primaryLanguage}</label>
            <select id="primaryLanguage" value={draft.organization.primaryLanguage}
              onChange={(e) => {
                const primaryLanguage = e.target.value as WorkspaceLanguage;
                updateDraft({
                  organization: {
                    ...draft.organization,
                    primaryLanguage,
                    secondaryLanguages: draft.organization.secondaryLanguages.filter((l) => l !== primaryLanguage),
                  },
                });
              }}
              className={inputClass} required>
              {WORKSPACE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{labels.languages[lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelClass}>{labels.fields.secondaryLanguages}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {WORKSPACE_LANGUAGES.filter((lang) => lang !== draft.organization.primaryLanguage).map((lang) => {
                const checked = draft.organization.secondaryLanguages.includes(lang);
                return (
                  <label key={lang} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
                    <input type="checkbox" checked={checked}
                      onChange={() => toggleSecondaryLanguage(lang)}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    {labels.languages[lang]}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {draft.step === 3 && (
        <div className="space-y-6">
          <SmartBillingRoutingPanel
            labels={labels.billingExperience}
            providerLabels={labels.providerLabels}
            value={draft.package.billingPath}
            onChange={(billingPath) =>
              updateDraft({ package: { ...draft.package, billingPath } })
            }
            enterpriseActionHref="/app/settings/billing/invoice-details"
          />
          <div>
            <p className={labelClass}>{labels.steps.package.subtitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PACKAGE_PLANS.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => updateDraft({ package: { ...draft.package, selectedPlan: plan } })}
                  className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
                    draft.package.selectedPlan === plan
                      ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{labels.packages[plan].name}</span>
                  <p className="mt-1 text-xs text-gray-500">{labels.packages[plan].description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {draft.step === 4 && (
        <div className="space-y-4">
          <span className={labelClass}>{labels.fields.primaryUseCases}</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {PRIMARY_USE_CASES.map((useCase) => {
              const checked = draft.profile.primaryUseCases.includes(useCase);
              return (
                <label key={useCase} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
                  <input type="checkbox" checked={checked}
                    onChange={() => {
                      const next = checked
                        ? draft.profile.primaryUseCases.filter((u) => u !== useCase)
                        : [...draft.profile.primaryUseCases, useCase];
                      updateDraft({ profile: { ...draft.profile, primaryUseCases: next } });
                    }}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  {labels.useCases[useCase]}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {draft.step === 5 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">{labels.confirmation.selectedPackage}</span>
              <span className="font-medium text-gray-900">{selectedPackageLabel}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">{labels.confirmation.organization}</span>
              <span className="font-medium text-gray-900">{draft.organization.companyName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">{labels.confirmation.trialStatus}</span>
              <span className="font-medium text-emerald-700">{labels.confirmation.trialActive}</span>
            </div>
            <div>
              <p className="text-gray-500">{labels.confirmation.nextStep}</p>
              <p className="mt-1 font-medium text-gray-900">{labels.confirmation.nextStepDetail}</p>
            </div>
            <p className="border-t border-gray-200 pt-3 text-xs text-gray-600">{labels.confirmation.securityNote}</p>
          </div>

          <div className="rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-4">
            <h3 className="text-sm font-semibold text-violet-900">{labels.security.infoTitle}</h3>
            <p className="mt-2 text-sm text-violet-800/90">{labels.security.infoBody}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button"
              onClick={() => updateDraft({ security: { twoFactorChoice: "skip" } })}
              className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
                draft.security.twoFactorChoice === "skip"
                  ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}>
              <span className="font-semibold text-gray-900">{labels.security.skipForNow}</span>
            </button>
            <button type="button"
              onClick={() => updateDraft({ security: { twoFactorChoice: "enable_later" } })}
              className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
                draft.security.twoFactorChoice === "enable_later"
                  ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}>
              <span className="font-semibold text-gray-900">{labels.security.enableAfterWorkspace}</span>
              <p className="mt-1 text-xs text-gray-500">{labels.security.enableNote}</p>
            </button>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={draft.confirmation.termsAccepted}
              onChange={(e) => updateDraft({ confirmation: { ...draft.confirmation, termsAccepted: e.target.checked } })}
              className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" required />
            <span>
              {labels.terms.acceptTerms}{" "}
              <Link href="/terms" className="font-semibold text-violet-600 hover:text-violet-700" target="_blank">
                {labels.terms.termsLink}
              </Link>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={draft.confirmation.authorityAccepted}
              onChange={(e) => updateDraft({ confirmation: { ...draft.confirmation, authorityAccepted: e.target.checked } })}
              className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" required />
            <span>{labels.terms.acceptAuthority}</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={draft.confirmation.productUpdatesOptIn}
              onChange={(e) => updateDraft({ confirmation: { ...draft.confirmation, productUpdatesOptIn: e.target.checked } })}
              className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
            <span>{labels.terms.productUpdates}</span>
          </label>
          <p className="text-xs text-gray-500">
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700" target="_blank">
              {labels.terms.privacyLink}
            </Link>
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {draft.step > 1 ? (
          <button type="button" onClick={handleBack} disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
            {labels.back}
          </button>
        ) : (
          <div />
        )}
        <button type="submit" disabled={loading || Boolean(success)}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
          {draft.step === TOTAL_STEPS ? labels.createWorkspace : labels.continue}
        </button>
      </div>

      <p className="text-center text-sm text-gray-600">
        {labels.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
          {labels.signIn}
        </Link>
      </p>
    </form>
  );
}
