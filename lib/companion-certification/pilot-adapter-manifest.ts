import fs from "node:fs";
import path from "node:path";

export type PilotAdapterCertificationConfig = {
  pilot_adapter_test_roots: readonly string[];
  legacy_directory_module_id: string;
};

const CONFIG_BASENAME = "pilot-adapter-manifest.json";

export function loadPilotAdapterCertificationConfig(repoRoot: string): PilotAdapterCertificationConfig {
  const configPath = path.join(repoRoot, "lib/companion-certification", CONFIG_BASENAME);
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as PilotAdapterCertificationConfig;
  if (!Array.isArray(raw.pilot_adapter_test_roots) || raw.pilot_adapter_test_roots.length === 0) {
    throw new Error(`Invalid pilot adapter certification config: ${configPath}`);
  }
  if (!raw.legacy_directory_module_id?.trim()) {
    throw new Error(`Missing legacy_directory_module_id in ${configPath}`);
  }
  return raw;
}

export function resolvePrimaryPilotAdapterTestsRoot(repoRoot: string): string {
  return loadPilotAdapterCertificationConfig(repoRoot).pilot_adapter_test_roots[0]!;
}
