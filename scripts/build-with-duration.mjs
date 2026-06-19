import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started = Date.now();

// validate:deployment already runs typecheck — compile + generate in separate processes
// to lower peak RAM during Vercel Enhanced (16 GB) page-data collection.
const result = spawnSync("node", ["scripts/build-split.mjs", "--from", "2"], {
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
