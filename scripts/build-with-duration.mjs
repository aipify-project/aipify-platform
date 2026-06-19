import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NEXT_BIN = path.join(root, "node_modules", "next", "dist", "bin", "next");
const started = Date.now();

// validate:deployment already runs typecheck.
// Split build (compile + generate) keeps webpack peak RAM in one process; build-split.mjs passes
// --max-old-space-size directly to the Next.js node process (not NODE_OPTIONS — npx/npm strip it).
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
  : (() => {
      const heap =
        process.env.AIPIFY_BUILD_HEAP_COMPILE ?? "--max-old-space-size=40960";
      const match = heap.match(/(--max-old-space-size=\d+)/);
      const cliArg = match?.[1];
      const { NODE_OPTIONS: _ignored, ...envWithoutNodeOptions } = process.env;
      return spawnSync(
        "node",
        [...(cliArg ? [cliArg] : []), NEXT_BIN, "build", "--webpack"],
        { cwd: root, stdio: "inherit", env: envWithoutNodeOptions }
      );
    })();

const durationMs = Date.now() - started;

if (result.status === 0) {
  spawnSync("npx", ["--yes", "tsx", "scripts/record-build-duration.ts", String(durationMs)], {
    cwd: root,
    stdio: "inherit",
  });
}

process.exit(result.status ?? 1);
