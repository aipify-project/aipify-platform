"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  IntegrationAuthHelpPanel,
  IntegrationConnectionStatusBadge,
  IntegrationSetupCompletionSummary,
  IntegrationSetupErrorPanel,
  buildIntegrationErrorPanelLabels,
  mapWizardConnectionPhase,
  type IntegrationSetupCompletionMode,
  type IntegrationWizardConnectionPhase,
} from "@/components/app/integration-setup";
import { IntegrationRemoveDialog } from "@/components/app/app-portal/IntegrationRemoveDialog";
import {
  INTEGRATION_WIZARD_STEPS,
  parseIntegrationError,
  parseIntegrationErrorFromResponse,
  type IntegrationErrorGuidance,
  wizardStepAt,
} from "@/lib/install/integration-setup";
import {
  parseAppPortalIntegrationSetup,
  parseVerificationFromTestResponse,
  interpolateIntegrationLabel,
  type AppPortalIntegrationSetup,
  type AppPortalIntegrationsLabels,
  type IntegrationVerificationMetadata,
} from "@/lib/app-portal/integrations";

type AppPortalIntegrationSetupPanelProps = {
  providerKey: string;
  labels: AppPortalIntegrationsLabels;
};

type SetupMode = "oauth" | "manual";

const WIZARD_PHASE_LABEL_KEYS = {
  pending: "pending",
  credential_saved: "credentialSaved",
  failed: "failed",
  verified_read_only: "verifiedReadOnly",
  active: "active",
} as const;

function maskCredential(value: string): string {
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.min(12, value.length - 4))}${value.slice(-4)}`;
}

function resolveInitialCompletionMode(
  setup: AppPortalIntegrationSetup,
  activationComplete: boolean
): IntegrationSetupCompletionMode | null {
  const connection = setup.connection;
  if (!connection) return null;

  const phase = mapWizardConnectionPhase(connection.status, {
    permissionLevel: connection.permission_level,
    hasCredential: Boolean(connection.masked_credential_hint || connection.id),
    lastTestSuccessAt: connection.last_test_success_at,
    lastTestFailedAt: connection.last_test_failed_at,
    lastTestError: connection.last_test_error ?? null,
    activationComplete,
  });

  if (phase === "active") return "active";
  if (phase === "verified_read_only") return "verified";
  if (phase === "credential_saved") return "credential_saved";
  return null;
}

function resolveInitialStepIndex(setup: AppPortalIntegrationSetup): number {
  const connection = setup.connection;
  if (!connection) return 0;

  const phase = mapWizardConnectionPhase(connection.status, {
    permissionLevel: connection.permission_level,
    hasCredential: Boolean(connection.masked_credential_hint || connection.id),
    lastTestSuccessAt: connection.last_test_success_at,
    lastTestFailedAt: connection.last_test_failed_at,
    lastTestError: connection.last_test_error ?? null,
    activationComplete: false,
  });

  if (phase === "verified_read_only" || phase === "active") {
    return INTEGRATION_WIZARD_STEPS.indexOf("confirm_activation");
  }
  if (phase === "credential_saved" || phase === "failed") {
    return INTEGRATION_WIZARD_STEPS.indexOf("test_connection");
  }
  if (connection.masked_credential_hint) {
    return INTEGRATION_WIZARD_STEPS.indexOf("enter_credential");
  }
  return 0;
}

export function AppPortalIntegrationSetupPanel({
  providerKey,
  labels,
}: AppPortalIntegrationSetupPanelProps) {
  const [setup, setSetup] = useState<AppPortalIntegrationSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<SetupMode>("manual");
  const [permissionLevel, setPermissionLevel] = useState("read_only");
  const [approvedScopes, setApprovedScopes] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [activationComplete, setActivationComplete] = useState(false);
  const [completionMode, setCompletionMode] = useState<IntegrationSetupCompletionMode | null>(null);
  const [verification, setVerification] = useState<IntegrationVerificationMetadata | null>(null);
  const [lastVerifiedAt, setLastVerifiedAt] = useState<string | null>(null);
  const [testError, setTestError] = useState<IntegrationErrorGuidance | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const resumeInitialized = useRef(false);

  const currentStep = wizardStepAt(stepIndex);
  const flowSteps = INTEGRATION_WIZARD_STEPS;

  const translate = useMemo(
    () => (key: string) => labels.setup.messageCatalog[key] ?? key,
    [labels.setup.messageCatalog]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    const res = await fetch(`/api/app-portal/integrations/${encodeURIComponent(providerKey)}`);
    if (res.ok) {
      const parsed = parseAppPortalIntegrationSetup(await res.json());
      if (parsed) {
        setSetup(parsed);
        if (parsed.oauth_available) setMode("oauth");
        else setMode("manual");
        if (parsed.connection?.id) setConnectionId(parsed.connection.id);
        setPermissionLevel(parsed.default_permission_level ?? "read_only");
        if (parsed.connection?.last_verification) {
          setVerification(parsed.connection.last_verification);
        }
        if (parsed.connection?.last_verified_at) {
          setLastVerifiedAt(parsed.connection.last_verified_at);
        } else if (parsed.connection?.last_test_success_at) {
          setLastVerifiedAt(parsed.connection.last_test_success_at);
        }
        if (parsed.connection?.connection_name) {
          setConnectionName(parsed.connection.connection_name);
        }
      } else {
        setSetup(null);
        setLoadFailed(true);
      }
    } else {
      setSetup(null);
      setLoadFailed(true);
    }
    setLoading(false);
  }, [providerKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!setup || resumeInitialized.current) return;
    resumeInitialized.current = true;

    const initialActivation =
      setup.connection?.status === "active" || activationComplete;
    const initialCompletion = resolveInitialCompletionMode(setup, initialActivation);
    if (initialCompletion) {
      setCompletionMode(initialCompletion);
      if (initialCompletion === "active") setActivationComplete(true);
    }
    setStepIndex(resolveInitialStepIndex(setup));
  }, [setup, activationComplete]);

  const hasCredential = Boolean(
    connectionId || setup?.connection?.masked_credential_hint || apiKey.length >= 8
  );

  const wizardPhase = useMemo(() => {
    return mapWizardConnectionPhase(setup?.connection?.status, {
      permissionLevel: setup?.connection?.permission_level ?? permissionLevel,
      hasCredential,
      lastTestSuccessAt: setup?.connection?.last_test_success_at ?? lastVerifiedAt,
      lastTestFailedAt: setup?.connection?.last_test_failed_at,
      lastTestError: setup?.connection?.last_test_error ?? null,
      activationComplete,
    });
  }, [setup, permissionLevel, hasCredential, lastVerifiedAt, activationComplete]);

  const statusLabel =
    labels.setup.statuses[
      WIZARD_PHASE_LABEL_KEYS[wizardPhase as IntegrationWizardConnectionPhase]
    ] ?? labels.setup.statuses.pending;

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
      setStepIndex(flowSteps.indexOf("test_connection"));
      setCompletionMode(null);
    } else {
      const guidance = await parseIntegrationErrorFromResponse(res);
      setTestError(guidance);
    }
    setActing(false);
  }

  async function testConnection(options?: { activation?: boolean }) {
    if (!connectionId) return;
    const isActivation = options?.activation === true;
    setActing(true);
    setTestError(null);
    const res = await fetch("/api/app-portal/integrations/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    if (res.ok) {
      const body = (await res.json()) as { verification?: unknown };
      const parsedVerification = parseVerificationFromTestResponse(body.verification);
      if (parsedVerification) setVerification(parsedVerification);
      const verifiedAt = new Date().toISOString();
      setLastVerifiedAt(verifiedAt);
      await load();

      if (isActivation) {
        setActivationComplete(true);
        setCompletionMode("active");
      } else {
        setStepIndex(flowSteps.indexOf("confirm_activation"));
        setCompletionMode("verified");
      }
    } else {
      const guidance = await parseIntegrationErrorFromResponse(res);
      setTestError(guidance);
      if (isActivation) {
        setCompletionMode("verified");
      }
    }
    setActing(false);
  }

  async function removeConnection() {
    if (!connectionId) return;
    setActing(true);
    const res = await fetch("/api/app-portal/integrations/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    if (!res.ok) {
      setActing(false);
      setShowRemoveDialog(false);
      return;
    }
    setConnectionId(null);
    setActivationComplete(false);
    setCompletionMode(null);
    setVerification(null);
    setLastVerifiedAt(null);
    setStepIndex(0);
    setApiKey("");
    setTestError(null);
    setShowRemoveDialog(false);
    resumeInitialized.current = false;
    await load();
    setActing(false);
  }

  const removeDialogTitle = setup
    ? interpolateIntegrationLabel(labels.hub.removeDialog.title, setup.display_name)
    : labels.setup.removeDialog.title;
  const removeDialogBody = setup
    ? interpolateIntegrationLabel(labels.hub.removeDialog.body, setup.display_name)
    : labels.setup.removeDialog.body;

  if (loading && !setup && !loadFailed) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.canvas}`}>
        <p className="text-sm text-aipify-text-secondary">{labels.setup.loading}</p>
      </div>
    );
  }

  if (loadFailed || !setup) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <Link
          href="/app/platform/integrations"
          className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
        >
          ← {labels.setup.back}
        </Link>
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6"
          role="alert"
          aria-labelledby="integration-load-error-title"
        >
          <h1 id="integration-load-error-title" className={AppPremiumShell.pageTitle}>
            {labels.setup.loadErrorTitle}
          </h1>
          <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.setup.loadErrorBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void load()}
              className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
            >
              {labels.setup.retryLoad}
            </button>
            <Link
              href="/app/platform/integrations"
              className={`inline-flex items-center rounded-lg border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-text ${AppPremiumShell.focusRing}`}
            >
              {labels.setup.backToIntegrations}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (completionMode) {
    return (
      <>
        <IntegrationSetupCompletionSummary
          mode={completionMode}
          labels={labels}
          providerName={setup.display_name}
          permissionLevel={setup.connection?.permission_level ?? permissionLevel}
          scopes={setup.connection?.approved_scopes ?? setup.recommended_scopes}
          verification={verification ?? setup.connection?.last_verification ?? null}
          lastVerifiedAt={lastVerifiedAt ?? setup.connection?.last_verified_at ?? setup.connection?.last_test_success_at ?? null}
          connectionName={connectionName || setup.connection?.connection_name || null}
          wizardPhase={wizardPhase}
          statusLabel={statusLabel}
          acting={acting}
          onPrimaryAction={() => {
            setCompletionMode(null);
            setStepIndex(flowSteps.indexOf("test_connection"));
          }}
          onSecondaryAction={() => void testConnection()}
          onActivate={
            completionMode === "verified" && !activationComplete
              ? () => void testConnection({ activation: true })
              : undefined
          }
        />
        <ManageIntegrationSection
          labels={labels}
          acting={acting}
          hasConnection={Boolean(connectionId)}
          onRemove={() => setShowRemoveDialog(true)}
        />
        {showRemoveDialog ? (
          <IntegrationRemoveDialog
            variant="remove"
            title={removeDialogTitle}
            body={removeDialogBody}
            labels={labels.setup.removeDialog}
            acting={acting}
            onCancel={() => setShowRemoveDialog(false)}
            onConfirm={() => void removeConnection()}
          />
        ) : null}
      </>
    );
  }

  const errorPanelLabels =
    testError &&
    buildIntegrationErrorPanelLabels(testError, translate, {
      findKeyHref: labels.setup.errorGuidance.findKeyHref,
      contactSupportHref: labels.setup.errorGuidance.contactSupportHref,
    });

  return (
    <>
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
              hasCredential={hasCredential}
              lastTestSuccessAt={setup.connection?.last_test_success_at}
              lastTestFailedAt={setup.connection?.last_test_failed_at}
              lastTestError={setup.connection?.last_test_error ?? null}
              wizardPhase={wizardPhase}
              activationComplete={activationComplete}
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
                  <ul className="mt-2 space-y-2 text-sm">
                    {setup.recommended_scopes.map((scope) => (
                      <li
                        key={scope}
                        className="rounded-lg bg-aipify-canvas px-3 py-2 text-aipify-text-secondary"
                      >
                        <span className="font-medium text-aipify-text">
                          {labels.setup.scopeDescriptions[scope] ?? scope}
                        </span>
                        <span className="mt-1 block font-mono text-xs text-aipify-text-muted">{scope}</span>
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
                  className={`inline-block text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
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
                          {labels.setup.unonight?.baseUrlLabel ?? ""}
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
                {wizardPhase === "credential_saved" ? (
                  <p className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-aipify-text-secondary" role="status">
                    {labels.setup.statuses.credentialSaved}
                  </p>
                ) : null}
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
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void testConnection()}
                      className={`rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                    >
                      {acting ? labels.setup.testing : labels.setup.test}
                    </button>
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
                  onClick={() => void testConnection({ activation: true })}
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
                className={`text-sm text-aipify-text-secondary disabled:opacity-40 ${AppPremiumShell.focusRing}`}
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
          <Link
            href={labels.setup.kcLinks.setupGuideHref}
            className={`font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
          >
            {labels.setup.kcLinks.setupGuide}
          </Link>
          <Link
            href={labels.setup.kcLinks.faqHref}
            className={`font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
          >
            {labels.setup.kcLinks.faq}
          </Link>
        </footer>

        <ManageIntegrationSection
          labels={labels}
          acting={acting}
          hasConnection={Boolean(connectionId)}
          onRemove={() => setShowRemoveDialog(true)}
        />
      </div>

      {showRemoveDialog ? (
        <IntegrationRemoveDialog
          variant="remove"
          title={removeDialogTitle}
          body={removeDialogBody}
          labels={labels.setup.removeDialog}
          acting={acting}
          onCancel={() => setShowRemoveDialog(false)}
          onConfirm={() => void removeConnection()}
        />
      ) : null}
    </>
  );
}

type ManageIntegrationSectionProps = {
  labels: AppPortalIntegrationsLabels;
  acting: boolean;
  hasConnection: boolean;
  onRemove: () => void;
};

function ManageIntegrationSection({
  labels,
  acting,
  hasConnection,
  onRemove,
}: ManageIntegrationSectionProps) {
  if (!hasConnection) return null;

  return (
    <section className="rounded-2xl border border-aipify-border bg-aipify-surface p-6">
      <h2 className={AppPremiumShell.sectionTitle}>{labels.setup.manageIntegration}</h2>
      <p className={`mt-2 ${AppPremiumShell.sectionSubtitle}`}>{labels.setup.removeDialog.body}</p>
      <button
        type="button"
        disabled={acting}
        onClick={onRemove}
        className={`mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50 ${AppPremiumShell.focusRing}`}
      >
        {labels.setup.removeDialog.confirm}
      </button>
    </section>
  );
}

/** Parse a raw error string for inline use without a Response object. */
export { parseIntegrationError };
