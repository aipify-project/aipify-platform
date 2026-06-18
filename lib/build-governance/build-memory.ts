import fs from "node:fs";
import path from "node:path";
import type { BuildMemoryIncident } from "./types";

const BUILD_MEMORY_PATH = "docs/BUILD_MEMORY.md";

export function appendBuildMemoryIncident(
  projectRoot: string,
  incident: BuildMemoryIncident
): void {
  const target = path.join(projectRoot, BUILD_MEMORY_PATH);
  const block = [
    "",
    `### ${incident.date} — ${incident.issue}`,
    "",
    "| Field | Detail |",
    "|-------|--------|",
    `| **Issue** | ${incident.issue} |`,
    `| **Root cause** | ${incident.rootCause} |`,
    `| **Fix** | ${incident.fix} |`,
    `| **Affected modules** | ${incident.affectedModules.join(", ")} |`,
    `| **Resolution** | ${incident.resolution} |`,
    "",
  ].join("\n");

  if (!fs.existsSync(target)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(
      target,
      `# Aipify Build Memory\n\n## Incidents\n${block}`
    );
    return;
  }

  const existing = fs.readFileSync(target, "utf8");
  if (existing.includes(`### ${incident.date} — ${incident.issue}`)) {
    return;
  }

  if (existing.includes("## Incidents")) {
    fs.writeFileSync(target, existing.replace("## Incidents", `## Incidents${block}`));
    return;
  }

  fs.writeFileSync(target, `${existing.trim()}\n\n## Incidents${block}\n`);
}
