export const IMPLEMENTATION_BLUEPRINT_PHASE206_MISSION = "Meeting Follow-Up Dashboard — Meeting Companion supports; metadata/summaries only.";
export const IMPLEMENTATION_BLUEPRINT_PHASE206_ROUTE = "/app/aipify-meeting-intelligence-follow-up-engine";
export const IMPLEMENTATION_BLUEPRINT_PHASE206_COMPANION_LIMITATIONS = [
  "store_raw_transcripts_without_policy",
  "pii_in_audit_payloads",
  "bypass_consent_controls",
  "duplicate_action_center_rpcs",
  "replace_human_judgment",
  "expose_unauthorized_meeting_content",
] as const;
