import fs from "node:fs";
import path from "node:path";
import { COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES } from "@/lib/companion-runtime/companion-core-customer-name-invariant";
import {
  buildForbiddenCustomerPilotNamePattern,
  loadForbiddenCustomerPilotNames,
} from "./forbidden-customer-pilot-names";

const ALLOWED_PLATFORM_TERMS = /\baipify(?:\s+group\s+as)?\b/gi;

export type CompanionCoreNameViolation = {
  file: string;
  forbidden_term: string;
  kind: "content" | "path";
};

function stripAllowedPlatformTerms(text: string): string {
  return text.replace(ALLOWED_PLATFORM_TERMS, "");
}

export function findForbiddenCustomerNamesInText(
  text: string,
  forbiddenTerms: readonly string[],
): string[] {
  const sanitized = stripAllowedPlatformTerms(text).toLowerCase();
  const found = new Set<string>();
  for (const term of forbiddenTerms) {
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

function scanPathComponents(relativePath: string, forbiddenTerms: readonly string[]): string[] {
  const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
  const found = new Set<string>();
  for (const term of forbiddenTerms) {
    if (normalized.includes(term)) found.add(term);
  }
  return [...found];
}

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
  const forbiddenTerms = loadForbiddenCustomerPilotNames(repoRoot);
  const violations: CompanionCoreNameViolation[] = [];

  for (const file of listCompanionCoreTypeScriptFiles(repoRoot)) {
    const relative = path.relative(repoRoot, file);
    for (const term of scanPathComponents(relative, forbiddenTerms)) {
      violations.push({ file: relative, forbidden_term: term, kind: "path" });
    }
    const text = fs.readFileSync(file, "utf8");
    for (const term of findForbiddenCustomerNamesInText(text, forbiddenTerms)) {
      violations.push({ file: relative, forbidden_term: term, kind: "content" });
    }
  }

  for (const file of listCompanionCoreArtifactFiles(repoRoot)) {
    const relative = path.relative(repoRoot, file);
    for (const term of scanPathComponents(relative, forbiddenTerms)) {
      violations.push({ file: relative, forbidden_term: term, kind: "path" });
    }
    const text = fs.readFileSync(file, "utf8");
    for (const term of findForbiddenCustomerNamesInText(text, forbiddenTerms)) {
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

export function buildForbiddenCustomerPilotNamePatternForRepo(repoRoot: string): RegExp {
  return buildForbiddenCustomerPilotNamePattern(loadForbiddenCustomerPilotNames(repoRoot));
}
