#!/usr/bin/env npx tsx
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendBuildMemoryIncident } from "../lib/build-governance/build-memory";
import { runGovernanceScan } from "../lib/build-governance/validator";
import { writeRouteRegistryArtifact } from "../lib/build-governance/run-governance";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

console.log("=== Aipify deployment verification ===\n");

const scan = runGovernanceScan(root);

console.log("1/4 Route validation");
console.log(
  `   Routes ${scan.statistics.totalRoutes} · Critical ${scan.criticalCount} · Warnings ${scan.warningCount}`
);

if (!scan.passed) {
  for (const issue of scan.issues.filter((item) => item.severity === "critical")) {
    console.error(`   ✗ ${issue.message}${issue.filePath ? ` (${issue.filePath})` : ""}`);
  }
  appendBuildMemoryIncident(root, {
    issue: "Deployment blocked by route architecture violations",
    rootCause: scan.issues
      .filter((item) => item.severity === "critical")
      .map((item) => item.message)
      .slice(0, 3)
      .join("; "),
    fix: "Resolve critical route governance issues before production deployment",
    date: new Date().toISOString().slice(0, 10),
    affectedModules: ["build-governance"],
    resolution: "Deployment halted until violations are cleared",
  });
  console.error("\nDeployment blocked: critical route architecture violations.");
  process.exit(1);
}
console.log("   ✓ Route validation passed");

console.log("\n2/4 TypeScript validation");
try {
  execSync("npm run typecheck", { cwd: root, stdio: "inherit" });
  console.log("   ✓ TypeScript passed");
} catch {
  console.error("\nDeployment blocked: typecheck failed.");
  process.exit(1);
}

console.log("\n3/4 Import dependency scan");
const importIssues = scan.issues.filter(
  (issue) => issue.code === "api_barrel_import" || issue.code === "circular_import" || issue.code === "invalid_barrel_export"
);
const circularCritical = importIssues.filter((issue) => issue.severity === "critical");
if (circularCritical.length > 0) {
  for (const issue of circularCritical) {
    console.error(`   ✗ ${issue.message}`);
  }
  console.error("\nDeployment blocked: circular import violations.");
  process.exit(1);
}
if (importIssues.length > 0) {
  console.warn(`   ⚠ ${importIssues.length} import warnings (non-blocking)`);
} else {
  console.log("   ✓ No import dependency warnings");
}

console.log("\n4/4 Route registry artifact");
writeRouteRegistryArtifact(root);
console.log("   ✓ Route registry written");

console.log("\n=== Deployment verification passed ===\n");

if (process.argv.includes("--record-incident") && scan.warningCount > 0) {
  appendBuildMemoryIncident(root, {
    issue: "Route governance warnings during deployment verification",
    rootCause: "Architecture drift detected by Phase 431 scanner",
    fix: "Resolve warnings in route registry before next production promotion",
    date: new Date().toISOString().slice(0, 10),
    affectedModules: ["build-governance"],
    resolution: "Warnings logged; deployment allowed after critical checks passed",
  });
}
