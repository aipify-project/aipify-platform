/**
 * Phase 619 — service experience engine smoke tests.
 * Run: node scripts/verify-phase-619.mjs
 */
import assert from "node:assert/strict";
import { serviceCommunicationsSectionToRpc, getServiceCommunicationsActiveSection, isServiceExperiencePath } from "../lib/service-experience-engine/communications-config.ts";
import { detectServiceExperienceAdvisorIntent, getServiceExperienceAdvisorRoute } from "../lib/service-experience-engine/advisor.ts";
import { parseServiceExperienceCenter, parseServiceExperienceDetail } from "../lib/service-experience-engine/parse.ts";

assert.equal(serviceCommunicationsSectionToRpc("messages"), "messages");
assert.equal(serviceCommunicationsSectionToRpc("no-shows"), "no-shows");
assert.equal(getServiceCommunicationsActiveSection("/app/services/communications/failed"), "failed");
assert.equal(getServiceCommunicationsActiveSection("/app/services/communications"), "overview");
assert.equal(isServiceExperiencePath("/app/services/rebooking"), true);
assert.equal(isServiceExperiencePath("/app/services/payments"), false);

assert.equal(detectServiceExperienceAdvisorIntent("show failed communication deliveries"), "communications");
assert.equal(detectServiceExperienceAdvisorIntent("rebooking reminder due"), "rebooking");
assert.equal(detectServiceExperienceAdvisorIntent("tilbakemelding fra kunde"), "feedback");
assert.equal(detectServiceExperienceAdvisorIntent("service quality delivery rate"), "quality");
assert.equal(detectServiceExperienceAdvisorIntent(""), null);
assert.equal(getServiceExperienceAdvisorRoute("feedback"), "/app/services/feedback");
assert.equal(getServiceExperienceAdvisorRoute("quality"), "/app/services/quality");
assert.equal(getServiceExperienceAdvisorRoute(null), "/app/services/communications");

const center = parseServiceExperienceCenter({
  found: true,
  section: "overview",
  stats: { scheduled: 2 },
  messages: [{ record_key: "c1", record_title: "Test" }],
});
assert.equal(center.found, true);
assert.equal(center.stats?.scheduled, 2);
assert.equal(center.messages?.length, 1);

const centerAgain = parseServiceExperienceCenter(center);
assert.equal(centerAgain.found, true);
assert.equal(centerAgain.messages?.length, 1);

const detail = parseServiceExperienceDetail({
  found: true,
  area: "communications",
  entity_key: "msg-1",
  record: { record_key: "msg-1" },
  phase617_link: "/app/services/payments",
  phase618_link: "/app/services/forms",
});
assert.equal(detail.found, true);
assert.equal(detail.entity_key, "msg-1");
assert.equal(detail.phase617_link, "/app/services/payments");

console.log("Phase 619 smoke tests passed");
