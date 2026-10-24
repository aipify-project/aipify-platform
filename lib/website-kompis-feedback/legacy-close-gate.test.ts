import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FEEDBACK_REVIEW_CLOSE_READY, FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import { legacyFeedbackCloseIsBlocked, runLegacyFeedbackClose } from "@/lib/website-kompis-feedback/legacy-close-gate";
import { runFeedbackDisposition } from "@/lib/website-kompis-feedback/disposition-server";

const root = process.cwd();
const feedbackId = "66666666-6666-4666-8666-666666666661";
const helpfulId = "77777777-7777-4777-8777-777777777771";

assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);
assert.equal(FEEDBACK_REVIEW_DISPOSITION_READY, true);
assert.equal(legacyFeedbackCloseIsBlocked(), true);
assert.equal(legacyFeedbackCloseIsBlocked(false), true);
assert.equal(legacyFeedbackCloseIsBlocked(true), false);

async function main() {
const calls: string[] = [];
const presentRpc = async (args: { p_feedback_id: string; p_confirmation: true }) => {
  calls.push(args.p_feedback_id);
  return { data: { review_status: "closed" }, error: null };
};

const blocked = await runLegacyFeedbackClose({ userId: "user-1", feedbackId, rpc: presentRpc });
assert.equal(blocked.status, 501);
assert.equal(blocked.body.code, "review_close_unavailable");
assert.deepEqual(calls, []);

const helpful = await runLegacyFeedbackClose({ userId: "user-1", feedbackId: helpfulId, rpc: presentRpc });
assert.equal(helpful.status, 501);
assert.equal(helpful.body.reviewStatus, undefined);
assert.deepEqual(calls, []);

const anonymous = await runLegacyFeedbackClose({ userId: null, feedbackId, rpc: presentRpc });
assert.equal(anonymous.status, 401);
assert.deepEqual(calls, []);

const invalid = await runLegacyFeedbackClose({ userId: "user-1", feedbackId: "bad", rpc: presentRpc });
assert.equal(invalid.status, 400);
assert.deepEqual(calls, []);

const opened = await runLegacyFeedbackClose({ userId: "user-1", feedbackId, ready: true, rpc: presentRpc });
assert.equal(opened.status, 200);
assert.equal(opened.body.reviewStatus, "closed");
assert.deepEqual(calls, [feedbackId]);

const dispositionCalls: string[] = [];
const dispositionBlocked = await runFeedbackDisposition(
  { rpc: async (name: string) => { dispositionCalls.push(name); return { data: null, error: null }; } } as never,
  { feedbackId, action: "rejected" },
  false,
);
assert.equal(dispositionBlocked.status, 501);
assert.deepEqual(dispositionCalls, []);

const route = fs.readFileSync(path.join(root, "app/api/website-kompis/feedback/[id]/close/route.ts"), "utf8");
const gate = fs.readFileSync(path.join(root, "lib/website-kompis-feedback/legacy-close-gate.ts"), "utf8");
const dispositionRoute = fs.readFileSync(
  path.join(root, "app/api/website-kompis/feedback/[id]/disposition/route.ts"),
  "utf8",
);
assert.match(route, /runLegacyFeedbackClose/);
assert.doesNotMatch(route, /ready:\s*true/);
assert.doesNotMatch(route, /process\.env/);
assert.doesNotMatch(gate, /process\.env/);
assert.doesNotMatch(dispositionRoute, /FEEDBACK_REVIEW_DISPOSITION_READY\s*=\s*true/);
assert.match(gate, /legacyFeedbackCloseIsBlocked/);
const gateBeforeRpc = gate.indexOf("legacyFeedbackCloseIsBlocked");
const rpcCall = gate.indexOf("await input.rpc");
assert.equal(gateBeforeRpc >= 0 && rpcCall > gateBeforeRpc, true);

console.log("legacy-close-gate.test.ts: ok");
}

main();
