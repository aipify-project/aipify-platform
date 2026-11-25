/**
 * Partner portal gate — pure, client-safe, no I/O.
 *
 * Classifies `GET /api/certified-sales-partner/portal` so the workspace can tell apart:
 *  - `backend_closed`  — Core CSP storage/RPC is genuinely not applied (fail-closed, unchanged)
 *  - `unauthorized`    — no signed-in session
 *  - `not_registered`  — Core is ready, but this account has no partner application yet
 *  - `pending`         — application exists but is not approved (under review / needs info / rejected / suspended)
 *  - `ready`           — approved partner workspace
 */

export type CspPendingStatus = "under_review" | "needs_information" | "rejected" | "suspended";

export type CspPortalGate =
  | { kind: "backend_closed"; detail: string | null }
  | { kind: "unauthorized" }
  | { kind: "not_registered" }
  | { kind: "pending"; status: CspPendingStatus; rawStatus: string }
  | { kind: "ready" }
  | { kind: "error"; detail: string | null };

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/** Maps a Core partner status to the pending panel, or `null` when the partner may use the workspace. */
export function resolveCspPendingStatus(status: string | null | undefined): CspPendingStatus | null {
  switch (status) {
    case "registered":
    case "under_review":
      return "under_review";
    case "needs_information":
      return "needs_information";
    case "rejected":
      return "rejected";
    case "suspended":
      return "suspended";
    default:
      return null;
  }
}

const NOT_REGISTERED_CODES = new Set(["partner_not_found", "no_partner", "not_registered", "no_application"]);

export function classifyCspPortalResponse(httpStatus: number, body: unknown): CspPortalGate {
  const b = rec(body);
  const error = typeof b.error === "string" ? b.error.trim().toLowerCase() : "";
  const detail = typeof b.detail === "string" && b.detail ? b.detail : error || null;

  if (httpStatus === 401 || error === "unauthorized") return { kind: "unauthorized" };
  if (NOT_REGISTERED_CODES.has(error) && b.backend_ready !== false) return { kind: "not_registered" };
  if (httpStatus === 503 || b.backend_ready === false || b.found === false) {
    return { kind: "backend_closed", detail: typeof b.detail === "string" && b.detail ? b.detail : null };
  }
  if (httpStatus < 200 || httpStatus >= 300) return { kind: "error", detail: detail ?? String(httpStatus) };

  const partner = rec(b.partner);
  const rawStatus = typeof partner.status === "string" ? partner.status : "";
  const pending = resolveCspPendingStatus(rawStatus);
  if (pending) return { kind: "pending", status: pending, rawStatus };
  return { kind: "ready" };
}
