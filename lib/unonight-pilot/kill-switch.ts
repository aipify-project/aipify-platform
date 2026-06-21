import type { UnonightPilotSettings } from "./types";

export type KillSwitchResult = {
  active: boolean;
  syncBlocked: boolean;
  discoveryBlocked: boolean;
  mutationsBlocked: boolean;
};

export function evaluateKillSwitch(settings: UnonightPilotSettings | null): KillSwitchResult {
  const active = Boolean(settings?.kill_switch);
  return {
    active,
    syncBlocked: active,
    discoveryBlocked: active,
    mutationsBlocked: active || Boolean(settings?.read_only),
  };
}

export function validateKillSwitchAllowsSync(settings: UnonightPilotSettings | null): boolean {
  return !evaluateKillSwitch(settings).syncBlocked && Boolean(settings?.enabled);
}
