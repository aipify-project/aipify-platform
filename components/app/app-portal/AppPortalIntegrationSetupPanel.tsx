"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  parseAppPortalIntegrationSetup,
  type AppPortalIntegrationSetup,
  type AppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";

type AppPortalIntegrationSetupPanelProps = {
  providerKey: string;
  labels: AppPortalIntegrationsLabels;
};

type SetupMode = "oauth" | "manual";

export function AppPortalIntegrationSetupPanel({
  providerKey,
  labels,
}: AppPortalIntegrationSetupPanelProps) {
  const [setup, setSetup] = useState<AppPortalIntegrationSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<SetupMode>("manual");
  const [permissionLevel, setPermissionLevel] = useState("read_only");
  const [approvedScopes, setApprovedScopes] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [done, setDone] = useState(false);

  const flowSteps = useMemo(
    () => [
      "select_platform",
      "explain_needs",
      "find_api_key",
      "choose_permissions",
      "validate_connection",
      "access_summary",
      "save_securely",
      "log_action",
    ],
    []
  );

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/app-portal/integrations/${encodeURIComponent(providerKey)}`);
    if (res.ok) {
      const parsed = parseAppPortalIntegrationSetup(await res.json());
      setSetup(parsed);
      if (parsed?.oauth_available) setMode("oauth");
      else setMode("manual");
      if (parsed?.connection?.id) setConnectionId(parsed.connection.id);
      setPermissionLevel(parsed?.default_permission_level ?? "read_only");
    }
    setLoading(false);
  }, [providerKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveConnection() {
    if (!approvedScopes) return;
    setActing(true);
    const res = await fetch("/api/app-portal/integrations/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_key: providerKey,
        setup_type: mode,
        permission_level: permissionLevel,
        approved_scopes: setup?.recommended_scopes ?? [],
        api_key: mode === "manual" ? apiKey : null,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { connection_id?: string };
      if (body.connection_id) setConnectionId(body.connection_id);
      setStep(6);
    }
    setActing(false);
  }

  async function testConnection() {
    if (!connectionId) return;
    setActing(true);
    const res = await fetch("/api/app-portal/integrations/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    if (res.ok) {
      setStep(7);
      setDone(true);
      await load();
    }
    setActing(false);
  }

  async function removeConnection() {
    if (!connectionId) return;
    setActing(true);
    await fetch("/api/app-portal/integrations/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    setConnectionId(null);
    setDone(false);
    setStep(0);
    setApiKey("");
    await load();
    setActing(false);
  }

  if (loading && !setup) {
    return <p className="p-6 text-sm text-slate-500">{labels.setup.loading}</p>;
  }

  if (!setup) {
    return <p className="p-6 text-sm text-red-600">{labels.setup.loading}</p>;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/app/platform/integrations" className="text-sm font-medium text-indigo-700">
          ← {labels.setup.back}
        </Link>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h1 className="text-xl font-semibold text-slate-900">{labels.setup.successTitle}</h1>
          <p className="mt-2 text-sm text-slate-700">{labels.setup.successBody}</p>
        </div>
      </div>
    );
  }

  const currentStepKey = flowSteps[step] ?? flowSteps[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/app/platform/integrations" className="text-sm font-medium text-indigo-700">
        ← {labels.setup.back}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {labels.setup.title}: {setup.display_name}
        </h1>
        <ol className="mt-4 flex flex-wrap gap-2">
          {flowSteps.map((key, index) => (
            <li
              key={key}
              className={`rounded-full px-3 py-1 text-xs ${
                index === step ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {labels.setup.stepLabels[key]}
            </li>
          ))}
        </ol>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-900">{labels.setup.stepLabels[currentStepKey]}</h2>

        {step === 0 && (
          <>
            <p className="text-sm text-slate-600">{labels.setup.whyAccess}</p>
            {setup.oauth_available ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800">{labels.setup.selectSetupType}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "oauth"}
                    onChange={() => setMode("oauth")}
                  />
                  {labels.setup.oauthOption}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "manual"}
                    onChange={() => setMode("manual")}
                  />
                  {labels.setup.manualOption}
                </label>
              </div>
            ) : null}
          </>
        )}

        {step === 1 && (
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>{labels.setup.whatAipifyReads}</li>
            <li>{labels.setup.whatAipifyCannotDo}</li>
            <li>{labels.setup.credentialStorage}</li>
          </ul>
        )}

        {step === 2 && mode === "manual" && (
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {setup.manual_steps.map((key) => (
              <li key={key}>{labels.setup.manualStepLabels[key]}</li>
            ))}
          </ol>
        )}

        {step === 2 && mode === "oauth" && (
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {setup.oauth_steps.map((key) => (
              <li key={key}>{labels.setup.oauthStepLabels[key]}</li>
            ))}
          </ol>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-slate-600">{labels.setup.permissionPreview}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {setup.recommended_scopes.map((scope) => (
                <li key={scope} className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs">
                  {scope}
                </li>
              ))}
            </ul>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={approvedScopes}
                onChange={(e) => setApprovedScopes(e.target.checked)}
              />
              <span>{labels.setup.approveScopes}</span>
            </label>
            <p className="text-xs text-slate-500">{labels.setup.whatNotToEnable}</p>
          </>
        )}

        {step === 4 && mode === "manual" && (
          <>
            <label className="block text-sm font-medium text-slate-800">{labels.setup.apiKeyLabel}</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={labels.setup.apiKeyPlaceholder}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              autoComplete="off"
            />
            {setup.connection?.masked_credential_hint ? (
              <p className="mt-2 text-xs text-slate-500">
                {labels.setup.apiKeyMaskedNote}: {setup.connection.masked_credential_hint}
              </p>
            ) : null}
          </>
        )}

        {step === 4 && mode === "oauth" && (
          <button
            type="button"
            disabled={!approvedScopes || acting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={() => setStep(5)}
          >
            {labels.setup.connectOAuth}
          </button>
        )}

        {step === 5 && (
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{labels.setup.accessSummaryTitle}</p>
            <p>{labels.setup.whatAipifyReads}</p>
            <p>{labels.setup.whatAipifyCannotDo}</p>
            <p>{labels.setup.revokeAccess}</p>
            <p>{labels.setup.rotateKey}</p>
          </div>
        )}

        {step >= 6 && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={acting || !approvedScopes || (mode === "manual" && apiKey.length < 8 && !connectionId)}
              onClick={() => void saveConnection()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {acting ? labels.setup.saving : labels.setup.save}
            </button>
            {connectionId ? (
              <>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void testConnection()}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
                >
                  {acting ? labels.setup.testing : labels.setup.test}
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void removeConnection()}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700"
                >
                  {labels.setup.remove}
                </button>
              </>
            ) : null}
          </div>
        )}
      </section>

      <div className="flex justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="text-sm text-slate-600 disabled:opacity-40"
        >
          {labels.setup.backStep}
        </button>
        {step < 6 ? (
          <button
            type="button"
            disabled={step === 3 && !approvedScopes}
            onClick={() => setStep((s) => Math.min(flowSteps.length - 1, s + 1))}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.setup.continueStep}
          </button>
        ) : null}
      </div>
    </div>
  );
}
