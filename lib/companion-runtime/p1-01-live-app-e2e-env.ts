import fs from "node:fs";
import path from "node:path";

export const P1_01_LIVE_E2E_ENV = {
  enabled: "APP_LIVE_E2E_ENABLED",
  environment: "APP_LIVE_E2E_ENVIRONMENT",
  email: "APP_LIVE_E2E_EMAIL",
  password: "APP_LIVE_E2E_PASSWORD",
  isolationEmail: "APP_LIVE_E2E_ISOLATION_EMAIL",
  isolationPassword: "APP_LIVE_E2E_ISOLATION_PASSWORD",
  baseUrl: "APP_LIVE_E2E_BASE_URL",
  organizationRef: "APP_LIVE_E2E_ORGANIZATION_REF",
  supabaseUrl: "NEXT_PUBLIC_SUPABASE_URL",
  supabaseAnonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
} as const;

export type P1LiveE2eEnvironmentName = "local" | "staging" | "production" | "unknown";

export type P1LiveE2eEnvConfig = {
  enabled: boolean;
  environment: P1LiveE2eEnvironmentName;
  email: string;
  password: string;
  isolationEmail: string | null;
  isolationPassword: string | null;
  baseUrl: string | null;
  organizationRef: string | null;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type P1LiveE2eEnvBlocker = {
  code: string;
  message: string;
  required_variable?: string;
};

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function loadP1LiveE2eEnvFiles(repoRoot = process.cwd()): void {
  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    const envPath = path.join(repoRoot, filename);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function parseEnvironmentName(raw: string | null): P1LiveE2eEnvironmentName {
  if (!raw) return "unknown";
  const normalized = raw.toLowerCase();
  if (normalized === "local" || normalized === "staging" || normalized === "production") {
    return normalized;
  }
  return "unknown";
}

export function resolveP1LiveE2eBlockers(): P1LiveE2eEnvBlocker[] {
  const blockers: P1LiveE2eEnvBlocker[] = [];

  if (readEnv(P1_01_LIVE_E2E_ENV.enabled) !== "1") {
    blockers.push({
      code: "live_e2e_not_enabled",
      message: "Set APP_LIVE_E2E_ENABLED=1 to run authenticated live APP E2E certification.",
      required_variable: P1_01_LIVE_E2E_ENV.enabled,
    });
  }

  const supabaseUrl = readEnv(P1_01_LIVE_E2E_ENV.supabaseUrl);
  if (!supabaseUrl) {
    blockers.push({
      code: "supabase_url_missing",
      message: "NEXT_PUBLIC_SUPABASE_URL is required for live authenticated sessions.",
      required_variable: P1_01_LIVE_E2E_ENV.supabaseUrl,
    });
  }

  const supabaseAnonKey = readEnv(P1_01_LIVE_E2E_ENV.supabaseAnonKey);
  if (!supabaseAnonKey) {
    blockers.push({
      code: "supabase_anon_key_missing",
      message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required for live authenticated sessions.",
      required_variable: P1_01_LIVE_E2E_ENV.supabaseAnonKey,
    });
  }

  const email = readEnv(P1_01_LIVE_E2E_ENV.email);
  if (!email) {
    blockers.push({
      code: "primary_credentials_missing",
      message: "APP_LIVE_E2E_EMAIL is required for authenticated APP organization access.",
      required_variable: P1_01_LIVE_E2E_ENV.email,
    });
  }

  const password = readEnv(P1_01_LIVE_E2E_ENV.password);
  if (!password) {
    blockers.push({
      code: "primary_credentials_missing",
      message: "APP_LIVE_E2E_PASSWORD is required for authenticated APP organization access.",
      required_variable: P1_01_LIVE_E2E_ENV.password,
    });
  }

  return blockers;
}

export function resolveP1LiveE2eConfig(): { config: P1LiveE2eEnvConfig | null; blockers: P1LiveE2eEnvBlocker[] } {
  const blockers = resolveP1LiveE2eBlockers();
  if (blockers.length > 0) {
    return { config: null, blockers };
  }

  return {
    config: {
      enabled: true,
      environment: parseEnvironmentName(readEnv(P1_01_LIVE_E2E_ENV.environment)),
      email: readEnv(P1_01_LIVE_E2E_ENV.email)!,
      password: readEnv(P1_01_LIVE_E2E_ENV.password)!,
      isolationEmail: readEnv(P1_01_LIVE_E2E_ENV.isolationEmail),
      isolationPassword: readEnv(P1_01_LIVE_E2E_ENV.isolationPassword),
      baseUrl: readEnv(P1_01_LIVE_E2E_ENV.baseUrl),
      organizationRef: readEnv(P1_01_LIVE_E2E_ENV.organizationRef),
      supabaseUrl: readEnv(P1_01_LIVE_E2E_ENV.supabaseUrl)!,
      supabaseAnonKey: readEnv(P1_01_LIVE_E2E_ENV.supabaseAnonKey)!,
    },
    blockers: [],
  };
}
