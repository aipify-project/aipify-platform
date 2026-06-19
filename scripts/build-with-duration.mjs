import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started = Date.now();

// validate:deployment already runs typecheck.
// Split build (compile + generate) lowers peak RAM on Enhanced 16 GB, but breaks Next.js 16
// proxy.ts handling — generate expects .next/server/proxy.js from compile, which may be missing.
// On Vercel Turbo (60 GB) use a single monolithic webpack build unless AIPIFY_SPLIT_BUILD=1.
const useSplitBuild = process.env.AIPIFY_SPLIT_BUILD === "1";
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
