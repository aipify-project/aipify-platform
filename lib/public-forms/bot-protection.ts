import { verifyHumanChallenge } from "./human-verification";

type PublicFormBody = {
  _honeypot?: unknown;
  _form_started_at?: unknown;
  _verification_token?: unknown;
  _verification_answer?: unknown;
  email?: unknown;
};

type RateEntry = { count: number; firstAt: number; lastAt: number };
const rateMap = new Map<string, RateEntry>();
const duplicateMap = new Map<string, number>();

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 8;
const MIN_SUBMIT_MS = 2500;
const DUPLICATE_WINDOW_MS = 60 * 1000;

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.firstAt > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, firstAt: now, lastAt: now });
    return true;
  }
  entry.count += 1;
  entry.lastAt = now;
  return entry.count <= RATE_MAX;
}

function duplicateKey(form: string, email: string): string {
  return `${form}:${email.toLowerCase()}`;
}

export type PublicFormGuardResult =
  | { ok: true }
  | { ok: false; error: string; status: number; log?: string };

export function assertPublicFormSubmission(
  request: Request,
  body: PublicFormBody,
  formKey: string,
): PublicFormGuardResult {
  const ip = clientIp(request);

  if (typeof body._honeypot === "string" && body._honeypot.trim()) {
    return { ok: false, error: "Submission blocked", status: 400, log: "honeypot" };
  }

  if (!rateLimit(ip)) {
    return { ok: false, error: "Too many requests. Please try again later.", status: 429, log: "rate_limit" };
  }

  const startedAt = Number(body._form_started_at);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_SUBMIT_MS) {
    return { ok: false, error: "Please complete the form before submitting.", status: 400, log: "timing" };
  }

  const token = typeof body._verification_token === "string" ? body._verification_token : "";
  const answer = Number(body._verification_answer);
  if (!verifyHumanChallenge(token, answer)) {
    return { ok: false, error: "Verification required. Complete the security check and try again.", status: 400, log: "verification" };
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email) {
    const key = duplicateKey(formKey, email);
    const last = duplicateMap.get(key);
    const now = Date.now();
    if (last && now - last < DUPLICATE_WINDOW_MS) {
      return { ok: false, error: "A recent submission was already received.", status: 429, log: "duplicate" };
    }
    duplicateMap.set(key, now);
  }

  return { ok: true };
}

export function logSuspiciousSubmission(formKey: string, reason: string, ip: string) {
  // eslint-disable-next-line no-console
  console.info("[public-form:guard]", { formKey, reason, ip, at: new Date().toISOString() });
}
