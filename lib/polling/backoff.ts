import { BACKOFF_STEPS_MS } from "./policy";

type BackoffState = {
  failures: number;
};

const states = new Map<string, BackoffState>();
const permanentFailures = new Set<string>();

export function recordPollingSuccess(key: string): void {
  states.delete(key);
}

export function recordPermanentPollingFailure(key: string): void {
  permanentFailures.add(key);
  states.delete(key);
}

export function isPermanentPollingFailure(key: string): boolean {
  return permanentFailures.has(key);
}

export function recordPollingFailure(key: string): number {
  const current = states.get(key) ?? { failures: 0 };
  current.failures += 1;
  states.set(key, current);
  const index = Math.min(current.failures - 1, BACKOFF_STEPS_MS.length - 1);
  return BACKOFF_STEPS_MS[index];
}

export function getBackoffIntervalMs(key: string, baseIntervalMs: number): number {
  const state = states.get(key);
  if (!state || state.failures === 0) {
    return baseIntervalMs;
  }
  const index = Math.min(state.failures - 1, BACKOFF_STEPS_MS.length - 1);
  return Math.max(baseIntervalMs, BACKOFF_STEPS_MS[index]);
}

export function clearPollingBackoff(): void {
  states.clear();
  permanentFailures.clear();
}
