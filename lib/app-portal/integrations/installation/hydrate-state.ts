import {
  isOpenHandoffStatus,
  type InstallationHandoffStatus,
} from "./handoff";
import {
  canShowInstallContinueLater,
  resolveInstallSupportLifecycle,
  waitingStateAfterRealHandoff,
  type InstallSupportLifecycle,
} from "./install-selection";
import { isInstallationSupportMode, type InstallationSupportMode, type InstallationWizardState } from "./enums";
import type { InstallationSessionSnapshot } from "./types";
import type { InstallationWaitingCopyParty } from "./waiting-copy";
import { resolveInstallationWaitingCopyParty } from "./waiting-copy";

export type HandoffLoadState = "loading" | "ready" | "error";

export type PersistedInstallationHandoff = {
  handoff_request_id: string;
  status: InstallationHandoffStatus | string;
  support_mode: InstallationSupportMode | null;
  assigned_party_type: string | null;
  requested_at: string | null;
  created_at: string | null;
  recipient_email: string | null;
  lifecycle_state: string | null;
  next_step: string | null;
  handoff_type: string | null;
};

export type HydratedHandoffKind =
  | "loading"
  | "open"
  | "completed"
  | "cancelled"
  | "failed"
  | "absent";

export type HydratedHandoffConfirmation = {
  reference: string;
  requestedAt: string;
  recipientEmail: string | null;
};

/**
 * Read-side installation presentation after hydrating session + persisted handoff.
 * Pure — never writes session, handoff, task, or audit.
 */
export type HydratedInstallationState = {
  lifecycle: InstallSupportLifecycle;
  handoffHydrated: boolean;
  hasOpenHandoff: boolean | null;
  handoffKind: HydratedHandoffKind;
  /** Authoritative customer-facing support mode for presentation. */
  supportMode: InstallationSupportMode | null;
  /** Presentation lifecycle state (may differ from persisted session.state). */
  presentationState: InstallationWizardState | null;
  confirmation: HydratedHandoffConfirmation | null;
  assignedPartyType: string | null;
  waitingCopyParty: InstallationWaitingCopyParty;
  showHandoffCta: boolean;
  showWaitingPresentation: boolean;
  showConfirmationBanner: boolean;
  canContinueLater: boolean;
  /** When true, top status should stay neutral/loading — avoid ready-to-ask flash. */
  statusPendingHydration: boolean;
};

function terminalHandoffKind(status: string): HydratedHandoffKind | null {
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  if (status === "failed") return "failed";
  return null;
}

/**
 * Parse GET /installation/handoff payload (`{ handoff }` or raw handoff row).
 * Rejects invalid shapes; never throws.
 */
export function parsePersistedInstallationHandoff(
  raw: unknown
): PersistedInstallationHandoff | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  const row =
    root.handoff && typeof root.handoff === "object"
      ? (root.handoff as Record<string, unknown>)
      : root;
  if (!row || typeof row !== "object") return null;

  const reference = String(row.handoff_request_id ?? row.id ?? "").trim();
  const status = typeof row.status === "string" ? row.status.trim() : "";
  if (!reference || !status) return null;

  const internal =
    row.internal_context && typeof row.internal_context === "object"
      ? (row.internal_context as Record<string, unknown>)
      : null;
  const recipient =
    (typeof row.recipient_email === "string" && row.recipient_email.trim()) ||
    (typeof internal?.recipient_email === "string" && String(internal.recipient_email).trim()) ||
    null;

  return {
    handoff_request_id: reference,
    status,
    support_mode: isInstallationSupportMode(row.support_mode) ? row.support_mode : null,
    assigned_party_type:
      typeof row.assigned_party_type === "string" ? row.assigned_party_type : null,
    requested_at:
      typeof row.requested_at === "string"
        ? row.requested_at
        : typeof row.created_at === "string"
          ? row.created_at
          : null,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    recipient_email: recipient,
    lifecycle_state: typeof row.lifecycle_state === "string" ? row.lifecycle_state : null,
    next_step: typeof row.next_step === "string" ? row.next_step : null,
    handoff_type: typeof row.handoff_type === "string" ? row.handoff_type : null,
  };
}

/**
 * Canonical read-side priority:
 * 1. persisted open handoff
 * 2. persisted session lifecycle
 * 3. confirmed support_mode
 * 4. local pre-confirmation selection
 * 5. canonical fallback
 */
export function resolveHydratedInstallationState(opts: {
  session: InstallationSessionSnapshot | null;
  localSupportMode: InstallationSupportMode | null;
  handoff: PersistedInstallationHandoff | null;
  handoffLoadState: HandoffLoadState;
}): HydratedInstallationState {
  const { session, localSupportMode, handoff, handoffLoadState } = opts;
  const canContinueLater = canShowInstallContinueLater(session);

  if (handoffLoadState === "loading") {
    const provisionalLifecycle = resolveInstallSupportLifecycle({
      localSupportMode,
      session,
      hasOpenHandoff: null,
    });
    return {
      lifecycle: provisionalLifecycle,
      handoffHydrated: false,
      hasOpenHandoff: null,
      handoffKind: "loading",
      supportMode: localSupportMode ?? session?.support_mode ?? null,
      presentationState: session?.state ?? null,
      confirmation: null,
      assignedPartyType: null,
      waitingCopyParty: "unknown",
      showHandoffCta: false,
      showWaitingPresentation: false,
      showConfirmationBanner: false,
      canContinueLater,
      statusPendingHydration: true,
    };
  }

  if (handoffLoadState === "error") {
    const lifecycle = resolveInstallSupportLifecycle({
      localSupportMode,
      session,
      hasOpenHandoff: false,
    });
    return {
      lifecycle,
      handoffHydrated: true,
      hasOpenHandoff: false,
      handoffKind: "absent",
      supportMode: localSupportMode ?? session?.support_mode ?? null,
      presentationState: session?.state ?? null,
      confirmation: null,
      assignedPartyType: null,
      waitingCopyParty: resolveInstallationWaitingCopyParty({
        assignedPartyType: null,
        supportMode: localSupportMode ?? session?.support_mode ?? null,
        sessionState: session?.state ?? null,
      }),
      showHandoffCta: lifecycle === "selected" || lifecycle === "confirmed",
      showWaitingPresentation: false,
      showConfirmationBanner: false,
      canContinueLater,
      statusPendingHydration: false,
    };
  }

  // ready
  if (handoff && isOpenHandoffStatus(handoff.status)) {
    const supportMode =
      handoff.support_mode ?? session?.support_mode ?? localSupportMode ?? null;
    const presentationState =
      (supportMode ? waitingStateAfterRealHandoff(supportMode) : null) ??
      session?.state ??
      "awaiting_aipify";
    const confirmation: HydratedHandoffConfirmation = {
      reference: handoff.handoff_request_id,
      requestedAt: handoff.requested_at ?? handoff.created_at ?? "",
      recipientEmail: handoff.recipient_email,
    };
    const waitingCopyParty = resolveInstallationWaitingCopyParty({
      assignedPartyType: handoff.assigned_party_type,
      supportMode,
      sessionState: presentationState,
    });
    return {
      lifecycle: "handed_off",
      handoffHydrated: true,
      hasOpenHandoff: true,
      handoffKind: "open",
      supportMode,
      presentationState,
      confirmation,
      assignedPartyType: handoff.assigned_party_type,
      waitingCopyParty,
      showHandoffCta: false,
      showWaitingPresentation: true,
      showConfirmationBanner: Boolean(confirmation.reference),
      canContinueLater,
      statusPendingHydration: false,
    };
  }

  const terminal = handoff ? terminalHandoffKind(handoff.status) : null;
  if (terminal === "completed") {
    const supportMode =
      handoff?.support_mode ?? session?.support_mode ?? localSupportMode ?? null;
    return {
      lifecycle: "confirmed",
      handoffHydrated: true,
      hasOpenHandoff: false,
      handoffKind: "completed",
      supportMode,
      presentationState: "completed",
      confirmation: handoff
        ? {
            reference: handoff.handoff_request_id,
            requestedAt: handoff.requested_at ?? handoff.created_at ?? "",
            recipientEmail: handoff.recipient_email,
          }
        : null,
      assignedPartyType: handoff?.assigned_party_type ?? null,
      waitingCopyParty: "unknown",
      showHandoffCta: false,
      showWaitingPresentation: false,
      showConfirmationBanner: false,
      canContinueLater,
      statusPendingHydration: false,
    };
  }

  if (terminal === "cancelled" || terminal === "failed") {
    const lifecycle = resolveInstallSupportLifecycle({
      localSupportMode,
      session,
      hasOpenHandoff: false,
    });
    return {
      lifecycle,
      handoffHydrated: true,
      hasOpenHandoff: false,
      handoffKind: terminal,
      supportMode: localSupportMode ?? session?.support_mode ?? null,
      presentationState: session?.state ?? null,
      confirmation: null,
      assignedPartyType: null,
      waitingCopyParty: resolveInstallationWaitingCopyParty({
        assignedPartyType: null,
        supportMode: localSupportMode ?? session?.support_mode ?? null,
        sessionState: session?.state ?? null,
      }),
      showHandoffCta: lifecycle === "selected" || lifecycle === "confirmed",
      showWaitingPresentation: false,
      showConfirmationBanner: false,
      canContinueLater,
      statusPendingHydration: false,
    };
  }

  const lifecycle = resolveInstallSupportLifecycle({
    localSupportMode,
    session,
    hasOpenHandoff: false,
  });
  const supportMode = localSupportMode ?? session?.support_mode ?? null;
  return {
    lifecycle,
    handoffHydrated: true,
    hasOpenHandoff: false,
    handoffKind: "absent",
    supportMode,
    presentationState: session?.state ?? null,
    confirmation: null,
    assignedPartyType: null,
    waitingCopyParty: resolveInstallationWaitingCopyParty({
      assignedPartyType: null,
      supportMode,
      sessionState: session?.state ?? null,
    }),
    showHandoffCta: lifecycle === "selected" || lifecycle === "confirmed",
    showWaitingPresentation: false,
    showConfirmationBanner: false,
    canContinueLater,
    statusPendingHydration: false,
  };
}
