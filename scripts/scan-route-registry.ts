#!/usr/bin/env npx tsx
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeRouteRegistryArtifact } from "../lib/build-governance/run-governance";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scan = writeRouteRegistryArtifact(root);

console.log(`Route registry written to build-governance/route-registry.json`);
console.log(`Total routes: ${scan.statistics.totalRoutes}`);
