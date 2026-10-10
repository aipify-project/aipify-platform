/**
 * REPAIR.14 — private/admin FAQ gate + embed recentContext length resilience.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH,
  buildWebsiteKompisAskPayload,
} from "./website-kompis-embed";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function main() {
  installServerOnlyShim();

  const {
    isOutOfScopePrivateMemberOrAdminQuestion,
  } = await import("./website-kompis-public-boundary");
  const {
    PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH,
    validatePublicCompanionAskRequest,
  } = await import("./public-companion-ask");

  assert.equal(
    WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH,
    PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH,
  );

  assert.equal(
    isOutOfScopePrivateMemberOrAdminQuestion(
      "Hvordan logger jeg inn på min private medlemskonto og adminpanel?",
    ),
    true,
  );
  assert.equal(isOutOfScopePrivateMemberOrAdminQuestion("Hvordan logger jeg inn?"), false);

  const longText = "Ut fra nettstedets offentlige sider:\n\n" + "Gaver ".repeat(120);
  assert.ok(longText.length > WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH);

  const embedPayload = buildWebsiteKompisAskPayload({
    question: "Hvordan fungerer gaveguiden?",
    locale: "no",
    domain: "www.customer.example",
    installId: "11111111-1111-4111-8111-111111111111",
    recentContext: [
      { role: "user", text: "Hvordan fungerer gaveguiden på NETTSTED_NAVN?" },
      { role: "assistant", text: longText },
    ],
  });
  assert.equal(
    embedPayload.recentContext?.[1]?.text.length,
    WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH,
  );

  const validated = validatePublicCompanionAskRequest({
    question: "Hvordan fungerer gaveguiden?",
    locale: "no",
    domain: "www.customer.example",
    installId: "11111111-1111-4111-8111-111111111111",
    recentContext: [
      { role: "user", text: "Hvordan fungerer gaveguiden på NETTSTED_NAVN?" },
      { role: "assistant", text: longText },
    ],
  });
  assert.equal(
    validated.recentContext?.[1]?.text.length,
    PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH,
  );

  console.log("website-kompis-private-scope-widget-repair: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
