export const BOOK_DEMO_COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-250",
  "251-1000",
  "1000+",
] as const;

export const BOOK_DEMO_INDUSTRIES = [
  "hospitality",
  "commerce",
  "support",
  "property_management",
  "professional_services",
  "healthcare",
  "education",
  "construction",
  "manufacturing",
  "technology",
  "other",
] as const;

export const BOOK_DEMO_CHALLENGES = [
  "operational_visibility",
  "support_efficiency",
  "knowledge_management",
  "automation",
  "reporting",
  "governance",
  "business_growth",
  "other",
] as const;

export const BOOK_DEMO_MEETING_TYPES = [
  "video",
  "phone",
  "in_person",
  "no_preference",
] as const;

export const BOOK_DEMO_PIPELINE_STAGES = [
  "demo_requested",
  "discovery_scheduled",
  "demo_completed",
  "follow_up_required",
  "qualified_opportunity",
  "customer_activated",
] as const;

export type BookDemoAdvisor = {
  id: string;
  displayName: string;
  roleTitle: string;
  availabilityStatus: string;
  availabilityNote: string;
  languages: string[];
  contactEmail: string;
  contactPhone: string;
};

export type BookDemoSubmissionResult = {
  ok: boolean;
  error?: string;
  leadId?: string;
  opportunityId?: string;
  pipelineStage?: string;
  pipelineStageLabel?: string;
  confirmationNote?: string;
};

export function parseBookDemoAdvisor(raw: unknown): BookDemoAdvisor | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    id: String(d.id ?? ""),
    displayName: String(d.display_name ?? ""),
    roleTitle: String(d.role_title ?? ""),
    availabilityStatus: String(d.availability_status ?? "available"),
    availabilityNote: String(d.availability_note ?? ""),
    languages: Array.isArray(d.languages) ? d.languages.map(String) : [],
    contactEmail: String(d.contact_email ?? ""),
    contactPhone: String(d.contact_phone ?? ""),
  };
}

export function parseBookDemoSubmission(raw: unknown): BookDemoSubmissionResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid response" };
  const d = raw as Record<string, unknown>;
  if (d.ok !== true) return { ok: false, error: String(d.error ?? "Submission failed") };
  return {
    ok: true,
    leadId: d.lead_id ? String(d.lead_id) : undefined,
    opportunityId: d.opportunity_id ? String(d.opportunity_id) : undefined,
    pipelineStage: d.pipeline_stage ? String(d.pipeline_stage) : undefined,
    pipelineStageLabel: d.pipeline_stage_label ? String(d.pipeline_stage_label) : undefined,
    confirmationNote: d.confirmation_note ? String(d.confirmation_note) : undefined,
  };
}
