import assert from "node:assert/strict";
import {
  formatOrganizationAccessScopeSummary,
  ORGANIZATION_ACCESS_CAPABILITY_LABEL_KEYS,
  resolveOrganizationAccessCapabilityLabel,
  resolveOrganizationAccessProviderLabel,
  resolveOrganizationAccessScopeLabel,
} from "./panel-display-labels";

const labels = {
  providers: {
    generic: "Tilkoblet leverandør",
    organization_member_count: "Medlemstall",
    "organization_member_count.dataType": "Aggregerte medlemstall",
    "organization_member_count.whyNeeded": "Aipify trenger lesetilgang.",
  },
  scopes: {
    "organization_member_count.memberCountRead": "Les organisasjonens medlemstall",
  },
  capabilities: {
    memberSearch: "Søk og les medlemmer",
  },
  unknownProvider: "Godkjent leverandør",
  unknownScope: "Godkjent dataomfang",
};

assert.equal(
  resolveOrganizationAccessScopeLabel("organization.members.count.read", labels),
  "Les organisasjonens medlemstall",
);
assert.notEqual(
  resolveOrganizationAccessScopeLabel("organization.members.count.read", labels),
  "organization.members.count.read",
);

assert.equal(resolveOrganizationAccessCapabilityLabel("member.search", labels), "Søk og les medlemmer");
assert.notEqual(resolveOrganizationAccessCapabilityLabel("member.search", labels), "member.search");

assert.equal(
  formatOrganizationAccessScopeSummary(["organization.members.count.read"], labels, "organization_member_count"),
  "Les organisasjonens medlemstall",
);
assert.ok(!formatOrganizationAccessScopeSummary(["organization.members.count.read"], labels).includes(".read"));

assert.equal(
  resolveOrganizationAccessProviderLabel("organization_member_count", labels),
  "Medlemstall",
);
assert.equal(resolveOrganizationAccessProviderLabel("unknown_provider", labels), "Tilkoblet leverandør");

assert.equal(
  ORGANIZATION_ACCESS_CAPABILITY_LABEL_KEYS["member.search"],
  "customerApp.organizationAccessApproval.capabilities.memberSearch",
);

console.log("panel-display-labels.test.ts: all assertions passed");
