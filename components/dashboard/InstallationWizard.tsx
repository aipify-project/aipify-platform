"use client";

import { useCallback, useState } from "react";
import { AipifyPulse } from "@/components/branding";
import {
  MODULE_CATALOG,
  WIZARD_STEPS,
  type InstallationWizardLabels,
  type WizardStep,
} from "@/lib/platform/installation-engine";
import type { SystemType } from "@/lib/tenant/types";
import { CUSTOMER_ACCENT } from "@/lib/dashboard/customer-tokens";

type InstallationWizardProps = {
  locale: string;
  labels: InstallationWizardLabels;
  onComplete?: () => void;
};

export default function InstallationWizard({
  labels,
  onComplete,
}: InstallationWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const [installationId, setInstallationId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [systemType, setSystemType] = useState<SystemType>("custom");
  const [selectedModules, setSelectedModules] = useState<string[]>(["support_ai"]);
  const [metaTag, setMetaTag] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [healthResult, setHealthResult] = useState<{
    score: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => {
    setStep(1);
    setInstallationId(null);
    setName("");
    setDomain("");
    setSystemType("custom");
    setSelectedModules(["support_ai"]);
    setMetaTag(null);
    setToken(null);
    setHealthResult(null);
    setError(null);
  }, []);

  async function startWizard() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/installations/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, system_type: systemType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? labels.error);
      setInstallationId(data.installation_id);
      setToken(data.installation_token ?? null);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.error);
    } finally {
      setLoading(false);
    }
  }

  async function patchWizard(
    wizardStep: number,
    payload: Record<string, unknown> = {}
  ) {
    if (!installationId) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/installations/${installationId}/wizard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: wizardStep, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? labels.error);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleDomainNext() {
    const data = await patchWizard(2, { domain });
    if (data) setStep(3);
  }

  async function handleStartVerification() {
    const data = await patchWizard(3, { action: "start_verification" });
    if (data?.meta_tag) setMetaTag(data.meta_tag);
  }

  async function handleConfirmVerification() {
    const data = await patchWizard(3, { action: "confirm_verification" });
    if (data?.verified) setStep(4);
  }

  async function handleModulesNext() {
    const data = await patchWizard(4, { modules: selectedModules });
    if (data) setStep(5);
  }

  async function handleGenerateCredentials() {
    const data = await patchWizard(5);
    if (data?.installation_token) {
      setToken(data.installation_token);
      setStep(6);
    }
  }

  async function handleActivate() {
    const data = await patchWizard(6, { activate: true });
    if (data?.activated) setStep(7);
  }

  async function handleHealthScan() {
    const data = await patchWizard(7);
    if (data?.score != null) {
      setHealthResult({ score: data.score, status: data.status });
      onComplete?.();
    }
  }

  function toggleModule(key: string) {
    setSelectedModules((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  }

  async function copyToken(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm ${CUSTOMER_ACCENT.gradientButton}`}
      >
        {labels.start}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.subtitle}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {WIZARD_STEPS.map((item) => (
          <span
            key={item.step}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              step === item.step
                ? "bg-violet-100 text-violet-800"
                : step > item.step
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {labels.steps[item.key]}
          </span>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {labels.nameLabel}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            {labels.systemType}
            <select
              value={systemType}
              onChange={(e) => setSystemType(e.target.value as SystemType)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {Object.entries(labels.systemTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={loading || !name.trim()}
            onClick={startWizard}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? labels.loading : labels.next}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {labels.domainLabel}
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={labels.domainPlaceholder}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="rounded-lg border px-4 py-2 text-sm">
              {labels.back}
            </button>
            <button
              type="button"
              disabled={loading || !domain.trim()}
              onClick={handleDomainNext}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? labels.loading : labels.next}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{labels.verifyHint}</p>
          {!metaTag ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleStartVerification}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? labels.loading : labels.startVerification}
            </button>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.metaTagLabel}
              </p>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-green-300">
                {metaTag}
              </pre>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmVerification}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? labels.loading : labels.confirmVerification}
              </button>
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{labels.modulesHint}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {MODULE_CATALOG.map((module) => (
              <label
                key={module.key}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module.key)}
                  onChange={() => toggleModule(module.key)}
                />
                {module.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={loading || selectedModules.length === 0}
            onClick={handleModulesNext}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? labels.loading : labels.next}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{labels.credentialsHint}</p>
          {token ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <code className="break-all text-xs text-amber-900">{token}</code>
              <button
                type="button"
                onClick={() => copyToken(token)}
                className="mt-2 text-xs font-semibold text-amber-800"
              >
                {copied ? labels.copied : labels.copy}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateCredentials}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? labels.loading : labels.next}
            </button>
          )}
          {token && (
            <button
              type="button"
              onClick={() => setStep(6)}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {labels.next}
            </button>
          )}
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{labels.activateHint}</p>
          <button
            type="button"
            disabled={loading}
            onClick={handleActivate}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? labels.loading : labels.activate}
          </button>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{labels.healthTitle}</p>
          {!healthResult ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleHealthScan}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading && (
                <AipifyPulse
                  size="sm"
                  title={labels.pulseLabel}
                  aria-label={labels.pulseLabel}
                />
              )}
              {loading ? labels.loading : labels.finish}
            </button>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <p>
                {labels.healthScore}: <strong>{healthResult.score}</strong>
              </p>
              <p>
                {labels.healthStatus[healthResult.status] ?? healthResult.status}
              </p>
              <p className="mt-2 font-medium">{labels.completed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
