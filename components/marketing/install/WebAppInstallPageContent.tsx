"use client";

import Link from "next/link";
import { AipifyWebAppInstallAction } from "@/components/pwa/AipifyWebAppInstallAction";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type WebAppInstallPageContentProps = {
  labels: PwaInstallLabels;
  page: Record<string, string>;
  faqs: Array<{ q: string; a: string }>;
};

function supportBadge(state: string, states: Record<string, string>) {
  const label = states[state] ?? state;
  const classes =
    state === "supported"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : state === "limited"
        ? "bg-amber-50 text-amber-900 border-amber-200"
        : "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export default function WebAppInstallPageContent({ labels, page, faqs }: WebAppInstallPageContentProps) {
  const states = {
    supported: page["supportStates.supported"] ?? "",
    limited: page["supportStates.limited"] ?? "",
    unsupported: page["supportStates.unsupported"] ?? "",
  };

  const benefits = [labels.benefit1, labels.benefit2, labels.benefit3, labels.benefit4, labels.benefit5];

  const platforms = ["chromeDesktop", "android", "apple"].map((key) => ({
    key,
    title: page[`platforms.${key}.title`] ?? key,
    state: page[`platforms.${key}.state`] ?? "unsupported",
    steps: [1, 2, 3].map((n) => page[`platforms.${key}.steps.${n}`] ?? "").filter(Boolean),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{page.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">{page.heroSubtitle}</p>
        <div className="mt-8 flex justify-center">
          <AipifyWebAppInstallAction labels={labels} variant="button" />
        </div>
      </header>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-gray-900">{page.whatIsTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{page.whatIsBody}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.benefitsTitle}</h2>
        <ul className="mt-4 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2 text-sm text-gray-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.devicesTitle}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {platforms.map((platform) => (
            <div key={platform.key} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900">{platform.title}</h3>
                {supportBadge(platform.state, states)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.instructionsTitle}</h2>
        <div className="mt-6 space-y-8">
          {platforms.map((platform) => (
            <div key={platform.key}>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">{platform.title}</h3>
                {supportBadge(platform.state, states)}
              </div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
                {platform.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.securityTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{page.securityBody}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.offlineTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{page.offlineBody}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.updatesTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{page.updatesBody}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">{page.removeTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{page.removeBody}</p>
      </section>

      <section className="mt-12" aria-labelledby="install-page-faq">
        <h2 id="install-page-faq" className="text-2xl font-semibold text-gray-900">
          {page.faqTitle}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{page.faqIntro}</p>
        <dl className="mt-6 space-y-4">
          {faqs.slice(0, 6).map((faq) => (
            <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-5">
              <dt className="font-medium text-gray-900">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/knowledge/articles/installing-aipify-web-app"
          className="mt-4 inline-flex text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          {page.viewAllFaqs}
        </Link>
      </section>

      <section className="mt-14 rounded-2xl border border-violet-200 bg-violet-50/60 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">{page.finalCtaTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{page.finalCtaBody}</p>
        <div className="mt-6 flex justify-center">
          <AipifyWebAppInstallAction labels={labels} variant="button" showGuideLink={false} />
        </div>
      </section>
    </div>
  );
}
