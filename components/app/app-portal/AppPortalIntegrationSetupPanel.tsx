"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  IntegrationConnectionStatusBadge,
  IntegrationSetupCompletionSummary,
  IntegrationSetupErrorPanel,
  ProviderConnectionErrorPanel,
  buildIntegrationErrorPanelLabels,
  mapWizardConnectionPhase,
  type IntegrationSetupCompletionMode,
} from "@/components/app/integration-setup";
import { IntegrationRemoveDialog } from "@/components/app/app-portal/IntegrationRemoveDialog";
import {
  INTEGRATION_WIZARD_STEPS,
  parseIntegrationError,
  type IntegrationErrorGuidance,
  wizardStepAt,
} from "@/lib/install/integration-setup";
import {
  parseAppPortalIntegrationSetup,
  resolveSetupOnboarding,
  parseVerificationFromTestResponse,
  interpolateIntegrationLabel,
  canonicalStatusLabelKey,
  connectionToCanonicalInput,
  refreshAppPortalIntegrationSurfaces,
  resolveCompletionModeFromConnection,
  resolveIntegrationCanonicalStatus,
  parseCoreAppIntegrationProviderContract,
  interpolateProviderContractLabel,
  resolveContractSetupStepLabels,
  validateProviderApiBaseUrl,
  buildProviderConnectionErrorPanelLabels,
  buildProviderConnectionErrorPanelModel,
  parseProviderTestErrorFromResponse,
  type CoreAppIntegrationProviderContract,
  type ProviderConnectionErrorPanelModel,
  type AppPortalIntegrationSetup,
  type AppPortalIntegrationsLabels,
  type IntegrationVerificationMetadata,
} from "@/lib/app-portal/integrations";
import { ProviderOnboardingOverview } from "@/components/app/app-portal/ProviderOnboardingOverview";
import {
  isCoreProviderInstallationState,
  mapSecretStreamStatusToInstallationState,
} from "@/lib/app-portal/integrations/onboarding";
import {
  enterCredentialStepIndex,
  resolveIntegrationWizardResumeStepIndex,
  shouldShowIntegrationCompletionSummary,
} from "@/lib/app-portal/integrations/rotation-recovery";

type AppPortalIntegrationSetupPanelProps = {
  providerKey: string;
  labels: AppPortalIntegrationsLabels;
};

type SetupMode = "oauth" | "manual";

function maskCredential(value: string): string {
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.min(12, value.length - 4))}${value.slice(-4)}`;
}

function resolveInitialCompletionMode(
  setup: AppPortalIntegrationSetup
): IntegrationSetupCompletionMode | null {
  return resolveCompletionModeFromConnection(setup.connection);
}

export function AppPortalIntegrationSetupPanel({
  providerKey,
  labels,
}: AppPortalIntegrationSetupPanelProps) {
  const router = useRouter();
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
  const [completionMode, setCompletionMode] = useState<IntegrationSetupCompletionMode | null>(null);
  const [verification, setVerification] = useState<IntegrationVerificationMetadata | null>(null);
  const [lastVerifiedAt, setLastVerifiedAt] = useState<string | null>(null);
  const [testError, setTestError] = useState<IntegrationErrorGuidance | null>(null);
  const [providerTestError, setProviderTestError] = useState<ProviderConnectionErrorPanelModel | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const resumeInitialized = useRef(false);
  const focusCredentialInput = useRef(false);

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
        applyBaseUrlFromSetup(parsed);
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

  const providerContractResult = useMemo(() => {
    if (!setup) return null;
    return parseCoreAppIntegrationProviderContract(
      setup.presentation_contract,
      setup.provider_key
    );
  }, [setup]);

  const providerContract: CoreAppIntegrationProviderContract | null =
    providerContractResult?.ok === true ? providerContractResult.contract : null;

  useEffect(() => {
    if (!setup || resumeInitialized.current) return;
    resumeInitialized.current = true;

    const initialCompletion = resolveInitialCompletionMode(setup);
    if (initialCompletion) {
      setCompletionMode(initialCompletion);
    }
    setStepIndex(resolveIntegrationWizardResumeStepIndex(setup));

    const initialCanonical = setup.connection
      ? resolveIntegrationCanonicalStatus(connectionToCanonicalInput(setup.connection))
      : null;

    // Resume mid-flow: scopes were already approved when the connection exists.
    if (setup.connection) {
      setApprovedScopes(true);
    }

    if (initialCanonical === "rotation_required" && setup.connection?.last_test_error) {
      setProviderTestError(
        buildProviderConnectionErrorPanelModel(setup.connection.last_test_error)
      );
    }
  }, [setup]);

  const canonicalStatus = useMemo(() => {
    if (!setup?.connection) return "not_configured" as const;
    return resolveIntegrationCanonicalStatus(connectionToCanonicalInput(setup.connection));
  }, [setup]);

  const isRotationRequired = canonicalStatus === "rotation_required";

  const goToUpdateKeyStep = useCallback(() => {
    setCompletionMode(null);
    setTestError(null);
    focusCredentialInput.current = true;
    setStepIndex(enterCredentialStepIndex());
  }, []);

  useEffect(() => {
    if (currentStep !== "enter_credential" || !focusCredentialInput.current) return;
    focusCredentialInput.current = false;
    const input = document.getElementById("api-key-input") as HTMLInputElement | null;
    if (!input) return;
    input.focus();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentStep, stepIndex]);

  const activationComplete = canonicalStatus === "active";

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
      activatedAt: setup?.connection?.activated_at,
      deactivatedAt: setup?.connection?.deactivated_at,
      canonicalStatus: setup?.connection?.canonical_status,
    });
  }, [setup, permissionLevel, hasCredential, lastVerifiedAt, activationComplete]);

  const statusLabel =
    labels.setup.statuses[canonicalStatusLabelKey(canonicalStatus)] ??
    labels.setup.statuses.pending;

  function applyBaseUrlFromSetup(parsed: AppPortalIntegrationSetup) {
    const contractParse = parseCoreAppIntegrationProviderContract(
      parsed.presentation_contract,
      parsed.provider_key
    );
    if (!contractParse.ok || !contractParse.contract.capabilities.collectsBaseUrl) {
      setBaseUrl("");
      return;
    }
    const stored =
      typeof parsed.connection?.access_summary?.base_url === "string"
        ? parsed.connection.access_summary.base_url
        : null;
    if (stored) {
      const validated = validateProviderApiBaseUrl({
        value: stored,
        allowedHosts: contractParse.contract.allowedAdminHosts,
      });
      setBaseUrl(validated.ok ? validated.value : contractParse.contract.adminBaseUrl);
      return;
    }
    setBaseUrl(contractParse.contract.adminBaseUrl);
  }

  async function saveConnection() {
    if (!approvedScopes || !providerContract) return;
    setActing(true);
    setTestError(null);
    setProviderTestError(null);
    try {
      let normalizedBaseUrl: string | null = null;
      if (providerContract.capabilities.collectsBaseUrl) {
        const baseValidation = validateProviderApiBaseUrl({
          value: baseUrl,
          allowedHosts: providerContract.allowedAdminHosts,
        });
        if (!baseValidation.ok) {
          setProviderTestError(
            buildProviderConnectionErrorPanelModel(
              baseValidation.code === "https_required"
                ? "invalid_base_url_https"
                : baseValidation.code === "email_not_allowed"
                  ? "invalid_base_url_email"
                  : baseValidation.code === "host_not_allowlisted"
                    ? "host_not_allowlisted"
                    : "invalid_base_url"
            )
          );
          return;
        }
        normalizedBaseUrl = baseValidation.value;
      }

      const scopes =
        providerContract.requiredScopes.length > 0
          ? providerContract.requiredScopes
          : setup?.recommended_scopes ?? [];

      const res = await fetch("/api/app-portal/integrations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_key: providerKey,
          setup_type: mode,
          permission_level: permissionLevel,
          approved_scopes: scopes,
          api_key: mode === "manual" && apiKey.trim().length > 0 ? apiKey.trim() : null,
          base_url: normalizedBaseUrl,
          connection_name: providerContract.capabilities.collectsConnectionName
            ? connectionName || null
            : null,
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as { connection_id?: string };
        if (body.connection_id) setConnectionId(body.connection_id);
        setApiKey("");
        setProviderTestError(null);
        setTestError(null);
        await load();
        setStepIndex(flowSteps.indexOf("test_connection"));
        setCompletionMode(null);
      } else {
        setProviderTestError(await parseProviderTestErrorFromResponse(res));
      }
    } catch {
      setTestError({
        category: "unknown",
        titleKey: "customerApp.portalStructure.integrations.errorGuidance.unknown.title",
        bodyKey: "customerApp.portalStructure.integrations.errorGuidance.unknown.body",
        checklistKeys: [],
        actions: {
          retry: labels.setup.errorGuidance.actions.retry,
          findKey: labels.setup.errorGuidance.actions.findKey,
          contactSupport: labels.setup.errorGuidance.actions.contactSupport,
        },
      });
    } finally {
      setActing(false);
    }
  }

  async function testConnection(options?: { activation?: boolean }) {
    if (!connectionId) return;
    const isActivation = options?.activation === true;
    setActing(true);
    setTestError(null);
    setProviderTestError(null);
    try {
      const res = await fetch("/api/app-portal/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: connectionId, activation: isActivation }),
      });
      if (res.ok) {
        const body = (await res.json()) as { verification?: unknown; last_verified_at?: string };
        const parsedVerification = parseVerificationFromTestResponse(body.verification);
        if (parsedVerification) setVerification(parsedVerification);
        setLastVerifiedAt(body.last_verified_at ?? new Date().toISOString());
        setTestError(null);
        setProviderTestError(null);
        await load();
        refreshAppPortalIntegrationSurfaces(router);
        const refreshed = parseAppPortalIntegrationSetup(
          await (await fetch(`/api/app-portal/integrations/${encodeURIComponent(providerKey)}`)).json()
        );
        const refreshedCanonical = refreshed?.connection
          ? resolveIntegrationCanonicalStatus(connectionToCanonicalInput(refreshed.connection))
          : null;

        if (isActivation && refreshedCanonical === "active") {
          setCompletionMode("active");
        } else if (!isActivation && refreshedCanonical === "verified") {
          setStepIndex(flowSteps.indexOf("confirm_activation"));
          setCompletionMode("verified");
        } else if (
          refreshedCanonical === "verification_failed" ||
          refreshedCanonical === "rotation_required"
        ) {
          setCompletionMode(null);
          setStepIndex(flowSteps.indexOf("test_connection"));
        } else {
          setCompletionMode(resolveCompletionModeFromConnection(refreshed?.connection ?? null));
        }
      } else {
        setProviderTestError(await parseProviderTestErrorFromResponse(res));
        setCompletionMode(null);
        setStepIndex(flowSteps.indexOf("test_connection"));
        await load();
        refreshAppPortalIntegrationSurfaces(router);
      }
    } finally {
      setActing(false);
    }
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
    setCompletionMode(null);
    setVerification(null);
    setLastVerifiedAt(null);
    setStepIndex(0);
    setApiKey("");
    setTestError(null);
    setShowRemoveDialog(false);
    resumeInitialized.current = false;
    await load();
    refreshAppPortalIntegrationSurfaces(router);
    setActing(false);
    router.push("/app/platform/integrations");
  }

  async function deactivateConnection() {
    if (!connectionId) return;
    setActing(true);
    const res = await fetch("/api/app-portal/integrations/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connectionId }),
    });
    setActing(false);
    if (res.ok) {
      setTestError(null);
      setProviderTestError(null);
      await load();
      refreshAppPortalIntegrationSurfaces(router);
      setCompletionMode("active");
    }
  }

  const displayName = providerContract?.displayName ?? setup?.display_name ?? "";
  const removeDialogTitle = displayName
    ? interpolateIntegrationLabel(labels.hub.removeDialog.title, displayName)
    : labels.setup.removeDialog.title;
  const removeDialogBody = displayName
    ? interpolateIntegrationLabel(labels.hub.removeDialog.body, displayName)
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

  if (!providerContract) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <Link
          href="/app/platform/integrations"
          className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
        >
          ← {labels.setup.back}
        </Link>
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 dark:border-amber-500/30 dark:bg-amber-950/30"
          role="alert"
          aria-labelledby="integration-contract-error-title"
        >
          <h1 id="integration-contract-error-title" className={AppPremiumShell.pageTitle}>
            {labels.setup.contractError.title}
          </h1>
          <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.setup.contractError.body}</p>
          <div className="mt-4">
            <Link
              href="/app/platform/integrations"
              className={`inline-flex items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text ${AppPremiumShell.focusRing}`}
            >
              {labels.setup.backToIntegrations}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const requiredScopes = providerContract.requiredScopes;
  const setupStepLabels = resolveContractSetupStepLabels(
    providerContract,
    labels.setup.manualStepLabels
  );

  if (
    completionMode &&
    shouldShowIntegrationCompletionSummary(completionMode, canonicalStatus)
  ) {
    return (
      <>
        <IntegrationSetupCompletionSummary
          mode={completionMode}
          labels={{
            ...labels,
            setup: {
              ...labels.setup,
              completion: {
                ...labels.setup.completion,
                verifiedHeading: interpolateProviderContractLabel(
                  labels.setup.completion.verifiedHeading,
                  providerContract
                ),
                verifiedBody: interpolateProviderContractLabel(
                  labels.setup.completion.verifiedBody,
                  providerContract
                ),
              },
            },
          }}
          providerName={providerContract.displayName}
          permissionLevel={setup.connection?.permission_level ?? permissionLevel}
          scopes={setup.connection?.approved_scopes ?? requiredScopes}
          verification={verification ?? setup.connection?.last_verification ?? null}
          lastVerifiedAt={lastVerifiedAt ?? setup.connection?.last_verified_at ?? setup.connection?.last_test_success_at ?? null}
          connectionName={connectionName || setup.connection?.connection_name || null}
          wizardPhase={wizardPhase}
          canonicalStatus={canonicalStatus}
          statusLabel={statusLabel}
          acting={acting}
          onPrimaryAction={() => {
            setCompletionMode(null);
            setStepIndex(flowSteps.indexOf("test_connection"));
          }}
          onSecondaryAction={() => void testConnection()}
          onActivate={
            completionMode === "verified" && canonicalStatus === "verified"
              ? () => void testConnection({ activation: true })
              : undefined
          }
          onDeactivate={
            completionMode === "active" && canonicalStatus === "active"
              ? () => void deactivateConnection()
              : undefined
          }
          deactivateLabel={labels.hub.deactivateIntegration}
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

  const providerErrorPanelLabels =
    providerTestError &&
    buildProviderConnectionErrorPanelLabels({
      model: providerTestError,
      contract: providerContract,
      t: translate,
    });

  const showRotationRecovery =
    isRotationRequired || providerTestError?.errorCode === "rotation_required";

  const rotationRecoveryLabels =
    showRotationRecovery
      ? providerErrorPanelLabels ??
        buildProviderConnectionErrorPanelLabels({
          model: buildProviderConnectionErrorPanelModel("rotation_required"),
          contract: providerContract,
          t: translate,
        })
      : null;

  return (
    <>
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <Link
          href="/app/platform/integrations"
          className={`inline-flex text-sm font-medium text-aipify-text-secondary hover:text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
        >
          ← {labels.setup.back}
        </Link>

        <header className="space-y-5">
          <div className="space-y-2">
            <p className={AppPremiumShell.eyebrow}>{labels.setup.plainLanguage.connectionTest}</p>
            <h1 className={`${AppPremiumShell.pageTitle} max-w-4xl text-balance`}>
              {interpolateProviderContractLabel(
                labels.setup.connectTitle.includes("{providerName}")
                  ? labels.setup.connectTitle
                  : `${labels.setup.title}: {providerName}`,
                providerContract
              )}
            </h1>
            {providerContract.adminIntegrationUrl ? (
              <a
                href={providerContract.adminIntegrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
              >
                {interpolateProviderContractLabel(labels.setup.openAdmin, providerContract)}
              </a>
            ) : null}
          </div>

          {(isRotationRequired || statusLabel) && (
            <div
              className="rounded-2xl border border-aipify-border bg-aipify-surface px-4 py-3 sm:px-5"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center gap-3">
                <IntegrationConnectionStatusBadge
                  label={statusLabel}
                  canonicalStatus={canonicalStatus}
                />
                {isRotationRequired ? (
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-aipify-text-secondary">
                    {interpolateProviderContractLabel(
                      translate(
                        "customerApp.portalStructure.integrations.connectionFailures.panels.rotation_required.body"
                      ),
                      providerContract
                    )}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {(() => {
            const onboarding = setup ? resolveSetupOnboarding(setup) : null;
            if (!onboarding?.ok) return null;
            const installationState = isCoreProviderInstallationState(setup?.installation_state)
              ? setup.installation_state
              : mapSecretStreamStatusToInstallationState(canonicalStatus);
            return (
              <ProviderOnboardingOverview
                contract={onboarding.contract}
                installationState={installationState}
                providerDisplayName={providerContract.displayName || setup?.display_name || providerKey}
                t={translate}
              />
            );
          })()}

          <ol
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
            aria-label={labels.setup.connectionStatusLabel}
          >
            {flowSteps.map((key, index) => {
              const isActive = index === stepIndex;
              const isComplete = index < stepIndex;
              const canJump = isComplete || isActive || (isRotationRequired && key === "enter_credential");
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    disabled={!canJump}
                    onClick={() => {
                      if (!canJump) return;
                      setStepIndex(index);
                    }}
                    aria-current={isActive ? "step" : undefined}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-default ${
                      isActive
                        ? "bg-violet-700 text-white"
                        : isComplete
                          ? "bg-violet-50 text-violet-800 ring-1 ring-violet-100 dark:bg-violet-950/40 dark:text-violet-100 dark:ring-violet-800/60"
                          : "bg-aipify-surface text-aipify-text-secondary ring-1 ring-aipify-border"
                    } ${AppPremiumShell.focusRing}`}
                  >
                    {labels.setup.wizard7StepLabels[key]}
                  </button>
                </li>
              );
            })}
          </ol>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <section className={`${AppPremiumShell.elevatedCard} space-y-5 p-5 sm:p-6 lg:p-7`}>
            <h2 className={AppPremiumShell.sectionTitle}>
              {labels.setup.wizard7StepLabels[currentStep]}
            </h2>

            {showRotationRecovery &&
            rotationRecoveryLabels &&
            currentStep !== "enter_credential" ? (
              <ProviderConnectionErrorPanel
                labels={rotationRecoveryLabels}
                variant="rotation"
                onUpdateKey={goToUpdateKeyStep}
                onRetry={connectionId ? () => void testConnection() : undefined}
                retryDisabled={acting || !connectionId}
              />
            ) : null}

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
                    {requiredScopes.map((scope) => (
                      <li
                        key={scope}
                        className="rounded-lg bg-aipify-canvas px-3 py-2 text-aipify-text-secondary"
                      >
                        <span className="font-medium text-aipify-text">
                          {providerContract.scopeLabels[scope] ??
                            providerContract.scopeDescriptions[scope] ??
                            labels.setup.scopeDescriptions[scope] ??
                            labels.setup.scopeUnknownFallback}
                        </span>
                        {providerContract.scopeDescriptions[scope] ? (
                          <span className="mt-1 block text-xs text-aipify-text-muted">
                            {providerContract.scopeDescriptions[scope]}
                          </span>
                        ) : null}
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
                    {setupStepLabels.map((label, index) => (
                      <li key={`${index}-${label}`}>{label}</li>
                    ))}
                  </ol>
                ) : (
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
                    {setup.oauth_steps.map((key) => (
                      <li key={key}>{labels.setup.oauthStepLabels[key]}</li>
                    ))}
                  </ol>
                )}
                {providerContract.adminIntegrationUrl ? (
                  <a
                    href={providerContract.adminIntegrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
                  >
                    {interpolateProviderContractLabel(labels.setup.openAdmin, providerContract)}
                  </a>
                ) : null}
                <Link
                  href={labels.setup.kcLinks.findApiKeyHref}
                  className={`ml-0 block text-sm font-medium text-aipify-companion hover:underline sm:ml-4 sm:inline-block ${AppPremiumShell.focusRing}`}
                >
                  {labels.setup.kcLinks.findApiKey}
                </Link>
              </>
            )}

            {currentStep === "enter_credential" && (
              <>
                {showRotationRecovery && rotationRecoveryLabels ? (
                  <ProviderConnectionErrorPanel
                    labels={rotationRecoveryLabels}
                    variant="rotation"
                    onUpdateKey={() => {
                      focusCredentialInput.current = true;
                      const input = document.getElementById("api-key-input") as HTMLInputElement | null;
                      input?.focus();
                    }}
                    onRetry={connectionId ? () => void testConnection() : undefined}
                    retryDisabled={acting || !connectionId}
                  />
                ) : null}
                {mode === "manual" ? (
                  <>
                    {providerContract.capabilities.collectsConnectionName ? (
                      <>
                        <label className="block text-sm font-medium text-aipify-text">
                          {interpolateProviderContractLabel(
                            labels.setup.credentialFields.connectionNameLabel,
                            providerContract
                          )}
                        </label>
                        <input
                          type="text"
                          value={connectionName}
                          onChange={(e) => setConnectionName(e.target.value)}
                          placeholder={interpolateProviderContractLabel(
                            labels.setup.credentialFields.connectionNamePlaceholder,
                            providerContract
                          )}
                          className={`mt-2 w-full rounded-lg border border-aipify-border bg-aipify-surface px-3 py-2 text-sm ${AppPremiumShell.focusRing}`}
                        />
                      </>
                    ) : null}
                    {providerContract.capabilities.collectsBaseUrl ? (
                      <>
                        <label className="mt-4 block text-sm font-medium text-aipify-text">
                          {interpolateProviderContractLabel(
                            labels.setup.credentialFields.baseUrlLabel,
                            providerContract
                          )}
                        </label>
                        <p className="mt-1 text-xs text-aipify-text-muted">
                          {interpolateProviderContractLabel(
                            labels.setup.credentialFields.baseUrlHint,
                            providerContract
                          )}
                        </p>
                        <input
                          type="url"
                          inputMode="url"
                          name="provider-base-url"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          data-1p-ignore
                          data-lpignore="true"
                          value={baseUrl}
                          onChange={(e) => setBaseUrl(e.target.value)}
                          placeholder={labels.setup.credentialFields.baseUrlPlaceholder}
                          className={`mt-2 w-full rounded-lg border border-aipify-border bg-aipify-surface px-3 py-2 text-sm ${AppPremiumShell.focusRing}`}
                        />
                      </>
                    ) : null}
                    <label className="mt-4 block text-sm font-medium text-aipify-text">
                      {interpolateProviderContractLabel(
                        "{credentialName}",
                        providerContract
                      )}
                    </label>
                    <p className="mt-1 text-xs text-aipify-text-muted">{labels.setup.apiKeyLabel}</p>
                    <input
                      id="api-key-input"
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
                    <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">
                      {labels.setup.securityWarnings.credentialsEncrypted}
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        disabled={
                          acting ||
                          !approvedScopes ||
                          (mode === "manual" && apiKey.trim().length < 8)
                        }
                        onClick={() => void saveConnection()}
                        className={`min-h-11 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                      >
                        {acting ? labels.setup.saving : labels.setup.save}
                      </button>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                        className={`min-h-11 rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                      >
                        {labels.setup.backStep}
                      </button>
                    </div>
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
                  <p className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-aipify-text-secondary dark:border-blue-500/30 dark:bg-blue-950/30" role="status">
                    {labels.setup.statuses.credentialSaved}
                  </p>
                ) : null}
                {providerTestError && providerErrorPanelLabels ? (
                  <ProviderConnectionErrorPanel
                    labels={providerErrorPanelLabels}
                    variant={
                      providerTestError.errorCode === "rotation_required" ? "rotation" : "error"
                    }
                    onUpdateKey={goToUpdateKeyStep}
                    onRetry={() => void testConnection()}
                    retryDisabled={acting || !connectionId}
                  />
                ) : null}
                {testError && errorPanelLabels ? (
                  <IntegrationSetupErrorPanel
                    guidance={testError}
                    labels={errorPanelLabels}
                    onRetry={() => void testConnection()}
                    retryDisabled={acting || !connectionId}
                  />
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {isRotationRequired || apiKey.trim().length >= 8 ? (
                    <button
                      type="button"
                      disabled={
                        acting ||
                        !approvedScopes ||
                        (mode === "manual" && apiKey.trim().length < 8)
                      }
                      onClick={() => void saveConnection()}
                      className={`min-h-11 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                    >
                      {acting ? labels.setup.saving : labels.setup.save}
                    </button>
                  ) : null}
                  {connectionId ? (
                    <button
                      type="button"
                      disabled={acting || isRotationRequired}
                      title={
                        isRotationRequired
                          ? interpolateProviderContractLabel(
                              translate(
                                "customerApp.portalStructure.integrations.connectionFailures.panels.rotation_required.body"
                              ),
                              providerContract
                            )
                          : undefined
                      }
                      onClick={() => void testConnection()}
                      className={`min-h-11 rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
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
                    (currentStep === "enter_credential" &&
                      mode === "manual" &&
                      apiKey.trim().length < 8 &&
                      (!connectionId || isRotationRequired))
                  }
                  onClick={() => setStepIndex((s) => Math.min(flowSteps.length - 1, s + 1))}
                  className={`rounded-lg bg-aipify-text px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
                >
                  {labels.setup.continueStep}
                </button>
              ) : null}
            </div>
          </section>

          <aside
            className={`${AppPremiumShell.elevatedCard} space-y-4 p-5 sm:p-6 xl:sticky xl:top-6 xl:self-start`}
            aria-labelledby="integration-contract-help-heading"
          >
            <h2 id="integration-contract-help-heading" className={AppPremiumShell.sectionTitle}>
              {labels.setup.authHelpAsideTitle}
            </h2>
            {providerContract.helpSections.length > 0 ? (
              <ul className="space-y-3 text-sm text-aipify-text-secondary">
                {providerContract.helpSections.map((section) => (
                  <li key={section.key}>
                    <p>{interpolateProviderContractLabel(section.body, providerContract)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
                {setupStepLabels.map((label, index) => (
                  <li key={`help-${index}`}>{label}</li>
                ))}
              </ol>
            )}
            {providerContract.adminIntegrationUrl ? (
              <a
                href={providerContract.adminIntegrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
              >
                {interpolateProviderContractLabel(labels.setup.openAdmin, providerContract)}
              </a>
            ) : null}
          </aside>
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
