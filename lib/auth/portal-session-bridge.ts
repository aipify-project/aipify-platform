/** Tab-scoped marks so auth gates do not flash full-screen loaders on soft remount. */

const PORTAL_SESSION_ACTIVE_KEY = "aipify.portal.sessionActive";
const PORTAL_TWO_FACTOR_PASSED_KEY = "aipify.portal.twoFactorPassed";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasPortalSessionActive(): boolean {
  if (!isBrowser()) return false;
  try {
    return sessionStorage.getItem(PORTAL_SESSION_ACTIVE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPortalSessionActive(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(PORTAL_SESSION_ACTIVE_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasTwoFactorPassed(): boolean {
  if (!isBrowser()) return false;
  try {
    return sessionStorage.getItem(PORTAL_TWO_FACTOR_PASSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markTwoFactorPassed(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(PORTAL_TWO_FACTOR_PASSED_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearPortalSessionMarks(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(PORTAL_SESSION_ACTIVE_KEY);
    sessionStorage.removeItem(PORTAL_TWO_FACTOR_PASSED_KEY);
  } catch {
    // ignore
  }
}
