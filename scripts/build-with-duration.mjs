import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started = Date.now();

// validate:deployment already runs typecheck.
// Split build (compile + generate) lowers peak RAM on Enhanced 16 GB. build-split.mjs copies
// middleware.js → proxy.js before generate (Next.js 16 proxy.ts rename). Monolithic only when
// AIPIFY_SPLIT_BUILD=0 (e.g. Turbo 60 GB with a single high-heap process).
const useSplitBuild = process.env.AIPIFY_SPLIT_BUILD !== "0";
const result = useSplitBuild
  ? spawnSync("node", ["scripts/build-split.mjs", "--from", "2"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    })
  : spawnSync("npm", ["run", "build:next"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });

const durationMs = Date.now() - started;

if (result.status === 0) {
  spawnSync("npx", ["--yes", "tsx", "scripts/record-build-duration.ts", String(durationMs)], {
    cwd: root,
    stdio: "inherit",
  });
}

process.exit(result.status ?? 1);
