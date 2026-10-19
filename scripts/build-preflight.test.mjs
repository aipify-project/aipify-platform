import assert from "node:assert/strict";
import test from "node:test";
import {
  DISK_BLOCK_BELOW_KIB,
  DISK_PASS_AT_KIB,
  RAM_BLOCK_BELOW_MIB,
  SWAP_BLOCK_ABOVE_MB,
  decide,
  findOtherNextBuild,
  parseDfAvailableKiB,
  parseFreeRamMiB,
  parseSwapUsedMb,
} from "./build-preflight.mjs";

const DF = `Filesystem 1024-blocks Used Available Capacity iused ifree %iused Mounted on
/dev/disk1s5 488245284 1000 AVAILABLE_KIB 95% 1 1 1% /System/Volumes/Data
`;

function df(kib) {
  return parseDfAvailableKiB(DF.replace("AVAILABLE_KIB", String(kib)));
}

function vmStat(pagesFree, pageSize = 4096) {
  return parseFreeRamMiB(`Mach Virtual Memory Statistics: (page size of ${pageSize} bytes)
Pages free: ${pagesFree}.
`);
}

function input({ kib, swap = "100.00M", pagesFree = 4_000_000, builds, ram }) {
  return {
    disk: df(kib),
    swap: parseSwapUsedMb(`vm.swapusage: total = 1024.00M used = ${swap} free = 1.00M (encrypted)`),
    ram: ram ?? vmStat(pagesFree),
    builds: builds ?? { ok: true, found: false, evidence: [] },
  };
}

test("df reads the Available column as KiB", () => {
  assert.deepEqual(df(16_777_216), { ok: true, kib: 16_777_216 });
  assert.equal(parseDfAvailableKiB("nope").ok, false);
  assert.equal(parseDfAvailableKiB("Filesystem Available\n/dev/disk1s5 not-a-number").ok, false);
});

test("swap accepts M, G and K and rejects a missing unit", () => {
  assert.equal(parseSwapUsedMb("used = 8192.00M").mb, 8192);
  assert.equal(parseSwapUsedMb("used = 1.50G").mb, 1536);
  assert.equal(parseSwapUsedMb("used = 2048K").mb, 2);
  assert.equal(parseSwapUsedMb("used = 12").ok, false);
  assert.equal(parseSwapUsedMb("used = 10.5X").ok, false);
});

test("free RAM is Pages free times page size in MiB", () => {
  assert.equal(vmStat(262_144).mib, 1024);
  assert.equal(vmStat(1, 4096).mib, 0);
  assert.equal(parseFreeRamMiB("Pages free: 10.").ok, false);
});

test("boundary values block only when strictly past the limit", () => {
  assert.equal(decide(input({ kib: DISK_BLOCK_BELOW_KIB, swap: `${SWAP_BLOCK_ABOVE_MB}.00M` })).level, "WARN");
  assert.equal(decide(input({ kib: DISK_BLOCK_BELOW_KIB - 1 })).level, "BLOCK");
  assert.equal(decide(input({ kib: DISK_PASS_AT_KIB, swap: `${SWAP_BLOCK_ABOVE_MB}.01M` })).level, "BLOCK");
  assert.equal(
    decide(input({ kib: DISK_PASS_AT_KIB, ram: { ok: true, mib: RAM_BLOCK_BELOW_MIB - 1 } })).level,
    "BLOCK",
  );
  assert.equal(decide(input({ kib: DISK_PASS_AT_KIB, ram: { ok: true, mib: RAM_BLOCK_BELOW_MIB } })).level, "PASS");
});

test("WARN is the band between the block floor and 30 GiB", () => {
  const result = decide(input({ kib: DISK_PASS_AT_KIB - 1 }));
  assert.equal(result.level, "WARN");
  assert.equal(result.exitCode, 0);
  assert.equal(decide(input({ kib: DISK_PASS_AT_KIB })).level, "PASS");
});

test("missing measurements and another next build block", () => {
  const broken = input({ kib: DISK_PASS_AT_KIB });
  broken.disk = { ok: false, reason: "df failed" };
  assert.equal(decide(broken).level, "BLOCK");
  const building = input({
    kib: DISK_PASS_AT_KIB,
    builds: { ok: true, found: true, evidence: ["9 node next build"] },
  });
  assert.match(decide(building).reasons.join("\n"), /another local next build/);
  assert.equal(decide(building).exitCode, 1);
});

test("the preflight command is not treated as next build", () => {
  const lines = [
    "10 node scripts/build-preflight.mjs",
    "11 npm run build:preflight",
    `${process.pid} node scripts/build-preflight.mjs --note next build`,
    "12 node node_modules/next/dist/bin/next dev -p 3001",
  ];
  const quiet = findOtherNextBuild(lines, process.pid);
  assert.equal(quiet.ok, true);
  assert.equal(quiet.found, false);
  const busy = findOtherNextBuild(
    [...lines, "13 node node_modules/next/dist/bin/next build --webpack"],
    process.pid,
  );
  assert.equal(busy.found, true);
  assert.equal(findOtherNextBuild(["not a process line"], 1).ok, false);
  assert.equal(findOtherNextBuild([], 1).ok, false);
});
