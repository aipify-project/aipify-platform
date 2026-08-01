import {
  isCustomerFacingSupportMode,
  type CustomerFacingSupportMode,
} from "./preview-mode";
import type { InstallationSupportMode, InstallationWizardState } from "./enums";
import type { InstallationAssistanceAction } from "./types";
import type { InstallationSessionSnapshot } from "./types";

/**
 * Live connect-route install lifecycle for support selection.
 * Selection is local until the customer explicitly continues or starts handoff.
 */
export type InstallSupportLifecycle =
  | "choose"
  | "selected"
  | "confirmed"
  | "handed_off";

export type InstallPresentationKey =
  | "choose"
  | "aipify_managed"
  | "guided"
  | "self_service"
  | "customer_it_managed";

export function installPresentationKeyForSupportMode(
  mode: InstallationSupportMode | null | undefined
): InstallPresentationKey {
  if (!mode || !isCustomerFacingSupportMode(mode)) return "choose";
  return mode;
}

export function resolveInstallSupportLifecycle(opts: {
  localSupportMode: InstallationSupportMode | null;
  session: InstallationSessionSnapshot | null;
  /**
   * True when a persisted open handoff exists for this tenant/provider.
   * False when checked and absent (V3 false-waiting repair → ready_for_handoff).
   * Null/undefined while unknown — treat awaiting_* conservatively as handed_off.
   */
  hasOpenHandoff?: boolean | null;
}): InstallSupportLifecycle {
  const sessionState = opts.session?.state;
  const isWaitingState =
    sessionState === "awaiting_aipify" ||
    sessionState === "awaiting_customer_it" ||
    sessionState === "awaiting_partner" ||
    sessionState === "awaiting_provider" ||
    sessionState === "awaiting_customer";
  if (isWaitingState) {
    // Waiting without a persisted handoff is inconsistent (V3 defect) — reopen handoff CTA.
    if (opts.hasOpenHandoff === false) {
      if (opts.session?.session_id && opts.session.support_mode) return "confirmed";
      if (opts.localSupportMode) return "selected";
      return "choose";
    }
    return "handed_off";
  }
  if (opts.session?.session_id && opts.session.support_mode) {
    return "confirmed";
  }
  if (opts.localSupportMode) return "selected";
  return "choose";
}

/** Session state after explicit Fortsett — never awaiting_* from selection alone. */
export function sessionStateAfterSupportConfirm(
  mode: InstallationSupportMode
): InstallationWizardState {
  void mode;
  return "in_progress";
}

/** Waiting state only after a persisted handoff / invite succeeds. */
export function waitingStateAfterRealHandoff(
  mode: InstallationSupportMode
): InstallationWizardState | null {
  switch (mode) {
    case "aipify_managed":
      return "awaiting_aipify";
    case "customer_it_managed":
      return "awaiting_customer_it";
    case "guided":
      return "awaiting_aipify";
    case "partner_managed":
      return "awaiting_partner";
    case "self_service":
    default:
      return null;
  }
}

export function canShowInstallContinueLater(
  session: InstallationSessionSnapshot | null | undefined
): boolean {
  if (!session?.session_id) return false;
  if (session.paused) return true;
  const progress =
    (session.completed_step_keys?.length ?? 0) > 0 ||
    Boolean(session.support_mode) ||
    (session.state !== "not_started" && session.state !== "support_selection");
  return progress;
}

/** Primary operational action key for the selected mode before/during handoff. */
export const INSTALL_PRIMARY_ACTION_BY_MODE: Record<
  CustomerFacingSupportMode,
  string
> = {
  aipify_managed: "aipify_managed",
  guided: "request_guided",
  self_service: "self_service",
  customer_it_managed: "invite_it",
};

export function primaryInstallActionKeyForMode(
  mode: InstallationSupportMode | null | undefined
): string | null {
  if (!mode || !isCustomerFacingSupportMode(mode)) return null;
  return INSTALL_PRIMARY_ACTION_BY_MODE[mode];
}

/**
 * Actions relevant to the current install lifecycle.
 * Before selection: none. After selection: at most the primary mode action (+ optional help).
 */
export function listRelevantInstallAssistanceActions(opts: {
  actions: readonly InstallationAssistanceAction[];
  supportMode: InstallationSupportMode | null | undefined;
  lifecycle: InstallSupportLifecycle;
}): InstallationAssistanceAction[] {
  if (opts.lifecycle === "choose" || opts.lifecycle === "handed_off") return [];
  const primaryKey = primaryInstallActionKeyForMode(opts.supportMode);
  if (!primaryKey) return [];
  const primary = opts.actions.find((a) => a.action_key === primaryKey);
  if (!primary) return [];
  if (primary.support_mode === "partner_managed") return [];
  if (primary.action_key === "invite_partner" || primary.action_key === "continue_later") {
    return [];
  }
  // Never surface placeholder / coming-later as an active install CTA.
  if (primary.handoff === "coming_later" || primary.handoff === "invite_placeholder") {
    return [];
  }
  return [primary];
}

export function isInstallSelectionWriteReason(reason: string | undefined): boolean {
  if (!reason) return false;
  return (
    reason.startsWith("support_mode:") &&
    !reason.startsWith("confirm_support_mode:") &&
    !reason.startsWith("handoff:")
  );
}
