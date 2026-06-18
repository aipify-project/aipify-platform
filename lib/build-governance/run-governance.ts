import fs from "node:fs";
import path from "node:path";
import { runGovernanceScan } from "./validator";

export function getProjectRoot(): string {
  return process.cwd();
}

export function runLocalGovernanceScan() {
  return runGovernanceScan(getProjectRoot());
}

export function writeRouteRegistryArtifact(projectRoot: string) {
  const scan = runGovernanceScan(projectRoot);
  const outDir = path.join(projectRoot, "build-governance");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "route-registry.json"),
    JSON.stringify(
      {
        generatedAt: scan.scannedAt,
        statistics: scan.statistics,
        routes: scan.routes,
        issues: scan.issues,
      },
      null,
      2
    )
  );
  return scan;
}

export function readLatestBuildDurationMs(projectRoot: string): number | null {
  const marker = path.join(projectRoot, "build-governance", "last-build.json");
  if (!fs.existsSync(marker)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(marker, "utf8")) as { durationMs?: number };
    return typeof parsed.durationMs === "number" ? parsed.durationMs : null;
  } catch {
    return null;
  }
}

export function writeBuildDurationMarker(projectRoot: string, durationMs: number) {
  const outDir = path.join(projectRoot, "build-governance");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "last-build.json"),
    JSON.stringify({ durationMs, recordedAt: new Date().toISOString() }, null, 2)
  );
}
