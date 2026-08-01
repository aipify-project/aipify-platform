import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const register = path.join(root, "scripts", "register-strip-loader.mjs");
const tests = [
  "lib/app-portal/integrations/canonical-status.test.ts",
  "lib/app-portal/integrations/credential-crypto.test.ts",
];

let failed = false;
for (const rel of tests) {
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "--import", register, path.join(root, rel)],
    { stdio: "inherit", env: process.env }
  );
  if (result.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
