import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const source = readFileSync(join(ROOT, "lib/polling/use-polling-task.ts"), "utf8");

test("usePollingTask keeps execute on a ref and omits it from the timer effect deps", () => {
  assert.match(source, /executeRef\.current = execute/);
  assert.match(source, /ok = await executeRef\.current\(\)/);
  assert.match(source, /Intentionally omit `execute`/);
  // Timer effect dependency list must not restart when callers pass inline lambdas.
  assert.doesNotMatch(
    source,
    /return \(\) => \{\s*cancelled = true;[\s\S]*?\},\s*\[[^\]]*execute[^\]]*\]\s*\);/,
  );
});

test("usePollingTask refuses overlapping execute while a prior poll is in flight", () => {
  assert.match(source, /let inFlight = false/);
  assert.match(source, /if \(cancelled \|\| inFlight\) return/);
  assert.match(source, /inFlight = true/);
  assert.match(source, /inFlight = false/);
});
