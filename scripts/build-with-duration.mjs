import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started = Date.now();

const result = spawnSync("npm", ["run", "build:next"], {
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
