import fs from "node:fs";
import path from "node:path";
import { FORBIDDEN_CUSTOMER_PILOT_NAMES } from "./companion-forbidden-customer-pilot-names";

/** Frozen invariant — customer/pilot names are forbidden in Companion Core and generated artifacts. */
export const COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES = "forbidden" as const;

export { FORBIDDEN_CUSTOMER_PILOT_NAMES };

const ALLOWED_PLATFORM_TERMS = /\baipify(?:\s+group\s+as)?\b/gi;

/** Files excluded from content scan — they define the forbidden list only. */
const CONTENT_SCAN_EXCLUDED_BASENAMES = new Set([
  "companion-forbidden-customer-pilot-names.ts",
  "companion-core-customer-name-invariant.ts",
]);

export type CompanionCoreNameViolation = {
  file: string;
  forbidden_term: string;
  kind: "content" | "path";
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

function scanPathComponents(relativePath: string): string[] {
  const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
  const found = new Set<string>();
  for (const term of FORBIDDEN_CUSTOMER_PILOT_NAMES) {
    if (normalized.includes(term)) found.add(term);
  }
  return [...found];
}

/** All Companion Core TypeScript sources including tests and fixtures. */
export function listCompanionCoreTypeScriptFiles(repoRoot: string): string[] {
  const runtimeRoot = path.join(repoRoot, "lib/companion-runtime");
  return walkFiles(runtimeRoot, (name) => name.endsWith(".ts")).sort();
}

export function listCompanionCoreArtifactFiles(repoRoot: string): string[] {
  const artifactsRoot = path.join(repoRoot, "lib/companion-runtime/artifacts");
  const auditRoot = path.join(repoRoot, "COMPANION_FOUNDATION_COVERAGE_AUDIT.md");
  const files = walkFiles(
    artifactsRoot,
    (name) => name.endsWith(".json") || name.endsWith(".md"),
  );
  if (fs.existsSync(auditRoot)) files.push(auditRoot);
  return files.sort();
}

export function scanCompanionCoreForForbiddenCustomerNames(repoRoot: string): CompanionCoreNameViolation[] {
  const violations: CompanionCoreNameViolation[] = [];

  for (const file of listCompanionCoreTypeScriptFiles(repoRoot)) {
    const relative = path.relative(repoRoot, file);
    const basename = path.basename(file);

    for (const term of scanPathComponents(relative)) {
      violations.push({ file: relative, forbidden_term: term, kind: "path" });
    }

    if (CONTENT_SCAN_EXCLUDED_BASENAMES.has(basename)) continue;

    const text = fs.readFileSync(file, "utf8");
    for (const term of findForbiddenCustomerNamesInText(text)) {
      violations.push({ file: relative, forbidden_term: term, kind: "content" });
    }
  }

  for (const file of listCompanionCoreArtifactFiles(repoRoot)) {
    const relative = path.relative(repoRoot, file);
    for (const term of scanPathComponents(relative)) {
      violations.push({ file: relative, forbidden_term: term, kind: "path" });
    }
    const text = fs.readFileSync(file, "utf8");
    for (const term of findForbiddenCustomerNamesInText(text)) {
      violations.push({ file: relative, forbidden_term: term, kind: "content" });
    }
  }

  return violations;
}

export function assertCompanionCoreCustomerNamesForbidden(repoRoot: string): true {
  const violations = scanCompanionCoreForForbiddenCustomerNames(repoRoot);
  if (violations.length > 0) {
    const sample = violations
      .slice(0, 16)
      .map((v) => `${v.file} [${v.kind}] (${v.forbidden_term})`)
      .join("\n  - ");
    throw new Error(
      `COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES=${COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES} — ` +
        `${violations.length} violation(s):\n  - ${sample}`,
    );
  }
  return true;
}

/** @deprecated use listCompanionCoreTypeScriptFiles */
export function listCompanionCoreSourceFiles(repoRoot: string): string[] {
  return listCompanionCoreTypeScriptFiles(repoRoot).filter((file) => !file.endsWith(".test.ts"));
}
