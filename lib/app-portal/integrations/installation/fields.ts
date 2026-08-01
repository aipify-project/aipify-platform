import type { InstallationCustomerField } from "./types";

export type FieldValidationResult =
  | { ok: true; sanitized: unknown }
  | { ok: false; code: string; message: string };

function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate typed customer fields — no arbitrary schema execution. */
export function validateInstallationFieldValue(
  field: InstallationCustomerField,
  raw: unknown
): FieldValidationResult {
  if (field.required && (raw == null || raw === "" || (Array.isArray(raw) && !raw.length))) {
    return { ok: false, code: "required", message: "Field is required" };
  }
  if (raw == null || raw === "") {
    return { ok: true, sanitized: null };
  }

  switch (field.field_type) {
    case "text":
    case "email":
    case "hostname":
    case "invitation_recipient":
    case "organization_lookup":
    case "user_lookup": {
      if (typeof raw !== "string") return { ok: false, code: "type", message: "Expected string" };
      const value = raw.trim();
      if (field.field_type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { ok: false, code: "email", message: "Invalid email" };
      }
      if (field.validation?.pattern) {
        try {
          if (!new RegExp(field.validation.pattern).test(value)) {
            return { ok: false, code: "pattern", message: "Invalid format" };
          }
        } catch {
          return { ok: false, code: "pattern_config", message: "Invalid pattern config" };
        }
      }
      return { ok: true, sanitized: value };
    }
    case "url": {
      if (typeof raw !== "string" || !isHttpsUrl(raw.trim())) {
        return { ok: false, code: "url", message: "HTTPS URL required" };
      }
      const host = new URL(raw.trim()).hostname.toLowerCase();
      const allow = field.validation?.allowlist_hosts ?? [];
      if (allow.length && !allow.some((h) => host === h.toLowerCase() || host.endsWith(`.${h.toLowerCase()}`))) {
        return { ok: false, code: "allowlist", message: "Host not allowlisted" };
      }
      return { ok: true, sanitized: raw.trim() };
    }
    case "port": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 65535) {
        return { ok: false, code: "port", message: "Invalid port" };
      }
      return { ok: true, sanitized: n };
    }
    case "select":
    case "radio": {
      if (typeof raw !== "string") return { ok: false, code: "type", message: "Expected string" };
      const allowed = new Set((field.options ?? []).map((o) => o.value));
      if (allowed.size && !allowed.has(raw)) {
        return { ok: false, code: "option", message: "Invalid option" };
      }
      return { ok: true, sanitized: raw };
    }
    case "multi_select": {
      if (!Array.isArray(raw)) return { ok: false, code: "type", message: "Expected array" };
      const allowed = new Set((field.options ?? []).map((o) => o.value));
      const values = raw.filter((v): v is string => typeof v === "string");
      if (allowed.size && values.some((v) => !allowed.has(v))) {
        return { ok: false, code: "option", message: "Invalid option" };
      }
      return { ok: true, sanitized: values };
    }
    case "checkbox":
    case "confirmation": {
      if (typeof raw !== "boolean") return { ok: false, code: "type", message: "Expected boolean" };
      if (field.required && raw !== true) {
        return { ok: false, code: "confirmation", message: "Confirmation required" };
      }
      return { ok: true, sanitized: raw };
    }
    case "date":
    case "datetime": {
      if (typeof raw !== "string" || Number.isNaN(Date.parse(raw))) {
        return { ok: false, code: "date", message: "Invalid date" };
      }
      return { ok: true, sanitized: raw };
    }
    case "file": {
      // File metadata only — binary handled by secure upload endpoint.
      if (typeof raw !== "object" || raw == null) {
        return { ok: false, code: "file", message: "Invalid file reference" };
      }
      return { ok: true, sanitized: raw };
    }
    case "secret_reference": {
      // Never accept/return plaintext secrets in client field values after save.
      if (typeof raw !== "string" || !raw.trim()) {
        return { ok: false, code: "secret", message: "Secret reference required" };
      }
      // Treat as one-time input token for server save — strip from session snapshots.
      return { ok: true, sanitized: { __secret_pending: true, length: raw.trim().length } };
    }
    default:
      return { ok: false, code: "unsupported", message: "Unsupported field type" };
  }
}

/** Strip secret payloads before persisting session snapshots to client-visible storage. */
export function redactSecretFieldValues(
  values: Record<string, unknown>,
  fields: InstallationCustomerField[]
): Record<string, unknown> {
  const secretKeys = new Set(fields.filter((f) => f.secret || f.field_type === "secret_reference").map((f) => f.field_key));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (secretKeys.has(key)) {
      out[key] = { masked: true };
      continue;
    }
    out[key] = value;
  }
  return out;
}
