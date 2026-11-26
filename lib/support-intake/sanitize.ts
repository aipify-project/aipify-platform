import type { SupportIntakePayload, SupportIntakeSource } from "./types";
import { SUPPORT_INTAKE_SOURCES } from "./types";

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 8000;
const MAX_NAME = 120;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export type SanitizeIntakeResult =
  | { ok: true; value: SupportIntakePayload }
  | { ok: false; message: string };

function cleanText(raw: unknown, max: number): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\0/g, "").trim().slice(0, max);
}

export function sanitizeSupportIntakePayload(
  input: unknown,
  forcedSource?: SupportIntakeSource,
): SanitizeIntakeResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, message: "Ugyldig forespørsel." };
  }
  const body = input as Record<string, unknown>;
  const sourceRaw = forcedSource ?? String(body.source ?? "").trim();
  if (!(SUPPORT_INTAKE_SOURCES as readonly string[]).includes(sourceRaw)) {
    return { ok: false, message: "Ugyldig kildekanal." };
  }
  const source = sourceRaw as SupportIntakeSource;
  const subject = cleanText(body.subject ?? body.title, MAX_SUBJECT);
  const message = cleanText(body.message ?? body.description, MAX_MESSAGE);
  if (subject.length < 3) {
    return { ok: false, message: "Emne må være minst 3 tegn." };
  }
  if (message.length < 10) {
    return { ok: false, message: "Melding må være minst 10 tegn." };
  }

  const contactName = cleanText(body.contactName ?? body.name, MAX_NAME) || null;
  const contactEmailRaw = cleanText(body.contactEmail ?? body.email, 200);
  const contactEmail = contactEmailRaw ? contactEmailRaw.toLowerCase() : null;
  if (source === "web") {
    if (!contactEmail || !EMAIL_RE.test(contactEmail)) {
      return { ok: false, message: "Gyldig e-postadresse er påkrevd." };
    }
    if (!contactName) {
      return { ok: false, message: "Navn er påkrevd." };
    }
  }

  return {
    ok: true,
    value: {
      source,
      subject,
      message,
      category: cleanText(body.category, 40) || null,
      priority: cleanText(body.priority, 20) || null,
      productName: cleanText(body.productName ?? body.product, 80) || null,
      contactName,
      contactEmail,
    },
  };
}

/** Strip raw unresolved placeholders before any customer-visible send. */
export function stripUnresolvedTemplatePlaceholders(text: string): string {
  return text.replace(/\{\{\s*[A-Za-z0-9_]+\s*\}\}/g, "").replace(/[ \t]{2,}/g, " ").trim();
}
