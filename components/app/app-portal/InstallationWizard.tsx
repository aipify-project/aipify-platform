"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildInstallationWizardLabels,
  canActivateFromWizard,
  canShowInstallContinueLater,
  createInstallationWizardPreviewViewState,
  isInstallationSupportMode,
  isInstallationWizardPreviewMode,
  listCustomerFacingSupportModes,
  listInstallationLocales,
  listPreviewExampleAssistanceActions,
  listRelevantInstallAssistanceActions,
  nextSafeStep,
  planInstallationSteps,
  previewStateAfterSupportSelect,
  primaryInstallActionKeyForMode,
  redactSecretFieldValues,
  resolveCustomerSafeText,
  resolveInstallationTextDirection,
  resolveStepPresentation,
  selectDefaultCustomerFacingSupportMode,
  selectDefaultSupportMode,
  resolveInstallationContract,
  sessionStateAfterSupportConfirm,
  buildHandoffIdempotencyKey,
  handoffTypeForSupportMode,
  isValidInviteEmail,
  parsePersistedInstallationHandoff,
  resolveHydratedInstallationState,
  resolveInstallationWaitingCopyParty,
  type HandoffLoadState,
  type InstallationAudience,
  type InstallationHandoffResponse,
  type InstallationSessionSnapshot,
  type InstallationSupportMode,
  type InstallationWizardMode,
  type InstallationWizardPreviewViewState,
  type InstallationWizardState,
  type InstallationWizardLabels,
  type PersistedInstallationHandoff,
} from "@/lib/app-portal/integrations/installation";
import type { AppPortalIntegrationSetup, AppPortalIntegrationsLabels } from "@/lib/app-portal/integrations";

/** Connect-route and other real install entry points — never inferred as preview. */
export type InstallationWizardEntry =
  | "connect_route"
  | "preview_dialog"
  | "unknown";

type InstallationWizardProps = {
  providerKey: string;
  setup: AppPortalIntegrationSetup;
  labels: AppPortalIntegrationsLabels;
  locale: string;
  audience?: InstallationAudience;
  onReload: () => Promise<void>;
  /** When true, show internal technical copy (operators/partners). */
  showInternalDetails?: boolean;
  /**
   * Explicit runtime mode. Connect route must pass `"install"`.
   * `preview` is read-only — no session, secret, test, or activation writes.
   */
  mode: InstallationWizardMode;
  /** Documents which surface mounted the wizard (live connect vs preview dialog). */
  entry?: InstallationWizardEntry;
};

function parseSession(raw: unknown): InstallationSessionSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.session_id !== "string") return null;
  return {
    session_id: row.session_id,
    provider_key: String(row.provider_key ?? ""),
    contract_version: String(row.contract_version ?? "1"),
    support_mode: isInstallationSupportMode(row.support_mode) ? row.support_mode : null,
    state: (row.state as InstallationWizardState) ?? "not_started",
    current_step_key: row.current_step_key == null ? null : String(row.current_step_key),
    completed_step_keys: Array.isArray(row.completed_step_keys)
      ? row.completed_step_keys.map(String)
      : [],
    field_values: (row.field_values as Record<string, unknown>) ?? {},
    paused: row.paused === true,
    last_test_status: row.last_test_status == null ? null : String(row.last_test_status),
    last_error_code: row.last_error_code == null ? null : String(row.last_error_code),
    updated_at: String(row.updated_at ?? ""),
  };
}

function statusTone(state: InstallationWizardState): string {
  if (["completed", "active", "verified", "ready_for_activation"].includes(state)) {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
  }
  if (["testing", "in_progress", "support_selection", "ready_for_test"].includes(state)) {
    return "border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-200";
  }
  if (
    ["awaiting_aipify", "awaiting_partner", "awaiting_provider", "awaiting_customer_it", "paused"].includes(
      state
    )
  ) {
    return "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100";
  }
  if (["blocked", "test_failed", "cancelled", "unsupported"].includes(state)) {
    return "border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-200";
  }
  if (state === "awaiting_customer" || state === "credentials_required") {
    return "border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-100";
  }
  return "border-slate-400/40 bg-slate-500/10 text-slate-700 dark:text-slate-200";
}

export function InstallationWizard({
  providerKey,
  setup,
  labels,
  locale,
  audience = "customer_owner",
  onReload,
  showInternalDetails = false,
  mode,
  entry = "unknown",
}: InstallationWizardProps) {
  const isPreview = isInstallationWizardPreviewMode(mode);
  const effectiveAudience: InstallationAudience = showInternalDetails
    ? "aipify_operator"
    : audience;

  const translate = useCallback(
    (key: string) => {
      const short = key.replace(/^customerApp\./, "");
      return (
        labels.setup.messageCatalog[key] ??
        labels.setup.messageCatalog[short] ??
        key
      );
    },
    [labels.setup.messageCatalog]
  );

  const wizLabels: InstallationWizardLabels = useMemo(
    () => buildInstallationWizardLabels(translate),
    [translate]
  );

  const contractResult = useMemo(
    () =>
      resolveInstallationContract({
        providerKey,
        installationContract: setup.installation_contract,
        onboardingMode: setup.onboarding_mode,
      }),
    [providerKey, setup.installation_contract, setup.onboarding_mode]
  );

  const [session, setSession] = useState<InstallationSessionSnapshot | null>(() =>
    isPreview ? null : parseSession(setup.installation_session)
  );
  const [previewView, setPreviewView] = useState<InstallationWizardPreviewViewState>(() =>
    createInstallationWizardPreviewViewState()
  );
  /** Local install support choice — never persisted until explicit Fortsett / handoff. */
  const [localSupportMode, setLocalSupportMode] = useState<InstallationSupportMode | null>(null);
  const [confirmInFlight, setConfirmInFlight] = useState(false);
  const [acting, setActing] = useState(false);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);
  const [handoffConfirmation, setHandoffConfirmation] = useState<{
    reference: string;
    requestedAt: string;
    recipientEmail?: string | null;
  } | null>(null);
  const [itRecipientEmail, setItRecipientEmail] = useState("");
  const [liveRegion, setLiveRegion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  /** Read-side handoff GET — presentation only; never writes lifecycle. */
  const [handoffLoadState, setHandoffLoadState] = useState<HandoffLoadState>(() =>
    isPreview ? "ready" : "loading"
  );
  const [persistedHandoff, setPersistedHandoff] =
    useState<PersistedInstallationHandoff | null>(null);

  useEffect(() => {
    if (isPreview) {
      setSession(null);
      setHandoffLoadState("ready");
      setPersistedHandoff(null);
      return;
    }
    setSession(parseSession(setup.installation_session));
  }, [setup.installation_session, isPreview]);

  useEffect(() => {
    if (isPreview) return;
    let cancelled = false;
    setHandoffLoadState("loading");
    const loadHandoff = async () => {
      try {
        const res = await fetch(
          `/api/app-portal/integrations/${encodeURIComponent(providerKey)}/installation/handoff`,
          { method: "GET", headers: { "Cache-Control": "no-store" } }
        );
        const data = (await res.json().catch(() => ({}))) as unknown;
        if (cancelled) return;
        if (!res.ok) {
          setPersistedHandoff(null);
          setHandoffLoadState("error");
          return;
        }
        setPersistedHandoff(parsePersistedInstallationHandoff(data));
        setHandoffLoadState("ready");
      } catch {
        if (!cancelled) {
          setPersistedHandoff(null);
          setHandoffLoadState("error");
        }
      }
    };
    void loadHandoff();
    return () => {
      cancelled = true;
    };
  }, [isPreview, providerKey]);

  const dir = resolveInstallationTextDirection(
    locale,
    contractResult.ok ? contractResult.contract.rtl_support : false
  );

  // Prove dynamic locale list is not hardcoded in the wizard component.
  const availableLocales = listInstallationLocales();

  const persistSession = useCallback(
    async (patch: {
      support_mode?: InstallationSupportMode | null;
      state?: InstallationWizardState;
      current_step_key?: string | null;
      completed_step_keys?: string[];
      field_values?: Record<string, unknown>;
      paused?: boolean;
      last_test_status?: string | null;
      last_error_code?: string | null;
      reason?: string;
      idempotency_key?: string;
    }) => {
      if (isPreview) {
        setPreviewView((prev) => ({
          support_mode:
            patch.support_mode !== undefined ? patch.support_mode : prev.support_mode,
          state: patch.state ?? prev.state,
          current_step_key:
            patch.current_step_key !== undefined
              ? patch.current_step_key
              : prev.current_step_key,
          completed_step_keys: patch.completed_step_keys ?? prev.completed_step_keys,
          paused: typeof patch.paused === "boolean" ? patch.paused : prev.paused,
        }));
        return null;
      }
      if (!contractResult.ok) return null;
      setActing(true);
      setErrorSummary(null);
      try {
        const res = await fetch("/api/app-portal/integrations/installation/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider_key: providerKey,
            contract_version: contractResult.contract.contract_version,
            ...patch,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorSummary(wizLabels.errorGeneric);
          setLiveRegion(wizLabels.errorGeneric);
          return null;
        }
        const next = parseSession(data.session);
        if (next) setSession(next);
        return next;
      } finally {
        setActing(false);
      }
    },
    [contractResult, isPreview, providerKey, wizLabels.errorGeneric]
  );

  const blockPreviewWrite = useCallback(() => {
    setLiveRegion(wizLabels.previewReadOnlyAction);
    setHandoffNotice(wizLabels.previewReadOnlyAction);
  }, [wizLabels.previewReadOnlyAction]);

  if (!contractResult.ok) {
    return (
      <section
        className="mx-auto w-full max-w-5xl rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6"
        aria-live="polite"
      >
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {wizLabels.errorGeneric}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {contractResult.issues.map((i) => i.message).join(" · ") || wizLabels.errorGeneric}
        </p>
      </section>
    );
  }

  const contract = contractResult.contract;
  const isInternalAudience =
    showInternalDetails ||
    effectiveAudience === "aipify_operator" ||
    effectiveAudience === "aipify_platform_admin" ||
    effectiveAudience === "partner";
  const visibleSupportModes = isInternalAudience
    ? contract.support_modes
    : listCustomerFacingSupportModes(contract.support_modes);
  const completedKeys = isPreview
    ? previewView.completed_step_keys
    : (session?.completed_step_keys ?? []);
  const hydrated = isPreview
    ? null
    : resolveHydratedInstallationState({
        session,
        localSupportMode,
        handoff: persistedHandoff,
        handoffLoadState,
      });
  const installLifecycle = isPreview ? null : hydrated!.lifecycle;
  const hasOpenHandoff = isPreview ? false : hydrated!.hasOpenHandoff;
  const selectedSupportMode = isPreview
    ? previewView.support_mode
    : (hydrated!.supportMode ?? localSupportMode ?? session?.support_mode ?? null);
  const supportMode =
    selectedSupportMode ??
    selectDefaultCustomerFacingSupportMode(contract.support_modes) ??
    selectDefaultSupportMode(contract);
  const planned = planInstallationSteps(contract, {
    supportMode,
    audience: effectiveAudience,
    completedStepKeys: completedKeys,
  });
  const currentStepKey = isPreview
    ? previewView.current_step_key
    : session?.current_step_key;
  const current =
    planned.find((s) => s.step_key === currentStepKey) ??
    nextSafeStep(planned, completedKeys) ??
    planned[0] ??
    null;
  const completed = new Set(completedKeys);
  const progressIndex = current ? Math.max(0, planned.findIndex((s) => s.step_key === current.step_key)) : 0;
  const progressTotal = Math.max(1, planned.length);
  const state: InstallationWizardState = isPreview
    ? previewView.state
    : (session?.state ?? "not_started");
  const falseWaitingRepair =
    !isPreview &&
    hasOpenHandoff === false &&
    [
      "awaiting_aipify",
      "awaiting_partner",
      "awaiting_provider",
      "awaiting_customer_it",
      "awaiting_customer",
    ].includes(state);
  const presentationState: InstallationWizardState | null = isPreview
    ? previewView.state
    : falseWaitingRepair
      ? "in_progress"
      : (hydrated?.presentationState ?? session?.state ?? null);
  const statusLabel = isPreview
    ? wizLabels.previewStatusForMode(selectedSupportMode)
    : hydrated?.statusPendingHydration
      ? wizLabels.loading
      : wizLabels.installStatusForLifecycle(
          selectedSupportMode,
          installLifecycle ?? "choose",
          presentationState
        );
  const statusToneState: InstallationWizardState = falseWaitingRepair
    ? "in_progress"
    : (presentationState ?? state);
  const responsibilityLabel = isPreview
    ? wizLabels.previewResponsibilityForMode(selectedSupportMode)
    : wizLabels.installResponsibilityForMode(selectedSupportMode);
  const presentation = current
    ? resolveStepPresentation(current, effectiveAudience)
    : null;
  const title = presentation
    ? resolveCustomerSafeText(presentation.title, {
        locale,
        translate,
        emptyFallback: wizLabels.emptyFallback,
      })
    : setup.display_name;
  const description = presentation
    ? resolveCustomerSafeText(presentation.description, {
        locale,
        translate,
        emptyFallback: wizLabels.reassurance,
      })
    : wizLabels.reassurance;
  const installAssistanceActions =
    !isPreview && installLifecycle && hydrated?.showHandoffCta
      ? listRelevantInstallAssistanceActions({
          actions: contract.assistance_actions,
          supportMode: selectedSupportMode,
          lifecycle: installLifecycle,
        })
      : [];
  const previewExampleActions = listPreviewExampleAssistanceActions(
    contract.assistance_actions
  );
  const waitingCopyParty =
    hydrated?.waitingCopyParty ??
    resolveInstallationWaitingCopyParty({
      assignedPartyType: null,
      supportMode: selectedSupportMode,
      sessionState: presentationState ?? state,
    });
  const waitingHeading = wizLabels.waitingForParty(waitingCopyParty);
  const showContinueLater =
    !isPreview && (hydrated?.canContinueLater ?? canShowInstallContinueLater(session));
  const showWaitingPresentation = Boolean(hydrated?.showWaitingPresentation);
  const confirmationData = handoffConfirmation ?? hydrated?.confirmation ?? null;
  const confirmationNotice =
    handoffNotice ??
    (hydrated?.showConfirmationBanner && hydrated.supportMode && hydrated.confirmation
      ? wizLabels.handoffSuccessNotice({
          mode: hydrated.supportMode,
          reference: hydrated.confirmation.reference,
          requestedAt: hydrated.confirmation.requestedAt,
          recipientEmail: hydrated.confirmation.recipientEmail,
          duplicate: true,
        })
      : null);
  const onChooseSupportStep =
    current?.step_type === "choose_support" ||
    state === "support_selection" ||
    state === "not_started" ||
    (!isPreview &&
      (installLifecycle === "choose" || installLifecycle === "selected") &&
      !session?.support_mode);

  const jumpToPreviewStep = (stepKey: string) => {
    if (!isPreview) return;
    const idx = planned.findIndex((s) => s.step_key === stepKey);
    if (idx < 0) return;
    const nextCompleted = planned.slice(0, idx).map((s) => s.step_key);
    void persistSession({
      current_step_key: stepKey,
      completed_step_keys: nextCompleted,
      state: idx === 0 ? "not_started" : "in_progress",
      reason: "preview_jump",
    });
  };

  const goPreviewBack = () => {
    if (!isPreview || progressIndex <= 0) return;
    const prev = planned[progressIndex - 1];
    if (prev) jumpToPreviewStep(prev.step_key);
  };

  const completeStep = async (stepKey: string, nextState: InstallationWizardState) => {
    const nextCompleted = Array.from(new Set([...completedKeys, stepKey]));
    const nextStep = nextSafeStep(
      planInstallationSteps(contract, {
        supportMode,
        audience: effectiveAudience,
        completedStepKeys: nextCompleted,
      }),
      nextCompleted
    );
    await persistSession({
      state: nextState,
      completed_step_keys: nextCompleted,
      current_step_key: nextStep?.step_key ?? stepKey,
      paused: false,
      reason: `complete:${stepKey}`,
    });
    setLiveRegion(wizLabels.primaryContinue);
  };

  const onSelectSupport = async (selected: InstallationSupportMode) => {
    if (isPreview) {
      await persistSession({
        support_mode: selected,
        state: previewStateAfterSupportSelect(selected),
        current_step_key:
          planned.find(
            (s) => s.step_type !== "choose_support" && s.step_type !== "introduction"
          )?.step_key ?? "choose_support",
        completed_step_keys: Array.from(
          new Set([...completedKeys, "introduction", "choose_support"])
        ),
        reason: `preview_support_mode:${selected}`,
      });
      setErrorSummary(null);
      setHandoffNotice(null);
      setLiveRegion(wizLabels.supportModeLabel(selected));
      return;
    }
    // Install: local UI selection only — no session write, no awaiting_* yet.
    setLocalSupportMode(selected);
    setErrorSummary(null);
    setHandoffNotice(null);
    setLiveRegion(wizLabels.supportModeLabel(selected));
  };

  const confirmSupportSelection = async (explicitMode?: InstallationSupportMode) => {
    if (isPreview || confirmInFlight) return;
    const modeToPersist = explicitMode ?? localSupportMode ?? session?.support_mode;
    if (!modeToPersist) return;
    setConfirmInFlight(true);
    setActing(true);
    setErrorSummary(null);
    try {
      const nextStep =
        planned.find(
          (s) => s.step_type !== "choose_support" && s.step_type !== "introduction"
        )?.step_key ?? "choose_support";
      const next = await persistSession({
        support_mode: modeToPersist,
        state: sessionStateAfterSupportConfirm(modeToPersist),
        current_step_key: nextStep,
        completed_step_keys: Array.from(
          new Set([...completedKeys, "introduction", "choose_support"])
        ),
        paused: false,
        reason: `confirm_support_mode:${modeToPersist}`,
        idempotency_key: `confirm_support:${providerKey}:${modeToPersist}`,
      });
      if (!next) {
        setErrorSummary(wizLabels.installSessionPersistError);
        setLiveRegion(wizLabels.installSessionPersistError);
        return;
      }
      setLocalSupportMode(null);
      setLiveRegion(wizLabels.primaryContinue);
    } finally {
      setConfirmInFlight(false);
      setActing(false);
    }
  };

  const onContinueLater = async () => {
    if (isPreview) {
      blockPreviewWrite();
      return;
    }
    await persistSession({
      state: "paused",
      paused: true,
      reason: "continue_later",
    });
    setLiveRegion(wizLabels.pauseSaved);
  };

  const submitInstallationHandoff = async (opts: {
    mode: InstallationSupportMode;
    recipientEmail?: string | null;
  }) => {
    const handoffType = handoffTypeForSupportMode(opts.mode);
    if (!handoffType || handoffType === "self_service_start") {
      return false;
    }
    if (opts.mode === "customer_it_managed" && !isValidInviteEmail(opts.recipientEmail)) {
      setErrorSummary(wizLabels.handoffInvalidRecipient);
      setLiveRegion(wizLabels.handoffInvalidRecipient);
      return false;
    }

    setActing(true);
    setErrorSummary(null);
    setHandoffNotice(null);
    try {
      const idempotencyKey = buildHandoffIdempotencyKey({
        providerKey,
        handoffType,
        sessionId: session?.session_id,
      });
      const res = await fetch(
        `/api/app-portal/integrations/${encodeURIComponent(providerKey)}/installation/handoff`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handoff_type: handoffType,
            idempotency_key: idempotencyKey,
            recipient_email: opts.recipientEmail ?? null,
          }),
        }
      );
      const payload = (await res.json().catch(() => ({}))) as InstallationHandoffResponse & {
        error?: string;
        error_code?: string;
        session?: InstallationSessionSnapshot | null;
      };
      if (!res.ok) {
        const message =
          payload.error_code === "invalid_recipient_email"
            ? wizLabels.handoffInvalidRecipient
            : wizLabels.handoffFailed;
        setErrorSummary(message);
        setLiveRegion(message);
        return false;
      }

      if (payload.session) {
        setSession(parseSession(payload.session) ?? session);
      } else {
        // Refresh session from server if RPC omitted nested session parse shape.
        const sessionRes = await fetch(
          `/api/app-portal/integrations/installation/session?provider_key=${encodeURIComponent(providerKey)}`
        );
        if (sessionRes.ok) {
          const sessionJson = await sessionRes.json();
          setSession(parseSession(sessionJson?.session) ?? null);
        }
      }

      setLocalSupportMode(null);
      const handoffRow = (payload as { handoff?: Record<string, unknown> }).handoff;
      const assignedPartyType =
        typeof handoffRow?.assigned_party_type === "string"
          ? handoffRow.assigned_party_type
          : opts.mode === "customer_it_managed"
            ? "customer_it"
            : opts.mode === "partner_managed"
              ? "partner"
              : "aipify";
      const requestedAt = payload.requested_at ?? payload.created_at ?? new Date().toISOString();
      const reference = String(payload.handoff_request_id ?? "");
      const recipientEmail = payload.recipient_email ?? opts.recipientEmail ?? null;
      setPersistedHandoff({
        handoff_request_id: reference,
        status:
          typeof handoffRow?.status === "string" ? handoffRow.status : payload.status || "requested",
        support_mode: isInstallationSupportMode(handoffRow?.support_mode)
          ? handoffRow.support_mode
          : opts.mode,
        assigned_party_type: assignedPartyType,
        requested_at: requestedAt,
        created_at: payload.created_at ?? requestedAt,
        recipient_email: recipientEmail,
        lifecycle_state:
          typeof handoffRow?.lifecycle_state === "string"
            ? handoffRow.lifecycle_state
            : payload.lifecycle_state ?? null,
        next_step:
          typeof handoffRow?.next_step === "string"
            ? handoffRow.next_step
            : payload.next_step ?? null,
        handoff_type:
          typeof handoffRow?.handoff_type === "string" ? handoffRow.handoff_type : handoffType,
      });
      setHandoffLoadState("ready");
      setHandoffConfirmation({
        reference,
        requestedAt,
        recipientEmail,
      });
      const successNotice = wizLabels.handoffSuccessNotice({
        mode: opts.mode,
        reference,
        requestedAt,
        recipientEmail,
        duplicate: Boolean(payload.duplicate),
      });
      setHandoffNotice(successNotice);
      setLiveRegion(successNotice);
      return true;
    } finally {
      setActing(false);
    }
  };

  const onAssistance = async (actionKey: string) => {
    const action = contract.assistance_actions.find((a) => a.action_key === actionKey);
    if (!action) return;
    if (action.support_mode && actionKey !== primaryInstallActionKeyForMode(action.support_mode)) {
      await onSelectSupport(action.support_mode);
      return;
    }

    // Active handoff CTAs — server-authoritative; waiting only after persisted success.
    if (action.handoff === "request" || action.handoff === "invite") {
      if (isPreview) {
        blockPreviewWrite();
        return;
      }
      const modeForHandoff =
        action.support_mode ?? selectedSupportMode ?? localSupportMode;
      if (!modeForHandoff) {
        setErrorSummary(wizLabels.handoffFailed);
        return;
      }
      await submitInstallationHandoff({
        mode: modeForHandoff,
        recipientEmail: modeForHandoff === "customer_it_managed" ? itRecipientEmail : null,
      });
      return;
    }

    // Honest placeholder only when contract still marks an action as not implemented.
    if (action.handoff === "coming_later" || action.requires_quote || action.requires_order) {
      if (isPreview) {
        blockPreviewWrite();
        return;
      }
      setHandoffNotice(wizLabels.comingLater);
      setLiveRegion(wizLabels.comingLater);
      return;
    }

    if (action.handoff === "invite_placeholder") {
      if (isPreview) {
        blockPreviewWrite();
        return;
      }
      // Partner / provider invite subsystem remains a scoped gap — no fake awaiting_*.
      setHandoffNotice(wizLabels.invitePlaceholder);
      setLiveRegion(wizLabels.invitePlaceholder);
      return;
    }
    if (action.handoff === "support" || actionKey === "contact_support") {
      if (isPreview) {
        blockPreviewWrite();
        return;
      }
      window.location.href = "/app/support";
      return;
    }
    if (actionKey === "self_service") {
      if (isPreview) {
        blockPreviewWrite();
        return;
      }
      setLocalSupportMode("self_service");
      await confirmSupportSelection("self_service");
      return;
    }
    if (actionKey === "continue_later") {
      await onContinueLater();
    }
  };

  const onSaveCredential = async () => {
    if (isPreview) {
      blockPreviewWrite();
      return;
    }
    if (!apiKey.trim()) {
      setErrorSummary(wizLabels.errorGeneric);
      return;
    }
    setActing(true);
    try {
      const res = await fetch("/api/app-portal/integrations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_key: providerKey,
          api_key: apiKey,
          permission_level: setup.default_permission_level,
          approved_scopes: setup.recommended_scopes,
        }),
      });
      setApiKey("");
      if (!res.ok) {
        setErrorSummary(wizLabels.errorGeneric);
        return;
      }
      const fields = redactSecretFieldValues(
        { ...(session?.field_values ?? {}), api_key: { masked: true } },
        current?.customer_fields ?? []
      );
      await persistSession({
        state: "ready_for_test",
        field_values: fields,
        completed_step_keys: Array.from(
          new Set([...completedKeys, current?.step_key ?? "provide_credentials"])
        ),
        current_step_key: "run_connection_test",
        reason: "credential_saved",
      });
      await onReload();
    } finally {
      setActing(false);
    }
  };

  const onRunTest = async () => {
    if (isPreview) {
      blockPreviewWrite();
      return;
    }
    if (!setup.connection?.id) {
      setTestMessage(wizLabels.testNeedInfo);
      return;
    }
    setActing(true);
    setTestMessage(wizLabels.testTesting);
    setLiveRegion(wizLabels.testTesting);
    try {
      await persistSession({ state: "testing", reason: "test_start" });
      const res = await fetch("/api/app-portal/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: setup.connection.id }),
      });
      if (!res.ok) {
        setTestMessage(wizLabels.testFailed);
        await persistSession({
          state: "test_failed",
          last_test_status: "failed",
          reason: "test_failed",
        });
        return;
      }
      setTestMessage(wizLabels.testOk);
      await persistSession({
        state: "verified",
        last_test_status: "passed",
        completed_step_keys: Array.from(
          new Set([...completedKeys, "run_connection_test"])
        ),
        current_step_key: "review_permissions",
        reason: "test_passed",
      });
      await onReload();
    } finally {
      setActing(false);
    }
  };

  const onActivate = async () => {
    if (isPreview) {
      blockPreviewWrite();
      return;
    }
    // Explicit gate: only verified / ready_for_activation — never auto-activate.
    if (!setup.connection?.id || !canActivateFromWizard(state)) {
      setErrorSummary(wizLabels.activateGate);
      return;
    }
    setActing(true);
    try {
      if (state === "verified") {
        await persistSession({ state: "ready_for_activation", reason: "pre_activate" });
      }
      const res = await fetch("/api/app-portal/integrations/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: setup.connection.id }),
      });
      if (!res.ok) {
        setErrorSummary(wizLabels.errorGeneric);
        return;
      }
      await persistSession({
        state: "active",
        completed_step_keys: Array.from(
          new Set([...completedKeys, "review_permissions", "activate"])
        ),
        current_step_key: "completion",
        reason: "activated",
      });
      await persistSession({
        state: "completed",
        completed_step_keys: Array.from(
          new Set([
            ...completedKeys,
            "review_permissions",
            "activate",
            "completion",
          ])
        ),
        current_step_key: "completion",
        reason: "completed",
      });
      setLiveRegion(wizLabels.completed);
      await onReload();
    } finally {
      setActing(false);
    }
  };

  const stale =
    !isPreview &&
    session?.contract_version &&
    session.contract_version !== contract.contract_version;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      dir={dir}
      data-installation-locales={availableLocales.join(",")}
      data-installation-wizard-mode={mode}
      data-installation-wizard-entry={entry}
      aria-labelledby="installation-wizard-title"
    >
      {isPreview ? (
        <div
          className="mb-5 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-950 dark:border-sky-400/40 dark:bg-sky-950/40 dark:text-sky-50"
          role="status"
          data-preview-banner="true"
        >
          <p className="font-semibold">{wizLabels.previewBadge}</p>
          <p className="mt-1 opacity-95">{wizLabels.previewNotice}</p>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {setup.display_name}
            {isPreview ? (
              <span className="ml-2 inline-flex rounded-full border border-sky-500/40 bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-900 dark:text-sky-100">
                {wizLabels.previewBadge}
              </span>
            ) : null}
          </p>
          <h1
            id="installation-wizard-title"
            className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl"
          >
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
          <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            {wizLabels.reassurance}
          </p>
        </div>
        <div
          className={`shrink-0 rounded-xl border px-4 py-3 text-sm ${
            isPreview
              ? "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100"
              : statusTone(statusToneState)
          }`}
          role="status"
          data-preview-status={isPreview ? "true" : undefined}
        >
          <span className="font-medium">{statusLabel}</span>
          <p className="mt-1 opacity-90">
            {wizLabels.estimatedTime(current?.estimated_time_minutes ?? contract.estimated_time_minutes)}
          </p>
        </div>
      </div>

      <nav aria-label={wizLabels.progressLabel} className="mb-8">
        <ol className="flex flex-wrap gap-2" role="list">
          {planned.map((step, idx) => {
            const done = completed.has(step.step_key);
            const isCurrent = current?.step_key === step.step_key;
            const stepTitle = resolveCustomerSafeText(
              resolveStepPresentation(step, effectiveAudience).title,
              { locale, translate, emptyFallback: step.step_key }
            );
            const className = [
              "rounded-full border px-3 py-1.5 text-xs sm:text-sm",
              done
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                : isCurrent
                  ? "border-violet-500/50 bg-violet-500/15 text-violet-900 dark:text-violet-100"
                  : "border-slate-300/60 bg-slate-100/60 text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
            ].join(" ");
            return (
              <li key={step.step_key} aria-current={isCurrent ? "step" : undefined}>
                {isPreview ? (
                  <button
                    type="button"
                    className={className}
                    onClick={() => jumpToPreviewStep(step.step_key)}
                  >
                    <span className="sr-only">
                      {wizLabels.progressLabel} {idx + 1}/{progressTotal}
                    </span>
                    {stepTitle}
                  </button>
                ) : (
                  <span className={className}>
                    <span className="sr-only">
                      {wizLabels.progressLabel} {idx + 1}/{progressTotal}
                    </span>
                    {stepTitle}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
          {wizLabels.progressLabel}: {progressIndex + 1} / {progressTotal}
        </p>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-8">
          {stale ? (
            <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
              {wizLabels.staleContract}
            </p>
          ) : null}

          {errorSummary ? (
            <div
              id="installation-error-summary"
              role="alert"
              className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-800 dark:text-rose-200"
            >
              {errorSummary}
            </div>
          ) : null}

          {confirmationNotice ? (
            <div
              role="status"
              aria-live="polite"
              data-handoff-confirmation={confirmationData ? "true" : "false"}
              className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-100"
            >
              <p>{confirmationNotice}</p>
              {confirmationData?.reference ? (
                <p className="mt-1 text-xs opacity-90" data-handoff-reference="true">
                  {wizLabels.handoffReferenceLabel}: {confirmationData.reference}
                </p>
              ) : null}
              {confirmationData?.requestedAt ? (
                <p className="mt-0.5 text-xs opacity-90" data-handoff-timestamp="true">
                  {wizLabels.handoffRequestedAtLabel}:{" "}
                  {new Date(confirmationData.requestedAt).toLocaleString(locale)}
                </p>
              ) : null}
              {confirmationData?.recipientEmail ? (
                <p className="mt-0.5 text-xs opacity-90" data-handoff-recipient="true">
                  {wizLabels.handoffRecipientLabel}: {confirmationData.recipientEmail}
                </p>
              ) : null}
            </div>
          ) : null}

          {onChooseSupportStep ? (
            <div className="space-y-3" data-install-support-selection="true">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {resolveCustomerSafeText(contract.steps.find((s) => s.step_type === "choose_support")?.title ?? {
                  kind: "locale_key",
                  key: "customerApp.portalStructure.integrations.installationWizard.steps.chooseSupport.title",
                }, { locale, translate, emptyFallback: wizLabels.emptyFallback })}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2" data-customer-support-choices="true">
                {visibleSupportModes.map((supportChoice) => {
                  const selected = selectedSupportMode === supportChoice;
                  return (
                    <li key={supportChoice}>
                      <button
                        type="button"
                        disabled={acting || confirmInFlight}
                        aria-pressed={selected}
                        onClick={() => void onSelectSupport(supportChoice)}
                        className={[
                          "flex min-h-12 w-full items-center justify-center rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                          selected
                            ? "border-violet-500 bg-violet-50 text-violet-950 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-50"
                            : "border-slate-200 bg-slate-50 text-slate-800 hover:border-violet-400 hover:bg-violet-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-violet-400 dark:hover:bg-violet-950/40",
                        ].join(" ")}
                      >
                        {wizLabels.supportModeLabel(supportChoice)}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {visibleSupportModes.includes("self_service") ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">{wizLabels.technicalRequired}</p>
              ) : null}
              {!isPreview && selectedSupportMode ? (
                <button
                  type="button"
                  disabled={acting || confirmInFlight}
                  data-confirm-support="true"
                  onClick={() => void confirmSupportSelection()}
                  className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-60"
                >
                  {confirmInFlight ? wizLabels.loading : wizLabels.primaryContinue}
                </button>
              ) : null}
            </div>
          ) : null}

          {current?.step_type === "introduction" ? (
            <div className="space-y-4">
              <button
                type="button"
                disabled={acting}
                className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-60"
                onClick={() =>
                  void completeStep("introduction", "support_selection").then(() =>
                    persistSession({
                      state: "support_selection",
                      current_step_key: "choose_support",
                      completed_step_keys: Array.from(
                        new Set([...completedKeys, "introduction"])
                      ),
                      reason: "intro_complete",
                    })
                  )
                }
              >
                {wizLabels.primaryContinue}
              </button>
            </div>
          ) : null}

          {current?.step_type === "provide_credentials" || current?.step_type === "configure_api_key" ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                {resolveCustomerSafeText(
                  current.customer_fields[0]?.label ?? {
                    kind: "locale_key",
                    key: "customerApp.portalStructure.integrations.installationWizard.fields.apiKey",
                  },
                  { locale, translate, emptyFallback: "API key" }
                )}
                <input
                  type="password"
                  autoComplete="off"
                  value={isPreview ? "" : apiKey}
                  placeholder={isPreview ? wizLabels.previewSampleCredential : undefined}
                  readOnly={isPreview}
                  disabled={isPreview}
                  onChange={(e) => {
                    if (!isPreview) setApiKey(e.target.value);
                  }}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-80 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50 dark:disabled:bg-slate-900"
                />
              </label>
              {isPreview ? (
                <button
                  type="button"
                  onClick={() =>
                    void completeStep(current.step_key, "ready_for_test")
                  }
                  className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {wizLabels.primaryContinue}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={acting || !apiKey.trim()}
                  onClick={() => void onSaveCredential()}
                  className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {wizLabels.primaryContinue}
                </button>
              )}
            </div>
          ) : null}

          {!isPreview && showWaitingPresentation ? (
            <div
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-50"
              data-waiting-party={waitingCopyParty}
            >
              <p className="font-medium">{waitingHeading}</p>
              <p className="mt-2 opacity-90">{description}</p>
            </div>
          ) : null}

          {current?.step_type === "run_connection_test" ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
                {isPreview
                  ? wizLabels.previewReadOnlyAction
                  : (testMessage ?? wizLabels.testTesting)}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {isPreview ? (
                  <button
                    type="button"
                    onClick={() => void completeStep(current.step_key, "verified")}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    {wizLabels.primaryContinue}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void onRunTest()}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                  >
                    {wizLabels.testRetry}
                  </button>
                )}
                <button
                  type="button"
                  disabled={acting || isPreview}
                  onClick={() => void onAssistance("ask_aipify_help")}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-violet-400 px-5 py-3 text-sm font-semibold text-violet-800 disabled:opacity-50 dark:text-violet-200"
                >
                  {wizLabels.testAskHelp}
                </button>
              </div>
            </div>
          ) : null}

          {current?.step_type === "review_permissions" ? (
            <div className="space-y-4">
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {setup.recommended_scopes.map((scope) => (
                  <li key={scope}>{scope}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled={acting}
                onClick={() =>
                  void completeStep("review_permissions", "ready_for_activation")
                }
                className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {wizLabels.primaryContinue}
              </button>
            </div>
          ) : null}

          {current?.step_type === "activate" ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isPreview ? wizLabels.previewReadOnlyAction : wizLabels.activateGate}
              </p>
              {isPreview ? (
                <button
                  type="button"
                  onClick={() => void completeStep(current.step_key, "completed")}
                  className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {wizLabels.primaryContinue}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={acting || !["verified", "ready_for_activation"].includes(state)}
                  onClick={() => void onActivate()}
                  className="inline-flex min-h-12 items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {wizLabels.primaryContinue}
                </button>
              )}
            </div>
          ) : null}

          {current?.step_type === "completion" || state === "completed" || state === "active" ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:text-emerald-100">
              <p className="font-medium">{wizLabels.completed}</p>
            </div>
          ) : null}

          {["configure_oauth", "install_connector", "enter_configuration", "authorize_access"].includes(
            current?.step_type ?? ""
          ) ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">{wizLabels.technicalRequired}</p>
              <button
                type="button"
                disabled={acting}
                onClick={() =>
                  void completeStep(current!.step_key, "ready_for_test")
                }
                className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {wizLabels.primaryContinue}
              </button>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row sm:flex-wrap">
            {isPreview ? (
              <>
                <button
                  type="button"
                  disabled={progressIndex <= 0}
                  onClick={goPreviewBack}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                >
                  {wizLabels.primaryBack}
                </button>
                {current && current.step_type !== "completion" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = planned[progressIndex + 1];
                      if (next) jumpToPreviewStep(next.step_key);
                      else void completeStep(current.step_key, "completed");
                    }}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    {wizLabels.primaryContinue}
                  </button>
                ) : null}
              </>
            ) : (
              <>
                {showContinueLater ? (
                  <button
                    type="button"
                    disabled={acting}
                    data-continue-later="true"
                    onClick={() => void onContinueLater()}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  >
                    {wizLabels.continueLater}
                  </button>
                ) : null}
                {session?.paused ? (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() =>
                      void persistSession({
                        state: "in_progress",
                        paused: false,
                        reason: "resume",
                      })
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    {wizLabels.resume}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div
            className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4"
            data-preview-responsibility={isPreview ? "true" : undefined}
            data-install-responsibility={!isPreview ? "true" : undefined}
          >
            <h2 className="text-sm font-semibold text-violet-900 dark:text-violet-100">
              {responsibilityLabel}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {isPreview ? wizLabels.previewNotice : wizLabels.reassurance}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {isPreview
                ? wizLabels.previewActionsExampleHeading
                : wizLabels.installActionsHeading}
            </h2>
            {isPreview ? (
              <ul className="mt-3 space-y-2" data-preview-actions="true">
                {previewExampleActions.map((action) => {
                  const label = resolveCustomerSafeText(action.label, {
                    locale,
                    translate,
                    emptyFallback: action.action_key,
                  });
                  return (
                    <li key={action.action_key}>
                      <button
                        type="button"
                        disabled
                        title={wizLabels.previewActionsUnavailable}
                        aria-disabled="true"
                        className="w-full cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-500 opacity-70 dark:border-slate-600 dark:text-slate-400"
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : hydrated?.statusPendingHydration ? (
              <p
                className="mt-3 text-sm text-slate-600 dark:text-slate-300"
                data-install-actions="hydrating"
              >
                {wizLabels.loading}
              </p>
            ) : installLifecycle === "choose" || !selectedSupportMode ? (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300" data-install-actions="empty">
                {wizLabels.installActionsChooseHint}
              </p>
            ) : installLifecycle === "handed_off" ? (
              <p
                className="mt-3 text-sm text-slate-600 dark:text-slate-300"
                data-install-actions="handed_off"
              >
                {wizLabels.handoffNextStepHint}
              </p>
            ) : (
              <ul className="mt-3 space-y-2" data-install-actions="relevant">
                {selectedSupportMode === "customer_it_managed" ? (
                  <li>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                      {wizLabels.itRecipientFieldLabel}
                    </label>
                    <input
                      type="email"
                      name="it_recipient_email"
                      autoComplete="email"
                      value={itRecipientEmail}
                      onChange={(event) => setItRecipientEmail(event.target.value)}
                      disabled={acting || confirmInFlight}
                      placeholder={wizLabels.itRecipientFieldPlaceholder}
                      className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50"
                      data-it-recipient-email="true"
                    />
                  </li>
                ) : null}
                {installAssistanceActions.map((action) => {
                  const modeKey = selectedSupportMode;
                  const label =
                    modeKey && primaryInstallActionKeyForMode(modeKey) === action.action_key
                      ? wizLabels.installPrimaryActionLabel(modeKey)
                      : resolveCustomerSafeText(action.label, {
                          locale,
                          translate,
                          emptyFallback: action.action_key,
                        });
                  return (
                    <li key={action.action_key}>
                      <button
                        type="button"
                        disabled={
                          acting ||
                          confirmInFlight ||
                          (modeKey === "customer_it_managed" && !isValidInviteEmail(itRecipientEmail))
                        }
                        onClick={() => void onAssistance(action.action_key)}
                        className="w-full rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-left text-sm font-medium text-violet-950 hover:border-violet-500 disabled:opacity-60 dark:border-violet-500/40 dark:bg-violet-950/40 dark:text-violet-50"
                        data-handoff-cta={action.action_key}
                      >
                        {acting ? wizLabels.handoffSubmitting : label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <div className="sr-only" aria-live="polite">
        {liveRegion}
      </div>
    </section>
  );
}
