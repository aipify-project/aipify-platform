import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
// @ts-expect-error jsdom is available at test runtime; this repo has no type declarations for the module.
import { JSDOM, VirtualConsole } from "jsdom";
import { AppTenantBootstrapSurface } from "@/components/app/bootstrap/AppTenantBootstrapSurface";

console.log("AppTenantBootstrapSurface.test.tsx");

const LABELS = {
  titleSelectionRequired: "Select organization",
  messageSelectionRequired: "Choose which organization to open.",
  titleMembershipMissing: "Organization access missing",
  messageMembershipMissing: "No eligible customer organization is available.",
  selectOrganization: "Eligible organizations",
  switching: "Switching…",
  switchFailed: "Could not complete organization switch.",
  retry: "Retry",
};

const ORG_ID = "11111111-1111-4111-8111-111111111111";

type FetchCall = { url: string; init?: RequestInit };

function installDom(onReload?: () => void) {
  const virtualConsole = new VirtualConsole();
  if (onReload) {
    virtualConsole.on("jsdomError", (error: Error) => {
      if (String(error?.message ?? error).includes("Not implemented: navigation")) {
        onReload();
      }
    });
  }
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/",
    virtualConsole,
  });
  const { window } = dom;
  Object.defineProperty(globalThis, "window", { value: window, configurable: true });
  Object.defineProperty(globalThis, "document", { value: window.document, configurable: true });
  Object.defineProperty(globalThis, "HTMLElement", { value: window.HTMLElement, configurable: true });
  Object.defineProperty(globalThis, "Node", { value: window.Node, configurable: true });
  Object.defineProperty(globalThis, "navigator", {
    value: window.navigator,
    configurable: true,
  });
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  return window;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function withMounted(
  element: ReactElement,
  run: (rootEl: HTMLElement) => Promise<void>,
  onReload?: () => void,
) {
  const window = installDom(onReload);
  const rootEl = window.document.getElementById("root");
  assert.ok(rootEl);
  const root: Root = createRoot(rootEl);
  try {
    await act(async () => {
      root.render(element);
    });
    await flush();
    await run(rootEl);
  } finally {
    await act(async () => {
      root.unmount();
    });
  }
}

const originalFetch = globalThis.fetch;

async function runTests() {
  // Case 1: membership_missing — empty state, no fetch, no switch controls
  {
    const fetchCalls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      fetchCalls.push(String(input));
      throw new Error("fetch should not be called for membership_missing");
    }) as typeof fetch;

    await withMounted(
      <AppTenantBootstrapSurface state="membership_missing" labels={LABELS} />,
      async (rootEl) => {
        assert.match(rootEl.textContent ?? "", /Organization access missing/);
        assert.match(rootEl.textContent ?? "", /No eligible customer organization/);
        assert.equal(rootEl.querySelector('[role="listbox"]'), null);
        assert.equal(rootEl.querySelector('button[role="option"]'), null);
        assert.equal(fetchCalls.length, 0);
        assert.equal(rootEl.querySelector(".max-w-7xl"), null);
      },
    );
  }

  // Case 2–4: selection_required — list, switch POST, reload
  {
    const fetchCalls: FetchCall[] = [];
    let reloadCount = 0;

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      fetchCalls.push({ url, init });
      if (url.includes("/api/organizations/switch")) {
        return new Response(JSON.stringify({ status: "ok", organization_id: ORG_ID }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("/api/organizations")) {
        return new Response(
          JSON.stringify({
            organizations: [
              {
                id: ORG_ID,
                name: "Eligible Customer Org",
                slug: "eligible-customer",
                status: "active",
                subscription_plan: "business",
                role: "owner",
                membership_status: "active",
              },
            ],
            current: null,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    await withMounted(
      <AppTenantBootstrapSurface state="selection_required" labels={LABELS} />,
      async (rootEl) => {
        assert.equal(
          fetchCalls.some(
            (call) => call.url.includes("/api/organizations") && !call.url.includes("/switch"),
          ),
          true,
        );
        assert.match(rootEl.textContent ?? "", /Eligible Customer Org/);
        assert.match(rootEl.textContent ?? "", /Select organization/);

        const option = rootEl.querySelector('button[role="option"]') as HTMLButtonElement | null;
        assert.ok(option);
        await act(async () => {
          option.click();
          await Promise.resolve();
          await Promise.resolve();
        });
        await flush();

        const switchCall = fetchCalls.find((call) => call.url.includes("/api/organizations/switch"));
        assert.ok(switchCall);
        assert.equal(switchCall.init?.method, "POST");
        assert.equal(switchCall.init?.body, JSON.stringify({ organization_id: ORG_ID }));
        assert.equal(reloadCount, 1);
        assert.equal(rootEl.querySelector(".max-w-7xl"), null);
      },
      () => {
        reloadCount += 1;
      },
    );
  }

  // Case 5: API error → safe error state, no APP shell
  {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: "boom" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    await withMounted(
      <AppTenantBootstrapSurface state="selection_required" labels={LABELS} />,
      async (rootEl) => {
        assert.match(rootEl.textContent ?? "", /Could not complete organization switch/);
        assert.match(rootEl.textContent ?? "", /Retry/);
        assert.equal(rootEl.querySelector('button[role="option"]'), null);
        assert.equal(rootEl.querySelector(".max-w-7xl"), null);
        assert.equal(rootEl.querySelector("[data-shell]"), null);
      },
    );
  }

  console.log("AppTenantBootstrapSurface.test.tsx: all assertions passed");
}

runTests()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    globalThis.fetch = originalFetch;
  });
