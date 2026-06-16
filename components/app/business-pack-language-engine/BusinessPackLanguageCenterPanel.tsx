"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";
import {
  parseBusinessPackLanguageCenter,
  TRANSLATION_STATUS_STYLE,
  type BusinessPackLanguageCenter,
  type PackLanguageRow,
} from "@/lib/aipify/business-pack-language-engine";

type Props = { packKey: string; labels: Record<string, string> };

function LanguageRow({
  lang,
  isDefault,
  labels,
  busy,
  onEnable,
  onDisable,
  onSetDefault,
}: {
  lang: PackLanguageRow;
  isDefault: boolean;
  labels: Record<string, string>;
  busy: boolean;
  onEnable: (locale: string) => void;
  onDisable: (locale: string) => void;
  onSetDefault: (locale: string) => void;
}) {
  const statusLabel = labels[`status_${lang.translation_status}`] ?? lang.translation_status;
  const statusStyle = TRANSLATION_STATUS_STYLE[lang.translation_status] ?? TRANSLATION_STATUS_STYLE.pending;

  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-900">{lang.label}</h3>
          <span className="text-xs uppercase text-gray-400">{lang.locale}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle}`}>{statusLabel}</span>
          {isDefault && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
              {labels.defaultLanguage}
            </span>
          )}
        </div>
        {lang.regional && (
          <p className="mt-1 text-xs text-gray-500">
            {lang.regional.date_format} · {lang.regional.currency} · {lang.regional.timezone}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {!lang.enabled && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onEnable(lang.locale)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-60"
          >
            {labels.enableLanguage}
          </button>
        )}
        {lang.enabled && !isDefault && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSetDefault(lang.locale)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {labels.setDefault}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDisable(lang.locale)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-60"
            >
              {labels.disableLanguage}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export function BusinessPackLanguageCenterPanel({ packKey, labels }: Props) {
  const [center, setCenter] = useState<BusinessPackLanguageCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aipify/business-pack-language-engine/center?packKey=${encodeURIComponent(packKey)}`);
      if (res.ok) setCenter(parseBusinessPackLanguageCenter(await res.json()));
    } catch {
      setCenter(null);
    }
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  const runAction = async (actionType: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-language-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, pack_key: packKey, payload }),
    });
    const body = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) setMessage(body.error ?? labels.actionFailed);
    else setMessage(body.message ?? labels.actionSuccess);
    await load();
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!center?.found || !center.definition) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        description={labels.notFoundMessage}
        action={{ label: labels.backToMarketplace, href: "/app/marketplace/activation" }}
      />
    );
  }

  const { definition, overview } = center;
  const allLanguages = [
    ...(overview?.installed_languages ?? []),
    ...(overview?.available_languages ?? []),
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-medium text-indigo-700">{labels.languageCenter}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{definition.pack_name}</h1>
          {center.principle && <p className="mt-2 text-sm text-gray-600">{center.principle}</p>}
        </div>
        <Link href={packLandingRoute(packKey)} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
          {labels.viewPack}
        </Link>
      </header>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.overview}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.translationCompletion}</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">{overview?.translation_completion_percent ?? 0}%</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.defaultLanguage}</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{overview?.default_language_label ?? "English"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.resourcePath}</dt>
            <dd className="mt-1 font-mono text-xs text-gray-600">{definition.locale_resource_path}</dd>
          </div>
        </dl>
      </section>

      {center.installation_flow && center.installation_flow.length > 0 && !overview?.installation_complete && (
        <section className="rounded-xl border border-violet-100 bg-violet-50/40 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.installationFlow}</h2>
          <ol className="mt-3 flex flex-wrap gap-2">
            {center.installation_flow.map((step, index) => (
              <li key={step} className="flex items-center gap-1 text-sm text-violet-950">
                {index > 0 && <span className="text-violet-300">→</span>}
                <span className="rounded-full bg-white px-2.5 py-0.5 capitalize ring-1 ring-violet-200">{step.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("generate_resources")}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {labels.generateResources}
          </button>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.languages}</h2>
        {allLanguages.map((lang) => (
          <LanguageRow
            key={lang.locale}
            lang={lang}
            isDefault={lang.locale === overview?.default_language}
            labels={labels}
            busy={busy}
            onEnable={(locale) => void runAction("enable_language", { locale })}
            onDisable={(locale) => void runAction("disable_language", { locale })}
            onSetDefault={(locale) => void runAction("set_default_language", { locale })}
          />
        ))}
      </section>

      {center.fallback_rules && center.fallback_rules.length > 0 && (
        <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <h3 className="text-sm font-semibold text-amber-900">{labels.fallbackRules}</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-950">
            {center.fallback_rules.map((rule) => (
              <li key={rule} className="flex gap-2"><span>·</span>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {center.governance_note && (
        <p className="text-center text-xs text-gray-500">{center.governance_note}</p>
      )}
    </div>
  );
}
