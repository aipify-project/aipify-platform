import type {
  HumanCenteredCompanionshipBlueprint,
  ManifestoActionResult,
  ManifestoBelief,
  ManifestoBriefingResult,
  ManifestoCard,
  ManifestoDashboard,
  ManifestoFoundationalPrinciple,
  ManifestoFutureBlock,
  ManifestoFutureBuildersMessage,
  ManifestoHope,
  ManifestoIntegrationLink,
  ManifestoPrinciple,
  ManifestoResponsibilityBlock,
  ManifestoSuccessCriterion,
  ManifestoVisionBlock,
} from "./types";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function parseBeliefs(value: unknown): ManifestoBelief[] {
  return Array.isArray(value) ? (value as ManifestoBelief[]) : [];
}

function parsePrinciples(value: unknown): ManifestoPrinciple[] {
  return Array.isArray(value) ? (value as ManifestoPrinciple[]) : [];
}

function parseHopes(value: unknown): ManifestoHope[] {
  return Array.isArray(value) ? (value as ManifestoHope[]) : [];
}

function parseVisionBlock(value: unknown): ManifestoVisionBlock | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    principle: typeof v.principle === "string" ? v.principle : undefined,
    bullets: asStringArray(v.bullets),
  };
}

function parseResponsibilityBlock(value: unknown): ManifestoResponsibilityBlock | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    principle: typeof v.principle === "string" ? v.principle : undefined,
    questions: Array.isArray(v.questions)
      ? (v.questions as ManifestoResponsibilityBlock["questions"])
      : [],
  };
}

function parseFutureBlock(value: unknown): ManifestoFutureBlock | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    title: typeof v.title === "string" ? v.title : undefined,
    aspiration: typeof v.aspiration === "string" ? v.aspiration : undefined,
    themes: asStringArray(v.themes),
  };
}

function parseFutureBuildersMessage(value: unknown): ManifestoFutureBuildersMessage | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    title: typeof v.title === "string" ? v.title : undefined,
    message: typeof v.message === "string" ? v.message : undefined,
    guidance: asStringArray(v.guidance),
  };
}

function parseFoundationalPrinciple(value: unknown): ManifestoFoundationalPrinciple | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    principle: typeof v.principle === "string" ? v.principle : undefined,
    quotes: asStringArray(v.quotes),
    qualities: asStringArray(v.qualities),
    commitments: asStringArray(v.commitments),
    route: typeof v.route === "string" ? v.route : undefined,
    phase: typeof v.phase === "string" ? v.phase : undefined,
    charter_doc: typeof v.charter_doc === "string" ? v.charter_doc : undefined,
    inclusion_route: typeof v.inclusion_route === "string" ? v.inclusion_route : undefined,
    learning_route: typeof v.learning_route === "string" ? v.learning_route : undefined,
    license_route: typeof v.license_route === "string" ? v.license_route : undefined,
    ethics_route: typeof v.ethics_route === "string" ? v.ethics_route : undefined,
    constitution_route: typeof v.constitution_route === "string" ? v.constitution_route : undefined,
    memory_route: typeof v.memory_route === "string" ? v.memory_route : undefined,
    purpose_route: typeof v.purpose_route === "string" ? v.purpose_route : undefined,
    partnership_blueprint: typeof v.partnership_blueprint === "string" ? v.partnership_blueprint : undefined,
    boundary_note: typeof v.boundary_note === "string" ? v.boundary_note : undefined,
  };
}

function parseSuccessCriteria(value: unknown): ManifestoSuccessCriterion[] {
  return Array.isArray(value) ? (value as ManifestoSuccessCriterion[]) : [];
}

function parseIntegrationLinks(value: unknown): ManifestoIntegrationLink[] {
  return Array.isArray(value) ? (value as ManifestoIntegrationLink[]) : [];
}

function parseBlueprintBlock(value: unknown): HumanCenteredCompanionshipBlueprint | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    phase: typeof v.phase === "string" ? v.phase : undefined,
    doc: typeof v.doc === "string" ? v.doc : undefined,
    engine_phase: typeof v.engine_phase === "string" ? v.engine_phase : undefined,
    route: typeof v.route === "string" ? v.route : undefined,
    mapping_note: typeof v.mapping_note === "string" ? v.mapping_note : undefined,
    distinction_note: typeof v.distinction_note === "string" ? v.distinction_note : undefined,
    purpose_why_aipify_exists:
      typeof v.purpose_why_aipify_exists === "string" ? v.purpose_why_aipify_exists : undefined,
    our_belief: parseBeliefs(v.our_belief),
    our_purpose: typeof v.our_purpose === "string" ? v.our_purpose : undefined,
    our_vision: parseVisionBlock(v.our_vision),
    what_aipify_is: asStringArray(v.what_aipify_is),
    what_aipify_is_not: asStringArray(v.what_aipify_is_not),
    our_principles: parsePrinciples(v.our_principles),
    self_love_principle: parseFoundationalPrinciple(v.self_love_principle),
    companion_principle: parseFoundationalPrinciple(v.companion_principle),
    humanity_principle: parseFoundationalPrinciple(v.humanity_principle),
    learning_principle: parseFoundationalPrinciple(v.learning_principle),
    trust_principle: parseFoundationalPrinciple(v.trust_principle),
    legacy_principle: parseFoundationalPrinciple(v.legacy_principle),
    our_hope: parseHopes(v.our_hope),
    our_responsibility: parseResponsibilityBlock(v.our_responsibility),
    the_future: parseFutureBlock(v.the_future),
    message_to_future_builders: parseFutureBuildersMessage(v.message_to_future_builders),
    success_criteria: parseSuccessCriteria(v.success_criteria),
    abos_principle: typeof v.abos_principle === "string" ? v.abos_principle : undefined,
    vision: typeof v.vision === "string" ? v.vision : undefined,
    integration_links: parseIntegrationLinks(v.integration_links),
    privacy_note: typeof v.privacy_note === "string" ? v.privacy_note : undefined,
  };
}

function parsePhase100Meta(value: unknown): ManifestoDashboard["implementation_blueprint_phase100"] {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  return {
    phase: typeof v.phase === "string" ? v.phase : undefined,
    doc: typeof v.doc === "string" ? v.doc : undefined,
    engine_phase: typeof v.engine_phase === "string" ? v.engine_phase : undefined,
    route: typeof v.route === "string" ? v.route : undefined,
  };
}

export function parseManifestoCard(data: unknown): ManifestoCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    manifesto_score: Number(d.manifesto_score ?? 0),
    themes_count: Number(d.themes_count ?? 0),
    current_version: typeof d.current_version === "string" ? d.current_version : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase100: parsePhase100Meta(d.implementation_blueprint_phase100),
    human_centered_companionship_abos_principle:
      typeof d.human_centered_companionship_abos_principle === "string"
        ? d.human_centered_companionship_abos_principle
        : undefined,
    human_centered_companionship_vision:
      typeof d.human_centered_companionship_vision === "string"
        ? d.human_centered_companionship_vision
        : undefined,
    human_centered_companionship_note:
      typeof d.human_centered_companionship_note === "string"
        ? d.human_centered_companionship_note
        : undefined,
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
    implementation_blueprint_phase100: parsePhase100Meta(d.implementation_blueprint_phase100),
    human_centered_companionship_note:
      typeof d.human_centered_companionship_note === "string"
        ? d.human_centered_companionship_note
        : undefined,
    aipify_manifesto_human_centered_companionship_blueprint: parseBlueprintBlock(
      d.aipify_manifesto_human_centered_companionship_blueprint,
    ),
    human_centered_companionship_distinction_note:
      typeof d.human_centered_companionship_distinction_note === "string"
        ? d.human_centered_companionship_distinction_note
        : undefined,
    human_centered_companionship_purpose:
      typeof d.human_centered_companionship_purpose === "string"
        ? d.human_centered_companionship_purpose
        : undefined,
    human_centered_companionship_our_belief: parseBeliefs(d.human_centered_companionship_our_belief),
    human_centered_companionship_our_purpose:
      typeof d.human_centered_companionship_our_purpose === "string"
        ? d.human_centered_companionship_our_purpose
        : undefined,
    human_centered_companionship_our_vision: parseVisionBlock(d.human_centered_companionship_our_vision),
    human_centered_companionship_what_aipify_is: asStringArray(d.human_centered_companionship_what_aipify_is),
    human_centered_companionship_what_aipify_is_not: asStringArray(
      d.human_centered_companionship_what_aipify_is_not,
    ),
    human_centered_companionship_our_principles: parsePrinciples(
      d.human_centered_companionship_our_principles,
    ),
    human_centered_companionship_self_love_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_self_love_principle,
    ),
    human_centered_companionship_companion_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_companion_principle,
    ),
    human_centered_companionship_humanity_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_humanity_principle,
    ),
    human_centered_companionship_learning_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_learning_principle,
    ),
    human_centered_companionship_trust_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_trust_principle,
    ),
    human_centered_companionship_legacy_principle: parseFoundationalPrinciple(
      d.human_centered_companionship_legacy_principle,
    ),
    human_centered_companionship_our_hope: parseHopes(d.human_centered_companionship_our_hope),
    human_centered_companionship_our_responsibility: parseResponsibilityBlock(
      d.human_centered_companionship_our_responsibility,
    ),
    human_centered_companionship_the_future: parseFutureBlock(d.human_centered_companionship_the_future),
    human_centered_companionship_message_to_future_builders: parseFutureBuildersMessage(
      d.human_centered_companionship_message_to_future_builders,
    ),
    human_centered_companionship_success_criteria: parseSuccessCriteria(
      d.human_centered_companionship_success_criteria,
    ),
    human_centered_companionship_abos_principle:
      typeof d.human_centered_companionship_abos_principle === "string"
        ? d.human_centered_companionship_abos_principle
        : undefined,
    human_centered_companionship_vision:
      typeof d.human_centered_companionship_vision === "string"
        ? d.human_centered_companionship_vision
        : undefined,
    human_centered_companionship_integration_links: parseIntegrationLinks(
      d.human_centered_companionship_integration_links,
    ),
    human_centered_companionship_privacy_note:
      typeof d.human_centered_companionship_privacy_note === "string"
        ? d.human_centered_companionship_privacy_note
        : undefined,
  };
}

export function parseManifestoActionResult(data: unknown): ManifestoActionResult {
  return (data ?? {}) as ManifestoActionResult;
}

export function parseManifestoBriefingResult(data: unknown): ManifestoBriefingResult {
  return (data ?? {}) as ManifestoBriefingResult;
}
