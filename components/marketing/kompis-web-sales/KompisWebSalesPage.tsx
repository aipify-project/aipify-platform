"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from "react";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import { kompisWebSalesHelperDisplayName } from "@/lib/marketing/kompis-web-sales/locale";
import {
  isPublicFooterEnabledLocale,
  publicFooterLocaleOptions,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import "./kompis-web-sales.css";

const BRAND_MARK = "/brand/aipify-kompis-avatar.png";
const HERO_MASCOT = "/website-kompis/dashboard/kompis_mascot_premium_v2.png";
const HERO_GLOW = "/website-kompis/dashboard/kompis_hero_glow_premium_v2.png";

type Props = {
  labels: KompisWebSalesLabels;
  locale: PublicFooterEnabledLocale;
  appName: string;
};

const BENEFIT_ICONS = [
  // source
  <path key="s" d="M7 4h10v4H7V4Zm0 6h10v10H7V10Zm2 2v6h6v-6H9Z" fill="currentColor" />,
  // page
  <path key="p" d="M6 3h8l4 4v14H6V3Zm8 1.5V8h3.5L14 4.5ZM8 12h8v2H8v-2Zm0 4h6v2H8v-2Z" fill="currentColor" />,
  // multilingual
  <path key="m" d="M4 5h7v2H8.8A13 13 0 0 1 12 14.2V16a15 15 0 0 0-4.4-7.2A15 15 0 0 0 3.2 16H1a17 17 0 0 1 4.4-8.5A11 11 0 0 1 4 5Zm9 2h10v2h-3.1A15 15 0 0 1 22 16h-2a13 13 0 0 0-2.4-6.2A13 13 0 0 0 15.2 16H13a15 15 0 0 1 2.8-7H13V7Z" fill="currentColor" />,
  // human
  <path key="h" d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4.4 0 8 2.2 8 5v1H4v-1c0-2.8 3.6-5 8-5Z" fill="currentColor" />,
  // fast
  <path key="f" d="M13 2 4 14h7l-1 8 10-14h-7l1-6Z" fill="currentColor" />,
];

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlanCheckIcon() {
  return (
    <svg className="kompis-web-sales-plan-check" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M6.2 10.2 8.7 12.7 13.8 7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KompisWebSalesPage({ labels, locale, appName }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [langOpen, setLangOpen] = useState(false);
  const [langError, setLangError] = useState<string | null>(null);
  const menuId = useId();
  const langRef = useRef<HTMLDivElement>(null);
  const localeOptions = publicFooterLocaleOptions();
  const activeLocale = localeOptions.find((opt) => opt.locale === locale) ?? localeOptions[0];
  const helperName = kompisWebSalesHelperDisplayName(locale);
  const [signupLanguage, setSignupLanguage] = useState(locale);

  useEffect(() => {
    setSignupLanguage(locale);
  }, [locale]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLangOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function goStart(event?: FormEvent) {
    event?.preventDefault();
    const form = event?.currentTarget;
    if (form instanceof HTMLFormElement) {
      const data = new FormData(form);
      const params = new URLSearchParams();
      for (const key of ["email", "website", "company", "language"] as const) {
        const value = String(data.get(key) ?? "").trim();
        if (value) params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${labels.hrefs.start}?${qs}` : labels.hrefs.start);
      return;
    }
    router.push(labels.hrefs.start);
  }

  function switchLocale(next: string) {
    if (!isPublicFooterEnabledLocale(next) || next === locale || pending) return;
    setLangError(null);
    setLangOpen(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        if (!res.ok) {
          setLangError(labels.nav.languageSwitchFailed);
          return;
        }
        window.location.assign("/");
      } catch {
        setLangError(labels.nav.languageSwitchFailed);
      }
    });
  }

  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={BRAND_MARK} alt="" width={40} height={40} priority />
            <span>{appName}</span>
          </Link>

          <nav className="kompis-web-sales-nav-links" aria-label={labels.nav.product}>
            <a href="#product">{labels.nav.product}</a>
            <a href="#how">{labels.nav.how}</a>
            <a href="#pricing">{labels.nav.pricing}</a>
            <a href="#faq">{labels.nav.faq}</a>
          </nav>

          <div className="kompis-web-sales-nav-actions">
            <div className="kompis-web-sales-lang" ref={langRef}>
              <button
                type="button"
                className="kompis-web-sales-lang-trigger"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-controls={menuId}
                aria-label={labels.nav.languageMenu}
                disabled={pending}
                onClick={() => setLangOpen((open) => !open)}
              >
                <Image src={activeLocale.flagSrc} alt="" width={20} height={14} />
                <span className="kompis-web-sales-lang-label">{activeLocale.nativeLabel}</span>
                <ChevronDown />
              </button>
              <div
                id={menuId}
                className="kompis-web-sales-lang-menu"
                role="listbox"
                aria-label={labels.nav.languageMenu}
                hidden={!langOpen}
              >
                {localeOptions.map((opt) => (
                  <button
                    key={opt.locale}
                    type="button"
                    role="option"
                    className="kompis-web-sales-lang-option"
                    aria-current={opt.locale === locale ? "true" : undefined}
                    onClick={() => switchLocale(opt.locale)}
                  >
                    <Image src={opt.flagSrc} alt="" width={22} height={15} />
                    <span>{opt.nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>
            <Link href={labels.hrefs.login} className="kompis-web-sales-secondary">
              {labels.nav.login}
            </Link>
            <Link
              href={labels.hrefs.start}
              className="kompis-web-sales-primary"
              {...marketingDataAttr("cta_click", "kompis_web_sales_nav_start_free")}
            >
              {labels.nav.startFree}
            </Link>
          </div>
        </div>
        <div className="kompis-web-sales-shell kompis-web-sales-mobile-nav" aria-label={labels.nav.product}>
          <a href="#product">{labels.nav.product}</a>
          <a href="#how">{labels.nav.how}</a>
          <a href="#pricing">{labels.nav.pricing}</a>
          <a href="#faq">{labels.nav.faq}</a>
        </div>
        {langError ? (
          <p className="kompis-web-sales-shell kompis-web-sales-alert" role="alert">
            {langError}
          </p>
        ) : null}
      </header>

      <main>
        <section className="kompis-web-sales-shell kompis-web-sales-hero" id="product" aria-labelledby="kompis-web-sales-hero-title">
          <div className="kompis-web-sales-hero-copy">
            <p className="kompis-web-sales-eyebrow">{labels.hero.eyebrow}</p>
            <h1 id="kompis-web-sales-hero-title" className="kompis-web-sales-display">
              {labels.hero.titleBefore}{" "}
              <span className="kompis-web-sales-gradient-text">{labels.hero.titleHighlight}</span>
            </h1>
            <p className="kompis-web-sales-lead">{labels.hero.subtitle}</p>
            <div className="kompis-web-sales-cta-row">
              <Link
                href={labels.hrefs.start}
                className="kompis-web-sales-primary"
                {...marketingDataAttr("cta_click", "kompis_web_sales_hero_start_free")}
              >
                {labels.hero.primaryCta}
              </Link>
              <a
                href={labels.hrefs.contactMailto}
                className="kompis-web-sales-cta-quiet"
                {...marketingDataAttr("cta_click", "kompis_web_sales_hero_contact")}
              >
                {labels.hero.secondaryCta}
              </a>
            </div>
            <div className="kompis-web-sales-trust">
              <span>{labels.hero.trustNoCard}</span>
              <span>{labels.hero.trustSetup}</span>
              <span>{labels.hero.trustFreeQuota}</span>
            </div>
          </div>

          <div className="kompis-web-sales-mascot-stage">
            <div className="kompis-web-sales-mascot-glow" aria-hidden="true" />
            <Image
              src={HERO_GLOW}
              alt=""
              width={520}
              height={292}
              className="kompis-web-sales-mascot-glow-img"
              priority
            />
            <Image
              className="kompis-web-sales-mascot"
              src={HERO_MASCOT}
              alt={labels.hero.mascotAlt}
              width={380}
              height={380}
              priority
            />
          </div>

          <form className="kompis-web-sales-panel kompis-web-sales-signup" onSubmit={goStart} noValidate>
            <h2>{labels.signupCard.title}</h2>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-email">{labels.signupCard.emailLabel}</label>
              <input id="kws-email" name="email" type="email" autoComplete="email" placeholder={labels.signupCard.emailPlaceholder} />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-website">{labels.signupCard.websiteLabel}</label>
              <input id="kws-website" name="website" type="url" autoComplete="url" placeholder={labels.signupCard.websitePlaceholder} />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-company">{labels.signupCard.companyLabel}</label>
              <input id="kws-company" name="company" type="text" autoComplete="organization" placeholder={labels.signupCard.companyPlaceholder} />
            </div>
            <div className="kompis-web-sales-field">
              <label htmlFor="kws-language">{labels.signupCard.languageLabel}</label>
              <select
                id="kws-language"
                name="language"
                value={signupLanguage}
                onChange={(e) => {
                  const next = e.target.value;
                  if (isPublicFooterEnabledLocale(next)) setSignupLanguage(next);
                }}
              >
                {localeOptions.map((opt) => (
                  <option key={opt.locale} value={opt.locale}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="kompis-web-sales-primary"
              style={{ width: "100%" }}
              {...marketingDataAttr("cta_click", "kompis_web_sales_signup_card")}
            >
              {labels.signupCard.submit}
            </button>
            <p className="kompis-web-sales-hint">{labels.signupCard.continueHint}</p>
          </form>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" aria-label={labels.benefits.title}>
          <div className="kompis-web-sales-feature-strip">
            {labels.benefits.items.map((item, index) => (
              <article key={item.title} className="kompis-web-sales-feature-item">
                <span className="kompis-web-sales-feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{BENEFIT_ICONS[index]}</svg>
                </span>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="how" aria-labelledby="kompis-web-sales-how-title">
          <div className="kompis-web-sales-how">
            <div className="kompis-web-sales-how-copy">
              <h2 id="kompis-web-sales-how-title">{labels.how.title}</h2>
              <p>{labels.how.intro}</p>
            </div>
            <div className="kompis-web-sales-how-grid">
              {labels.how.steps.map((step, index) => (
                <article key={step.title} className="kompis-web-sales-how-card">
                  <div className="kompis-web-sales-how-card-top">
                    <span className="kompis-web-sales-step-index">{index + 1}</span>
                    <span className="kompis-web-sales-how-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">{BENEFIT_ICONS[index % BENEFIT_ICONS.length]}</svg>
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  {index < labels.how.steps.length - 1 ? (
                    <span className="kompis-web-sales-how-arrow" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" aria-labelledby="kompis-web-sales-demo-title">
          <div className="kompis-web-sales-demo-intro">
            <h2 id="kompis-web-sales-demo-title" className="kompis-web-sales-section-title">
              {labels.demo.title}
            </h2>
            <p className="kompis-web-sales-section-lead">{labels.demo.subtitle}</p>
            <span className="kompis-web-sales-badge">{labels.demo.illustrationBadge}</span>
          </div>
          <div className="kompis-web-sales-demo-grid">
            <article className="kompis-web-sales-demo-card">
              <h3>{labels.demo.widgetTitle}</h3>
              <div className="kompis-web-sales-chat">
                <div className="kompis-web-sales-chat-head">
                  <span className="kompis-web-sales-chat-identity">
                    <Image src={BRAND_MARK} alt="" width={28} height={28} />
                    <span>{helperName}</span>
                  </span>
                  <span className="kompis-web-sales-chat-status">{labels.demo.widgetStatus}</span>
                </div>
                <div className="kompis-web-sales-chat-body">
                  <p className="kompis-web-sales-bubble visitor">{labels.demo.widgetVisitor}</p>
                  <p className="kompis-web-sales-bubble reply">{labels.demo.widgetReply}</p>
                </div>
              </div>
            </article>
            <article className="kompis-web-sales-demo-card">
              <h3>{labels.demo.controlTitle}</h3>
              <div className="kompis-web-sales-control-shell">
                <div className="kompis-web-sales-control-nav" aria-hidden="true">
                  {labels.demo.controlItems.slice(0, 4).map((item, index) => (
                    <span key={item} data-active={index === 0 ? "true" : undefined}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="kompis-web-sales-control-main">
                  <p className="kompis-web-sales-control-kicker">{labels.demo.controlBody}</p>
                  <div className="kompis-web-sales-control-pills">
                    {labels.demo.controlItems.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="pricing" aria-labelledby="kompis-web-sales-pricing-title">
          <div className="kompis-web-sales-pricing">
            <div className="kompis-web-sales-pricing-copy">
              <h2 id="kompis-web-sales-pricing-title">{labels.pricing.title}</h2>
              <p className="kompis-web-sales-pricing-lead">{labels.pricing.subtitle}</p>
              <p className="kompis-web-sales-pricing-aside">{labels.pricing.asideBody}</p>
              <p className="kompis-web-sales-note">{labels.pricing.plannedNote}</p>
            </div>
            <div className="kompis-web-sales-plans">
              <article className="kompis-web-sales-plan kompis-web-sales-plan-featured">
                <span className="kompis-web-sales-plan-badge">{labels.pricing.free.badge}</span>
                <h3>{labels.pricing.free.name}</h3>
                <p className="kompis-web-sales-plan-figure" aria-label={labels.pricing.free.quota}>
                  <span className="kompis-web-sales-plan-figure-num">{labels.pricing.free.quotaFigure}</span>
                  <span className="kompis-web-sales-plan-figure-unit">{labels.pricing.free.quotaUnit}</span>
                </p>
                <p className="kompis-web-sales-plan-nocard">{labels.pricing.free.noCardPill}</p>
                <p className="kompis-web-sales-plan-price-line">{labels.pricing.free.price}</p>
                <ul className="kompis-web-sales-plan-features">
                  {labels.pricing.free.features.map((feature) => (
                    <li key={feature}>
                      <PlanCheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={labels.hrefs.start}
                  className="kompis-web-sales-primary kompis-web-sales-plan-cta"
                  {...marketingDataAttr("cta_click", "kompis_web_sales_pricing_free")}
                >
                  {labels.pricing.free.cta}
                </Link>
              </article>
              <article className="kompis-web-sales-plan kompis-web-sales-plan-standard">
                <span className="kompis-web-sales-plan-tagline">{labels.pricing.paid.tagline}</span>
                <h3>{labels.pricing.paid.name}</h3>
                <p className="kompis-web-sales-plan-figure" aria-label={labels.pricing.paid.quota}>
                  <span className="kompis-web-sales-plan-figure-num">{labels.pricing.paid.quotaFigure}</span>
                  <span className="kompis-web-sales-plan-figure-unit">{labels.pricing.paid.quotaUnit}</span>
                </p>
                <div className="kompis-web-sales-plan-prices">
                  <p className="kompis-web-sales-plan-price-main">{labels.pricing.paid.priceMonthly}</p>
                  <p className="kompis-web-sales-plan-price-alt">{labels.pricing.paid.priceAnnual}</p>
                  <p className="kompis-web-sales-plan-price-note">{labels.pricing.paid.priceNote}</p>
                </div>
                <ul className="kompis-web-sales-plan-features">
                  {labels.pricing.paid.features.map((feature) => (
                    <li key={feature}>
                      <PlanCheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={labels.hrefs.start}
                  className="kompis-web-sales-secondary kompis-web-sales-plan-cta"
                  {...marketingDataAttr("cta_click", "kompis_web_sales_pricing_paid")}
                >
                  {labels.pricing.paid.cta}
                </Link>
                <p className="kompis-web-sales-hint">{labels.pricing.paid.checkoutUnavailable}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="faq" aria-labelledby="kompis-web-sales-faq-title">
          <h2 id="kompis-web-sales-faq-title" className="kompis-web-sales-section-title">
            {labels.faq.title}
          </h2>
          <div className="kompis-web-sales-faq-grid">
            {labels.faq.items.map((item) => (
              <details key={item.question} className="kompis-web-sales-faq-item">
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section">
          <div className="kompis-web-sales-final">
            <div>
              <h2>{labels.finalCta.title}</h2>
              <p>{labels.finalCta.subtitle}</p>
              <div className="kompis-web-sales-cta-row">
                <Link
                  href={labels.hrefs.start}
                  className="kompis-web-sales-primary"
                  {...marketingDataAttr("cta_click", "kompis_web_sales_final_start_free")}
                >
                  {labels.finalCta.primary}
                </Link>
                <a
                  href={labels.hrefs.contactMailto}
                  className="kompis-web-sales-cta-quiet"
                  {...marketingDataAttr("cta_click", "kompis_web_sales_final_contact")}
                >
                  {labels.finalCta.secondary}
                </a>
              </div>
            </div>
            <Image
              className="kompis-web-sales-final-mascot"
              src={HERO_MASCOT}
              alt=""
              width={220}
              height={220}
            />
          </div>
        </section>
      </main>

      <footer className="kompis-web-sales-footer">
        <div className="kompis-web-sales-shell kompis-web-sales-footer-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand">
            <Image src={BRAND_MARK} alt="" width={32} height={32} />
            <span>{labels.footer.tagline}</span>
          </Link>
          <nav className="kompis-web-sales-footer-links" aria-label={labels.footer.home}>
            <a href="#product">{labels.footer.product}</a>
            <a href="#how">{labels.footer.how}</a>
            <a href="#pricing">{labels.footer.pricing}</a>
            <a href={labels.hrefs.faq}>{labels.footer.faq}</a>
            <Link href={labels.hrefs.privacy}>{labels.footer.privacy}</Link>
            <Link href={labels.hrefs.terms}>{labels.footer.terms}</Link>
            <a href={labels.hrefs.contactMailto}>{labels.footer.contact}</a>
            <a href={labels.hrefs.aipify} rel="noreferrer">
              aipify.ai
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
