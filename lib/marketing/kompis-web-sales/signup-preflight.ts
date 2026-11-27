import {
  isPublicFooterEnabledLocale,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";

export type SignupCollectInput = {
  email: string;
  website: string;
  company: string;
  language: string;
};

export type SignupCollectValues = {
  email: string;
  website: string;
  company: string;
  language: PublicFooterEnabledLocale;
};

export type SignupCollectField = keyof SignupCollectValues;

export type SignupCollectValidation =
  | { ok: true; values: SignupCollectValues }
  | {
      ok: false;
      field: SignupCollectField;
      code: "required" | "email" | "website" | "language";
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function looksLikeWorkEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/**
 * Accepts bare domains and full URLs; returns a normalized https URL for the next step.
 * Does not invent a site — empty input fails validation upstream.
 */
export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname || !url.hostname.includes(".")) return null;
    if (url.hostname.startsWith(".") || url.hostname.endsWith(".")) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function validateSignupCollectFields(input: SignupCollectInput): SignupCollectValidation {
  const email = input.email.trim();
  const websiteRaw = input.website.trim();
  const company = input.company.trim();
  const languageRaw = input.language.trim();

  if (!email) return { ok: false, field: "email", code: "required" };
  if (!looksLikeWorkEmail(email)) return { ok: false, field: "email", code: "email" };

  if (!websiteRaw) return { ok: false, field: "website", code: "required" };
  const website = normalizeWebsiteUrl(websiteRaw);
  if (!website) return { ok: false, field: "website", code: "website" };

  if (!company) return { ok: false, field: "company", code: "required" };

  if (!languageRaw || !isPublicFooterEnabledLocale(languageRaw)) {
    return { ok: false, field: "language", code: "language" };
  }

  return {
    ok: true,
    values: {
      email: email.toLowerCase(),
      website,
      company,
      language: languageRaw,
    },
  };
}

export function signupCollectQueryString(values: SignupCollectValues): string {
  const params = new URLSearchParams();
  params.set("email", values.email);
  params.set("website", values.website);
  params.set("company", values.company);
  params.set("language", values.language);
  return params.toString();
}

export function readSignupCollectFromSearchParams(
  get: (key: string) => string | null,
): SignupCollectInput {
  return {
    email: get("email") ?? "",
    website: get("website") ?? "",
    company: get("company") ?? "",
    language: get("language") ?? "",
  };
}
