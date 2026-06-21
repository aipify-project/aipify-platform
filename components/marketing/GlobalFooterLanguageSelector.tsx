"use client";

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import {
  isPublicFooterEnabledLocale,
  publicFooterLocaleOptions,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";

export type GlobalFooterLanguageSelectorLabels = {
  title: string;
  hint: string;
  activeLanguage: string;
  changeLanguage: string;
  switchFailed: string;
  retry: string;
};

type Props = {
  currentLocale: PublicFooterEnabledLocale;
  labels: GlobalFooterLanguageSelectorLabels;
};

function ariaLabelFor(
  nativeLabel: string,
  isActive: boolean,
  labels: GlobalFooterLanguageSelectorLabels,
): string {
  return isActive
    ? `${nativeLabel} – ${labels.activeLanguage}`
    : `${nativeLabel} – ${labels.changeLanguage}`;
}

export default function GlobalFooterLanguageSelector({ currentLocale, labels }: Props) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const options = publicFooterLocaleOptions();

  const switchLocale = useCallback(
    (nextLocale: PublicFooterEnabledLocale) => {
      if (nextLocale === currentLocale || pending) return;
      setError(null);
      startTransition(async () => {
        try {
          const res = await fetch("/api/locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale: nextLocale }),
          });
          if (!res.ok) {
            setError(labels.switchFailed);
            return;
          }
          const search = typeof window !== "undefined" ? window.location.search : "";
          const hash = typeof window !== "undefined" ? window.location.hash : "";
          window.location.assign(`${pathname}${search}${hash}`);
        } catch {
          setError(labels.switchFailed);
        }
      });
    },
    [currentLocale, labels.switchFailed, pathname, pending],
  );

  return (
    <section
      className="border-t border-aipify-border pt-10"
      aria-labelledby="footer-language-region-heading"
      aria-busy={pending}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="footer-language-region-heading"
          className="text-sm font-semibold tracking-wide text-aipify-text"
        >
          {labels.title}
        </h2>
        {labels.hint ? (
          <p className="mt-1.5 text-sm text-aipify-text-secondary">{labels.hint}</p>
        ) : null}

        <ul
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-3.5"
          role="list"
        >
          {options.map((option) => {
            const isActive = option.locale === currentLocale;
            return (
              <li key={option.locale}>
                <button
                  type="button"
                  disabled={pending}
                  aria-label={ariaLabelFor(option.nativeLabel, isActive, labels)}
                  aria-current={isActive ? "true" : undefined}
                  title={option.nativeLabel}
                  onClick={() => switchLocale(option.locale)}
                  className={[
                    "group relative flex h-11 min-h-[44px] w-[52px] min-w-[44px] items-center justify-center rounded-xl border bg-aipify-surface transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    isActive
                      ? "border-emerald-400/70 shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_0_14px_rgba(16,185,129,0.18)] motion-safe:animate-[aipify-lang-active-glow_3s_ease-in-out_infinite] motion-reduce:animate-none"
                      : "border-aipify-border hover:-translate-y-0.5 hover:border-aipify-companion/35 hover:shadow-sm",
                  ].join(" ")}
                >
                  <img
                    src={option.flagSrc}
                    alt=""
                    aria-hidden
                    width={36}
                    height={25}
                    className="h-[25px] w-[36px] rounded-[6px] border border-black/5 object-cover shadow-sm"
                  />
                  {isActive ? (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                      <span className="sr-only">{labels.activeLanguage}</span>
                    </span>
                  ) : null}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-aipify-border bg-aipify-surface px-2.5 py-1 text-xs font-medium text-aipify-text shadow-md group-hover:block group-focus-visible:block"
                  >
                    {option.nativeLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {error ? (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-amber-800" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="font-semibold text-aipify-companion underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
              onClick={() => setError(null)}
            >
              {labels.retry}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
