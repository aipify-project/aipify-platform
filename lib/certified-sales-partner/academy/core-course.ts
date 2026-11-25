/**
 * SERVER-ONLY: resolves the Core academy course id (uuid) for a course key.
 *
 * Core exposes no partner-callable course list, so the id is read with the service-role client
 * (read-only, `published = true` only). It carries no secrets and never reaches the browser as a
 * trust input. Any failure — missing service config, unpublished course, no row — returns `null`,
 * which makes the submit route fall back to honest practice mode (nothing is certified).
 */
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { id: string; at: number }>();

export async function resolveCoreAcademyCourseId(courseKey: string): Promise<string | null> {
  const hit = cache.get(courseKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.id;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_academy_courses")
      .select("id")
      .eq("course_key", courseKey)
      .eq("published", true)
      .maybeSingle();
    if (error || !data || typeof data.id !== "string" || !UUID_PATTERN.test(data.id)) return null;
    cache.set(courseKey, { id: data.id, at: Date.now() });
    return data.id;
  } catch {
    return null;
  }
}
