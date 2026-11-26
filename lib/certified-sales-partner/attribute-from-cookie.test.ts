import assert from "node:assert/strict";
import { extractOrganizationId } from "./organization-id";

assert.equal(extractOrganizationId(null), null);
assert.equal(extractOrganizationId({ organization_id: "org-1" }), "org-1");
assert.equal(extractOrganizationId({ organizationId: "org-2" }), "org-2");
assert.equal(extractOrganizationId({ organization: { id: "org-3" } }), "org-3");
assert.equal(extractOrganizationId({ id: "org-4", plan: "starter" }), "org-4");
assert.equal(extractOrganizationId({ nested: true }), null);

console.log("attribute-from-cookie.test.ts: ok");
