import fs from "node:fs";
import path from "node:path";

/** Frozen invariant — customer/pilot names are forbidden in Companion Core and generated artifacts. */
export const COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES = "forbidden" as const;

export const FORBIDDEN_CUSTOMER_PILOT_NAMES = [
  "unonight",
  "unonatt",
  "xentora",
] as const;

const ALLOWED_PLATFORM_TERMS = /\baipify(?:\s+group\s+as)?\b/gi;

export type CompanionCoreNameViolation = {
  file: string;
  forbidden_term: string;
};

function stripAllowedPlatformTerms(text: string): string {
  return text.replace(ALLOWED_PLATFORM_TERMS, "");
}

export function findForbiddenCustomerNamesInText(text: string): string[] {
  const sanitized = stripAllowedPlatformTerms(text).toLowerCase();
  const found = new Set<string>();
  for (const term of FORBIDDEN_CUSTOMER_PILOT_NAMES) {
    if (sanitized.includes(term)) found.add(term);
  }
  return [...found];
}

function walkFiles(dir: string, matcher: (name: string) => boolean, results: string[] = []): string[] {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, results);
      continue;
    }
    if (matcher(entry.name)) results.push(fullPath);
  }
  return results;
}

/** Production Companion Core sources — phase adapter tests may reference tenant adapters separately. */
export function listCompanionCoreSourceFiles(repoRoot: string): string[] {
  const runtimeRoot = path.join(repoRoot, "lib/companion-runtime");
  return walkFiles(runtimeRoot, (name) => name.endsWith(".ts") && !name.endsWith(".test.ts")).sort();
}

export function listCompanionCoreArtifactFiles(repoRoot: string): string[] {
  const artifactsRoot = path.join(repoRoot, "lib/companion-runtime/artifacts");
  return walkFiles(
    artifactsRoot,
    (name) => name.endsWith(".json") || name.endsWith(".md"),
  ).sort();
}

export function scanCompanionCoreForForbiddenCustomerNames(repoRoot: string): CompanionCoreNameViolation[] {
  const violations: CompanionCoreNameViolation[] = [];
  const files = [...listCompanionCoreSourceFiles(repoRoot), ...listCompanionCoreArtifactFiles(repoRoot)];

  for (const file of files) {
    if (
      file.endsWith("companion-core-customer-name-invariant.ts") ||
      file.endsWith("v1-runtime-certification.ts")
    ) {
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    for (const term of findForbiddenCustomerNamesInText(text)) {
      violations.push({ file, forbidden_term: term });
    }
  }

  return violations;
}

export function assertCompanionCoreCustomerNamesForbidden(repoRoot: string): true {
  const violations = scanCompanionCoreForForbiddenCustomerNames(repoRoot);
  if (violations.length > 0) {
    const sample = violations
      .slice(0, 12)
      .map((v) => `${path.relative(repoRoot, v.file)} (${v.forbidden_term})`)
      .join("\n  - ");
    throw new Error(
      `COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES=${COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES} — ` +
        `${violations.length} violation(s):\n  - ${sample}`,
    );
  }
  return true;
}
