import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started = Date.now();

// validate:deployment already runs typecheck.
// Split build (compile + generate) keeps webpack peak RAM in one process; build-split.mjs sets
// NODE_OPTIONS per phase so compile can use Turbo-class heap (48 GB) while generate stays at 8 GB.
// Monolithic only when AIPIFY_SPLIT_BUILD=0. Turbopack: set AIPIFY_USE_TURBOPACK=1.
const useSplitBuild = process.env.AIPIFY_SPLIT_BUILD !== "0";
const useTurbopack = process.env.AIPIFY_USE_TURBOPACK === "1";

console.log(
  `[build] mode=${useSplitBuild ? "split" : "monolithic"} bundler=${useTurbopack ? "turbopack" : "webpack"} AIPIFY_SPLIT_BUILD=${process.env.AIPIFY_SPLIT_BUILD ?? "(unset)"}`
);

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
