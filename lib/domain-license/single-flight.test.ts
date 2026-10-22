import assert from "node:assert/strict";
import { createSingleFlight } from "./single-flight";

async function main() {
  const run = createSingleFlight();
  let started = 0;
  const first = run(async () => {
    started += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return "ok";
  });
  const second = await run(async () => {
    started += 1;
    return "again";
  });
  assert.equal(second, undefined);
  assert.equal(await first, "ok");
  assert.equal(started, 1);
  assert.equal(await run(async () => "later"), "later");
  console.log("domain-license/single-flight.test.ts: OK");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
