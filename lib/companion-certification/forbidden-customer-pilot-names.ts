import fs from "node:fs";
import path from "node:path";

export type ForbiddenCustomerPilotNamesConfig = {
  forbidden_customer_pilot_names: readonly string[];
};

const CONFIG_BASENAME = "forbidden-customer-pilot-names.json";

export function resolveForbiddenCustomerPilotNamesConfigPath(repoRoot: string): string {
  return path.join(repoRoot, "lib/companion-certification", CONFIG_BASENAME);
}

export function loadForbiddenCustomerPilotNames(repoRoot: string): readonly string[] {
  const configPath = resolveForbiddenCustomerPilotNamesConfigPath(repoRoot);
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as ForbiddenCustomerPilotNamesConfig;
  const names = raw.forbidden_customer_pilot_names;
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error(`Invalid forbidden customer pilot names config: ${configPath}`);
  }
  return names;
}

export function buildForbiddenCustomerPilotNamePattern(names: readonly string[]): RegExp {
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(?:${escaped.join("|")})\\b`, "i");
}
