#!/usr/bin/env node
/**
 * Split production build — lowers peak memory vs one monolithic `next build`.
 *
 * Phase 1: TypeScript (tsc --noEmit)
 * Phase 2: Compile (webpack or turbopack via --experimental-build-mode compile)
 * Phase 3: Static generation (--experimental-build-mode generate)
 *
 * Heap is applied per phase as a direct `node --max-old-space-size=…` flag on the Next.js
 * process (not NODE_OPTIONS — npm/npx wrappers often strip env or spawn children that ignore it).
 * Set AIPIFY_BUILD_HEAP_COMPILE / AIPIFY_BUILD_HEAP_GENERATE in vercel.json build.env.
 *
 * Usage: node scripts/build-split.mjs
 *        node scripts/build-split.mjs --from 2   (skip typecheck + compile)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import v8 from "node:v8";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NEXT_BIN = path.join(root, "node_modules", "next", "dist", "bin", "next");

const useTurbopack = process.env.AIPIFY_USE_TURBOPACK === "1";
const bundlerFlag = useTurbopack ? "--turbo" : "--webpack";

/**
 * Next.js 16 compile phase renames `.next/server/proxy.js` → `middleware.js`.
 * Generate phase expects `proxy.js` to exist and re-runs the rename — split builds fail with ENOENT without this.
 * Turbopack keeps proxy.js; this only runs for webpack split builds.
 */
function prepareProxyArtifactForGeneratePhase() {
  if (useTurbopack) return;

  const serverDir = path.join(root, ".next", "server");
  const proxyJs = path.join(serverDir, "proxy.js");
  const middlewareJs = path.join(serverDir, "middleware.js");

  if (!fs.existsSync(proxyJs) && fs.existsSync(middlewareJs)) {
    fs.copyFileSync(middlewareJs, proxyJs);
    console.log("Prepared proxy.js for generate phase (Next.js 16 split-build workaround).");
  }

  const proxyNft = path.join(serverDir, "proxy.js.nft.json");
  const middlewareNft = path.join(serverDir, "middleware.js.nft.json");
  if (!fs.existsSync(proxyNft) && fs.existsSync(middlewareNft)) {
    const nft = JSON.parse(fs.readFileSync(middlewareNft, "utf8"));
    nft.files = nft.files.map((file) => (file === "middleware.js" ? "proxy.js" : file));
    fs.writeFileSync(proxyNft, JSON.stringify(nft));
  }
}

const DEFAULT_HEAP_COMPILE = "--max-old-space-size=40960";
const DEFAULT_HEAP_GENERATE = "--max-old-space-size=16384";

function parseHeapMb(nodeOptions) {
  const match = nodeOptions?.match(/--max-old-space-size=(\d+)/);
  return match ? Number(match[1]) : null;
}

/** Extract `--max-old-space-size=N` for direct `node` CLI (not NODE_OPTIONS). */
function heapCliArg(nodeOptions) {
  const match = nodeOptions?.match(/(--max-old-space-size=\d+)/);
  return match ? match[1] : null;
}

/** Log v8 heap_size_limit from a child `node` process with the same CLI heap flag. */
function verifyChildHeapLimit(phaseName, nodeOptions) {
  const cliArg = heapCliArg(nodeOptions);
  const requestedMb = parseHeapMb(nodeOptions);
  if (!cliArg || requestedMb == null) return;

  const script = `
    const limitMb = Math.round(require("node:v8").getHeapStatistics().heap_size_limit / 1024 / 1024);
    console.log("[build] ${phaseName} verified heap_size_limit_mb=" + limitMb + " (requested=${requestedMb})");
    if (limitMb < ${requestedMb} * 0.9) {
      console.warn("[build] WARNING: heap limit lower than requested — check node invocation");
      process.exitCode = 1;
    }
  `.trim();

  const result = spawnSync("node", [cliArg, "-e", script], {
    stdio: "inherit",
    cwd: root,
  });
  if (result.status !== 0) {
    console.warn(`[build] heap verification failed for ${phaseName} (non-fatal)`);
  }
}

/** Cap requested heap to physical RAM so Vercel Standard (8 GB) does not SIGKILL on overcommit. */
function capHeapToMachine(nodeOptions, maxMb) {
  const requested = parseHeapMb(nodeOptions);
  if (requested == null || requested <= maxMb) return nodeOptions;
  console.log(
    `[build] capping heap ${requested} MB → ${maxMb} MB (physical_ram=${Math.round(os.totalmem() / 1024 / 1024)} MB)`
  );
  return `--max-old-space-size=${maxMb}`;
}

function resolvePhaseHeaps() {
  const totalMb = Math.round(os.totalmem() / 1024 / 1024);
  // Native/webpack headroom: ~20 GB on Turbo, ~4 GB on Enhanced, ~2 GB on Standard.
  const compileNativeReserveMb = totalMb >= 50000 ? 20480 : totalMb >= 14000 ? 4096 : 2048;
  const maxCompileMb = Math.max(4096, totalMb - compileNativeReserveMb);
  const maxGenerateMb = Math.max(2048, Math.min(16384, totalMb - 4096));

  return {
    compile: capHeapToMachine(
      process.env.AIPIFY_BUILD_HEAP_COMPILE ?? DEFAULT_HEAP_COMPILE,
      maxCompileMb
    ),
    generate: capHeapToMachine(
      process.env.AIPIFY_BUILD_HEAP_GENERATE ?? DEFAULT_HEAP_GENERATE,
      maxGenerateMb
    ),
  };
}

const { compile: NODE_HEAP_COMPILE, generate: NODE_HEAP_GENERATE } = resolvePhaseHeaps();

function logPhaseEnv(phaseName, nodeOptions) {
  const heapMb = parseHeapMb(nodeOptions);
  const cliArg = heapCliArg(nodeOptions);
  console.log(
    `[build] ${phaseName} | bundler=${useTurbopack ? "turbopack" : "webpack"} | node ${cliArg ?? "(default heap)"} ${path.relative(root, NEXT_BIN)} | configured_heap_mb=${heapMb ?? "default"}`
  );
}

function logMachineContext() {
  const totalMb = Math.round(os.totalmem() / 1024 / 1024);
  const freeMb = Math.round(os.freemem() / 1024 / 1024);
  const parentHeapMb = Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024);
  const compileMb = parseHeapMb(NODE_HEAP_COMPILE);
  const generateMb = parseHeapMb(NODE_HEAP_GENERATE);
  const vercelMachine = process.env.VERCEL_BUILD_MACHINE_TYPE ?? "(unset)";
  const nativeHeadroomMb =
    compileMb != null ? Math.max(0, totalMb - compileMb) : null;

  console.log(
    `[build] machine context | total_ram_mb=${totalMb} free_ram_mb=${freeMb} parent_heap_limit_mb=${parentHeapMb} vercel_machine=${vercelMachine} compile_heap_mb=${compileMb ?? "default"} generate_heap_mb=${generateMb ?? "default"} native_headroom_mb=${nativeHeadroomMb ?? "n/a"} (physical_ram - compile_heap)`
  );
}

const fromArg = process.argv.find((a) => a.startsWith("--from"));
const fromPhase = fromArg
  ? Number(fromArg.split("=")[1] ?? process.argv[process.argv.indexOf(fromArg) + 1])
  : 1;

const phases = [
  {
    name: "TypeScript",
    cmd: "npm",
    args: ["run", "typecheck"],
  },
  {
    name: "Compile",
    kind: "next",
    heap: NODE_HEAP_COMPILE,
    args: ["build", bundlerFlag, "--experimental-build-mode", "compile"],
  },
  {
    name: "Static generation",
    kind: "next",
    heap: NODE_HEAP_GENERATE,
    args: ["build", bundlerFlag, "--experimental-build-mode", "generate"],
  },
];

function runPhase(phase) {
  if (phase.heap) {
    logPhaseEnv(phase.name, phase.heap);
    verifyChildHeapLimit(phase.name, phase.heap);
  }
  console.log(`\n${"=".repeat(60)}\n▶ Phase: ${phase.name}\n${"=".repeat(60)}\n`);
  const started = Date.now();

  let cmd;
  let args;
  let childEnv = process.env;

  if (phase.kind === "next") {
    const cliArg = heapCliArg(phase.heap);
    cmd = "node";
    args = [...(cliArg ? [cliArg] : []), NEXT_BIN, ...phase.args];
    // Do not rely on NODE_OPTIONS — direct CLI flag is the source of truth.
    const { NODE_OPTIONS: _ignored, ...envWithoutNodeOptions } = process.env;
    childEnv = envWithoutNodeOptions;
  } else {
    cmd = phase.cmd;
    args = phase.args;
  }

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: childEnv,
    cwd: root,
    shell: process.platform === "win32" && phase.kind !== "next",
  });
  const elapsed = ((Date.now() - started) / 1000 / 60).toFixed(1);
  if (result.status !== 0) {
    console.error(`\n✗ ${phase.name} failed after ${elapsed} min (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
  console.log(`\n✓ ${phase.name} completed in ${elapsed} min`);
}

console.log(
  `Split build starting (phases ${fromPhase}–${phases.length}, bundler=${useTurbopack ? "turbopack" : "webpack"})…`
);
logMachineContext();

for (let i = fromPhase - 1; i < phases.length; i++) {
  if (phases[i].name === "Static generation") {
    prepareProxyArtifactForGeneratePhase();
  }
  runPhase(phases[i]);
}

console.log("\n✓ Split production build finished successfully.\n");
