import type { SupabaseClient } from "@supabase/supabase-js";
import type { Installation } from "./types";
import { getDashboardProfile } from "./get-profile";

export async function getCompanyInstallations(
  supabase: SupabaseClient
): Promise<Installation[]> {
  const profile = await getDashboardProfile(supabase);

  if (!profile) {
    return [];
  }

  const { data, error } = await supabase
    .from("installations")
    .select(
      "id, company_id, system_type, status, installed_at, metadata, created_at, updated_at"
    )
    .eq("company_id", profile.company.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Installation[];
}

export async function getActiveInstallation(
  supabase: SupabaseClient,
  installationId?: string | null
): Promise<Installation | null> {
  const installations = await getCompanyInstallations(supabase);

  if (installations.length === 0) {
    return null;
  }

  if (installationId) {
    return (
      installations.find(
        (item) => item.id === installationId && item.status === "active"
      ) ?? null
    );
  }

  return installations.find((item) => item.status === "active") ?? null;
}
