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

const P1_LIVE_E2E_PRIORITY_ENV_KEYS = [
  P1_01_LIVE_E2E_ENV.enabled,
  P1_01_LIVE_E2E_ENV.environment,
  P1_01_LIVE_E2E_ENV.email,
  P1_01_LIVE_E2E_ENV.password,
  P1_01_LIVE_E2E_ENV.isolationEmail,
  P1_01_LIVE_E2E_ENV.isolationPassword,
  P1_01_LIVE_E2E_ENV.baseUrl,
  P1_01_LIVE_E2E_ENV.organizationRef,
  P1_01_LIVE_E2E_ENV.supabaseUrl,
  P1_01_LIVE_E2E_ENV.supabaseAnonKey,
] as const;

/** Server-only vars used by live certification — loaded from `.env.local` / `.env`, never committed. */
const P1_LIVE_E2E_SERVER_ENV_KEYS = ["CRON_SECRET", "SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function parseEnvFile(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) return {};
  const parsed: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) parsed[key] = value;
  }
  return parsed;
}

/** Load APP + Supabase env from `.env.local` first, then `.env` — same vars the APP uses at runtime. */
export function loadP1LiveE2eEnvFiles(repoRoot = process.cwd()): void {
  const localEnv = parseEnvFile(path.join(repoRoot, ".env.local"));
  const sharedEnv = parseEnvFile(path.join(repoRoot, ".env"));

  for (const key of P1_LIVE_E2E_PRIORITY_ENV_KEYS) {
    const value = localEnv[key] ?? sharedEnv[key];
    if (value?.trim() && !process.env[key]?.trim()) {
      process.env[key] = value.trim();
    }
  }

  for (const key of P1_LIVE_E2E_SERVER_ENV_KEYS) {
    const value = localEnv[key] ?? sharedEnv[key];
    if (value?.trim()) {
      process.env[key] = value.trim();
    }
  }

  for (const [key, value] of Object.entries(localEnv)) {
    if (!process.env[key]?.trim() && value.trim()) {
      process.env[key] = value.trim();
    }
  }

  for (const [key, value] of Object.entries(sharedEnv)) {
    if (!process.env[key]?.trim() && value.trim()) {
      process.env[key] = value.trim();
    }
  }
}

export function normalizeP1LiveE2eEmail(email: string): string {
  return email.trim().toLowerCase();
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

  const isolationEmail = readEnv(P1_01_LIVE_E2E_ENV.isolationEmail);

  return {
    config: {
      enabled: true,
      environment: parseEnvironmentName(readEnv(P1_01_LIVE_E2E_ENV.environment)),
      email: normalizeP1LiveE2eEmail(readEnv(P1_01_LIVE_E2E_ENV.email)!),
      password: readEnv(P1_01_LIVE_E2E_ENV.password)!,
      isolationEmail: isolationEmail ? normalizeP1LiveE2eEmail(isolationEmail) : null,
      isolationPassword: readEnv(P1_01_LIVE_E2E_ENV.isolationPassword),
      baseUrl: readEnv(P1_01_LIVE_E2E_ENV.baseUrl),
      organizationRef: readEnv(P1_01_LIVE_E2E_ENV.organizationRef),
      supabaseUrl: readEnv(P1_01_LIVE_E2E_ENV.supabaseUrl)!,
      supabaseAnonKey: readEnv(P1_01_LIVE_E2E_ENV.supabaseAnonKey)!,
    },
    blockers: [],
  };
}
