import { createClient } from "@/lib/supabase/server";

export async function fetchDesktopCompanionHome() {
  const supabase = await createClient();
  return supabase.rpc("get_desktop_companion_home");
}

export async function fetchDesktopCompanionProfile() {
  const supabase = await createClient();
  return supabase.rpc("get_desktop_companion_profile");
}

export async function fetchDesktopCompanionBriefing() {
  const supabase = await createClient();
  return supabase.rpc("get_desktop_companion_briefing");
}

export async function fetchDesktopCompanionTasks() {
  const supabase = await createClient();
  return supabase.rpc("get_desktop_companion_tasks");
}

export async function fetchDesktopCompanionNotifications() {
  const supabase = await createClient();
  return supabase.rpc("get_desktop_companion_notifications");
}

export async function updateDesktopCompanionPreferences(patch: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.rpc("update_desktop_companion_preferences", { p_patch: patch });
}

export async function searchDesktopCompanion(query: string, limit = 20) {
  const supabase = await createClient();
  return supabase.rpc("search_desktop_companion", { p_query: query, p_limit: limit });
}
