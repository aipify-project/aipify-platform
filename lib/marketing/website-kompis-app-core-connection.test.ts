import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  WebsiteKompisPositiveAvailabilityCache,
  resolveWebsiteKompisPublicAvailabilityWithResilience,
} from "@/lib/marketing/website-kompis-public-availability-resilience";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function main() {
  installServerOnlyShim();

  const { askPublicPlatformCompanion } = await import("./public-companion-ask");
  const { WEBSITE_KOMPIS_DISABLED_SOURCE } = await import("./website-kompis-install-config");
  const { WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE } = await import(
    "./website-kompis-public-page-context"
  );
  const { WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE } = await import(
    "./website-kompis-faq-match-safety"
  );

  const installId = "11111111-1111-4111-8111-111111111111";
  const domain = "example-a.test";
  const pageContext = {
    pathname: "/premium",
    title: "Premium medlemskap",
    metaDescription: "Bli Premium-medlem og få eksklusive fordeler.",
    surface: "public" as const,
    headings: [{ level: 1 as const, text: "Premium medlemskap" }],
    textSnippets: ["Med Premium får du flere matcher og prioritert synlighet."],
  };

  const rawInstallConfig = {
    website_kompis: {
      enabled: true,
      sources: {
        faq: true,
        currentPage: true,
        aipifyPublic: true,
        publicSiteIndex: false,
      },
    },
  };

  const availabilityCache = new WebsiteKompisPositiveAvailabilityCache();
  let resolveOnceCalls = 0;

  const askOptions = {
    requestHost: domain,
    rawInstallConfig,
    resolveLicensedAvailability: async () =>
      resolveWebsiteKompisPublicAvailabilityWithResilience({
        visitorContext: { installId, domain },
        cache: availabilityCache,
        resolveOnce: async () => {
          resolveOnceCalls += 1;
          if (resolveOnceCalls === 1) {
            return {
              available: false as const,
              reason: "license_unknown" as const,
              capabilityKey: "website_kompis" as const,
            };
          }
          return {
            available: true as const,
            reason: "available" as const,
            capabilityKey: "website_kompis" as const,
          };
        },
      }),
  };

  const pageQuestion = async (question: string) =>
    askPublicPlatformCompanion(
      {
        question,
        locale: "no",
        installId,
        domain,
        pageContext,
      },
      askOptions,
    );

  const first = await pageQuestion("Hva handler denne siden om?");
  assert.equal(first.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.equal(resolveOnceCalls, 2);

  const callsBeforeSecondAsk = resolveOnceCalls;
  const second = await pageQuestion("Hva koster det?");
  assert.equal(second.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.equal(resolveOnceCalls, callsBeforeSecondAsk);

  const third = await pageQuestion("Hva handler denne siden om?");
  assert.equal(third.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.notEqual(third.sources[0]?.route, WEBSITE_KOMPIS_DISABLED_SOURCE);
  assert.equal(resolveOnceCalls, callsBeforeSecondAsk);

  const safety = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp nakenbilder av andre personer?",
      locale: "no",
      installId,
      domain,
      pageContext,
    },
    askOptions,
  );
  assert.equal(safety.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);

  let hardDisabledCalls = 0;
  const hardDisabled = await askPublicPlatformCompanion(
    {
      question: "Hva handler denne siden om?",
      locale: "no",
      installId,
      domain,
      pageContext,
    },
    {
      ...askOptions,
      resolveLicensedAvailability: async () => {
        hardDisabledCalls += 1;
        return {
          available: false as const,
          reason: "license_inactive" as const,
          capabilityKey: "website_kompis" as const,
        };
      },
    },
  );
  assert.equal(hardDisabledCalls, 1);
  assert.equal(hardDisabled.sources[0]?.route, WEBSITE_KOMPIS_DISABLED_SOURCE);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
