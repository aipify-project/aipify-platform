"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  appLocaleOptions,
  isAppLocale,
  type AppLocale,
} from "@/lib/i18n/app-locales";

export type AppLanguageSelectorLabels = {
  label: string;
  activeLanguage: string;
  changeLanguage: string;
  switchFailed: string;
  retry: string;
  openMenu: string;
};

type Props = {
  currentLocale: AppLocale;
  labels: AppLanguageSelectorLabels;
  variant?: "header" | "settings";
  onLocaleChange?: (locale: AppLocale) => void;
};

function ariaLabelFor(
  nativeLabel: string,
  isActive: boolean,
  labels: AppLanguageSelectorLabels,
): string {
  return isActive
    ? `${nativeLabel} – ${labels.activeLanguage}`
    : `${nativeLabel} – ${labels.changeLanguage}`;
}

export function AppLanguageSelector({
  currentLocale,
  labels,
  variant = "header",
  onLocaleChange,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const options = appLocaleOptions();
  const active = options.find((option) => option.locale === currentLocale) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const switchLocale = useCallback(
    (nextLocale: AppLocale) => {
      if (nextLocale === currentLocale || pending) return;
      setError(null);
      setOpen(false);
      startTransition(async () => {
        try {
          const res = await fetch("/api/locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale: nextLocale, scope: "app" }),
          });
          if (!res.ok) {
            setError(labels.switchFailed);
            return;
          }
          onLocaleChange?.(nextLocale);
          const search = typeof window !== "undefined" ? window.location.search : "";
          const hash = typeof window !== "undefined" ? window.location.hash : "";
          window.location.assign(`${pathname}${search}${hash}`);
        } catch {
          setError(labels.switchFailed);
        }
      });
    },
    [currentLocale, labels.switchFailed, onLocaleChange, pathname, pending],
  );

  const triggerClasses =
    variant === "settings"
      ? "flex min-h-[44px] w-full max-w-md items-center justify-between gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm font-medium text-aipify-text transition hover:border-aipify-companion/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
      : "inline-flex min-h-[44px] max-w-[14rem] items-center gap-2 rounded-xl border border-aipify-border bg-aipify-surface px-2.5 py-2 text-sm font-medium text-aipify-text transition hover:border-aipify-companion/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus sm:max-w-[15rem] sm:px-3";

  return (
    <div ref={rootRef} className="relative shrink-0" aria-busy={pending}>
      <button
        type="button"
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${labels.label}: ${active.nativeLabel}`}
        onClick={() => setOpen((value) => !value)}
        className={triggerClasses}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden className="text-base leading-none">
            {active.flagEmoji}
          </span>
          <span className="truncate">{active.nativeLabel}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-aipify-text-muted transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={labels.openMenu}
          className={`absolute z-50 mt-2 min-w-[13rem] max-w-[min(100vw-2rem,16rem)] overflow-hidden rounded-xl border border-aipify-border bg-aipify-surface py-1 shadow-lg ${
            variant === "settings" ? "left-0" : "right-0"
          }`}
        >
          {options.map((option) => {
            const isActive = option.locale === currentLocale;
            return (
              <li key={option.locale} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={ariaLabelFor(option.nativeLabel, isActive, labels)}
                  disabled={pending}
                  onClick={() => switchLocale(option.locale)}
                  className={[
                    "flex w-full min-h-[44px] items-center gap-3 px-3 py-2.5 text-left text-sm transition",
                    isActive
                      ? "bg-aipify-companion/10 font-semibold text-aipify-companion"
                      : "text-aipify-text hover:bg-aipify-surface-muted",
                  ].join(" ")}
                >
                  <span aria-hidden className="text-base leading-none">
                    {option.flagEmoji}
                  </span>
                  <span className="flex-1">{option.nativeLabel}</span>
                  {isActive ? (
                    <Check className="h-4 w-4 shrink-0 text-aipify-companion" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <div
          className="absolute right-0 top-full z-50 mt-14 flex max-w-xs flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-sm"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="font-semibold text-aipify-companion underline-offset-2 hover:underline"
            onClick={() => setError(null)}
          >
            {labels.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function coerceClientAppLocale(value: string): AppLocale {
  return isAppLocale(value) ? value : "en";
}
