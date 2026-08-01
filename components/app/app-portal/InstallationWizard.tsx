"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildInstallationWizardLabels,
  canActivateFromWizard,
  isInstallationSupportMode,
  listInstallationLocales,
  nextSafeStep,
  planInstallationSteps,
  redactSecretFieldValues,
  resolveCustomerSafeText,
  resolveInstallationTextDirection,
  resolveStepPresentation,
  selectDefaultSupportMode,
  resolveInstallationContract,
  waitingStateForSupportMode,
  type InstallationAudience,
  type InstallationSessionSnapshot,
  type InstallationSupportMode,
  type InstallationWizardState,
  type InstallationWizardLabels,
} from "@/lib/app-portal/integrations/installation";
import type { AppPortalIntegrationSetup, AppPortalIntegrationsLabels } from "@/lib/app-portal/integrations";

type InstallationWizardProps = {
  providerKey: string;
  setup: AppPortalIntegrationSetup;
  labels: AppPortalIntegrationsLabels;
  locale: string;
  audience?: InstallationAudience;
  onReload: () => Promise<void>;
  /** When true, show internal technical copy (operators/partners). */
  showInternalDetails?: boolean;
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
}: InstallationWizardProps) {
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
    parseSession(setup.installation_session)
  );
  const [acting, setActing] = useState(false);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);
  const [liveRegion, setLiveRegion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  useEffect(() => {
    setSession(parseSession(setup.installation_session));
  }, [setup.installation_session]);

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
    [contractResult, providerKey, wizLabels.errorGeneric]
  );

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
  const supportMode =
    session?.support_mode ?? selectDefaultSupportMode(contract);
  const planned = planInstallationSteps(contract, {
    supportMode,
    audience: effectiveAudience,
    completedStepKeys: session?.completed_step_keys ?? [],
  });
  const current =
    planned.find((s) => s.step_key === session?.current_step_key) ??
    nextSafeStep(planned, session?.completed_step_keys ?? []) ??
    planned[0] ??
    null;
  const completed = new Set(session?.completed_step_keys ?? []);
  const progressIndex = current ? Math.max(0, planned.findIndex((s) => s.step_key === current.step_key)) : 0;
  const progressTotal = Math.max(1, planned.length);
  const state: InstallationWizardState = session?.state ?? "not_started";
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

  const completeStep = async (stepKey: string, nextState: InstallationWizardState) => {
    const nextCompleted = Array.from(new Set([...(session?.completed_step_keys ?? []), stepKey]));
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

  const onSelectSupport = async (mode: InstallationSupportMode) => {
    const waitState = waitingStateForSupportMode(mode);
    await persistSession({
      support_mode: mode,
      state: mode === "self_service" || mode === "guided" ? "in_progress" : waitState,
      current_step_key: "choose_support",
      completed_step_keys: Array.from(
        new Set([...(session?.completed_step_keys ?? []), "introduction", "choose_support"])
      ),
      reason: `support_mode:${mode}`,
    });
    setLiveRegion(wizLabels.supportModeLabel(mode));
  };

  const onContinueLater = async () => {
    await persistSession({
      state: "paused",
      paused: true,
      reason: "continue_later",
    });
    setLiveRegion(wizLabels.pauseSaved);
  };

  const onAssistance = async (actionKey: string) => {
    const action = contract.assistance_actions.find((a) => a.action_key === actionKey);
    if (!action) return;
    if (action.support_mode) {
      await onSelectSupport(action.support_mode);
      return;
    }
    if (action.handoff === "coming_later" || action.requires_quote || action.requires_order) {
      setHandoffNotice(wizLabels.comingLater);
      setLiveRegion(wizLabels.comingLater);
      return;
    }
    if (action.handoff === "invite_placeholder") {
      const role =
        actionKey.includes("partner")
          ? "partner"
          : actionKey.includes("provider")
            ? "external_provider"
            : "customer_it";
      const res = await fetch("/api/app-portal/integrations/installation/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_key: providerKey, role }),
      });
      if (res.ok) {
        setHandoffNotice(wizLabels.invitePlaceholder);
        setLiveRegion(wizLabels.invitePlaceholder);
      } else {
        setHandoffNotice(wizLabels.invitePlaceholder);
      }
      return;
    }
    if (action.handoff === "support" || actionKey === "contact_support") {
      window.location.href = "/app/support";
      return;
    }
    if (actionKey === "continue_later") {
      await onContinueLater();
    }
  };

  const onSaveCredential = async () => {
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
          new Set([...(session?.completed_step_keys ?? []), current?.step_key ?? "provide_credentials"])
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
          new Set([...(session?.completed_step_keys ?? []), "run_connection_test"])
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
          new Set([...(session?.completed_step_keys ?? []), "review_permissions", "activate"])
        ),
        current_step_key: "completion",
        reason: "activated",
      });
      await persistSession({
        state: "completed",
        completed_step_keys: Array.from(
          new Set([
            ...(session?.completed_step_keys ?? []),
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
    session?.contract_version &&
    session.contract_version !== contract.contract_version;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      dir={dir}
      data-installation-locales={availableLocales.join(",")}
      aria-labelledby="installation-wizard-title"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {setup.display_name}
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
          className={`shrink-0 rounded-xl border px-4 py-3 text-sm ${statusTone(state)}`}
          role="status"
        >
          <span className="font-medium">{wizLabels.stateLabel(state)}</span>
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
            return (
              <li
                key={step.step_key}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs sm:text-sm",
                  done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                    : isCurrent
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-900 dark:text-violet-100"
                      : "border-slate-300/60 bg-slate-100/60 text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="sr-only">
                  {wizLabels.progressLabel} {idx + 1}/{progressTotal}
                </span>
                {stepTitle}
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

          {handoffNotice ? (
            <p
              role="status"
              aria-live="polite"
              data-handoff-placeholder="true"
              className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100"
            >
              {handoffNotice}
            </p>
          ) : null}

          {current?.step_type === "choose_support" || state === "support_selection" || state === "not_started" ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {resolveCustomerSafeText(contract.steps.find((s) => s.step_type === "choose_support")?.title ?? {
                  kind: "locale_key",
                  key: "customerApp.portalStructure.integrations.installationWizard.steps.chooseSupport.title",
                }, { locale, translate, emptyFallback: wizLabels.emptyFallback })}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {contract.support_modes.map((mode) => (
                  <li key={mode}>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void onSelectSupport(mode)}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-violet-400 dark:hover:bg-violet-950/40"
                    >
                      {wizLabels.supportModeLabel(mode)}
                    </button>
                  </li>
                ))}
              </ul>
              {contract.support_modes.includes("self_service") ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">{wizLabels.technicalRequired}</p>
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
                        new Set([...(session?.completed_step_keys ?? []), "introduction"])
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
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
              <button
                type="button"
                disabled={acting || !apiKey.trim()}
                onClick={() => void onSaveCredential()}
                className="inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {wizLabels.primaryContinue}
              </button>
            </div>
          ) : null}

          {current?.step_type === "waiting_external_party" ||
          ["awaiting_aipify", "awaiting_partner", "awaiting_provider", "awaiting_customer_it"].includes(
            state
          ) ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-50">
              <p className="font-medium">{wizLabels.waiting}</p>
              <p className="mt-2 opacity-90">{description}</p>
            </div>
          ) : null}

          {current?.step_type === "run_connection_test" ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
                {testMessage ?? wizLabels.testTesting}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void onRunTest()}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                >
                  {wizLabels.testRetry}
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void onAssistance("ask_aipify_help")}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-violet-400 px-5 py-3 text-sm font-semibold text-violet-800 dark:text-violet-200"
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
              <p className="text-sm text-slate-600 dark:text-slate-300">{wizLabels.activateGate}</p>
              <button
                type="button"
                disabled={acting || !["verified", "ready_for_activation"].includes(state)}
                onClick={() => void onActivate()}
                className="inline-flex min-h-12 items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {wizLabels.primaryContinue}
              </button>
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
            <button
              type="button"
              disabled={acting}
              onClick={() => void onContinueLater()}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              {wizLabels.continueLater}
            </button>
            {session?.paused ? (
              <button
                type="button"
                disabled={acting}
                onClick={() =>
                  void persistSession({
                    state: supportMode === "aipify_managed" ? "awaiting_aipify" : "in_progress",
                    paused: false,
                    reason: "resume",
                  })
                }
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
              >
                {wizLabels.resume}
              </button>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <h2 className="text-sm font-semibold text-violet-900 dark:text-violet-100">
              {wizLabels.responsibleParty(current?.responsible_party ?? contract.responsible_party_default)}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {resolveCustomerSafeText(contract.documentation.customer_help, {
                locale,
                translate,
                emptyFallback: wizLabels.reassurance,
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {resolveCustomerSafeText(
                { kind: "locale_key", key: "customerApp.portalStructure.integrations.installationWizard.actions.askAipifyHelp" },
                { locale, translate, emptyFallback: "Help" }
              )}
            </h2>
            <ul className="mt-3 space-y-2">
              {contract.assistance_actions.map((action) => {
                const label = resolveCustomerSafeText(action.label, {
                  locale,
                  translate,
                  emptyFallback: action.action_key,
                });
                return (
                  <li key={action.action_key}>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void onAssistance(action.action_key)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:border-violet-400 dark:border-slate-600 dark:text-slate-200"
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <div className="sr-only" aria-live="polite">
        {liveRegion}
      </div>
    </section>
  );
}
