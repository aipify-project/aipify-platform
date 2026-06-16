/**
 * Relationship Intelligence Engine helpers (Phase A.78 — Organizational).
 * Authoritative enforcement lives in Supabase RPCs.
 * Distinct from Phase 33 RSI at lib/relationship-intelligence/.
 */

import type { RpcClient } from "./rpc-client";

export const RELATIONSHIP_CATEGORIES = ["internal", "customer", "partner", "community"] as const;
export type RelationshipCategory = (typeof RELATIONSHIP_CATEGORIES)[number];

export const RELATIONSHIP_STRENGTHS = ["weak", "moderate", "strong", "critical"] as const;
export type RelationshipStrength = (typeof RELATIONSHIP_STRENGTHS)[number];

export const INTERACTION_FREQUENCIES = ["rare", "occasional", "regular", "frequent"] as const;
export type InteractionFrequency = (typeof INTERACTION_FREQUENCIES)[number];

export const SENTIMENT_HINTS = ["positive", "neutral", "caution", "at_risk"] as const;
export type SentimentHint = (typeof SENTIMENT_HINTS)[number];

export const RELATIONSHIP_PROFILE_STATUSES = ["active", "inactive", "archived"] as const;
export type RelationshipProfileStatus = (typeof RELATIONSHIP_PROFILE_STATUSES)[number];

export const INTERACTION_TYPES = [
  "collaboration",
  "support",
  "escalation",
  "review",
  "meeting",
  "handoff",
  "other",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export const INSIGHT_TYPES = [
  "collaboration_pattern",
  "escalation_path",
  "communication_preference",
  "trust_indicator",
  "engagement_trend",
  "risk_signal",
  "opportunity",
] as const;
export type InsightType = (typeof INSIGHT_TYPES)[number];

export const INSIGHT_CONFIDENCE_LEVELS = ["low", "moderate", "high"] as const;
export type InsightConfidence = (typeof INSIGHT_CONFIDENCE_LEVELS)[number];

export const INSIGHT_STATUSES = ["open", "acknowledged", "resolved", "dismissed"] as const;
export type InsightStatus = (typeof INSIGHT_STATUSES)[number];

export const RELATIONSHIP_INTELLIGENCE_PERMISSION_KEYS = [
  "relationship_intelligence.view",
  "relationship_intelligence.manage",
  "relationship_intelligence.insights.resolve",
] as const;
export type RelationshipIntelligencePermissionKey =
  (typeof RELATIONSHIP_INTELLIGENCE_PERMISSION_KEYS)[number];

export async function getRelationshipIntelligenceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_relationship_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getRelationshipIntelligenceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_relationship_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listOrganizationRelationshipProfiles(
  supabase: RpcClient,
  category?: RelationshipCategory
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_organization_relationship_profiles", {
    p_category: category ?? null,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createRelationshipIntelligenceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
