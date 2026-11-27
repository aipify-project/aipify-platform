import {
  validateSignupCollectFields,
  type SignupCollectValues,
} from "./signup-preflight";

/** Client-only handoff so signup collect fields are not put in the URL. */
export const KOMPIS_WEB_SIGNUP_HANDOFF_KEY = "aipify.kompis_web.signup_collect.v1";

export function writeSignupHandoff(values: SignupCollectValues): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KOMPIS_WEB_SIGNUP_HANDOFF_KEY, JSON.stringify(values));
  } catch {
    // Private mode / blocked storage — Start page falls back to collect step.
  }
}

export function readSignupHandoff(): SignupCollectValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KOMPIS_WEB_SIGNUP_HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SignupCollectValues>;
    const result = validateSignupCollectFields({
      email: typeof parsed.email === "string" ? parsed.email : "",
      website: typeof parsed.website === "string" ? parsed.website : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      language: typeof parsed.language === "string" ? parsed.language : "",
    });
    return result.ok ? result.values : null;
  } catch {
    return null;
  }
}

export function clearSignupHandoff(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KOMPIS_WEB_SIGNUP_HANDOFF_KEY);
  } catch {
    // ignore
  }
}
