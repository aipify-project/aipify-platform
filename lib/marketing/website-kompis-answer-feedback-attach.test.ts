import assert from "node:assert/strict";
import { createRequire } from "node:module";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";

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

installServerOnlyShim();

const baseResponse: PublicCompanionAskResponse = {
  answer: {
    directAnswer: "Ut fra nettstedets offentlige sider beskrives provisjonsmodellen.",
    explanation: null,
    steps: [],
  },
  locale: "no",
  sources: [
    {
      title: "Slik fungerer det",
      route: "https://www.customer.example/no/how-it-works",
    },
  ],
  confidence: { level: "medium", score: null },
  supportEscalation: { offered: false, reason: null },
  actions: [],
};

async function main() {
  const { attachWebsiteKompisAnswerFeedbackReceipt } = await import(
    "@/lib/marketing/website-kompis-answer-feedback-attach"
  );

  // Missing install/domain → no write attempt
  let createCalls = 0;
  const noTrust = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "Hvordan fungerer provisjon?",
    installId: null,
    domain: null,
    createReceipt: async () => {
      createCalls += 1;
      return { answerId: "should-not-run", persistenceReady: true };
    },
  });
  assert.equal(createCalls, 0);
  assert.equal("answerId" in noTrust ? (noTrust as { answerId?: string }).answerId : undefined, undefined);

  // Trusted install/domain with stubbed receipt → no live RPC
  const stubbed = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "Hvordan fungerer provisjon?",
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "www.customer.example",
    createServiceRoleClient: () => ({}) as never,
    createReceipt: async () => {
      createCalls += 1;
      return { answerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", persistenceReady: true };
    },
  });
  assert.equal(createCalls, 1);
  assert.equal(stubbed.answerId, "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
  assert.equal(stubbed.feedbackPersistenceReady, true);

  // Service-role unavailable → fail closed, no fake answerId invent
  const noAdmin = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "Hvordan fungerer provisjon?",
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "www.customer.example",
    createServiceRoleClient: () => {
      throw new Error("missing env");
    },
  });
  assert.equal(noAdmin.answerId, null);
  assert.equal(noAdmin.feedbackPersistenceReady, false);

  // Default path (no createReceipt inject): real writer calls admin.rpc
  let rpcCalls = 0;
  const defaultPath = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "Hvordan fungerer provisjon?",
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "www.customer.example",
    createServiceRoleClient: () =>
      ({
        rpc: async (name: string) => {
          rpcCalls += 1;
          assert.equal(name, "create_website_kompis_answer_receipt");
          return {
            data: { answer_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
            error: null,
          };
        },
      }) as never,
  });
  assert.equal(rpcCalls, 1, "default path must invoke createWebsiteKompisAnswerReceipt RPC");
  assert.equal(defaultPath.answerId, "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  assert.equal(defaultPath.feedbackPersistenceReady, true);

  // Invalid install UUID → sanitize fails → no write / no fake id
  createCalls = 0;
  const badInstall = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "Hvordan fungerer provisjon?",
    installId: "not-a-uuid",
    domain: "www.customer.example",
    createReceipt: async () => {
      createCalls += 1;
      return { answerId: "should-not-run", persistenceReady: true };
    },
  });
  assert.equal(createCalls, 0);
  assert.equal(
    "answerId" in badInstall ? (badInstall as { answerId?: string }).answerId : undefined,
    undefined,
  );

  // Empty question → no write
  createCalls = 0;
  const emptyQ = await attachWebsiteKompisAnswerFeedbackReceipt({
    response: baseResponse,
    question: "   ",
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "www.customer.example",
    createReceipt: async () => {
      createCalls += 1;
      return { answerId: "should-not-run", persistenceReady: true };
    },
  });
  assert.equal(createCalls, 0);
  assert.equal(
    "answerId" in emptyQ ? (emptyQ as { answerId?: string }).answerId : undefined,
    undefined,
  );

  console.log("website-kompis-answer-feedback-attach: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
