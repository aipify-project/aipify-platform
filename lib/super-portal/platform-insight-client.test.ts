import assert from "node:assert/strict";
import {
  PLATFORM_SUPER_ADMIN_INSIGHT_FETCH_TIMEOUT_MS,
  armInsightFetchTimeout,
  isAbortError,
} from "@/lib/super-portal/platform-insight-client";
import { AIPIFY_LOADER_DEFAULT_LABEL } from "@/lib/loading/aipify-loader-assets";
import fs from "node:fs";
import path from "node:path";

async function main() {
  assert.equal(PLATFORM_SUPER_ADMIN_INSIGHT_FETCH_TIMEOUT_MS, 12_000);
  assert.equal(isAbortError(new DOMException("Aborted", "AbortError")), true);
  assert.equal(isAbortError(new Error("network")), false);
  assert.equal(isAbortError(null), false);

  async function wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  {
    const controller = new AbortController();
    const clear = armInsightFetchTimeout(controller, 25);
    assert.equal(controller.signal.aborted, false);
    await wait(60);
    assert.equal(controller.signal.aborted, true);
    clear();
  }

  {
    const controller = new AbortController();
    const clear = armInsightFetchTimeout(controller, 5_000);
    clear();
    await wait(30);
    assert.equal(controller.signal.aborted, false);
  }

  const panelPath = path.join(
    process.cwd(),
    "components/platform/platform-portal/PlatformSuperAdminInsightPanel.tsx",
  );
  const panelSource = fs.readFileSync(panelPath, "utf8");
  assert.equal(
    panelSource.includes('from "@/components/ui/aipify-loader"'),
    false,
    "insight panel must not import shared aipify-loader (default English visible label)",
  );
  assert.equal(
    panelSource.includes(AIPIFY_LOADER_DEFAULT_LABEL),
    false,
    "insight panel must not embed default preparing-content copy",
  );
  assert.match(panelSource, /PLATFORM_SUPER_ADMIN_INSIGHT_FETCH_TIMEOUT_MS|armInsightFetchTimeout/);
  assert.match(panelSource, /data-state="loading"/);
  assert.match(panelSource, /sr-only/);

  console.log("platform-insight-client.test.ts: all assertions passed");
}

void main();
