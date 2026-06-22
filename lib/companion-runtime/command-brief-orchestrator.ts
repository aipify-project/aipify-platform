import {
  applyCommandBriefSinceLastClassification,
  buildCommandBriefSections,
  dedupeCommandBriefSignals,
  filterCommandBriefSignalsForPanel,
  filterCommandBriefSignalsForPermission,
  prioritizeCommandBriefSignals,
  resolveCommandBriefPanelFromPermissions,
  resolveCommandBriefSinceBoundary,
  type CommandBriefBundle,
  type CommandBriefPanel,
} from "@/lib/integration-intelligence/command-brief";
import type { CommandBriefDomainContexts } from "./command-brief-signal-collector";
import { collectCommandBriefSignalsFromDomainContexts } from "./command-brief-signal-collector";
import { collectProactiveCommandBriefSignals } from "./command-brief-proactive-bridge";
import { buildVerificationCommandBriefSignals } from "./verification-read-orchestrator";

export function buildCommandBriefBundle(input: {
  organization_id: string;
  effectivePermissions: readonly string[];
  subscriptionStatus: string | null;
  contexts: CommandBriefDomainContexts;
  panel?: CommandBriefPanel;
  last_login_at?: string | null;
  last_command_brief_view_at?: string | null;
  verification_queue?: Parameters<typeof buildVerificationCommandBriefSignals>[0]["queue"];
  verification_source_exact?: boolean;
  booking_candidates?: Parameters<
    typeof collectCommandBriefSignalsFromDomainContexts
  >[0]["booking_candidates"];
  supportContext?: import("./companion-support-context").CompanionSupportContext;
  hostsContext?: import("./companion-hosts-context").CompanionHostsContext;
}): CommandBriefBundle {
  const panel =
    input.panel ??
    resolveCommandBriefPanelFromPermissions({
      effectivePermissions: input.effectivePermissions,
      surface: "app",
    });

  const appSuspended =
    input.subscriptionStatus !== null &&
    ["paused", "cancelled", "suspended", "inactive"].includes(input.subscriptionStatus.toLowerCase());

  if (appSuspended) {
    return {
      organization_id: input.organization_id,
      panel,
      since_boundary_at: null,
      since_boundary_source: "none",
      generated_at: new Date().toISOString(),
      sections: [],
      all_signals: [],
      prioritized_signals: [],
      permission_denied: false,
      app_entitlement_blocked: true,
      empty_signal_basis: true,
      source_modules: [],
    };
  }

  const sinceBoundary = resolveCommandBriefSinceBoundary({
    last_login_at: input.last_login_at ?? input.contexts.operationalContext.since,
    last_command_brief_view_at: input.last_command_brief_view_at ?? null,
  });

  const domainSignals = collectCommandBriefSignalsFromDomainContexts({
    organization_id: input.organization_id,
    contexts: input.contexts,
    verification_queue: input.verification_queue,
    verification_source_exact: input.verification_source_exact,
    booking_candidates: input.booking_candidates,
    supportContext: input.supportContext,
    hostsContext: input.hostsContext,
  });

  const proactiveSignals = collectProactiveCommandBriefSignals({
    organization_id: input.organization_id,
    signals: input.contexts.proactiveContext.prioritized_signals,
    panel,
  });

  const merged = dedupeCommandBriefSignals([...domainSignals, ...proactiveSignals]);
  const classified = applyCommandBriefSinceLastClassification(merged, sinceBoundary);
  const permitted = filterCommandBriefSignalsForPermission(
    classified,
    input.effectivePermissions,
  );
  const panelFiltered = filterCommandBriefSignalsForPanel(permitted, panel);
  const prioritized = prioritizeCommandBriefSignals(panelFiltered);

  const permissionDenied =
    input.contexts.proactiveContext.permission_denied &&
    domainSignals.length === 0 &&
    proactiveSignals.length === 0;

  return {
    organization_id: input.organization_id,
    panel,
    since_boundary_at: sinceBoundary.since_at,
    since_boundary_source: sinceBoundary.source,
    generated_at: new Date().toISOString(),
    sections: buildCommandBriefSections(prioritized),
    all_signals: panelFiltered,
    prioritized_signals: prioritized,
    permission_denied: permissionDenied,
    app_entitlement_blocked: false,
    empty_signal_basis: prioritized.length === 0,
    source_modules: [...new Set(prioritized.map((signal) => signal.source_module))],
  };
}

export function createEmptyCommandBriefBundle(organizationId: string): CommandBriefBundle {
  return {
    organization_id: organizationId,
    panel: "app",
    since_boundary_at: null,
    since_boundary_source: "none",
    generated_at: new Date().toISOString(),
    sections: [],
    all_signals: [],
    prioritized_signals: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    empty_signal_basis: true,
    source_modules: [],
  };
}
