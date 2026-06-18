#!/usr/bin/env npx tsx
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeBuildDurationMarker } from "../lib/build-governance/run-governance";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const durationMs = Number(process.env.BUILD_DURATION_MS ?? process.argv[2] ?? 0);

if (durationMs > 0) {
  writeBuildDurationMarker(root, durationMs);
  console.log(`Recorded build duration: ${Math.round(durationMs / 1000)}s`);
}
