export type FoundingStatement = {
  id: string;
  statement_key: string;
  title: string;
  content: string;
};

export type StrategicTheme = {
  id: string;
  theme_key: string;
  theme_number: number;
  title: string;
  description: string;
  category: string;
  acknowledged?: boolean;
};

export type OrganizationalCommitment = {
  id: string;
  title: string;
  description: string;
  commitment_type: string;
  status: string;
};

export type VisionUpdate = {
  id: string;
  update_type: string;
  title: string;
  summary?: string | null;
  status: string;
  alignment_score?: number | null;
  scheduled_at?: string | null;
};

export type VisionPublication = {
  id: string;
  title: string;
  summary: string;
  audience: string;
  status: string;
  published_at?: string | null;
};

export type ManifestoActionResult = {
  status?: string;
  error?: string;
};

export type ManifestoBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};

export type ManifestoBelief = {
  key?: string;
  number?: number;
  title?: string;
  description?: string;
};

export type ManifestoPrinciple = {
  key?: string;
  label?: string;
  description?: string;
};

export type ManifestoHope = {
  key?: string;
  number?: number;
  title?: string;
  description?: string;
};

export type ManifestoVisionBlock = {
  principle?: string;
  bullets?: string[];
};

export type ManifestoResponsibilityQuestion = {
  key?: string;
  question?: string;
  answer?: string;
};

export type ManifestoResponsibilityBlock = {
  principle?: string;
  questions?: ManifestoResponsibilityQuestion[];
};

export type ManifestoFutureBlock = {
  title?: string;
  aspiration?: string;
  themes?: string[];
};

export type ManifestoFutureBuildersMessage = {
  title?: string;
  message?: string;
  guidance?: string[];
};

export type ManifestoFoundationalPrinciple = {
  principle?: string;
  quotes?: string[];
  qualities?: string[];
  commitments?: string[];
  route?: string;
  phase?: string;
  charter_doc?: string;
  inclusion_route?: string;
  learning_route?: string;
  license_route?: string;
  ethics_route?: string;
  constitution_route?: string;
  memory_route?: string;
  purpose_route?: string;
  partnership_blueprint?: string;
  boundary_note?: string;
};

export type ManifestoSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ManifestoIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  doc?: string;
};

export type HumanCenteredCompanionshipBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  purpose_why_aipify_exists?: string;
  our_belief?: ManifestoBelief[];
  our_purpose?: string;
  our_vision?: ManifestoVisionBlock;
  what_aipify_is?: string[];
  what_aipify_is_not?: string[];
  our_principles?: ManifestoPrinciple[];
  self_love_principle?: ManifestoFoundationalPrinciple;
  companion_principle?: ManifestoFoundationalPrinciple;
  humanity_principle?: ManifestoFoundationalPrinciple;
  learning_principle?: ManifestoFoundationalPrinciple;
  trust_principle?: ManifestoFoundationalPrinciple;
  legacy_principle?: ManifestoFoundationalPrinciple;
  our_hope?: ManifestoHope[];
  our_responsibility?: ManifestoResponsibilityBlock;
  the_future?: ManifestoFutureBlock;
  message_to_future_builders?: ManifestoFutureBuildersMessage;
  success_criteria?: ManifestoSuccessCriterion[];
  abos_principle?: string;
  vision?: string;
  integration_links?: ManifestoIntegrationLink[];
  privacy_note?: string;
};

export type ManifestoCard = {
  has_customer: boolean;
  manifesto_score?: number;
  themes_count?: number;
  current_version?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase100?: {
    phase?: string;
    doc?: string;
    route?: string;
  };
  human_centered_companionship_abos_principle?: string;
  human_centered_companionship_vision?: string;
  human_centered_companionship_note?: string;
};

export type ManifestoDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  manifesto_enabled?: boolean;
  acknowledgement_required?: boolean;
  vision_publication_enabled?: boolean;
  current_version?: string;
  review_cycle_months?: number;
  manifesto_score?: number;
  themes_count?: number;
  themes_acknowledged?: number;
  vision_alignment_score?: number;
  publications_count?: number;
  founding_belief?: string;
  aipify_promise?: string;
  founding_statements: FoundingStatement[];
  strategic_themes: StrategicTheme[];
  organizational_commitments: OrganizationalCommitment[];
  vision_updates: VisionUpdate[];
  vision_publications: VisionPublication[];
  target_audiences?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase100?: {
    phase?: string;
    doc?: string;
    engine_phase?: string;
    route?: string;
  };
  human_centered_companionship_note?: string;
  aipify_manifesto_human_centered_companionship_blueprint?: HumanCenteredCompanionshipBlueprint;
  human_centered_companionship_distinction_note?: string;
  human_centered_companionship_purpose?: string;
  human_centered_companionship_our_belief?: ManifestoBelief[];
  human_centered_companionship_our_purpose?: string;
  human_centered_companionship_our_vision?: ManifestoVisionBlock;
  human_centered_companionship_what_aipify_is?: string[];
  human_centered_companionship_what_aipify_is_not?: string[];
  human_centered_companionship_our_principles?: ManifestoPrinciple[];
  human_centered_companionship_self_love_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_companion_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_humanity_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_learning_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_trust_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_legacy_principle?: ManifestoFoundationalPrinciple;
  human_centered_companionship_our_hope?: ManifestoHope[];
  human_centered_companionship_our_responsibility?: ManifestoResponsibilityBlock;
  human_centered_companionship_the_future?: ManifestoFutureBlock;
  human_centered_companionship_message_to_future_builders?: ManifestoFutureBuildersMessage;
  human_centered_companionship_success_criteria?: ManifestoSuccessCriterion[];
  human_centered_companionship_abos_principle?: string;
  human_centered_companionship_vision?: string;
  human_centered_companionship_integration_links?: ManifestoIntegrationLink[];
  human_centered_companionship_privacy_note?: string;
};
