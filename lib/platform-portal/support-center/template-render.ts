/**
 * Safe reply-template variable substitution.
 * Only allowlisted keys; values escaped; unknown placeholders rejected.
 */

import {
  SUPPORT_TEMPLATE_VARIABLES,
  type SupportTemplateVariable,
} from "./types";

export type TemplateFieldValues = Partial<Record<SupportTemplateVariable, string>>;

export type TemplateRenderResult =
  | { ok: true; text: string }
  | { ok: false; error: string; field?: string };

const PLACEHOLDER_RE = /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;
const SCRIPT_RE = /<\s*\/?\s*script/i;

export function escapeTemplateText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Renders a plain-text (or HTML-as-text) template body.
 * Missing allowlisted vars fall back to empty string (never throw).
 * Unknown {{vars}} fail closed.
 */
export function renderSupportTemplateBody(
  body: string,
  fields: TemplateFieldValues,
  options: { escapeHtml?: boolean } = {},
): TemplateRenderResult {
  if (typeof body !== "string") {
    return { ok: false, error: "template_body_required" };
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value == null) continue;
    if (typeof value !== "string") {
      return { ok: false, error: "invalid_field_value", field: key };
    }
    if (SCRIPT_RE.test(value)) {
      return { ok: false, error: "script_tag_rejected", field: key };
    }
  }

  let failure: TemplateRenderResult | null = null;
  const shouldEscape = options.escapeHtml !== false;
  const text = body.replace(PLACEHOLDER_RE, (_m, name: string) => {
    if (failure) return "";
    if (!(SUPPORT_TEMPLATE_VARIABLES as readonly string[]).includes(name)) {
      failure = { ok: false, error: "unknown_placeholder", field: name };
      return "";
    }
    const raw = fields[name as SupportTemplateVariable];
    const value = typeof raw === "string" ? raw : "";
    return shouldEscape ? escapeTemplateText(value) : value;
  });

  return failure ?? { ok: true, text };
}

/** Detect whether body already ends with a signature-like block to avoid doubles. */
export function bodyLooksLikeItIncludesSignature(body: string): boolean {
  const lower = body.toLowerCase();
  if (lower.includes("aipify group as")) return true;
  if (/med vennlig hilsen/i.test(body)) return true;
  if (lower.includes("--\n") && !lower.includes("{{agent_name}}")) return true;
  return false;
}
