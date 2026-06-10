import assert from "node:assert/strict";
import { selectModelProfile } from "./router";
import type { ModelProfile } from "./types";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

const CUSTOM_PROFILES: ModelProfile[] = [
  {
    profile_id: "enterprise-a",
    display_name: "Enterprise Model A",
    tasks: ["executive_summary", "support_response"],
    tier: "balanced",
    provider_key: "customer-a",
  },
  {
    profile_id: "enterprise-b",
    display_name: "Enterprise Model B",
    tasks: ["executive_summary"],
    tier: "reasoning",
    provider_key: "customer-b",
  },
];

test("selectModelProfile picks reasoning tier for executive summary", () => {
  const result = selectModelProfile({ task: "executive_summary" });
  assert.ok(result);
  assert.equal(result.profile_id, "aipify-reasoning");
  assert.equal(result.policy_mode, "aipify_managed");
});

test("selectModelProfile picks fast tier for support response", () => {
  const result = selectModelProfile({ task: "support_response" });
  assert.ok(result);
  assert.equal(result.profile_id, "aipify-fast");
});

test("customer_approved policy restricts to approved profiles", () => {
  const result = selectModelProfile({
    task: "executive_summary",
    policy: {
      mode: "customer_approved",
      approved_profile_ids: ["enterprise-a"],
    },
    profiles: CUSTOM_PROFILES,
  });
  assert.ok(result);
  assert.equal(result.profile_id, "enterprise-a");
  assert.equal(result.policy_mode, "customer_approved");
});

test("customer_approved returns null when no approved profile supports task", () => {
  const result = selectModelProfile({
    task: "email_draft",
    policy: {
      mode: "customer_approved",
      approved_profile_ids: ["enterprise-a"],
    },
    profiles: CUSTOM_PROFILES,
  });
  assert.equal(result, null);
});

console.log("All model router tests passed.");
