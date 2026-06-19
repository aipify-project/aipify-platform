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
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/**
 * Next.js 16 compile phase renames `.next/server/proxy.js` → `middleware.js`.
 * Generate phase expects `proxy.js` to exist and re-runs the rename — split builds fail with ENOENT without this.
 */
function prepareProxyArtifactForGeneratePhase() {
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

const NODE_HEAP_COMPILE =
  process.env.AIPIFY_BUILD_HEAP_COMPILE ?? "--max-old-space-size=32768";
const NODE_HEAP_GENERATE =
  process.env.AIPIFY_BUILD_HEAP_GENERATE ?? "--max-old-space-size=16384";

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
    env: { NODE_OPTIONS: NODE_HEAP_COMPILE },
  },
  {
    name: "Static generation",
    cmd: "npx",
    args: ["next", "build", "--webpack", "--experimental-build-mode", "generate"],
    env: { NODE_OPTIONS: NODE_HEAP_GENERATE },
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
  if (phases[i].name === "Static generation") {
    prepareProxyArtifactForGeneratePhase();
  }
  runPhase(phases[i]);
}

console.log("\n✓ Split production build finished successfully.\n");
