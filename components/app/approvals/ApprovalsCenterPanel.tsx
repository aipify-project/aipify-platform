"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerApproval } from "@/lib/app/customer-app";
import type { ApprovalsCenterUiLabels } from "@/lib/companion-action-approval/approvals-center-labels";
import {
  buildCompanionPendingDisplayFields,
  resolveApprovalPostRequest,
  resolveCompanionActionsLoadOutcome,
  resolveTrustApprovalsLoadOutcome,
  resolveTrustApproveRequest,
  runIndependentApprovalLoads,
  selectFocusedApprovalId,
  shouldShowApprovalsEmptyState,
  type CompanionActionRequest,
} from "@/lib/companion-action-approval";
import {
  APPROVAL_RISK_CHIP_CLASSES,
  APPROVAL_STATUS_CHIP_CLASSES,
  buildApprovalViewModel,
  resolveApprovalRiskKey,
  type ApprovalViewModel,
} from "@/lib/companion-action-approval/presentation";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { buildApprovalsDeepLink } from "@/lib/companion-action-approval/parse";

type ApprovalsCenterPanelProps = {
  locale: string;
  labels: ApprovalsCenterUiLabels;
};

function Chip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function DecisionPanel({
  vm,
  labels,
  actingId,
  decisionReason,
  setDecisionReason,
  emergencyActive,
  onApprove,
  onReject,
}: {
  vm: ApprovalViewModel;
  labels: ApprovalsCenterUiLabels;
  actingId: string | null;
  decisionReason: string;
  setDecisionReason: (value: string) => void;
  emergencyActive: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const decisionDisabled =
    actingId === vm.id ||
    !vm.decisionAllowed ||
    (vm.returnToKompis && decisionReason.trim().length < 3);

  return (
    <aside
      className={`${AipifyShellClasses.surfaceCard} space-y-4 p-5 lg:sticky lg:top-6`}
      aria-label={labels.decisionActionsLabel}
    >
      <div>
        <h2 className="text-base font-semibold text-aipify-text">{labels.decisionTitle}</h2>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.reasonHelp}</p>
      </div>

      {vm.expiresSoon && vm.expiresAtDisplay ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {labels.expiresSoon}
          {vm.timeRemainingLabel ? ` · ${vm.timeRemainingLabel}` : null}
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-aipify-text-muted">{labels.presentation.riskControlTitle}</dt>
          <dd>
            <Chip className={APPROVAL_RISK_CHIP_CLASSES[vm.riskTone]}>{vm.riskLabel}</Chip>
          </dd>
        </div>
        {vm.roleLabel ? (
          <div className="flex justify-between gap-3">
            <dt className="text-aipify-text-muted">{labels.approverFieldLabel}</dt>
            <dd className="font-medium text-aipify-text">{vm.roleLabel}</dd>
          </div>
        ) : null}
        {vm.sourceLabel ? (
          <div className="flex justify-between gap-3">
            <dt className="text-aipify-text-muted">{labels.typeApproval}</dt>
            <dd className="font-medium text-aipify-text">{vm.sourceLabel}</dd>
          </div>
        ) : null}
        {vm.expiresAtDisplay ? (
          <div className="flex justify-between gap-3">
            <dt className="text-aipify-text-muted">{labels.expiresAtLabel}</dt>
            <dd className="text-right text-aipify-text">{vm.expiresAtDisplay}</dd>
          </div>
        ) : null}
        {vm.timeRemainingLabel ? (
          <div className="flex justify-between gap-3">
            <dt className="text-aipify-text-muted">{labels.validForLabel}</dt>
            <dd className="text-aipify-text">{vm.timeRemainingLabel}</dd>
          </div>
        ) : null}
      </dl>

      {vm.decisionBlockReason === "incomplete_scope" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">{labels.incompleteScopeTitle}</p>
          <p className="mt-1">{labels.incompleteScopeBody}</p>
        </div>
      ) : null}

      {vm.isActionablePending ? (
        <div className="space-y-3">
          {vm.returnToKompis ? (
            <label className="block text-sm text-aipify-text">
              <span className="font-medium">{labels.internalReason}</span>
              <textarea
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
                rows={3}
                placeholder={labels.reasonPlaceholder}
                className="mt-2 w-full rounded-xl border border-aipify-border bg-aipify-surface p-3 text-sm text-aipify-text outline-none ring-aipify-focus focus:ring-2"
              />
            </label>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={decisionDisabled || emergencyActive}
              onClick={onApprove}
              className={`${AipifyShellClasses.primaryButton} min-h-11 w-full px-4 py-2.5 text-sm font-semibold`}
            >
              {actingId === vm.id ? labels.executing : labels.approve}
            </button>
            <button
              type="button"
              disabled={decisionDisabled || emergencyActive}
              onClick={onReject}
              className={`${AipifyShellClasses.secondaryButton} min-h-11 w-full px-4 py-2.5 text-sm font-semibold`}
            >
              {labels.reject}
            </button>
            {vm.returnToKompis ? (
              <Link
                href="/app/kompis"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-aipify-border px-4 py-2.5 text-sm font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
              >
                {labels.returnToKompis}
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-sm text-aipify-text-secondary">{vm.statusLabel}</p>
      )}

      {/* Mobile sticky bar duplicate is handled via fixed footer when actionable */}
      {vm.isActionablePending ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-aipify-border bg-aipify-surface/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-[1560px] gap-2">
            <button
              type="button"
              disabled={decisionDisabled || emergencyActive}
              onClick={onApprove}
              className={`${AipifyShellClasses.primaryButton} min-h-11 flex-1 px-4 text-sm font-semibold`}
            >
              {actingId === vm.id ? labels.executing : labels.approve}
            </button>
            <button
              type="button"
              disabled={decisionDisabled || emergencyActive}
              onClick={onReject}
              className={`${AipifyShellClasses.secondaryButton} min-h-11 flex-1 px-4 text-sm font-semibold`}
            >
              {labels.reject}
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function ApprovalDetail({
  vm,
  labels,
  actingId,
  decisionReason,
  setDecisionReason,
  emergencyActive,
  onApprove,
  onReject,
}: {
  vm: ApprovalViewModel;
  labels: ApprovalsCenterUiLabels;
  actingId: string | null;
  decisionReason: string;
  setDecisionReason: (value: string) => void;
  emergencyActive: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <article className={`${AipifyShellClasses.surfaceCard} space-y-6 p-6 pb-28 lg:pb-6`}>
        <header className="space-y-3">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">{vm.sourceLabel}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl">
            {vm.displayTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Chip className={APPROVAL_STATUS_CHIP_CLASSES[vm.statusTone]}>{vm.statusLabel}</Chip>
            <Chip className={APPROVAL_RISK_CHIP_CLASSES[vm.riskTone]}>{vm.riskLabel}</Chip>
            {vm.expiresSoon ? (
              <Chip className={APPROVAL_STATUS_CHIP_CLASSES.pending}>{labels.expiresSoon}</Chip>
            ) : null}
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-aipify-text-secondary">
            {vm.displaySummary}
          </p>
        </header>

        {(vm.isWebsiteKompisPublish || vm.isWebsiteKompisRollback) && (
          <section className="grid gap-4 sm:grid-cols-2">
            {vm.websitePath ? (
              <div className="rounded-xl bg-aipify-surface-muted px-4 py-3">
                <p className="text-xs font-medium text-aipify-text-muted">{labels.pathLabel}</p>
                <p className="mt-1 font-mono text-sm text-aipify-text">{vm.websitePath}</p>
              </div>
            ) : null}
            {vm.localeLabel ? (
              <div className="rounded-xl bg-aipify-surface-muted px-4 py-3">
                <p className="text-xs font-medium text-aipify-text-muted">{labels.localeLabel}</p>
                <p className="mt-1 text-sm font-medium text-aipify-text">{vm.localeLabel}</p>
              </div>
            ) : null}
          </section>
        )}

        {vm.whatChanges.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold text-aipify-text">{labels.whatChangesTitle}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-aipify-text-secondary">
              {vm.whatChanges.map((line) => (
                <li key={line}>{line}</li>
              ))}
              {vm.websitePath ? (
                <li>
                  {vm.websitePath}
                  {vm.localeLabel ? ` · ${vm.localeLabel}` : null}
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}

        {vm.whatUnchanged.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold text-aipify-text">{labels.whatUnchangedTitle}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-aipify-text-secondary">
              {vm.whatUnchanged.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {(vm.isWebsiteKompisPublish || vm.isWebsiteKompisRollback) && (
          <section className="rounded-xl border border-dashed border-aipify-border bg-aipify-surface-muted px-4 py-4">
            <h3 className="text-sm font-semibold text-aipify-text">{labels.previewTitle}</h3>
            <p className="mt-2 text-sm text-aipify-text-secondary">{labels.previewNewDraft}</p>
          </section>
        )}

        <section>
          <h3 className="text-sm font-semibold text-aipify-text">{labels.recommendationTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{vm.recommendation}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-aipify-text">{labels.riskControlTitle}</h3>
          <p className="mt-2 text-sm text-aipify-text-secondary">{vm.riskDescription}</p>
          {vm.reversibility ? (
            <p className="mt-2 text-sm text-aipify-text-secondary">
              <span className="font-medium text-aipify-text">{labels.reversibilityLabel}: </span>
              {vm.reversibility}
            </p>
          ) : null}
        </section>

        {(vm.afterApprove || vm.afterReject) && (
          <section>
            <h3 className="text-sm font-semibold text-aipify-text">{labels.consequencesTitle}</h3>
            <dl className="mt-2 space-y-2 text-sm text-aipify-text-secondary">
              {vm.afterApprove ? (
                <div>
                  <dt className="font-medium text-aipify-text">{labels.afterApproveLabel}</dt>
                  <dd>{vm.afterApprove}</dd>
                </div>
              ) : null}
              {vm.afterReject ? (
                <div>
                  <dt className="font-medium text-aipify-text">{labels.afterRejectLabel}</dt>
                  <dd>{vm.afterReject}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        )}

        <div className="grid gap-2 text-sm text-aipify-text-muted sm:grid-cols-2">
          {vm.createdAtDisplay ? (
            <p>
              {labels.createdAtLabel}: {vm.createdAtDisplay}
            </p>
          ) : null}
          {vm.expiresAtDisplay ? (
            <p>
              {labels.expiresAtLabel}: {vm.expiresAtDisplay}
            </p>
          ) : null}
        </div>

        {vm.technicalRows.length > 0 ? (
          <details className="rounded-xl border border-aipify-border bg-aipify-surface-muted/60 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-aipify-text">
              {labels.technicalDetails}
            </summary>
            <dl className="mt-3 grid gap-2 text-xs text-aipify-text-secondary sm:grid-cols-2">
              {vm.technicalRows.map((row) => (
                <div key={row.key}>
                  <dt className="font-medium text-aipify-text">{row.label}</dt>
                  <dd className="mt-0.5 break-all font-mono">{row.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : null}
      </article>

      <DecisionPanel
        vm={vm}
        labels={labels}
        actingId={actingId}
        decisionReason={decisionReason}
        setDecisionReason={setDecisionReason}
        emergencyActive={emergencyActive}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
}

export function ApprovalsCenterPanel({ locale, labels }: ApprovalsCenterPanelProps) {
  const searchParams = useSearchParams();
  const focusedRequestId = useMemo(() => selectFocusedApprovalId(searchParams), [searchParams]);
  const [items, setItems] = useState<CustomerApproval[]>([]);
  const [emergencyState, setEmergencyState] = useState<string | null>(null);
  const [companionActions, setCompanionActions] = useState<CompanionActionRequest[]>([]);
  const [companionEmergencyStop, setCompanionEmergencyStop] = useState(false);
  const [trustLoading, setTrustLoading] = useState(true);
  const [companionLoading, setCompanionLoading] = useState(true);
  const [trustLoadError, setTrustLoadError] = useState<string | null>(null);
  const [companionLoadError, setCompanionLoadError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const refreshTrust = useCallback(async () => {
    setTrustLoadError(null);
    try {
      const response = await fetch("/api/app/approvals");
      const payload = (await response.json()) as Record<string, unknown> & { error?: string };
      const outcome = resolveTrustApprovalsLoadOutcome({
        responseOk: response.ok,
        payload,
        fallbackError: labels.trustLoadError,
      });
      if (outcome.kind === "error") {
        setTrustLoadError(outcome.error);
        return;
      }
      if (payload?.has_customer) {
        // Intentionally ignore RPC philosophy / phase / Self Love / integration meta for customer UI.
        setItems(
          ((payload.approvals as CustomerApproval[]) ?? []).filter((row) => {
            const category = String(row.category ?? "").toLowerCase();
            const status = String(row.status ?? "").toLowerCase();
            if (category === "notification") return false;
            if (status === "dismissed") return false;
            return true;
          }),
        );
        setEmergencyState(
          typeof payload.emergency_state === "string" ? payload.emergency_state : null,
        );
      } else {
        setItems([]);
        setEmergencyState(null);
      }
    } catch {
      setTrustLoadError(labels.trustLoadError);
    } finally {
      setTrustLoading(false);
    }
  }, [labels.trustLoadError]);

  const refreshCompanion = useCallback(async () => {
    setCompanionLoadError(null);
    try {
      const response = await fetch("/api/companion/actions");
      const payload = (await response.json()) as Record<string, unknown> & { error?: string };
      const outcome = resolveCompanionActionsLoadOutcome({
        responseOk: response.ok,
        payload,
        fallbackError: labels.companion.loadError,
      });
      if (outcome.kind === "error") {
        setCompanionLoadError(outcome.error);
        return;
      }
      setCompanionActions(outcome.actions);
      setCompanionEmergencyStop(outcome.emergencyStop);
    } catch {
      setCompanionLoadError(labels.companion.loadError);
    } finally {
      setCompanionLoading(false);
    }
  }, [labels.companion.loadError]);

  const retryAll = useCallback(async () => {
    setTrustLoading(true);
    setCompanionLoading(true);
    await runIndependentApprovalLoads({ trust: refreshTrust, companion: refreshCompanion });
  }, [refreshCompanion, refreshTrust]);

  useEffect(() => {
    void retryAll();
  }, [retryAll]);

  const emergencyActive =
    emergencyState === "paused" || emergencyState === "emergency_shutdown";

  const viewModels = useMemo(() => {
    return items
      .map((item) =>
        buildApprovalViewModel(item, {
          locale,
          labels: labels.presentation,
          emergencyActive,
          technicalLabels: labels.technicalLabels,
        }),
      )
      .filter((row): row is ApprovalViewModel => row != null);
  }, [emergencyActive, items, labels.presentation, labels.technicalLabels, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return viewModels.filter((vm) => {
      if (statusFilter !== "all" && vm.status !== statusFilter) return false;
      if (riskFilter !== "all" && resolveApprovalRiskKey(vm.riskLevel) !== riskFilter) return false;
      if (!q) return true;
      return (
        vm.displayTitle.toLowerCase().includes(q) ||
        vm.displaySummary.toLowerCase().includes(q) ||
        (vm.websitePath ?? "").toLowerCase().includes(q) ||
        vm.sourceLabel.toLowerCase().includes(q)
      );
    });
  }, [query, riskFilter, statusFilter, viewModels]);

  const focused = useMemo(() => {
    if (!focusedRequestId) return null;
    return viewModels.find((vm) => vm.id === focusedRequestId) ?? null;
  }, [focusedRequestId, viewModels]);

  const focusedMissing = Boolean(focusedRequestId) && !focused && !trustLoading && !trustLoadError;
  const pendingCount = viewModels.filter((vm) => vm.isActionablePending).length;

  async function postApprovalAction(
    kind: "trust" | "companion",
    id: string,
    decision: "approve" | "reject",
  ) {
    setActingId(kind === "trust" ? id : `companion:${id}`);
    try {
      if (kind === "trust") {
        if (decision === "approve") {
          const request = resolveTrustApproveRequest(id, decisionReason);
          await fetch(request.url, request.init);
        } else {
          const request = resolveApprovalPostRequest("trust", id, "reject");
          await fetch(request.url, request.init);
        }
      } else {
        const request = resolveApprovalPostRequest("companion", id, decision);
        await fetch(request.url, request.init);
      }
      await retryAll();
    } finally {
      setActingId(null);
      setDecisionReason("");
    }
  }

  async function emergencyStop() {
    const confirmed = window.confirm(labels.emergencyStopConfirm);
    if (!confirmed) return;
    const reason = window.prompt(labels.emergencyStopReasonPrompt, "");
    if (!reason || reason.trim().length < 8) return;
    await fetch("/api/actions/emergency-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: "emergency_shutdown",
        reason: reason.trim(),
        confirmation: true,
      }),
    });
    await refreshTrust();
  }

  if (trustLoading && companionLoading) {
    return <AipifyLoadingState message={labels.loading} centered />;
  }

  return (
    <div className="mx-auto w-full max-w-[1560px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-aipify-text">{labels.title}</h1>
            {pendingCount > 0 ? (
              <Chip className={APPROVAL_STATUS_CHIP_CLASSES.pending}>
                {labels.presentation.pendingCount(pendingCount)}
              </Chip>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-base text-aipify-text-secondary">{labels.subtitle}</p>
        </div>
      </header>

      {emergencyActive ? (
        <p
          role="status"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
        >
          {labels.emergencyActive}
        </p>
      ) : null}

      {focusedMissing ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-5`}>
          <h2 className="text-lg font-semibold text-aipify-text">{labels.couldNotOpen}</h2>
          <p className="text-sm text-aipify-text-secondary">{labels.couldNotOpenBody}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void retryAll()}
              className="rounded-xl border border-aipify-border px-3 py-2 text-sm font-medium"
            >
              {labels.retry}
            </button>
            <Link href="/app/approvals" className="rounded-xl border border-aipify-border px-3 py-2 text-sm font-medium">
              {labels.backToApprovals}
            </Link>
            <Link href="/app/kompis" className="rounded-xl border border-aipify-border px-3 py-2 text-sm font-medium">
              {labels.returnToKompis}
            </Link>
          </div>
        </div>
      ) : null}

      {focused ? (
        <ApprovalDetail
          vm={focused}
          labels={labels}
          actingId={actingId}
          decisionReason={decisionReason}
          setDecisionReason={setDecisionReason}
          emergencyActive={emergencyActive}
          onApprove={() => void postApprovalAction("trust", focused.id, "approve")}
          onReject={() => void postApprovalAction("trust", focused.id, "reject")}
        />
      ) : (
        <section className="space-y-4" aria-labelledby="approvals-list-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="approvals-list-heading" className="text-lg font-semibold text-aipify-text">
              {labels.listHeading}
            </h2>
            <Link href="/app/command-center" className="text-sm font-medium text-violet-700 hover:underline dark:text-violet-300">
              {labels.openActionCenter}
            </Link>
          </div>

          <div className="grid gap-3 rounded-2xl border border-aipify-border bg-aipify-surface p-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
            <label className="block text-sm">
              <span className="sr-only">{labels.searchPlaceholder}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
                className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2.5 text-sm outline-none ring-aipify-focus focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-aipify-text-muted">{labels.filterStatus}</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2.5 text-sm"
              >
                <option value="all">{labels.filterAll}</option>
                <option value="pending">{labels.presentation.statusLabels.pending}</option>
                <option value="approved">{labels.presentation.statusLabels.approved}</option>
                <option value="rejected">{labels.presentation.statusLabels.rejected}</option>
                <option value="expired">{labels.presentation.statusLabels.expired}</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-aipify-text-muted">{labels.filterRisk}</span>
              <select
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value)}
                className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2.5 text-sm"
              >
                <option value="all">{labels.filterAll}</option>
                <option value="1">{labels.presentation.riskLevels["1"]}</option>
                <option value="2">{labels.presentation.riskLevels["2"]}</option>
                <option value="3">{labels.presentation.riskLevels["3"]}</option>
                <option value="4">{labels.presentation.riskLevels["4"]}</option>
              </select>
            </label>
          </div>

          {trustLoadError ? (
            <div className="space-y-2">
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
                {trustLoadError}
              </p>
              <button
                type="button"
                onClick={() => void retryAll()}
                className="rounded-xl border border-aipify-border px-3 py-2 text-sm"
              >
                {labels.retry}
              </button>
            </div>
          ) : null}

          {trustLoading ? (
            <AipifyLoadingState message={labels.loading} centered />
          ) : shouldShowApprovalsEmptyState({
              loading: trustLoading,
              error: trustLoadError,
              itemCount: viewModels.length,
            }) ? (
            <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
          ) : filtered.length === 0 ? (
            <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-6`}>
              <p className="text-sm text-aipify-text-secondary">{labels.emptyFiltered}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setRiskFilter("all");
                }}
                className="rounded-xl border border-aipify-border px-3 py-2 text-sm font-medium"
              >
                {labels.resetFilters}
              </button>
            </div>
          ) : (
            <ul className="grid gap-3 xl:grid-cols-2">
              {filtered.map((vm) => (
                <li key={vm.id}>
                  <Link
                    href={buildApprovalsDeepLink(vm.id)}
                    className={`${AipifyShellClasses.surfaceCard} block p-5 transition hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2">
                        <h3 className="text-lg font-semibold text-aipify-text">{vm.displayTitle}</h3>
                        <p className="line-clamp-2 text-sm text-aipify-text-secondary">{vm.displaySummary}</p>
                      </div>
                      <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                        {labels.reviewCta}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Chip className={APPROVAL_STATUS_CHIP_CLASSES[vm.statusTone]}>{vm.statusLabel}</Chip>
                      <Chip className={APPROVAL_RISK_CHIP_CLASSES[vm.riskTone]}>{vm.riskLabel}</Chip>
                      <Chip className={APPROVAL_STATUS_CHIP_CLASSES.brand}>{vm.sourceLabel}</Chip>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-aipify-text-muted">
                      {vm.createdAtDisplay ? (
                        <span>
                          {labels.createdAtLabel}: {vm.createdAtDisplay}
                        </span>
                      ) : null}
                      {vm.expiresAtDisplay ? (
                        <span>
                          {labels.expiresAtLabel}: {vm.expiresAtDisplay}
                        </span>
                      ) : null}
                      {vm.roleLabel ? <span>{vm.roleLabel}</span> : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="space-y-3" aria-labelledby="companion-approvals-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="companion-approvals-heading" className="text-lg font-semibold text-aipify-text">
            {labels.companion.section}
          </h2>
          <Link href="/app/companion/actions" className="text-sm font-medium text-violet-700 hover:underline dark:text-violet-300">
            {labels.companion.openCenter}
          </Link>
        </div>
        {companionLoadError ? (
          <div className="space-y-2">
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              {companionLoadError}
            </p>
            <button type="button" onClick={() => void retryAll()} className="rounded-xl border border-aipify-border px-3 py-2 text-sm">
              {labels.retry}
            </button>
          </div>
        ) : null}
        {companionLoading ? (
          <AipifyLoadingState message={labels.loading} centered />
        ) : shouldShowApprovalsEmptyState({
            loading: companionLoading,
            error: companionLoadError,
            itemCount: companionActions.length,
          }) ? (
          <p className="text-sm text-aipify-text-muted">{labels.companion.empty}</p>
        ) : companionLoadError ? null : (
          <ul className="grid gap-3 md:grid-cols-2">
            {companionActions.map((action) => {
              const display = buildCompanionPendingDisplayFields(action);
              const actingKey = `companion:${display.id}`;
              const isPending =
                display.status === "pending" || display.status === "awaiting_approval";
              const statusLabel =
                labels.companion.statusLabels[display.status] ??
                labels.companion.statusLabels[`status_${display.status}`] ??
                labels.presentation.statusLabels[display.status] ??
                labels.pendingBadge;

              return (
                <li key={display.id} className={`${AipifyShellClasses.surfaceCard} p-5`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-aipify-text">{display.title}</h3>
                    <Chip className={APPROVAL_STATUS_CHIP_CLASSES.pending}>{statusLabel}</Chip>
                  </div>
                  {display.description ? (
                    <p className="mt-2 text-sm text-aipify-text-secondary">{display.description}</p>
                  ) : null}
                  {isPending ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={actingId === actingKey || companionEmergencyStop}
                        onClick={() => void postApprovalAction("companion", display.id, "approve")}
                        className={`${AipifyShellClasses.primaryButton} px-4 py-2 text-sm font-semibold`}
                      >
                        {actingId === actingKey ? labels.executing : labels.approve}
                      </button>
                      <button
                        type="button"
                        disabled={actingId === actingKey}
                        onClick={() => void postApprovalAction("companion", display.id, "reject")}
                        className={`${AipifyShellClasses.secondaryButton} px-4 py-2 text-sm font-semibold`}
                      >
                        {labels.reject}
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-rose-200/70 bg-rose-50/40 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold text-rose-900 dark:text-rose-100">{labels.emergencyStop}</h2>
            <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-100/80">{labels.emergencyStopHelp}</p>
          </div>
          <button
            type="button"
            onClick={() => void emergencyStop()}
            className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100"
          >
            {labels.emergencyStop}
          </button>
        </div>
      </section>
    </div>
  );
}
