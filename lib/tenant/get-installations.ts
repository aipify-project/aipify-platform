import type { SupabaseClient } from "@supabase/supabase-js";
import type { Installation } from "./types";
import { getDashboardProfile } from "./get-profile";

const INSTALLATION_SELECT = `
  id,
  company_id,
  name,
  site_url,
  system_type,
  status,
  installed_at,
  last_synced_at,
  metadata,
  created_at,
  updated_at,
  companies ( name ),
  installation_modules ( module_key, enabled ),
  installation_integrations ( integration_key, status, last_synced_at )
`;

function normalizeInstallation(row: Record<string, unknown>): Installation {
  const company = row.companies as { name: string } | { name: string }[] | null;
  const companyName = Array.isArray(company) ? company[0]?.name : company?.name;

  return {
    id: row.id as string,
    company_id: row.company_id as string,
    name: (row.name as string | null) ?? null,
    site_url: (row.site_url as string | null) ?? null,
    system_type: row.system_type as Installation["system_type"],
    status: row.status as Installation["status"],
    installed_at: (row.installed_at as string | null) ?? null,
    last_synced_at: (row.last_synced_at as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    company: companyName ? { name: companyName } : null,
    modules: (row.installation_modules as Installation["modules"]) ?? [],
    integrations:
      (row.installation_integrations as Installation["integrations"]) ?? [],
  };
}

export async function getCompanyInstallations(
  supabase: SupabaseClient
): Promise<Installation[]> {
  const profile = await getDashboardProfile(supabase);

  if (!profile) {
    return [];
  }

  const { data, error } = await supabase
    .from("installations")
    .select(INSTALLATION_SELECT)
    .eq("company_id", profile.company.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => normalizeInstallation(row as Record<string, unknown>));
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
