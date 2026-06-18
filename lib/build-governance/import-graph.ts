import fs from "node:fs";
import path from "node:path";
import type { GovernanceIssue } from "./types";

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,]+from\s+)?["']([^"']+)["']/g;

function listTypeScriptFiles(dir: string, root: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      listTypeScriptFiles(full, root, out);
      continue;
    }
    if (/\.(ts|tsx|mts|cts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

function resolveImport(fromFile: string, specifier: string, projectRoot: string): string | null {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;

  const candidates: string[] = [];
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const base = path.join(projectRoot, rel);
    candidates.push(base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx"));
  } else {
    const base = path.resolve(path.dirname(fromFile), specifier);
    candidates.push(base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx"));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return path.normalize(candidate);
    }
  }
  return null;
}

function extractImports(filePath: string): string[] {
  const src = fs.readFileSync(filePath, "utf8");
  const imports: string[] = [];
  for (const match of src.matchAll(IMPORT_PATTERN)) {
    const spec = match[1];
    if (spec) imports.push(spec);
  }
  return imports;
}

function findCycleFrom(
  start: string,
  graph: Map<string, string[]>
): string[] | null {
  const stack: string[] = [];
  const visiting = new Set<string>();

  const dfs = (node: string): string[] | null => {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      return idx === -1 ? [node] : stack.slice(idx).concat(node);
    }
    visiting.add(node);
    stack.push(node);
    for (const next of graph.get(node) ?? []) {
      const cycle = dfs(next);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(node);
    return null;
  };

  return dfs(start);
}

function rel(projectRoot: string, filePath: string): string {
  return filePath.replace(`${projectRoot}/`, "").replace(/\\/g, "/");
}

export function scanImportGraphIssues(projectRoot: string): GovernanceIssue[] {
  const libRoot = path.join(projectRoot, "lib");
  const files = listTypeScriptFiles(libRoot, projectRoot);
  const graph = new Map<string, string[]>();

  for (const file of files) {
    const deps: string[] = [];
    for (const spec of extractImports(file)) {
      const resolved = resolveImport(file, spec, projectRoot);
      if (resolved && resolved.startsWith(libRoot)) deps.push(resolved);
    }
    graph.set(file, deps);
  }

  const issues: GovernanceIssue[] = [];
  const reported = new Set<string>();

  for (const file of files) {
    const cycle = findCycleFrom(file, graph);
    if (!cycle || cycle.length < 2) continue;
    const key = [...new Set(cycle.slice(0, -1))].sort().join("→");
    if (reported.has(key)) continue;
    reported.add(key);

    const uniqueCycle = [...new Set(cycle.slice(0, -1))];
    const cycleRel = uniqueCycle.map((item) => rel(projectRoot, item));
    issues.push({
      code: "circular_import",
      severity: "critical",
      message: `Circular import detected: ${cycleRel.join(" → ")}`,
      filePath: cycleRel[0],
      relatedPaths: cycleRel,
    });
  }

  for (const file of files) {
    if (!file.endsWith(`${path.sep}index.ts`) && !file.endsWith(`${path.sep}index.tsx`)) continue;
    const src = fs.readFileSync(file, "utf8");
    const dir = path.dirname(file);
    const selfName = path.basename(dir);

    for (const match of src.matchAll(/export\s+\*\s+from\s+["']([^"']+)["']/g)) {
      const target = resolveImport(file, match[1]!, projectRoot);
      if (!target) continue;
      const targetSrc = fs.readFileSync(target, "utf8");
      const barrelPath = rel(projectRoot, file);
      if (targetSrc.includes(`from "@/${path.relative(projectRoot, dir).replace(/\\/g, "/")}"`)) {
        issues.push({
          code: "invalid_barrel_export",
          severity: "warning",
          message: `Barrel ${barrelPath} re-exports module that imports back into ${selfName}`,
          filePath: barrelPath,
          relatedPaths: [rel(projectRoot, target)],
        });
      }
    }
  }

  return issues;
}
