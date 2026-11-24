/**
 * Pure helpers shared by the CSP Customer/Partner and Platform UI panels.
 * No React, no i18n, no network — safe to unit test with tsx.
 */

export type CspApiOutcome =
  | { kind: "ready"; body: unknown }
  | { kind: "not_ready"; code: string; body: unknown }
  | { kind: "unauthorized"; code: string; body: unknown }
  | { kind: "forbidden"; code: string; body: unknown }
  | { kind: "invalid"; code: string; body: unknown }
  | { kind: "error"; code: string; body: unknown };

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/**
 * Classifies a CSP API response honestly. Anything not clearly a success is NOT ready:
 * HTTP 2xx with `backend_ready === false` or `found === false` is still fail-closed.
 */
export function classifyCspApiResponse(status: number, body: unknown): CspApiOutcome {
  const rec = asRecord(body);
  const code = typeof rec.error === "string" && rec.error ? rec.error : `http_${status}`;

  if (status === 401) return { kind: "unauthorized", code, body };
  if (status === 403) return { kind: "forbidden", code, body };
  if (status === 400 || status === 422) return { kind: "invalid", code, body };
  if (status === 503 || rec.backend_ready === false) return { kind: "not_ready", code, body };
  if (status >= 200 && status < 300) {
    if (rec.found === false) return { kind: "not_ready", code, body };
    return { kind: "ready", body };
  }
  return { kind: "error", code, body };
}

/** Parses a fetch Response body without ever throwing. */
export async function readCspResponse(res: Response): Promise<CspApiOutcome> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return classifyCspApiResponse(res.status, body);
}

/** Network-level failure — never reported as success. */
export function cspNetworkFailure(): CspApiOutcome {
  return { kind: "error", code: "network_error", body: null };
}

/** Stable JSON text for the secondary technical-details block. */
export function formatCspTechnicalDetails(body: unknown): string {
  if (body === null || body === undefined) return "";
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return "";
  }
}

function pickNumber(rec: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

function pickCurrency(rec: Record<string, unknown>): string | null {
  const v = rec.currency;
  return typeof v === "string" && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : null;
}

export type CspOverviewMetrics = {
  productsCount: number | null;
  pendingSalesCount: number | null;
  earnedAmount: number | null;
  upcomingPayoutAmount: number | null;
  currency: string | null;
};

/**
 * Reads overview slots from the portal payload ONLY when present — absent slots stay
 * `null` so the UI never fabricates a zero.
 */
export function extractCspOverviewMetrics(payload: unknown): CspOverviewMetrics {
  const root = asRecord(payload);
  const nested = asRecord(root.summary ?? root.overview ?? root.metrics);
  const merged = { ...root, ...nested };
  const products = Array.isArray(merged.products) ? merged.products.length : null;
  return {
    productsCount: pickNumber(merged, ["products_count", "product_count"]) ?? products,
    pendingSalesCount: pickNumber(merged, ["pending_sales_count", "pending_sales"]),
    earnedAmount: pickNumber(merged, ["earned_amount", "earned_total", "earned"]),
    upcomingPayoutAmount: pickNumber(merged, ["upcoming_payout_amount", "upcoming_payout", "next_payout_amount"]),
    currency: pickCurrency(merged),
  };
}

export function hasAnyCspOverviewMetric(m: CspOverviewMetrics): boolean {
  return (
    m.productsCount !== null ||
    m.pendingSalesCount !== null ||
    m.earnedAmount !== null ||
    m.upcomingPayoutAmount !== null
  );
}

/** Returns an array from `payload[key]`, or the payload itself when it is an array. */
export function extractCspList(payload: unknown, key: string): Array<Record<string, unknown>> {
  const candidate = Array.isArray(payload) ? payload : asRecord(payload)[key];
  if (!Array.isArray(candidate)) return [];
  return candidate.filter((r): r is Record<string, unknown> => !!r && typeof r === "object" && !Array.isArray(r));
}

export function cspString(rec: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim() !== "") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return null;
}

export function cspNumber(rec: Record<string, unknown>, ...keys: string[]): number | null {
  return pickNumber(rec, keys);
}

export type CspExamQuestion = {
  id: string;
  text: string;
  options: Array<{ id: string; label: string }>;
};

export type CspExamCourse = {
  id: string;
  title: string;
  questions: CspExamQuestion[];
};

/**
 * Courses are shown ONLY when the backend provides well-formed questions. Anything
 * resembling an answer key (`correct`, `answer`, …) on questions is ignored here.
 */
export function extractCspExamCourses(payload: unknown): CspExamCourse[] {
  const courses = extractCspList(payload, "courses");
  const out: CspExamCourse[] = [];
  for (const c of courses) {
    const id = cspString(c, "id", "course_id");
    if (!id) continue;
    const questions: CspExamQuestion[] = [];
    for (const q of extractCspList(c, "questions")) {
      const qid = cspString(q, "id", "question_id");
      const text = cspString(q, "text", "question", "title");
      if (!qid || !text) continue;
      const options = extractCspList(q, "options")
        .map((o) => ({ id: cspString(o, "id", "option_id"), label: cspString(o, "label", "text") }))
        .filter((o): o is { id: string; label: string } => !!o.id && !!o.label);
      if (options.length < 2) continue;
      questions.push({ id: qid, text, options });
    }
    if (questions.length > 0) out.push({ id, title: cspString(c, "title", "name") ?? id, questions });
  }
  return out;
}
