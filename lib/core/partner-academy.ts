/**
 * Partner Academy — Phase 332 foundation.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerAcademyFilters } from "@/lib/partner-academy/types";

export async function getPartnerAcademyDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_academy_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAcademyCourses(
  supabase: RpcClient,
  filters: PartnerAcademyFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_academy_courses", {
    p_category: filters.category ?? null,
    p_status: filters.status ?? null,
    p_cert_level: filters.cert_level ?? null,
    p_difficulty: filters.difficulty ?? null,
    p_locale: filters.locale ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAcademyCertifications(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_academy_certifications");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerAcademyProgress(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_academy_progress");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitPartnerAcademyExam(
  supabase: RpcClient,
  params: {
    examKey?: string;
    scorePct?: number;
    startCourseKey?: string;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_partner_academy_exam", {
    p_exam_key: params.examKey ?? null,
    p_score_pct: params.scorePct ?? null,
    p_start_course_key: params.startCourseKey ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
