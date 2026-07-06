"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { WebsiteKompisDomainSettingsView } from "@/lib/marketing/website-kompis-domain-settings";
import type { WebsiteKompisInstallConfig } from "@/lib/marketing/website-kompis-install-config";
import type { WebsiteKompisDomainSettingsLabels } from "@/lib/domain-license/labels";
import {
  buildWebsiteKompisScriptEmbedSnippet,
  normalizeWebsiteKompisEmbedDomain,
  sanitizeWebsiteKompisEmbedLocale,
  WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN,
} from "@/lib/marketing/website-kompis-embed";

type SettingsResponse = {
  found: boolean;
  settings?: WebsiteKompisDomainSettingsView;
  error?: string;
  reason?: string;
};

const ICON_VARIANTS = [
  "companion-purple-default",
  "companion-purple-dark",
  "companion-purple-light",
] as const;

const FALLBACK_TONES = ["professional-friendly", "short-direct"] as const;
const WELCOME_VARIANTS = ["standard", "compact"] as const;

export function WebsiteKompisDomainSettingsCard({
  domainId,
  domain,
  labels,
}: {
  domainId: string;
  domain: string;
  labels: WebsiteKompisDomainSettingsLabels;
}) {
  const [settings, setSettings] = useState<WebsiteKompisDomainSettingsView | null>(null);
  const [draft, setDraft] = useState<WebsiteKompisInstallConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const normalizedDomain = useMemo(() => normalizeWebsiteKompisEmbedDomain(domain), [domain]);

  const embedCoreOrigin = useMemo(() => {
    if (!settings?.metadataUrl) {
      return WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN;
    }
    try {
      return new URL(settings.metadataUrl).origin;
    } catch {
      return WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN;
    }
  }, [settings?.metadataUrl]);

  const installSnippet = useMemo(() => {
    if (!settings?.installId || !normalizedDomain) {
      return null;
    }
    return buildWebsiteKompisScriptEmbedSnippet({
      coreOrigin: embedCoreOrigin,
      installId: settings.installId,
      domain: normalizedDomain,
      locale: sanitizeWebsiteKompisEmbedLocale(draft?.defaultLocale ?? "no"),
    });
  }, [draft?.defaultLocale, embedCoreOrigin, normalizedDomain, settings?.installId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/app/domains/website-kompis?domain_id=${encodeURIComponent(domainId)}`);
    const body = (await res.json()) as SettingsResponse;
    if (!res.ok || !body.settings) {
      setSettings(null);
      setDraft(null);
      setError(body.error ?? labels.loadError);
      setLoading(false);
      return;
    }
    setSettings(body.settings);
    setDraft(body.settings.config);
    setLoading(false);
  }, [domainId, labels.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    if (!draft || !settings?.canManage) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const res = await fetch("/api/app/domains/website-kompis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain_id: domainId,
        action: "update",
        patch: {
          enabled: draft.enabled,
          iconVariant: draft.iconVariant,
          fallbackTone: draft.fallbackTone,
          welcomeMessageVariant: draft.welcomeMessageVariant,
          sources: {
            faq: draft.sources.faq,
            currentPage: draft.sources.currentPage,
            aipifyPublic: draft.sources.aipifyPublic,
            publicSiteIndex: false,
          },
        },
      }),
    });

    const body = (await res.json()) as SettingsResponse;
    setSaving(false);

    if (!res.ok || !body.settings) {
      setError(body.error ?? labels.saveError);
      return;
    }

    setSettings(body.settings);
    setDraft(body.settings.config);
    setSaved(true);
  }

  async function handleCopySnippet() {
    if (!installSnippet) return;
    try {
      await navigator.clipboard.writeText(installSnippet);
      setSnippetCopied(true);
      window.setTimeout(() => setSnippetCopied(false), 2000);
    } catch {
      setSnippetCopied(false);
    }
  }

  function lockMessage(): string {
    if (!settings) return labels.unableToVerifyLicense;
    switch (settings.availability.reason) {
      case "license_inactive":
        return labels.licenseInactive;
      case "entitlement_missing":
        return labels.licenseNotIncluded;
      case "domain_unverified":
        return labels.domainMustBeVerified;
      case "install_missing":
        return labels.installMissing;
      case "license_unknown":
        return labels.unableToVerifyLicense;
      default:
        return labels.licenseRequired;
    }
  }

  if (loading) {
    return (
      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/70 p-4 text-sm text-gray-600">
        {labels.title}
      </div>
    );
  }

  const locked = !settings?.canManage || !settings.availability.available;

  return (
    <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            settings?.availability.available
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {settings?.availability.available ? labels.licenseAvailable : labels.licenseRequired}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-gray-700">{labels.domainLabel}</dt>
          <dd>{domain}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">{labels.installIdLabel}</dt>
          <dd className="break-all">{settings?.installId ?? labels.installPending}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-gray-700">{labels.metadataUrlLabel}</dt>
          <dd className="break-all">{settings?.metadataUrl ?? labels.metadataPending}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white/80 p-3">
        <p className="text-sm font-semibold text-gray-900">Installer Website Kompis</p>
        <p className="mt-1 text-sm text-gray-600">
          Legg denne koden inn før {"</body>"} på {normalizedDomain ?? "DOMENE"}.
        </p>

        {installSnippet ? (
          <div className="mt-3 space-y-2">
            <pre className="max-h-48 overflow-x-auto rounded-md border border-gray-200 bg-gray-950 p-3 text-xs leading-relaxed text-gray-100">
              <code>{installSnippet}</code>
            </pre>
            <button
              type="button"
              onClick={() => void handleCopySnippet()}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {snippetCopied ? "Kopiert" : "Kopier kode"}
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            Installasjonskode blir tilgjengelig når INSTALL_ID og DOMENE er klare.
          </p>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-600">{labels.sourcePriority}</p>
      <p className="mt-1 text-sm text-gray-500">{labels.publicSiteIndexComingLater}</p>

      {locked ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {lockMessage()}
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-3 text-sm text-emerald-700">{labels.saved}</p>
      ) : null}

      {draft ? (
        <div className={`mt-4 space-y-3 ${locked ? "pointer-events-none opacity-60" : ""}`}>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={draft.enabled}
              disabled={locked || saving}
              onChange={(event) => setDraft({ ...draft, enabled: event.target.checked })}
            />
            {labels.enabledLabel}
          </label>

          <label className="block text-sm text-gray-800">
            <span className="mb-1 block font-medium">{labels.iconVariantLabel}</span>
            <select
              value={draft.iconVariant}
              disabled={locked || saving}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  iconVariant: event.target.value as WebsiteKompisInstallConfig["iconVariant"],
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {ICON_VARIANTS.map((variant) => (
                <option key={variant} value={variant}>
                  {labels.iconVariants[variant]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-gray-800">
            <span className="mb-1 block font-medium">{labels.fallbackToneLabel}</span>
            <select
              value={draft.fallbackTone}
              disabled={locked || saving}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  fallbackTone: event.target.value as WebsiteKompisInstallConfig["fallbackTone"],
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {FALLBACK_TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {labels.fallbackTones[tone]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-gray-800">
            <span className="mb-1 block font-medium">{labels.welcomeVariantLabel}</span>
            <select
              value={draft.welcomeMessageVariant}
              disabled={locked || saving}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  welcomeMessageVariant: event.target
                    .value as WebsiteKompisInstallConfig["welcomeMessageVariant"],
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {WELCOME_VARIANTS.map((variant) => (
                <option key={variant} value={variant}>
                  {labels.welcomeVariants[variant]}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-2 text-sm text-gray-800">
            <legend className="font-medium">{labels.sourcesLabel}</legend>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.sources.faq}
                disabled={locked || saving}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    sources: { ...draft.sources, faq: event.target.checked },
                  })
                }
              />
              {labels.sourceFaq}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.sources.currentPage}
                disabled={locked || saving}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    sources: { ...draft.sources, currentPage: event.target.checked },
                  })
                }
              />
              {labels.sourceCurrentPage}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.sources.aipifyPublic}
                disabled={locked || saving}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    sources: { ...draft.sources, aipifyPublic: event.target.checked },
                  })
                }
              />
              {labels.sourceAipifyPublic}
            </label>
          </fieldset>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={locked || saving}
              onClick={() => void handleSave()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? labels.saving : labels.save}
            </button>
            <button
              type="button"
              disabled={locked || saving}
              onClick={() => setDraft(settings?.config ?? draft)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-60"
            >
              {labels.reset}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
