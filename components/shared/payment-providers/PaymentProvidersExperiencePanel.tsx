"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PROVIDER_FIELD_DEFINITIONS,
  parsePaymentProvidersCenter,
  type PaymentProviderCard as ProviderCardData,
  type PaymentProviderKey,
  type PaymentProviderLabels,
  type PaymentProvidersCenter,
  type ProviderScope,
} from "@/lib/payment-providers";
import { PaymentProviderCard } from "./PaymentProviderCard";
import { PaymentProviderLogo } from "./PaymentProviderLogo";

type PaymentProvidersExperiencePanelProps = {
  scope: ProviderScope;
  labels: PaymentProviderLabels;
  backHref: string;
};

export function PaymentProvidersExperiencePanel({
  scope,
  labels,
  backHref,
}: PaymentProvidersExperiencePanelProps) {
  const [center, setCenter] = useState<PaymentProvidersCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState<PaymentProviderKey | null>(null);
  const [testing, setTesting] = useState<PaymentProviderKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"test" | "live">("test");
  const [formEnabled, setFormEnabled] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [auditFilter, setAuditFilter] = useState<PaymentProviderKey | null>(null);
  const auditRef = useRef<HTMLElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/payment-providers?scope=${scope}`);
    if (res.ok) setCenter(parsePaymentProvidersCenter(await res.json()));
    setLoading(false);
  }, [scope]);

  useEffect(() => {
    void load();
  }, [load]);

  function openConfigure(card: ProviderCardData) {
    setConfiguring(card.provider_key);
    setFormMode(card.mode);
    setFormEnabled(card.enabled);
    setFormValues({});
    setTestMessage(null);
  }

  async function handleSave() {
    if (!configuring) return;
    setSaving(true);
    setTestMessage(null);
    const res = await fetch(`/api/payment-providers/${configuring}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scope,
        mode: formMode,
        enabled: formEnabled,
        credentials: formValues,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setConfiguring(null);
      await load();
    }
  }

  async function handleTest(provider: PaymentProviderKey) {
    setTesting(provider);
    setTestMessage(null);
    const res = await fetch(`/api/payment-providers/${provider}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope }),
    });
    setTesting(null);
    if (res.ok) {
      const result = await res.json();
      setTestMessage(
        result.message ??
          (result.success ? labels.testResult.success : labels.testResult.failure)
      );
      await load();
    }
  }

  async function copyWebhook(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  function viewLogs(provider: PaymentProviderKey) {
    setAuditFilter(provider);
    auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading) return <p className="p-6 text-sm text-neutral-500">{labels.loading}</p>;

  const activeCard = configuring
    ? center?.providers.find((p) => p.provider_key === configuring)
    : null;

  const filteredAudit =
    auditFilter === null
      ? center?.recent_audit ?? []
      : (center?.recent_audit ?? []).filter((e) => e.provider_key === auditFilter);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-neutral-600">{labels.subtitle}</p>
        <p className="mt-3 max-w-3xl text-sm text-neutral-500">{labels.visualStandards}</p>
        {center?.principle && (
          <p className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm text-neutral-800">
            {center.principle}
          </p>
        )}
        {center?.paid_access_now && (
          <p className="mt-3 text-sm font-medium text-indigo-800">{labels.paidAccessNow}</p>
        )}
      </div>

      {testMessage && (
        <p
          className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-900"
          role="status"
        >
          {testMessage}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {center?.providers.map((card) => (
          <PaymentProviderCard
            key={card.provider_key}
            card={card}
            labels={labels}
            canEdit={center.can_edit}
            testing={testing === card.provider_key}
            onConfigure={() => openConfigure(card)}
            onTest={() => void handleTest(card.provider_key)}
            onViewLogs={() => viewLogs(card.provider_key)}
            onCopyWebhook={() => void copyWebhook(card.webhook_url)}
            copied={copiedUrl === card.webhook_url}
          />
        ))}
      </div>

      {center?.regional_strategy && Object.keys(center.regional_strategy).length > 0 && (
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-neutral-900">{labels.regionalStrategy}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(center.regional_strategy).map(([region, providers]) => (
              <div key={region} className="rounded-xl bg-neutral-50 px-4 py-3 text-sm">
                <dt className="font-medium capitalize text-neutral-900">{region}</dt>
                <dd className="mt-1 text-neutral-600">
                  {providers.map((p) => labels.providers[p as PaymentProviderKey] ?? p).join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section
        ref={auditRef}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-neutral-900">{labels.auditTitle}</h2>
          {auditFilter && (
            <button
              type="button"
              onClick={() => setAuditFilter(null)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {labels.clearLogFilter}
            </button>
          )}
        </div>
        {filteredAudit.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{labels.noAudit}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {filteredAudit.map((entry) => (
              <li key={entry.id} className="rounded-xl bg-neutral-50 px-4 py-3">
                <span className="font-medium text-neutral-900">
                  {labels.providers[entry.provider_key as PaymentProviderKey] ?? entry.provider_key}
                </span>
                {" — "}
                {entry.summary}
                <span className="ml-2 text-xs text-neutral-500">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeCard && configuring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
              <PaymentProviderLogo
                provider={configuring}
                alt={labels.providerProfiles[configuring]?.logoAlt ?? labels.providers[configuring]}
              />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  {labels.configure} — {labels.providers[configuring]}
                </h2>
                <p className="text-sm text-neutral-500">
                  {labels.providerProfiles[configuring]?.tagline}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="text-sm">
                <span className="font-medium text-neutral-700">{labels.fields.mode}</span>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value as "test" | "live")}
                  className="mt-1 block rounded-lg border border-neutral-200 px-3 py-2"
                  disabled={!center?.can_edit}
                >
                  <option value="test">{labels.modes.test}</option>
                  <option value="live">{labels.modes.live}</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  disabled={!center?.can_edit}
                />
                {labels.fields.enabled}
              </label>
            </div>
            <div className="mt-4 space-y-3">
              {PROVIDER_FIELD_DEFINITIONS[configuring].map((field) => {
                const existing = activeCard.credentials.find((c) => c.key === field.key);
                return (
                  <label key={field.key} className="block text-sm">
                    <span className="font-medium text-neutral-700">{field.key}</span>
                    {existing?.configured && (
                      <span className="ml-2 text-xs text-neutral-500">{existing.masked_value}</span>
                    )}
                    <input
                      type={
                        field.category === "secret_key" || field.category === "webhook_secret"
                          ? "password"
                          : "text"
                      }
                      placeholder={existing?.configured ? "••••••••" : ""}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm"
                      disabled={!center?.can_edit}
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConfiguring(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm"
              >
                {labels.back}
              </button>
              {center?.can_edit && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void handleSave()}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
                  >
                    {saving ? labels.saving : labels.save}
                  </button>
                  <button
                    type="button"
                    disabled={testing === configuring}
                    onClick={() => void handleTest(configuring)}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm"
                  >
                    {testing === configuring ? labels.testing : labels.testConnection}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
