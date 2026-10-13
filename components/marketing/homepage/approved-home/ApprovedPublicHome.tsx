"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  ApprovedPublicHomeDemoMode,
  ApprovedPublicHomeLabels,
} from "@/components/marketing/homepage/approved-home/types";
import "@/components/marketing/homepage/approved-home/aipify-public-home-approved.css";

const MASCOT_SRC = "/brand/aipify-kompis-avatar.png";

/** Production CTAs — not mailto:hello@aipify.ai from the design concept. */
export const APPROVED_PUBLIC_HOME_CTA = {
  contact: "/book-demo",
  products: "#products",
  web: "#products",
  bedrift: "#products",
  security: "#security",
} as const;

type Props = {
  labels: ApprovedPublicHomeLabels;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ApprovedPublicHome({ labels }: Props) {
  const [mode, setMode] = useState<ApprovedPublicHomeDemoMode>("web");
  const demo = mode === "web" ? labels.demoWeb : labels.demoCompany;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document
        .querySelectorAll(".aipify-public-home .reveal")
        .forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".aipify-public-home .reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="aipify-public-home">
      <div className="ambient" aria-hidden="true">
        <div className="wave one" />
        <div className="wave two" />
      </div>

      <div id="top">
        <section className="section hero">
          <Image
            className="hero-mascot"
            src={MASCOT_SRC}
            alt=""
            aria-hidden="true"
            width={1280}
            height={1280}
            priority
          />
          <div className="eyebrow">
            <span className="spark" />
            {labels.eyebrow}
          </div>
          <h1>
            {labels.heroTitleBefore}{" "}
            <span className="gradient-text">{labels.heroTitleMid}</span> {labels.heroTitleAnd}{" "}
            <span className="gradient-text">{labels.heroTitleEnd}</span>
          </h1>
          <p className="hero-copy">{labels.heroCopy}</p>
          <div className="hero-actions">
            <Link className="button primary" href={APPROVED_PUBLIC_HOME_CTA.web}>
              {labels.ctaExploreWeb}
            </Link>
            <Link className="button secondary" href={APPROVED_PUBLIC_HOME_CTA.bedrift}>
              {labels.ctaExploreBedrift}
            </Link>
          </div>
          <div className="trust-line">
            <span>
              <CheckIcon />
              {labels.trustSource}
            </span>
            <span>
              <CheckIcon />
              {labels.trustMultilingual}
            </span>
            <span>
              <CheckIcon />
              {labels.trustHuman}
            </span>
          </div>

          <div className="demo-wrap reveal" aria-label={labels.demoAria}>
            <div className="demo-badge">{labels.demoBadge}</div>
            <div className="demo-glow" aria-hidden="true" />
            <div className="demo">
              <div className="demo-bar">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <div className="demo-address">{labels.demoAddress}</div>
              </div>
              <div className="demo-stage">
                <div className="demo-main">
                  <div className="demo-kicker">{demo.kicker}</div>
                  <h3 className="demo-title">{demo.title}</h3>
                  <p className="demo-text">{demo.text}</p>
                  <div className="demo-pills">
                    {demo.pills.map((pill) => (
                      <span key={pill} className="demo-pill">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="demo-chat">
                  <div className="chat-head">
                    <div className="bot-avatar" aria-hidden="true">
                      A
                    </div>
                    <div>
                      <strong>{demo.name}</strong>
                      <div className="online">
                        <span aria-hidden="true">●</span> {labels.demoOnline}
                      </div>
                    </div>
                  </div>
                  <div className="chat-body">
                    <div className="bubble user">{demo.question}</div>
                    <div className="bubble bot">{demo.answer}</div>
                    <div className="source-tag">{demo.source}</div>
                  </div>
                  <div className="chat-input">
                    <span>{labels.demoInputPlaceholder}</span>
                    <span className="send" aria-hidden="true">
                      ↑
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="demo-switch" role="tablist" aria-label={labels.demoSwitchAria}>
              <button
                className={`switch-btn${mode === "web" ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={mode === "web"}
                onClick={() => setMode("web")}
              >
                {labels.demoWebTab}
              </button>
              <button
                className={`switch-btn${mode === "company" ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={mode === "company"}
                onClick={() => setMode("company")}
              >
                {labels.demoCompanyTab}
              </button>
            </div>
          </div>
        </section>

        <section className="section" id="products">
          <div className="section-head center reveal">
            <div className="label">{labels.productsLabel}</div>
            <h2>{labels.productsTitle}</h2>
            <p>{labels.productsSubtitle}</p>
          </div>
          <div className="product-grid">
            <article className="product-card reveal">
              <div className="product-icon">
                <Image
                  src={MASCOT_SRC}
                  alt={labels.productIconAlt}
                  width={80}
                  height={80}
                />
              </div>
              <h3>{labels.productWebTitle}</h3>
              <p>{labels.productWebBody}</p>
              <ul className="feature-list">
                {labels.productWebFeatures.map((item) => (
                  <li key={item.text}>
                    <span
                      className={`check${item.status === "planned" ? " planned" : ""}`}
                      title={item.status === "planned" ? labels.plannedLabel : labels.availableNowLabel}
                    >
                      {item.status === "planned" ? "○" : "✓"}
                    </span>
                    <span>
                      {item.text}
                      {item.status === "planned" ? (
                        <span className="feature-status">{labels.plannedLabel}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="button ghost product-cta" href={APPROVED_PUBLIC_HOME_CTA.contact}>
                {labels.productWebCta}
              </Link>
            </article>
            <article className="product-card company reveal">
              <div className="product-icon">
                <Image
                  src={MASCOT_SRC}
                  alt={labels.productIconAlt}
                  width={80}
                  height={80}
                />
              </div>
              <h3>{labels.productBedriftTitle}</h3>
              <p>{labels.productBedriftBody}</p>
              <ul className="feature-list">
                {labels.productBedriftFeatures.map((item) => (
                  <li key={item.text}>
                    <span
                      className={`check${item.status === "planned" ? " planned" : ""}`}
                      title={item.status === "planned" ? labels.plannedLabel : labels.availableNowLabel}
                    >
                      {item.status === "planned" ? "○" : "✓"}
                    </span>
                    <span>
                      {item.text}
                      {item.status === "planned" ? (
                        <span className="feature-status">{labels.plannedLabel}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="button ghost product-cta" href={APPROVED_PUBLIC_HOME_CTA.contact}>
                {labels.productBedriftCta}
              </Link>
            </article>
          </div>
        </section>

        <section className="section" id="core">
          <div className="core-panel reveal">
            <div className="core-content">
              <div>
                <div className="label" style={{ color: "#a996ff" }}>
                  {labels.coreLabel}
                </div>
                <h2>{labels.coreTitle}</h2>
                <p>{labels.coreBody}</p>
                <Link
                  className="button"
                  style={{ background: "white", color: "#6042d4", marginTop: 14 }}
                  href={APPROVED_PUBLIC_HOME_CTA.security}
                >
                  {labels.coreCta}
                </Link>
              </div>
              <div className="core-flow">
                {labels.coreSteps.map((step, index) => (
                  <div className="flow-step" key={step.title}>
                    <div className="flow-num">{index + 1}</div>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{step.detail}</small>
                    </div>
                    <div className="flow-status">{step.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="security">
          <Image
            className="section-mascot middle"
            src={MASCOT_SRC}
            alt=""
            aria-hidden="true"
            width={1280}
            height={1280}
          />
          <div className="section-head reveal">
            <div className="label">{labels.securityLabel}</div>
            <h2>{labels.securityTitle}</h2>
            <p>{labels.securitySubtitle}</p>
          </div>
          <div className="values">
            {labels.values.map((value) => (
              <article className="value reveal" key={value.title}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="addons">
          <div className="section-head center reveal">
            <div className="label">{labels.addonsLabel}</div>
            <h2>{labels.addonsTitle}</h2>
            <p>{labels.addonsSubtitle}</p>
          </div>
          <div className="addons">
            <article className="addon reveal">
              <div className="addon-icon">✦</div>
              <div>
                <h3>{labels.addonDesignTitle}</h3>
                <p>{labels.addonDesignBody}</p>
                <span className="tag">{labels.plannedTag}</span>
              </div>
            </article>
            <article className="addon reveal">
              <div className="addon-icon">文</div>
              <div>
                <h3>{labels.addonTranslatorTitle}</h3>
                <p>{labels.addonTranslatorBody}</p>
                <span className="tag">{labels.plannedTag}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="contact">
          <Image
            className="section-mascot bottom"
            src={MASCOT_SRC}
            alt=""
            aria-hidden="true"
            width={1280}
            height={1280}
          />
          <div className="cta reveal">
            <h2>{labels.ctaTitle}</h2>
            <p>{labels.ctaBody}</p>
            <Link className="button" href={APPROVED_PUBLIC_HOME_CTA.contact}>
              {labels.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
