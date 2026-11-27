"use client";

import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publicFooterLocaleOptions,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";

type Props = {
  locale: PublicFooterEnabledLocale;
  languageMenuLabel: string;
  languageSwitchFailed: string;
};

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function KompisWebSalesLocaleSwitcher({
  locale,
  languageMenuLabel,
  languageSwitchFailed,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const localeOptions = publicFooterLocaleOptions();
  const activeLocale = localeOptions.find((opt) => opt.locale === locale) ?? localeOptions[0];

  function switchLocale(next: PublicFooterEnabledLocale) {
    if (next === locale || pending) return;
    setOpen(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        if (!res.ok) {
          setError(languageSwitchFailed);
          return;
        }
        setError(null);
        router.refresh();
      } catch {
        setError(languageSwitchFailed);
      }
    });
  }

  return (
    <div className="kompis-web-sales-lang" ref={rootRef}>
      <button
        type="button"
        className="kompis-web-sales-lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={languageMenuLabel}
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
        }}
      >
        <Image src={activeLocale.flagSrc} alt="" width={20} height={14} />
        <span className="kompis-web-sales-lang-label">{activeLocale.nativeLabel}</span>
        <ChevronDown />
      </button>
      <div
        id={menuId}
        className="kompis-web-sales-lang-menu"
        role="listbox"
        aria-label={languageMenuLabel}
        hidden={!open}
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
      {error ? (
        <p className="kompis-web-sales-alert" role="alert" style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, whiteSpace: "nowrap" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
