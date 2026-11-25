"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AipifyHumanVerification, PublicFormHoneypot } from "@/components/ui/aipify-human-verification";
import {
  buildCspLoginUrl,
  CSP_CREATE_ACCOUNT_URL,
  classifyCspRegistrationResponse,
  resolveCspExistingStatusKey,
  type CspExistingStatusKey,
} from "@/lib/certified-sales-partner/registration-outcome";
import { buildCspPhoneDialOptions, CSP_CALLING_CODES } from "@/lib/certified-sales-partner/phone";
import {
  collectCspRegistrationErrors,
  CSP_FIELD_BY_ERROR_CODE,
} from "@/lib/certified-sales-partner/registration";
import { listIsoAlpha2Countries } from "@/lib/platform-portal/countries";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

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
  /** Accessible label of the country-code select. */
  phoneDial: string;
  /** Accessible label of the national-number input. */
  phoneNational: string;
  phoneHint: string;
  address: string;
  optional: string;
  required: string;
  confirmBusiness: string;
  confirmTerms: string;
  confirmCertification: string;
  confirmAccuracy: string;
  /** Honest note: what Platform reviews and what Core stores today. */
  companyPersistenceNote: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  backendClosedTitle: string;
  backendClosedBody: string;
  errorGeneric: string;
  errorSummaryTitle: string;
  supportRefLabel: string;
  /** Sign-in bridge: the Core application RPC needs an authenticated session. */
  loginRequiredTitle: string;
  loginRequiredBody: string;
  loginCta: string;
  createAccountCta: string;
  /** Existing application (already applied) — message per partner status. */
  existingTitle: string;
  existingBody: Record<CspExistingStatusKey, string>;
  openPortalCta: string;
  /** Validation / confirmation / guard error code → translated message. Unknown codes use `errorGeneric`. */
  errors: Record<string, string>;
};

type MessageKind = "ok" | "closed" | "error" | "login" | "existing";

type FormMessage = {
  kind: MessageKind;
  text: string;
  title?: string;
  /** Field-level messages repeated in the summary. */
  items?: string[];
  supportRef?: string;
  links?: Array<{ href: string; label: string; primary: boolean }>;
};

type Props = {
  labels: CspRegistrationFormLabels;
  verificationLabels: HumanVerificationLabels;
  locale: string;
};

const FIELD_IDS: Record<string, string> = {
  fullName: "csp-full-name",
  email: "csp-email",
  phone: "csp-phone-national",
  country: "csp-country",
  legalBusinessName: "csp-legal-name",
  businessRegistrationNumber: "csp-registration-number",
  registeredBusinessConfirmed: "csp-confirm-business",
  termsAccepted: "csp-confirm-terms",
  certificationUnderstood: "csp-confirm-certification",
  infoAccurateConfirmed: "csp-confirm-accuracy",
};

/** DOM order — used to focus the first invalid field. */
const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "country",
  "legalBusinessName",
  "businessRegistrationNumber",
  "registeredBusinessConfirmed",
  "termsAccepted",
  "certificationUnderstood",
  "infoAccurateConfirmed",
];

const FIELD_BY_INPUT_NAME: Record<string, string> = {
  full_name: "fullName",
  email: "email",
  phone_national: "phone",
  phone_dial_country: "phone",
  country: "country",
  legal_business_name: "legalBusinessName",
  business_registration_number: "businessRegistrationNumber",
  registered_business_confirmed: "registeredBusinessConfirmed",
  terms_accepted: "termsAccepted",
  certification_understood: "certificationUnderstood",
  info_accurate_confirmed: "infoAccurateConfirmed",
};

const COLOR_ERROR = "#B42318";
const COLOR_ERROR_SOFT = "#FEF3F2";
const COLOR_SUCCESS = "#027A48";
const COLOR_SUCCESS_SOFT = "#ECFDF3";
const COLOR_WARNING = "#B54708";
const COLOR_WARNING_SOFT = "#FFFAEB";
const COLOR_PURPLE = "#7C3AED";
const COLOR_PURPLE_DEEP = "#5B21B6";

const inputBase =
  "mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-aipify-text focus:outline-none focus:ring-2 focus:ring-aipify-focus";
const inputOk = "border-aipify-border";
// Literal class names so Tailwind can generate them (values mirror COLOR_ERROR / COLOR_ERROR_SOFT).
const inputBad = "border-[#B42318] bg-[#FEF3F2]";

export function CertifiedSalesPartnerRegistrationForm({ labels, verificationLabels, locale }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState("");
  const [dialCountry, setDialCountry] = useState("");
  const [dialTouched, setDialTouched] = useState(false);
  const [verificationKey, setVerificationKey] = useState(0);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  const countries = useMemo(() => listIsoAlpha2Countries(locale || "en"), [locale]);
  const dialOptions = useMemo(() => buildCspPhoneDialOptions(locale || "en"), [locale]);

  useEffect(() => {
    if (message) messageRef.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, [message]);

  function messageFor(code: string): string {
    return labels.errors[code] ?? labels.errorGeneric;
  }

  function focusField(field: string) {
    const id = FIELD_IDS[field];
    if (id) document.getElementById(id)?.focus();
  }

  function clearFieldError(field: string | undefined) {
    if (!field) return;
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function onCountryChange(next: string) {
    setCountry(next);
    // Keep the dial code in step with the business country unless the user chose another one.
    // National digits are uncontrolled and are never touched here.
    if (!dialTouched && CSP_CALLING_CODES[next]) setDialCountry(next);
    clearFieldError("country");
  }

  function resetVerification() {
    onVerificationReset();
    setVerificationKey((key) => key + 1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // React nulls `currentTarget` once the handler yields — keep the form element for the async tail.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const verified = requireVerification();

    const dial = CSP_CALLING_CODES[dialCountry] ?? "";
    const checks = {
      fullName: text("full_name"),
      email: text("email"),
      country: text("country"),
      legalBusinessName: text("legal_business_name"),
      businessRegistrationNumber: text("business_registration_number"),
      phoneDial: dial,
      phoneNational: text("phone_national"),
      registeredBusinessConfirmed: form.get("registered_business_confirmed") === "on",
      termsAccepted: form.get("terms_accepted") === "on",
      certificationUnderstood: form.get("certification_understood") === "on",
      infoAccurateConfirmed: form.get("info_accurate_confirmed") === "on",
    };

    // Same rules as the server — field-level feedback before anything is sent.
    const problems = collectCspRegistrationErrors(checks);
    if (problems.length > 0) {
      const byField = Object.fromEntries(problems.map((p) => [p.field, p.error]));
      setFieldErrors(byField);
      setMessage({
        kind: "error",
        title: labels.errorSummaryTitle,
        text: "",
        items: problems.map((p) => messageFor(p.error)),
      });
      const first = FIELD_ORDER.find((f) => f in byField);
      if (first) focusField(first);
      return;
    }
    setFieldErrors({});

    if (!verified) {
      setMessage({ kind: "error", text: labels.errors.verification_required ?? labels.errorGeneric });
      document.getElementById("csp-verification")?.focus();
      return;
    }

    setPending(true);
    setMessage(null);

    const payload = {
      full_name: checks.fullName,
      country: checks.country,
      legal_business_name: checks.legalBusinessName,
      business_registration_number: checks.businessRegistrationNumber,
      phone_dial: checks.phoneNational ? dial : "",
      phone_national: checks.phoneNational,
      address: text("address"),
      registered_business_confirmed: checks.registeredBusinessConfirmed,
      terms_accepted: checks.termsAccepted,
      certification_understood: checks.certificationUnderstood,
      info_accurate_confirmed: checks.infoAccurateConfirmed,
      _honeypot: String(form.get("_honeypot") ?? ""),
    };

    try {
      const response = await fetch("/api/certified-sales-partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guardFields(checks.email, payload)),
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
        case "error": {
          const known = labels.errors[outcome.code];
          const field = CSP_FIELD_BY_ERROR_CODE[outcome.code];
          if (field) {
            setFieldErrors({ [field]: outcome.code });
            focusField(field);
          }
          // An expired or missing security check needs a fresh challenge.
          if (outcome.code === "verification_required") resetVerification();
          setMessage({
            kind: "error",
            text: known ?? labels.errorGeneric,
            supportRef: outcome.supportRef,
          });
          return;
        }
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
          setCountry("");
          setDialCountry("");
          setDialTouched(false);
          resetVerification();
          return;
      }
    } catch {
      setMessage({ kind: "error", text: labels.errorGeneric });
    } finally {
      setPending(false);
    }
  }

  const errorOf = (field: string): string | undefined =>
    fieldErrors[field] ? messageFor(fieldErrors[field]!) : undefined;

  return (
    <section className="w-full rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
      <form
        className="relative mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={onSubmit}
        onChange={(event) => {
          const name = (event.target as unknown as HTMLInputElement).name;
          clearFieldError(FIELD_BY_INPUT_NAME[name]);
        }}
        noValidate
      >
        <PublicFormHoneypot />
        <p className="sm:col-span-2 text-sm font-semibold text-aipify-text">{labels.sectionContact}</p>
        <Field
          id={FIELD_IDS.fullName!}
          name="full_name"
          label={labels.fullName}
          requiredMark={labels.required}
          required
          autoComplete="name"
          error={errorOf("fullName")}
          className="sm:col-span-1"
        />
        <Field
          id={FIELD_IDS.email!}
          name="email"
          label={labels.email}
          type="email"
          requiredMark={labels.required}
          required
          autoComplete="email"
          error={errorOf("email")}
          className="sm:col-span-1"
        />

        <div
          role="group"
          aria-labelledby="csp-phone-legend"
          className="block text-sm text-aipify-text sm:col-span-1"
        >
          <span id="csp-phone-legend" className="font-medium">
            {labels.phone} <span className="text-aipify-text-muted">({labels.optional})</span>
          </span>
          <div className="flex gap-2">
            <div className="w-[9.5rem] shrink-0">
              <label htmlFor="csp-phone-dial" className="sr-only">
                {labels.phoneDial}
              </label>
              <select
                id="csp-phone-dial"
                name="phone_dial_country"
                value={dialCountry}
                onChange={(event) => {
                  setDialCountry(event.target.value);
                  setDialTouched(true);
                }}
                aria-invalid={errorOf("phone") ? true : undefined}
                className={`${inputBase} ${errorOf("phone") ? inputBad : inputOk}`}
              >
                <option value="">{labels.phoneDial}</option>
                {dialOptions.map((option) => (
                  <option key={option.country} value={option.country}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor={FIELD_IDS.phone} className="sr-only">
                {labels.phoneNational}
              </label>
              <input
                id={FIELD_IDS.phone}
                name="phone_national"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                aria-invalid={errorOf("phone") ? true : undefined}
                aria-describedby={errorOf("phone") ? "csp-phone-error csp-phone-hint" : "csp-phone-hint"}
                className={`${inputBase} ${errorOf("phone") ? inputBad : inputOk}`}
              />
            </div>
          </div>
          <span id="csp-phone-hint" className="mt-1 block text-xs text-aipify-text-muted">
            {labels.phoneHint}
          </span>
          <FieldError id="csp-phone-error" message={errorOf("phone")} />
        </div>

        <div className="block text-sm text-aipify-text sm:col-span-1">
          <label htmlFor={FIELD_IDS.country} className="font-medium">
            {labels.country} <span className="text-aipify-text-muted">({labels.required})</span>
          </label>
          <select
            id={FIELD_IDS.country}
            name="country"
            required
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            autoComplete="country"
            aria-invalid={errorOf("country") ? true : undefined}
            aria-describedby={
              errorOf("country") ? "csp-country-error csp-country-hint" : "csp-country-hint"
            }
            className={`${inputBase} ${errorOf("country") ? inputBad : inputOk}`}
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
          <span id="csp-country-hint" className="mt-1 block text-xs text-aipify-text-muted">
            {labels.countryHint}
          </span>
          <FieldError id="csp-country-error" message={errorOf("country")} />
        </div>

        <p className="sm:col-span-2 mt-2 text-sm font-semibold text-aipify-text">{labels.sectionCompany}</p>
        <Field
          id={FIELD_IDS.legalBusinessName!}
          name="legal_business_name"
          label={labels.legalBusinessName}
          requiredMark={labels.required}
          required
          autoComplete="organization"
          error={errorOf("legalBusinessName")}
          className="sm:col-span-1"
        />
        <Field
          id={FIELD_IDS.businessRegistrationNumber!}
          name="business_registration_number"
          label={labels.businessRegistrationNumber}
          requiredMark={labels.required}
          required
          error={errorOf("businessRegistrationNumber")}
          className="sm:col-span-1"
        />
        <Field
          id="csp-address"
          name="address"
          label={labels.address}
          optionalMark={labels.optional}
          autoComplete="street-address"
          className="sm:col-span-2"
        />
        <p
          className="flex items-start gap-2 rounded-xl border border-aipify-border bg-aipify-canvas px-3 py-2.5 text-xs leading-relaxed text-aipify-text-secondary sm:col-span-2"
          data-testid="csp-company-persistence-note"
        >
          <InfoIcon />
          <span>{labels.companyPersistenceNote}</span>
        </p>

        <p className="sm:col-span-2 mt-2 text-sm font-semibold text-aipify-text">{labels.sectionTerms}</p>
        <div className="space-y-3 sm:col-span-2">
          <Checkbox
            id={FIELD_IDS.registeredBusinessConfirmed!}
            name="registered_business_confirmed"
            label={labels.confirmBusiness}
            error={errorOf("registeredBusinessConfirmed")}
          />
          <Checkbox
            id={FIELD_IDS.termsAccepted!}
            name="terms_accepted"
            label={labels.confirmTerms}
            error={errorOf("termsAccepted")}
          />
          <Checkbox
            id={FIELD_IDS.certificationUnderstood!}
            name="certification_understood"
            label={labels.confirmCertification}
            error={errorOf("certificationUnderstood")}
          />
          <Checkbox
            id={FIELD_IDS.infoAccurateConfirmed!}
            name="info_accurate_confirmed"
            label={labels.confirmAccuracy}
            error={errorOf("infoAccurateConfirmed")}
          />
        </div>

        <div id="csp-verification" tabIndex={-1} className="sm:col-span-2 focus:outline-none">
          <AipifyHumanVerification
            key={verificationKey}
            labels={verificationLabels}
            variant="light"
            compact
            onVerified={onVerified}
            onReset={onVerificationReset}
          />
          {verificationRequired ? (
            <p
              className="mt-2 flex items-start gap-2 text-sm font-medium"
              style={{ color: COLOR_ERROR }}
              role="alert"
            >
              <AlertIcon />
              <span>{verificationLabels.required}</span>
            </p>
          ) : null}
        </div>

        {message ? (
          <div className="sm:col-span-2" ref={messageRef}>
            <MessageBox message={message} supportRefLabel={labels.supportRefLabel} />
          </div>
        ) : null}

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
    </section>
  );
}

function MessageBox({ message, supportRefLabel }: { message: FormMessage; supportRefLabel: string }) {
  const tone = {
    ok: { border: COLOR_SUCCESS, bg: COLOR_SUCCESS_SOFT, title: COLOR_SUCCESS, icon: <CheckIcon />, role: "status" },
    error: { border: COLOR_ERROR, bg: COLOR_ERROR_SOFT, title: COLOR_ERROR, icon: <AlertIcon />, role: "alert" },
    closed: { border: COLOR_WARNING, bg: COLOR_WARNING_SOFT, title: COLOR_WARNING, icon: <InfoIcon />, role: "status" },
    login: { border: COLOR_PURPLE, bg: "#FFFFFF", title: COLOR_PURPLE_DEEP, icon: <InfoIcon />, role: "status" },
    existing: { border: COLOR_PURPLE, bg: "#FFFFFF", title: COLOR_PURPLE_DEEP, icon: <InfoIcon />, role: "status" },
  }[message.kind];

  return (
    <div
      className="rounded-xl border-2 p-4 text-sm"
      style={{ borderColor: tone.border, backgroundColor: tone.bg }}
      role={tone.role}
      data-kind={message.kind}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0" style={{ color: tone.title }}>
          {tone.icon}
        </span>
        <div className="min-w-0">
          {message.title ? (
            <p className="font-semibold" style={{ color: tone.title }}>
              {message.title}
            </p>
          ) : null}
          {message.text ? (
            <p className={`${message.title ? "mt-1 " : ""}text-aipify-text`}>{message.text}</p>
          ) : null}
          {message.items?.length ? (
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-aipify-text">
              {message.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {message.supportRef ? (
            <p className="mt-2 text-xs text-aipify-text-secondary">
              {supportRefLabel}: <span className="font-mono font-semibold">{message.supportRef}</span>
            </p>
          ) : null}
          {message.links?.length ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {message.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.primary
                      ? "inline-flex items-center justify-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white"
                      : "inline-flex items-center justify-center rounded-xl border-2 border-[#7C3AED] bg-white px-4 py-2 text-sm font-semibold text-[#5B21B6]"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-xs font-medium" style={{ color: COLOR_ERROR }}>
      <AlertIcon small />
      <span>{message}</span>
    </p>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  requiredMark,
  optionalMark,
  autoComplete,
  error,
  className = "",
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  requiredMark?: string;
  optionalMark?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={`block text-sm text-aipify-text ${className}`}>
      <label htmlFor={id} className="font-medium">
        {label}
        {required && requiredMark ? <span className="text-aipify-text-muted"> ({requiredMark})</span> : null}
        {!required && optionalMark ? <span className="text-aipify-text-muted"> ({optionalMark})</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputBase} ${error ? inputBad : inputOk}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function Checkbox({ id, name, label, error }: { id: string; name: string; label: string; error?: string }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className="flex items-start gap-2 text-sm text-aipify-text-secondary">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="mt-1"
          required
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          style={error ? { outline: `2px solid ${COLOR_ERROR}`, outlineOffset: 2 } : undefined}
        />
        <span>{label}</span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function IconBase({ children, small }: { children: ReactNode; small?: boolean }) {
  const size = small ? 14 : 18;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="mt-px shrink-0"
    >
      {children}
    </svg>
  );
}

function AlertIcon({ small }: { small?: boolean }) {
  return (
    <IconBase small={small}>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v5M10 14h.01" />
    </IconBase>
  );
}

function CheckIcon() {
  return (
    <IconBase>
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" />
    </IconBase>
  );
}

function InfoIcon() {
  return (
    <IconBase>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6h.01" />
    </IconBase>
  );
}
