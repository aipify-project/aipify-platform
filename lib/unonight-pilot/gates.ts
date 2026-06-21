import type { PilotHealthState } from "./constants";
import type { UnonightPilotSettings } from "./types";

export type PilotActivationGateResult = {
  ok: boolean;
  reason?: string;
  blockedBy?: "kill_switch" | "disabled" | "read_only" | "not_enabled" | "cross_tenant";
};

export function validatePilotActivationGates(
  settings: UnonightPilotSettings | null,
  options?: { requireEnabled?: boolean; allowMutation?: boolean; authOrgId?: string; targetOrgId?: string }
): PilotActivationGateResult {
  if (options?.authOrgId && options?.targetOrgId && options.authOrgId !== options.targetOrgId) {
    return { ok: false, reason: "Organization access denied", blockedBy: "cross_tenant" };
  }

  if (!settings) {
    return { ok: false, reason: "Pilot not configured", blockedBy: "disabled" };
  }

  if (settings.kill_switch) {
    return { ok: false, reason: "Pilot kill switch active", blockedBy: "kill_switch" };
  }

  if (options?.requireEnabled !== false && !settings.enabled) {
    return { ok: false, reason: "Pilot is disabled", blockedBy: "not_enabled" };
  }

  if (options?.allowMutation && settings.read_only) {
    return { ok: false, reason: "Pilot is read-only — mutations blocked", blockedBy: "read_only" };
  }

  return { ok: true };
}

export function canRunSync(settings: UnonightPilotSettings | null): boolean {
  const gate = validatePilotActivationGates(settings, { requireEnabled: true });
  if (!gate.ok) return false;
  if (!settings) return false;
  return !settings.kill_switch && settings.enabled;
}

export function resolveHealthStateAfterSync(settings: UnonightPilotSettings): PilotHealthState {
  if (settings.kill_switch) return "paused";
  if (settings.shadow_mode) return "shadow_mode_active";
  if (settings.read_only) return "read_only_active";
  return settings.health_state;
}
