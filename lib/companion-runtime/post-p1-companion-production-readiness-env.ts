import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import type { PostP1EnvironmentChecks } from "./post-p1-companion-production-readiness-types";

/** Presence-only checks — never return or log secret values. */
export function resolvePostP1EnvironmentChecks(): PostP1EnvironmentChecks {
  loadP1LiveE2eEnvFiles();
  const { config } = resolveP1LiveE2eConfig();

  return {
    cron_secret_configured: Boolean(process.env.CRON_SECRET?.trim()),
    supabase_service_role_key_configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    live_e2e_enabled: Boolean(config?.enabled),
    live_e2e_base_url_configured: Boolean(config?.baseUrl?.trim()),
  };
}
