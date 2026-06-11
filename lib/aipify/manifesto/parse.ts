import type {
  ManifestoActionResult,
  ManifestoBriefingResult,
  ManifestoCard,
  ManifestoDashboard,
} from "./types";

export function parseManifestoCard(data: unknown): ManifestoCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    manifesto_score: Number(d.manifesto_score ?? 0),
    themes_count: Number(d.themes_count ?? 0),
    current_version: typeof d.current_version === "string" ? d.current_version : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseManifestoDashboard(data: unknown): ManifestoDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    manifesto_enabled: Boolean(d.manifesto_enabled ?? true),
    acknowledgement_required: Boolean(d.acknowledgement_required ?? true),
    vision_publication_enabled: Boolean(d.vision_publication_enabled ?? true),
    current_version: typeof d.current_version === "string" ? d.current_version : undefined,
    review_cycle_months: Number(d.review_cycle_months ?? 12),
    manifesto_score: Number(d.manifesto_score ?? 0),
    themes_count: Number(d.themes_count ?? 0),
    themes_acknowledged: Number(d.themes_acknowledged ?? 0),
    vision_alignment_score: Number(d.vision_alignment_score ?? 0),
    publications_count: Number(d.publications_count ?? 0),
    founding_belief: typeof d.founding_belief === "string" ? d.founding_belief : undefined,
    aipify_promise: typeof d.aipify_promise === "string" ? d.aipify_promise : undefined,
    founding_statements: Array.isArray(d.founding_statements)
      ? (d.founding_statements as ManifestoDashboard["founding_statements"])
      : [],
    strategic_themes: Array.isArray(d.strategic_themes)
      ? (d.strategic_themes as ManifestoDashboard["strategic_themes"])
      : [],
    organizational_commitments: Array.isArray(d.organizational_commitments)
      ? (d.organizational_commitments as ManifestoDashboard["organizational_commitments"])
      : [],
    vision_updates: Array.isArray(d.vision_updates)
      ? (d.vision_updates as ManifestoDashboard["vision_updates"])
      : [],
    vision_publications: Array.isArray(d.vision_publications)
      ? (d.vision_publications as ManifestoDashboard["vision_publications"])
      : [],
    target_audiences: Array.isArray(d.target_audiences) ? (d.target_audiences as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as ManifestoDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseManifestoActionResult(data: unknown): ManifestoActionResult {
  return (data ?? {}) as ManifestoActionResult;
}

export function parseManifestoBriefingResult(data: unknown): ManifestoBriefingResult {
  return (data ?? {}) as ManifestoBriefingResult;
}
