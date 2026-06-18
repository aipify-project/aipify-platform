#!/usr/bin/env npx tsx
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runGovernanceScan } from "../lib/build-governance/validator";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const warnOnly = process.argv.includes("--warn-only");

const result = runGovernanceScan(root);

console.log(`Route governance scan @ ${result.scannedAt}`);
console.log(
  `Routes: ${result.statistics.totalRoutes} · API: ${result.statistics.apiRoutes} · Dynamic: ${result.statistics.dynamicRoutes}`
);
console.log(`Critical: ${result.criticalCount} · Warnings: ${result.warningCount}`);

for (const issue of result.issues) {
  const prefix = issue.severity === "critical" ? "ERROR" : "WARN";
  console.log(`${prefix} [${issue.code}] ${issue.message}`);
  if (issue.filePath) console.log(`  → ${issue.filePath}`);
  if (issue.relatedPaths?.length) {
    for (const related of issue.relatedPaths) console.log(`  · ${related}`);
  }
}

if (result.criticalCount > 0 && !warnOnly) {
  process.exit(1);
}

if (result.warningCount > 0 && !warnOnly) {
  console.log("\nWarnings detected. Use --warn-only to allow exit 0 during development.");
}

process.exit(0);
