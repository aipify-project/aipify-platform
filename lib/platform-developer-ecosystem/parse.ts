import type { DeveloperPortalCenter } from "./types";

export function parseDeveloperPortalCenter(raw: Record<string, unknown>): DeveloperPortalCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    overview: raw.overview as DeveloperPortalCenter["overview"],
    publishers: Array.isArray(raw.publishers) ? (raw.publishers as Record<string, unknown>[]) : [],
    extensions: Array.isArray(raw.extensions) ? (raw.extensions as Record<string, unknown>[]) : [],
    sdk_modules: Array.isArray(raw.sdk_modules) ? (raw.sdk_modules as Record<string, unknown>[]) : [],
    documentation: raw.documentation as Record<string, unknown>,
    certification_statuses: raw.certification_statuses as Record<string, string>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as DeveloperPortalCenter["audit_recent"])
      : [],
    routes: raw.routes as Record<string, string>,
    mobile_access: raw.mobile_access as Record<string, unknown>,
  };
}
