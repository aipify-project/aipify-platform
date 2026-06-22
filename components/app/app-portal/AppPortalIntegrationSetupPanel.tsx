"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  IntegrationAuthHelpPanel,
  IntegrationConnectionStatusBadge,
  IntegrationSetupErrorPanel,
  buildIntegrationErrorPanelLabels,
} from "@/components/app/integration-setup";
import {
  INTEGRATION_WIZARD_STEPS,
  mapConnectionStatusToSemantic,
  parseIntegrationError,
  parseIntegrationErrorFromResponse,
  type IntegrationErrorGuidance,
  wizardStepAt,
} from "@/lib/install/integration-setup";
import {
  parseAppPortalIntegrationSetup,
  type AppPortalIntegrationSetup,
  type AppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";
import type { Translator } from "@/lib/i18n/translate";

type AppPortalIntegrationSetupPanelProps = {
  providerKey: string;
  labels: AppPortalIntegrationsLabels;
  /** Optional translator for error guidance keys (server passes via closure). */
  t?: Translator;
};

type SetupMode = "oauth" | "manual";

function maskCredential(value: string): string {
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.min(12, value.length - 4))}${value.slice(-4)}`;
}

export function AppPortalIntegrationSetupPanel({
  providerKey,
  labels,
  t,
}: AppPortalIntegrationSetupPanelProps) {
  const [setup, setSetup] = useState<AppPortalIntegrationSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<SetupMode>("manual");
  const [permissionLevel, setPermissionLevel] = useState("read_only");
  const [approvedScopes, setApprovedScopes] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [done, setDone] = useState(false);
  const [testError, setTestError] = useState<IntegrationErrorGuidance | null>(null);

  const currentStep = wizardStepAt(stepIndex);
  const flowSteps = INTEGRATION_WIZARD_STEPS;

  const translate = useMemo(() => {
    if (t) return t;
    return (key: string) => key;
  }, [t]);

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

  const connectionStatus = useMemo(() => {
    if (!setup?.connection) return "pending";
    return mapConnectionStatusToSemantic(setup.connection.status, {
      permissionLevel: setup.connection.permission_level,
      hasCredential: Boolean(setup.connection.masked_credential_hint || connectionId),
      lastTestSuccessAt: setup.connection.last_test_success_at,
      lastTestFailedAt: setup.connection.last_test_failed_at,
      lastTestError: setup.connection.last_test_error ?? null,
    });
  }, [setup, connectionId]);

  const statusLabelKey = {
    pending: "pending",
    missing_info: "missingInfo",
    needs_review: "needsReview",
    connected: "connected",
    failed: "failed",
    read_only: "readOnly",
  } as const;
  const statusLabel = labels.setup.statuses[statusLabelKey[connectionStatus]];

  const isUnonight = providerKey === "unonight";

  async function saveConnection() {
    if (!approvedScopes) return;
    setActing(true);
    setTestError(null);
    const res = await fetch("/api/app-portal/integrations/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_key: providerKey,
        setup_type: mode,
        permission_level: permissionLevel,
        approved_scopes: setup?.recommended_scopes ?? [],
        api_key: mode === "manual" ? apiKey : null,
        base_url: isUnonight ? baseUrl || null : null,
        connection_name: isUnonight ? connectionName || null : null,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { connection_id?: string };
      if (body.connection_id) setConnectionId(body.connection_id);
      await load();
    } else {
      const guidance = await parseIntegrationErrorFromResponse(res);
      setTestError(guidance);
    }
    setActing(false);
  }

  async function testConnection() {
    if (!connectionId) return;
    setActing(true);
    setTestError(null);
    const res = await fetch("/api/app-portal/integrations/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    if (res.ok) {
      setStepIndex(flowSteps.indexOf("confirm_activation"));
      setDone(true);
      await load();
    } else {
      const guidance = await parseIntegrationErrorFromResponse(res);
      setTestError(guidance);
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
    setStepIndex(0);
    setApiKey("");
    setTestError(null);
    await load();
    setActing(false);
  }

  if (loading && !setup) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.canvas}`}>
        <p className="text-sm text-aipify-text-secondary">{labels.setup.loading}</p>
      </div>
    );
  }

  if (!setup) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.canvas}`}>
        <p className="text-sm text-red-600">{labels.setup.loading}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <Link
          href="/app/platform/integrations"
          className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
        >
          ← {labels.setup.back}
        </Link>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
          <h1 className={AppPremiumShell.pageTitle}>{labels.setup.successTitle}</h1>
          <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.setup.successBody}</p>
          <p className="mt-3 text-sm text-aipify-text-secondary">{labels.setup.confirmActivationBody}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href={labels.setup.kcLinks.faqHref} className="font-medium text-aipify-companion hover:underline">
            {labels.setup.kcLinks.faq}
          </Link>
          <Link href={labels.setup.kcLinks.setupGuideHref} className="font-medium text-aipify-companion hover:underline">
            {labels.setup.kcLinks.setupGuide}
          </Link>
        </div>
      </div>
    );
  }

  const errorPanelLabels =
    testError &&
    buildIntegrationErrorPanelLabels(testError, translate, {
      findKeyHref: labels.setup.errorGuidance.findKeyHref,
      contactSupportHref: labels.setup.errorGuidance.contactSupportHref,
    });

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <Link
        href="/app/platform/integrations"
        className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
      >
        ← {labels.setup.back}
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={AppPremiumShell.eyebrow}>{labels.setup.plainLanguage.connectionTest}</p>
            <h1 className={AppPremiumShell.pageTitle}>
              {labels.setup.title}: {setup.display_name}
            </h1>
          </div>
          <IntegrationConnectionStatusBadge
            status={setup.connection?.status}
            label={statusLabel}
            permissionLevel={permissionLevel}
            hasCredential={Boolean(connectionId || setup.connection?.masked_credential_hint)}
            lastTestSuccessAt={setup.connection?.last_test_success_at}
            lastTestFailedAt={setup.connection?.last_test_failed_at}
            lastTestError={setup.connection?.last_test_error ?? null}
          />
        </div>

        <ol className="flex flex-wrap gap-2" aria-label={labels.setup.connectionStatusLabel}>
          {flowSteps.map((key, index) => (
            <li
              key={key}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                index === stepIndex
                  ? "bg-violet-700 text-white"
                  : index < stepIndex
                    ? "bg-violet-50 text-violet-800 ring-1 ring-violet-100"
                    : "bg-aipify-surface text-aipify-text-secondary ring-1 ring-aipify-border"
              }`}
            >
              {labels.setup.wizard7StepLabels[key]}
            </li>
          ))}
        </ol>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <h2 className={AppPremiumShell.sectionTitle}>
            {labels.setup.wizard7StepLabels[currentStep]}
          </h2>

          {currentStep === "choose_system" && (
            <>
              <p className={AppPremiumShell.sectionSubtitle}>{labels.setup.whyAccess}</p>
              {setup.oauth_available ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-aipify-text">{labels.setup.selectSetupType}</p>
                  <label className="flex items-center gap-2 text-sm text-aipify-text-secondary">
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === "oauth"}
                      onChange={() => setMode("oauth")}
                    />
                    {labels.setup.oauthOption}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-aipify-text-secondary">
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

          {currentStep === "explain_access" && (
            <>
              <p className="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3 text-sm text-aipify-text-secondary">
                {labels.setup.securityWarnings.readOnlyDefault}
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-aipify-text-secondary">
                <li>{labels.setup.whatAipifyReads}</li>
                <li>{labels.setup.whatAipifyCannotDo}</li>
                <li>{labels.setup.credentialStorage}</li>
                <li>{labels.setup.plainLanguage.readOnly}</li>
              </ul>
              <div>
                <p className="text-sm font-medium text-aipify-text">{labels.setup.plainLanguage.accessScope}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {setup.recommended_scopes.map((scope) => (
                    <li key={scope} className="rounded-lg bg-aipify-canvas px-3 py-2 font-mono text-xs text-aipify-text-secondary">
                      {scope}
                    </li>
                  ))}
                </ul>
              </div>
              <label className="flex items-start gap-2 text-sm text-aipify-text-secondary">
                <input
                  type="checkbox"
                  checked={approvedScopes}
                  onChange={(e) => setApprovedScopes(e.target.checked)}
                />
                <span>{labels.setup.approveScopes}</span>
              </label>
              <p className="text-xs text-aipify-text-muted">{labels.setup.whatNotToEnable}</p>
              <p className="text-xs text-aipify-text-muted">{labels.setup.securityWarnings.noWriteWithoutApproval}</p>
            </>
          )}

          {currentStep === "find_credential" && (
            <>
              {mode === "manual" ? (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
                  {setup.manual_steps.map((key) => (
                    <li key={key}>{labels.setup.manualStepLabels[key]}</li>
                  ))}
                </ol>
              ) : (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
                  {setup.oauth_steps.map((key) => (
                    <li key={key}>{labels.setup.oauthStepLabels[key]}</li>
                  ))}
                </ol>
              )}
              <Link
                href={labels.setup.kcLinks.findApiKeyHref}
                className="inline-block text-sm font-medium text-aipify-companion hover:underline"
              >
                {labels.setup.kcLinks.findApiKey}
              </Link>
            </>
          )}

          {currentStep === "enter_credential" && (
            <>
              {mode === "manual" ? (
                <>
                  {isUnonight ? (
                    <>
                      <label className="block text-sm font-medium text-aipify-text">
                        {labels.setup.unonight?.connectionNameLabel ?? labels.setup.plainLanguage.secureConnectionKey}
                      </label>
                      <input
                        type="text"
                        value={connectionName}
                        onChange={(e) => setConnectionName(e.target.value)}
                        placeholder={labels.setup.unonight?.connectionNamePlaceholder ?? ""}
                        className={`mt-2 w-full rounded-lg border border-aipify-border bg-aipify-surface px-3 py-2 text-sm ${AppPremiumShell.focusRing}`}
                      />
                      <label className="mt-4 block text-sm font-medium text-aipify-text">
                        {labels.setup.unonight?.baseUrlLabel ?? "API base URL"}
                      </label>
                      <p className="mt-1 text-xs text-aipify-text-muted">
                        {labels.setup.unonight?.baseUrlHint ?? ""}
                      </p>
                      <input
                        type="url"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder={labels.setup.unonight?.baseUrlPlaceholder ?? ""}
                        className={`mt-2 w-full rounded-lg border border-aipify-border bg-aipify-surface px-3 py-2 text-sm ${AppPremiumShell.focusRing}`}
                      />
                    </>
                  ) : null}
                  <label className="block text-sm font-medium text-aipify-text">
                    {labels.setup.plainLanguage.secureConnectionKey}
                  </label>
                  <p className="mt-1 text-xs text-aipify-text-muted">{labels.setup.apiKeyLabel}</p>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={labels.setup.apiKeyPlaceholder}
                    className={`mt-2 w-full rounded-lg border border-aipify-border bg-aipify-surface px-3 py-2 text-sm ${AppPremiumShell.focusRing}`}
                    autoComplete="off"
                    aria-describedby="api-key-hint"
                  />
                  {apiKey.length > 0 ? (
                    <p id="api-key-hint" className="mt-2 font-mono text-xs text-aipify-text-muted">
                      {labels.setup.apiKeyMaskedNote}: {maskCredential(apiKey)}
                    </p>
                  ) : null}
                  {setup.connection?.masked_credential_hint ? (
                    <p className="mt-2 text-xs text-aipify-text-muted">
                      {labels.setup.apiKeyMaskedNote}: {setup.connection.masked_credential_hint}
                    </p>
                  ) : null}
                </>
              ) : (
                <button
                  type="button"
                  disabled={!approvedScopes || acting}
                  className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                  onClick={() => setStepIndex(flowSteps.indexOf("test_connection"))}
                >
                  {labels.setup.connectOAuth}
                </button>
              )}
            </>
          )}

          {currentStep === "test_connection" && (
            <>
              <p className={AppPremiumShell.sectionSubtitle}>{labels.setup.plainLanguage.connectionTest}</p>
              {testError && errorPanelLabels ? (
                <IntegrationSetupErrorPanel
                  guidance={testError}
                  labels={errorPanelLabels}
                  onRetry={() => void testConnection()}
                  retryDisabled={acting || !connectionId}
                />
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={acting || !approvedScopes || (mode === "manual" && apiKey.length < 8 && !connectionId)}
                  onClick={() => void saveConnection()}
                  className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                >
                  {acting ? labels.setup.saving : labels.setup.save}
                </button>
                {connectionId ? (
                  <>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void testConnection()}
                      className={`rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text ${AppPremiumShell.focusRing}`}
                    >
                      {acting ? labels.setup.testing : labels.setup.test}
                    </button>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void removeConnection()}
                      className={`rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 ${AppPremiumShell.focusRing}`}
                    >
                      {labels.setup.remove}
                    </button>
                  </>
                ) : null}
              </div>
            </>
          )}

          {currentStep === "access_summary" && (
            <div className="space-y-2 text-sm text-aipify-text-secondary">
              <p className="font-medium text-aipify-text">{labels.setup.accessSummaryTitle}</p>
              <p>{labels.setup.whatAipifyReads}</p>
              <p>{labels.setup.whatAipifyCannotDo}</p>
              <p>{labels.setup.revokeAccess}</p>
              <p>{labels.setup.rotateKey}</p>
              <p>{labels.setup.securityWarnings.revokeAnytime}</p>
              <p className="text-xs text-aipify-text-muted">{labels.setup.securityWarnings.credentialsEncrypted}</p>
            </div>
          )}

          {currentStep === "confirm_activation" && (
            <div className="space-y-4">
              <p className={AppPremiumShell.sectionSubtitle}>{labels.setup.confirmActivationBody}</p>
              <button
                type="button"
                disabled={acting || !connectionId}
                onClick={() => void testConnection()}
                className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {acting ? labels.setup.activating : labels.setup.activateCta}
              </button>
            </div>
          )}

          <div className="flex justify-between border-t border-aipify-border pt-4">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
              className="text-sm text-aipify-text-secondary disabled:opacity-40"
            >
              {labels.setup.backStep}
            </button>
            {stepIndex < flowSteps.length - 1 && currentStep !== "test_connection" ? (
              <button
                type="button"
                disabled={
                  (currentStep === "explain_access" && !approvedScopes) ||
                  (currentStep === "enter_credential" && mode === "manual" && apiKey.length < 8 && !connectionId)
                }
                onClick={() => setStepIndex((s) => Math.min(flowSteps.length - 1, s + 1))}
                className={`rounded-lg bg-aipify-text px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {labels.setup.continueStep}
              </button>
            ) : null}
          </div>
        </section>

        <IntegrationAuthHelpPanel providerKey={providerKey} labels={labels.setup.authHelp} />
      </div>

      <footer className="flex flex-wrap gap-4 text-sm">
        <Link href={labels.setup.kcLinks.setupGuideHref} className="font-medium text-aipify-companion hover:underline">
          {labels.setup.kcLinks.setupGuide}
        </Link>
        <Link href={labels.setup.kcLinks.faqHref} className="font-medium text-aipify-companion hover:underline">
          {labels.setup.kcLinks.faq}
        </Link>
      </footer>
    </div>
  );
}

/** Parse a raw error string for inline use without a Response object. */
export { parseIntegrationError };
