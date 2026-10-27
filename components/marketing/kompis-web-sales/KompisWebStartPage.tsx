"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import {
  isPublicFooterEnabledLocale,
  publicFooterLocaleOptions,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";
import { AUTH_REDIRECT_PATHS, buildClientAuthCallbackRedirectUrl } from "@/lib/auth/auth-redirect-urls";
import { createClient } from "@/lib/supabase/client";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import "./kompis-web-sales.css";

const BRAND_MARK = "/brand/aipify-kompis-avatar.png";

type Step = "collect" | "account" | "success";

type Props = {
  labels: KompisWebSalesLabels;
  locale: PublicFooterEnabledLocale;
  appName: string;
};

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function KompisWebStartPage({ labels, locale, appName }: Props) {
  const search = useSearchParams();
  const localeOptions = publicFooterLocaleOptions();
  const start = labels.start;

  const [step, setStep] = useState<Step>("collect");
  const [email, setEmail] = useState(() => search.get("email") ?? "");
  const [website, setWebsite] = useState(() => search.get("website") ?? "");
  const [company, setCompany] = useState(() => search.get("company") ?? "");
  const [language, setLanguage] = useState(() => {
    const fromQuery = search.get("language");
    if (fromQuery && isPublicFooterEnabledLocale(fromQuery)) return fromQuery;
    return locale;
  });
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const successBody = useMemo(
    () => start.successBody.replace("{email}", email.trim() || "…"),
    [email, start.successBody],
  );

  function onCollect(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !website.trim() || !company.trim() || !language) {
      setError(start.errorRequired);
      return;
    }
    if (!looksLikeEmail(email)) {
      setError(start.errorEmail);
      return;
    }
    setStep("account");
  }

  async function onAccount(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!fullName.trim() || !password || !confirmPassword) {
      setError(start.errorRequired);
      return;
    }
    if (password.length < 8) {
      setError(start.errorPasswordShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(start.errorPasswordMismatch);
      return;
    }
    if (!termsAccepted) {
      setError(start.errorTerms);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const emailRedirectTo = buildClientAuthCallbackRedirectUrl(AUTH_REDIRECT_PATHS.login);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName.trim(),
            company_name: company.trim(),
            website: website.trim(),
            preferred_language: language,
            product_intent: "kompis_web",
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes("rate limit")) setError(start.errorRateLimit);
        else if (msg.includes("already registered") || msg.includes("already exists")) {
          setError(start.errorExists);
        } else setError(signUpError.message || start.errorGeneric);
        return;
      }

      if (data.user?.identities?.length === 0) {
        setError(start.errorExists);
        return;
      }

      setStep("success");
    } catch {
      setError(start.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={BRAND_MARK} alt="" width={40} height={40} priority />
            <span>{appName}</span>
          </Link>
          <div className="kompis-web-sales-nav-actions">
            <Link href={labels.hrefs.login} className="kompis-web-sales-secondary">
              {labels.nav.login}
            </Link>
          </div>
        </div>
      </header>

      <main className="kompis-web-sales-shell" style={{ paddingBlock: "48px", maxWidth: 560 }}>
        <p className="kompis-web-sales-eyebrow">{labels.hero.eyebrow}</p>
        <Link href={labels.hrefs.home} className="kompis-web-sales-cta-quiet" style={{ display: "inline-flex", marginBottom: 18 }}>
          {start.backHome}
        </Link>

        {step === "collect" ? (
          <form className="kompis-web-sales-panel kompis-web-sales-signup" onSubmit={onCollect} noValidate>
            <h1 style={{ fontSize: "1.55rem", margin: "0 0 8px" }}>{start.collectTitle}</h1>
            <p className="kompis-web-sales-hint" style={{ marginTop: 0 }}>
              {start.collectSubtitle}
            </p>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-email">{labels.signupCard.emailLabel}</label>
              <input
                id="kws-start-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.signupCard.emailPlaceholder}
              />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-website">{labels.signupCard.websiteLabel}</label>
              <input
                id="kws-start-website"
                name="website"
                type="url"
                autoComplete="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder={labels.signupCard.websitePlaceholder}
              />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-company">{labels.signupCard.companyLabel}</label>
              <input
                id="kws-start-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={labels.signupCard.companyPlaceholder}
              />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-language">{labels.signupCard.languageLabel}</label>
              <select
                id="kws-start-language"
                name="language"
                value={language}
                onChange={(e) => {
                  const next = e.target.value;
                  if (isPublicFooterEnabledLocale(next)) setLanguage(next);
                }}
              >
                {localeOptions.map((opt) => (
                  <option key={opt.locale} value={opt.locale}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </div>
            {error ? (
              <p className="kompis-web-sales-alert" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="kompis-web-sales-primary"
              style={{ width: "100%" }}
              {...marketingDataAttr("cta_click", "kompis_web_start_collect_continue")}
            >
              {start.continue}
            </button>
          </form>
        ) : null}

        {step === "account" ? (
          <form className="kompis-web-sales-panel kompis-web-sales-signup" onSubmit={onAccount} noValidate>
            <h1 style={{ fontSize: "1.55rem", margin: "0 0 8px" }}>{start.accountTitle}</h1>
            <p className="kompis-web-sales-hint" style={{ marginTop: 0 }}>
              {start.accountSubtitle}
            </p>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-name">{start.fullNameLabel}</label>
              <input
                id="kws-start-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={start.fullNamePlaceholder}
              />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-password">{start.passwordLabel}</label>
              <input
                id="kws-start-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-start-confirm">{start.confirmPasswordLabel}</label>
              <input
                id="kws-start-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.95rem" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ marginTop: 4 }}
              />
              <span>
                {start.termsLabel}{" "}
                <Link href={labels.hrefs.terms}>{labels.footer.terms}</Link>
                {" · "}
                <Link href={labels.hrefs.privacy}>{labels.footer.privacy}</Link>
              </span>
            </label>
            {error ? (
              <p className="kompis-web-sales-alert" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="kompis-web-sales-primary"
              style={{ width: "100%" }}
              disabled={loading}
              {...marketingDataAttr("cta_click", "kompis_web_start_create_account")}
            >
              {start.createAccount}
            </button>
            <button type="button" className="kompis-web-sales-cta-quiet" onClick={() => setStep("collect")}>
              {start.back}
            </button>
          </form>
        ) : null}

        {step === "success" ? (
          <div className="kompis-web-sales-panel kompis-web-sales-signup">
            <h1 style={{ fontSize: "1.55rem", margin: "0 0 8px" }}>{start.successTitle}</h1>
            <p className="kompis-web-sales-hint">{successBody}</p>
            <Link
              href={labels.hrefs.login}
              className="kompis-web-sales-primary"
              style={{ width: "100%", textAlign: "center" }}
            >
              {start.loginCta}
            </Link>
            <Link href={labels.hrefs.home} className="kompis-web-sales-cta-quiet" style={{ textAlign: "center" }}>
              {start.homeCta}
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
