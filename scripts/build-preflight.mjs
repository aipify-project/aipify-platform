#!/usr/bin/env node
/**
 * Read-only local gate before an Aipify production build.
 * Not invoked by `npm run build` or Vercel. It does not start Next, change env, or delete files.
 *
 * Units:
 * - Data Available: KiB from `df -k /System/Volumes/Data` (1024-byte blocks).
 * - Swap used: MB as printed by `sysctl vm.swapusage` (M = the printed number, G = number × 1024).
 * - Free RAM: MiB from `vm_stat` Pages free × page size / 1 048 576. Purgeable pages are not counted.
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DISK_BLOCK_BELOW_KIB = 16_777_216;
export const DISK_PASS_AT_KIB = 31_457_280;
export const SWAP_BLOCK_ABOVE_MB = 8192;
export const RAM_BLOCK_BELOW_MIB = 12_288;

const DF_ARGS = ["-k", "/System/Volumes/Data"];
const SWAP_ARGS = ["vm.swapusage"];
const VM_STAT_ARGS = [];
const PS_ARGS = ["-ax", "-o", "pid=,command="];

export function parseDfAvailableKiB(output) {
  const lines = String(output ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const header = lines[0]?.split(/\s+/) ?? [];
  const availableIndex = header.indexOf("Available");
  const dataLine = lines.find((line, index) => index > 0 && /\s/.test(line));
  if (availableIndex < 0 || !dataLine) return { ok: false, reason: "df output has no Available column" };
  const columns = dataLine.split(/\s+/);
  const raw = columns[availableIndex];
  if (!/^\d+$/.test(raw ?? "")) return { ok: false, reason: "df Available is not an integer KiB value" };
  return { ok: true, kib: Number(raw) };
}

export function parseSwapUsedMb(output) {
  const match = String(output ?? "").match(/used\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*([KMG])\b/i);
  if (!match) return { ok: false, reason: "sysctl vm.swapusage has no used size" };
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return { ok: false, reason: "swap used is not a number" };
  const unit = match[2].toUpperCase();
  const mb = unit === "G" ? value * 1024 : unit === "M" ? value : value / 1024;
  return { ok: true, mb };
}

export function parseFreeRamMiB(output) {
  const text = String(output ?? "");
  const pageSize = text.match(/page size of (\d+) bytes/i);
  const pagesFree = text.match(/Pages free:\s+([0-9]+)\.?/i);
  if (!pageSize || !pagesFree) return { ok: false, reason: "vm_stat is missing page size or Pages free" };
  const bytes = Number(pageSize[1]) * Number(pagesFree[1]);
  if (!Number.isSafeInteger(bytes) || bytes < 0) return { ok: false, reason: "vm_stat free RAM is not a safe byte count" };
  return { ok: true, mib: Math.floor(bytes / 1_048_576) };
}

export function findOtherNextBuild(processLines, selfPid) {
  if (!Array.isArray(processLines)) return { ok: false, reason: "process list is missing" };
  if (processLines.length === 0) return { ok: false, reason: "process list is empty" };
  const matches = [];
  for (const line of processLines) {
    const text = String(line).trim();
    if (!text) continue;
    const pidMatch = text.match(/^(\d+)\s+(.*)$/);
    if (!pidMatch) return { ok: false, reason: "process list line has no pid" };
    const pid = Number(pidMatch[1]);
    const command = pidMatch[2];
    if (pid === selfPid || command.includes("build-preflight")) continue;
    if (isNextBuildCommand(command)) matches.push(text);
  }
  return { ok: true, found: matches.length > 0, evidence: matches };
}

function isNextBuildCommand(command) {
  return (
    /(?:^|[\s/])next\s+build(?:\s|$)/.test(command) ||
    /next\/dist\/bin\/next\s+build(?:\s|$)/.test(command) ||
    /\.bin\/next\s+build(?:\s|$)/.test(command)
  );
}

export function decide(input) {
  const reasons = [];
  if (!input.disk?.ok) reasons.push(input.disk?.reason ?? "disk measurement failed");
  if (!input.swap?.ok) reasons.push(input.swap?.reason ?? "swap measurement failed");
  if (!input.ram?.ok) reasons.push(input.ram?.reason ?? "RAM measurement failed");
  if (!input.builds?.ok) reasons.push(input.builds?.reason ?? "process inspection failed");
  else if (input.builds.found) reasons.push("another local next build is running");

  if (input.disk?.ok && input.disk.kib < DISK_BLOCK_BELOW_KIB) {
    reasons.push(`Data Available ${input.disk.kib} KiB is below ${DISK_BLOCK_BELOW_KIB} KiB`);
  }
  if (input.swap?.ok && input.swap.mb > SWAP_BLOCK_ABOVE_MB) {
    reasons.push(`swap used ${input.swap.mb} MB is above ${SWAP_BLOCK_ABOVE_MB} MB`);
  }
  if (input.ram?.ok && input.ram.mib < RAM_BLOCK_BELOW_MIB) {
    reasons.push(`free RAM ${input.ram.mib} MiB is below ${RAM_BLOCK_BELOW_MIB} MiB`);
  }

  if (reasons.length > 0) return { level: "BLOCK", exitCode: 1, reasons };
  if (input.disk.kib < DISK_PASS_AT_KIB) {
    return {
      level: "WARN",
      exitCode: 0,
      reasons: [`Data Available ${input.disk.kib} KiB is below ${DISK_PASS_AT_KIB} KiB`],
    };
  }
  return { level: "PASS", exitCode: 0, reasons: [] };
}

export function formatReport(result, input) {
  const disk = input.disk?.ok ? String(input.disk.kib) : "unavailable";
  const swap = input.swap?.ok ? String(input.swap.mb) : "unavailable";
  const ram = input.ram?.ok ? String(input.ram.mib) : "unavailable";
  const build = !input.builds?.ok ? "unknown" : input.builds.found ? "yes" : "no";
  const lines = [
    `PREFLIGHT ${result.level}`,
    `disk_available_kib=${disk} block_below_kib=${DISK_BLOCK_BELOW_KIB} pass_at_kib=${DISK_PASS_AT_KIB}`,
    `swap_used_mb=${swap} block_above_mb=${SWAP_BLOCK_ABOVE_MB}`,
    `ram_free_mib=${ram} block_below_mib=${RAM_BLOCK_BELOW_MIB}`,
    `other_next_build=${build}`,
    "reasons:",
    ...(result.reasons.length ? result.reasons.map((reason) => `- ${reason}`) : ["- none"]),
  ];
  return lines.join("\n");
}

function runCapture(command, args) {
  try {
    return { ok: true, output: execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) };
  } catch (error) {
    const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr ?? "") : "";
    return { ok: false, output: stderr || String(error) };
  }
}

export function measure(env = process) {
  const diskRun = runCapture("df", DF_ARGS);
  const swapRun = runCapture("sysctl", SWAP_ARGS);
  const ramRun = runCapture("vm_stat", VM_STAT_ARGS);
  const psRun = runCapture("ps", PS_ARGS);
  const processLines = psRun.ok ? psRun.output.split(/\r?\n/).filter((line) => line.trim()) : [];
  return {
    disk: diskRun.ok ? parseDfAvailableKiB(diskRun.output) : { ok: false, reason: "df failed" },
    swap: swapRun.ok ? parseSwapUsedMb(swapRun.output) : { ok: false, reason: "sysctl vm.swapusage failed" },
    ram: ramRun.ok ? parseFreeRamMiB(ramRun.output) : { ok: false, reason: "vm_stat failed" },
    builds: psRun.ok ? findOtherNextBuild(processLines, env.pid) : { ok: false, reason: "ps failed" },
  };
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const input = measure();
  const result = decide(input);
  console.log(formatReport(result, input));
  process.exit(result.exitCode);
}
