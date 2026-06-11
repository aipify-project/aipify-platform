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

export type ManifestoCard = {
  has_customer: boolean;
  manifesto_score?: number;
  themes_count?: number;
  current_version?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
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
