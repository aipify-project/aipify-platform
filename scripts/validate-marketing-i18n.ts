#!/usr/bin/env npx tsx
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatMarketingLocaleIssues,
  validateMarketingLocaleCompleteness,
} from "../lib/marketing/validate-marketing-locale-completeness";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const result = validateMarketingLocaleCompleteness(root);

console.log("=== Marketing locale completeness ===\n");
console.log(formatMarketingLocaleIssues(result, 25));

if (!result.passed) {
  console.error("\nMarketing locale completeness check failed.");
  process.exit(1);
}

console.log("\n✓ All core marketing locales are complete.");
