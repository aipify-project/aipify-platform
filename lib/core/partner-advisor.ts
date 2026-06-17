/**
 * Partner Advisor Center — Phase 339.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerAdvisorFilters } from "@/lib/partner-advisor/types";

export async function getPartnerAdvisor(
  supabase: RpcClient,
  filters: PartnerAdvisorFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_advisor", {
    p_advisor_type: filters.advisor_type ?? null,
    p_health_score: filters.health_score ?? null,
    p_performance: filters.performance ?? null,
    p_country: filters.country ?? null,
    p_partner_tier: filters.partner_tier ?? null,
    p_goal_status: filters.goal_status ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAdvisorReviews(
  supabase: RpcClient,
  filters: Pick<PartnerAdvisorFilters, "review_type" | "review_status" | "search"> = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_advisor_reviews", {
    p_review_type: filters.review_type ?? null,
    p_review_status: filters.review_status ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAdvisorMessages(
  supabase: RpcClient,
  filters: Pick<PartnerAdvisorFilters, "message_source" | "message_type" | "search"> = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_advisor_messages", {
    p_message_source: filters.message_source ?? null,
    p_message_type: filters.message_type ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAdvisorGoals(
  supabase: RpcClient,
  filters: Pick<PartnerAdvisorFilters, "goal_type" | "goal_status" | "search"> = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_advisor_goals", {
    p_goal_type: filters.goal_type ?? null,
    p_goal_status: filters.goal_status ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function postPartnerAdvisorMessage(
  supabase: RpcClient,
  subject: string,
  body: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("post_partner_advisor_message", {
    p_subject: subject,
    p_body: body,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function schedulePartnerAdvisorIntroduction(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_partner_advisor_introduction");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createPartnerAdvisorReview(
  supabase: RpcClient,
  reviewType: string,
  scheduledDate?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_partner_advisor_review", {
    p_review_type: reviewType,
    p_scheduled_date: scheduledDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
