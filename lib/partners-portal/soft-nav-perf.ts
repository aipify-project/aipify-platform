/**
 * Soft-navigation timing marks for /partners/* (dev/profiling only).
 * Never claims Production improvement without real measured evidence.
 */

const MARK_PREFIX = "csp-partners-nav";

export function markPartnersSoftNavStart(pathname: string): void {
  if (typeof performance === "undefined" || typeof performance.mark !== "function") return;
  try {
    performance.mark(`${MARK_PREFIX}:start:${pathname}`);
  } catch {
    /* ignore quota / unsupported */
  }
}

export function markPartnersSoftNavReady(pathname: string): void {
  if (typeof performance === "undefined" || typeof performance.mark !== "function") return;
  try {
    const start = `${MARK_PREFIX}:start:${pathname}`;
    const ready = `${MARK_PREFIX}:ready:${pathname}`;
    performance.mark(ready);
    performance.measure(`${MARK_PREFIX}:duration:${pathname}`, start, ready);
  } catch {
    /* start mark missing or measure unsupported */
  }
}
