import { getLegalCompanyContext, renderLegalDocumentTemplate } from "./render";
import type {
  AcceptanceItem,
  BusinessPackLegalCenter,
  BusinessPackLegalEngineDashboard,
  LegalDocument,
} from "./types";

function parseDocuments(value: unknown, packName?: string): LegalDocument[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map((row) => {
      const template = String(row.body_template ?? "");
      return {
        document_key: String(row.document_key ?? ""),
        title: String(row.title ?? ""),
        version: String(row.version ?? ""),
        body_template: template,
        body: renderLegalDocumentTemplate(template, packName),
        effective_date: String(row.effective_date ?? ""),
        published_at: String(row.published_at ?? ""),
        requires_acceptance: row.requires_acceptance === true,
        accepted: row.accepted === true,
      };
    });
}

function parseAcceptanceItems(value: unknown): AcceptanceItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (row): row is AcceptanceItem =>
      typeof row === "object" && row !== null && typeof (row as AcceptanceItem).document_key === "string",
  );
}

export function parseBusinessPackLegalCenter(data: unknown): BusinessPackLegalCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  }

  const rawDefinition = row.definition as BusinessPackLegalCenter["definition"];
  const packName = rawDefinition?.pack_name;
  const definition = rawDefinition
    ? {
        ...rawDefinition,
        pack_terms: Object.fromEntries(
          Object.entries(rawDefinition.pack_terms ?? {}).map(([key, value]) => [
            key,
            renderLegalDocumentTemplate(String(value), packName),
          ]),
        ),
      }
    : undefined;
  const overview = row.overview as BusinessPackLegalCenter["overview"];

  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    definition,
    overview,
    documents: parseDocuments(row.documents, packName),
    acceptance_required: parseAcceptanceItems(row.acceptance_required),
    company: getLegalCompanyContext(),
    mandatory_documents: Array.isArray(row.mandatory_documents) ? (row.mandatory_documents as string[]) : [],
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    legal_center_route: typeof row.legal_center_route === "string" ? row.legal_center_route : undefined,
  };
}

export function parseBusinessPackLegalEngineDashboard(data: unknown): BusinessPackLegalEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    mandatory_documents: Array.isArray(row.mandatory_documents) ? (row.mandatory_documents as string[]) : [],
    governance: (row.governance as Record<string, string>) ?? {},
    forbidden: Array.isArray(row.forbidden) ? (row.forbidden as string[]) : [],
    summary: (row.summary as Record<string, number>) ?? {},
    definitions: Array.isArray(row.definitions) ? (row.definitions as Array<Record<string, unknown>>) : [],
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    success_criteria: Array.isArray(row.success_criteria) ? (row.success_criteria as string[]) : [],
  };
}

export function packLegalRoute(packKey: string): string {
  return `/app/marketplace/packs/${packKey}/legal`;
}
