#!/usr/bin/env node
/**
 * Split production build — lowers peak memory vs one monolithic `next build`.
 *
 * Phase 1: TypeScript (tsc --noEmit)
 * Phase 2: Webpack compile only (--experimental-build-mode compile)
 * Phase 3: Static generation (--experimental-build-mode generate)
 *
 * Usage: node scripts/build-split.mjs
 *        node scripts/build-split.mjs --from 2   (skip typecheck + compile)
 */
import { spawnSync } from "node:child_process";

const NODE_HEAP = process.env.NODE_OPTIONS?.includes("max-old-space-size")
  ? process.env.NODE_OPTIONS
  : "--max-old-space-size=14336";

const fromArg = process.argv.find((a) => a.startsWith("--from"));
const fromPhase = fromArg ? Number(fromArg.split("=")[1] ?? process.argv[process.argv.indexOf(fromArg) + 1]) : 1;

const phases = [
  {
    name: "TypeScript",
    cmd: "npm",
    args: ["run", "typecheck"],
    env: {},
  },
  {
    name: "Webpack compile",
    cmd: "npx",
    args: ["next", "build", "--webpack", "--experimental-build-mode", "compile"],
    env: { NODE_OPTIONS: NODE_HEAP },
  },
  {
    name: "Static generation",
    cmd: "npx",
    args: ["next", "build", "--webpack", "--experimental-build-mode", "generate"],
    env: { NODE_OPTIONS: NODE_HEAP },
  },
];

function runPhase(phase) {
  console.log(`\n${"=".repeat(60)}\n▶ Phase: ${phase.name}\n${"=".repeat(60)}\n`);
  const started = Date.now();
  const result = spawnSync(phase.cmd, phase.args, {
    stdio: "inherit",
    env: { ...process.env, ...phase.env },
    shell: process.platform === "win32",
  });
  const elapsed = ((Date.now() - started) / 1000 / 60).toFixed(1);
  if (result.status !== 0) {
    console.error(`\n✗ ${phase.name} failed after ${elapsed} min (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
  console.log(`\n✓ ${phase.name} completed in ${elapsed} min`);
}

console.log(`Split build starting (phases ${fromPhase}–${phases.length})…`);

for (let i = fromPhase - 1; i < phases.length; i++) {
  runPhase(phases[i]);
}

console.log("\n✓ Split production build finished successfully.\n");
