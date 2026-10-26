"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import {
  isPublicFooterEnabledLocale,
  publicFooterLocaleOptions,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import "./kompis-web-sales.css";

const MASCOT_SRC = "/brand/aipify-kompis-avatar.png";

type Props = {
  labels: KompisWebSalesLabels;
  locale: PublicFooterEnabledLocale;
  appName: string;
};

export default function KompisWebSalesPage({ labels, locale, appName }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [langError, setLangError] = useState<string | null>(null);
  const localeOptions = publicFooterLocaleOptions();

  function goRegister(event?: FormEvent) {
    event?.preventDefault();
    router.push(labels.hrefs.register);
  }

  function switchLocale(next: string) {
    if (!isPublicFooterEnabledLocale(next) || next === locale || pending) return;
    setLangError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        if (!res.ok) {
          setLangError("Language switch failed");
          return;
        }
        window.location.assign("/kompis-web");
      } catch {
        setLangError("Language switch failed");
      }
    });
  }

  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={labels.hrefs.aipify} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={MASCOT_SRC} alt="" width={36} height={36} priority />
            <span>{appName}</span>
          </Link>

          <nav className="kompis-web-sales-nav-links" aria-label="Sales">
            <a href="#product">{labels.nav.product}</a>
            <a href="#how">{labels.nav.how}</a>
            <a href="#pricing">{labels.nav.pricing}</a>
            <a href="#faq">{labels.nav.faq}</a>
          </nav>

          <div className="kompis-web-sales-nav-actions">
            <div className="kompis-web-sales-lang">
              <label className="sr-only" htmlFor="kompis-web-sales-lang">
                {labels.nav.language}
              </label>
              <select
                id="kompis-web-sales-lang"
                value={locale}
                disabled={pending}
                onChange={(e) => switchLocale(e.target.value)}
                aria-busy={pending}
              >
                {localeOptions.map((opt) => (
                  <option key={opt.locale} value={opt.locale}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </div>
            <Link href={labels.hrefs.login} className="kompis-web-sales-secondary">
              {labels.nav.login}
            </Link>
            <Link
              href={labels.hrefs.register}
              className="kompis-web-sales-primary"
              {...marketingDataAttr("cta_click", "kompis_web_sales_nav_start_free")}
            >
              {labels.nav.startFree}
            </Link>
          </div>
        </div>
        <div className="kompis-web-sales-shell kompis-web-sales-mobile-nav" aria-label="Sales sections">
          <a href="#product">{labels.nav.product}</a>
          <a href="#how">{labels.nav.how}</a>
          <a href="#pricing">{labels.nav.pricing}</a>
          <a href="#faq">{labels.nav.faq}</a>
        </div>
        {langError ? (
          <p className="kompis-web-sales-shell" role="alert" style={{ color: "#b42318", paddingBottom: 8 }}>
            {langError}
          </p>
        ) : null}
      </header>

      <main>
        <section className="kompis-web-sales-shell kompis-web-sales-hero" id="product" aria-labelledby="kompis-web-sales-hero-title">
          <div>
            <p className="kompis-web-sales-eyebrow">{labels.hero.eyebrow}</p>
            <h1 id="kompis-web-sales-hero-title" className="kompis-web-sales-display">
              {labels.hero.titleBefore}{" "}
              <span className="kompis-web-sales-gradient-text">{labels.hero.titleHighlight}</span>
            </h1>
            <p className="kompis-web-sales-lead">{labels.hero.subtitle}</p>
            <div className="kompis-web-sales-cta-row">
              <Link
                href={labels.hrefs.register}
                className="kompis-web-sales-primary"
                {...marketingDataAttr("cta_click", "kompis_web_sales_hero_start_free")}
              >
                {labels.hero.primaryCta}
              </Link>
              <Link
                href={labels.hrefs.bookDemo}
                className="kompis-web-sales-secondary"
                {...marketingDataAttr("cta_click", "kompis_web_sales_hero_book_demo")}
              >
                {labels.hero.secondaryCta}
              </Link>
            </div>
            <div className="kompis-web-sales-trust">
              <span>{labels.hero.trustNoCard}</span>
              <span>{labels.hero.trustSetup}</span>
              <span>{labels.hero.trustFreeQuota}</span>
            </div>
            <div className="kompis-web-sales-mascot-wrap" aria-hidden="true">
              <div className="kompis-web-sales-mascot-glow" />
              <Image
                className="kompis-web-sales-mascot"
                src={MASCOT_SRC}
                alt={labels.hero.mascotAlt}
                width={320}
                height={320}
                priority
              />
            </div>
          </div>

          <form className="kompis-web-sales-panel" onSubmit={goRegister} noValidate>
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
              <select id="kws-language" name="language" defaultValue={locale}>
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

        <section className="kompis-web-sales-shell kompis-web-sales-section" aria-labelledby="kompis-web-sales-benefits-title">
          <h2 id="kompis-web-sales-benefits-title">{labels.benefits.title}</h2>
          <div className="kompis-web-sales-feature-grid">
            {labels.benefits.items.map((item) => (
              <article key={item.title} className="kompis-web-sales-feature-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="how" aria-labelledby="kompis-web-sales-how-title">
          <h2 id="kompis-web-sales-how-title">{labels.how.title}</h2>
          <div className="kompis-web-sales-how-grid">
            {labels.how.steps.map((step, index) => (
              <article key={step.title} className="kompis-web-sales-how-card">
                <span className="kompis-web-sales-step-index">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" aria-labelledby="kompis-web-sales-demo-title">
          <h2 id="kompis-web-sales-demo-title">{labels.demo.title}</h2>
          <p className="kompis-web-sales-section-lead">{labels.demo.subtitle}</p>
          <div className="kompis-web-sales-demo-grid">
            <article className="kompis-web-sales-panel">
              <span className="kompis-web-sales-badge">{labels.demo.illustrationBadge}</span>
              <h3>{labels.demo.widgetTitle}</h3>
              <div className="kompis-web-sales-chat">
                <div className="kompis-web-sales-chat-head">
                  <span>{appName}</span>
                  <span>{labels.demo.widgetStatus}</span>
                </div>
                <div className="kompis-web-sales-chat-body">
                  <p className="kompis-web-sales-bubble visitor">{labels.demo.widgetVisitor}</p>
                  <p className="kompis-web-sales-bubble reply">{labels.demo.widgetReply}</p>
                </div>
              </div>
            </article>
            <article className="kompis-web-sales-panel">
              <span className="kompis-web-sales-badge">{labels.demo.illustrationBadge}</span>
              <h3>{labels.demo.controlTitle}</h3>
              <p style={{ color: "var(--sales-muted)", margin: 0, lineHeight: 1.5 }}>{labels.demo.controlBody}</p>
              <ul className="kompis-web-sales-control-list">
                {labels.demo.controlItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="pricing" aria-labelledby="kompis-web-sales-pricing-title">
          <h2 id="kompis-web-sales-pricing-title">{labels.pricing.title}</h2>
          <p className="kompis-web-sales-section-lead">{labels.pricing.subtitle}</p>
          <div className="kompis-web-sales-plans">
            <article className="kompis-web-sales-plan kompis-web-sales-plan-featured">
              <span className="kompis-web-sales-plan-badge">{labels.pricing.free.badge}</span>
              <h3>{labels.pricing.free.name}</h3>
              <p className="quota">{labels.pricing.free.quota}</p>
              <p className="price">{labels.pricing.free.price}</p>
              <ul>
                {labels.pricing.free.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={labels.hrefs.register}
                className="kompis-web-sales-primary"
                style={{ width: "100%" }}
                {...marketingDataAttr("cta_click", "kompis_web_sales_pricing_free")}
              >
                {labels.pricing.free.cta}
              </Link>
            </article>
            <article className="kompis-web-sales-plan">
              <h3>{labels.pricing.paid.name}</h3>
              <p className="quota">{labels.pricing.paid.quota}</p>
              <p className="price">
                {labels.pricing.paid.priceMonthly}
                <br />
                {labels.pricing.paid.priceAnnual}
              </p>
              <ul>
                {labels.pricing.paid.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={labels.hrefs.bookDemo}
                className="kompis-web-sales-secondary"
                style={{ width: "100%" }}
                {...marketingDataAttr("cta_click", "kompis_web_sales_pricing_paid")}
              >
                {labels.pricing.paid.cta}
              </Link>
              <p className="kompis-web-sales-hint">{labels.pricing.paid.checkoutUnavailable}</p>
            </article>
          </div>
          <p className="kompis-web-sales-note">{labels.pricing.plannedNote}</p>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section" id="faq" aria-labelledby="kompis-web-sales-faq-title">
          <h2 id="kompis-web-sales-faq-title">{labels.faq.title}</h2>
          <div className="kompis-web-sales-faq-grid">
            {labels.faq.items.map((item) => (
              <article key={item.question} className="kompis-web-sales-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kompis-web-sales-shell kompis-web-sales-section">
          <div className="kompis-web-sales-final">
            <h2>{labels.finalCta.title}</h2>
            <p>{labels.finalCta.subtitle}</p>
            <div className="kompis-web-sales-cta-row">
              <Link
                href={labels.hrefs.register}
                className="kompis-web-sales-primary"
                {...marketingDataAttr("cta_click", "kompis_web_sales_final_start_free")}
              >
                {labels.finalCta.primary}
              </Link>
              <Link
                href={labels.hrefs.bookDemo}
                className="kompis-web-sales-secondary"
                {...marketingDataAttr("cta_click", "kompis_web_sales_final_book_demo")}
              >
                {labels.finalCta.secondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="kompis-web-sales-footer">
        <div className="kompis-web-sales-shell kompis-web-sales-footer-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand">
            <Image src={MASCOT_SRC} alt="" width={32} height={32} />
            <span>{labels.footer.tagline}</span>
          </Link>
          <nav className="kompis-web-sales-footer-links" aria-label="Footer">
            <a href="#product">{labels.footer.product}</a>
            <a href="#how">{labels.footer.how}</a>
            <a href="#pricing">{labels.footer.pricing}</a>
            <a href="#faq">{labels.footer.faq}</a>
            <Link href={labels.hrefs.privacy}>{labels.footer.privacy}</Link>
            <Link href={labels.hrefs.terms}>{labels.footer.terms}</Link>
            <Link href={labels.hrefs.contact}>{labels.footer.contact}</Link>
            <Link href={labels.hrefs.home}>{labels.footer.home}</Link>
            <a href={labels.hrefs.aipify} rel="noreferrer">
              aipify.ai
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
