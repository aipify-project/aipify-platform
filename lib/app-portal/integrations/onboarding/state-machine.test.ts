import { describe, expect, it } from "vitest";
import { assertTransition, canTransition, isActivationAllowed, mapSecretStreamStatusToInstallationState } from "./index";

describe("provider onboarding state machine", () => {
  it("allows valid transitions and rejects skipped verification", () => {
    expect(canTransition("credential_stored", "connection_test_required")).toBe(true);
    expect(canTransition("credential_stored", "active")).toBe(false);
    expect(() => assertTransition("credential_stored", "active")).toThrow(/Invalid provider installation transition/);
  });
  it("only permits activation after verification and available service", () => {
    expect(isActivationAllowed("verified", "production_ready", "guided")).toBe(true);
    expect(isActivationAllowed("credential_stored", "production_ready", "guided")).toBe(false);
    expect(isActivationAllowed("verified", "blocked", "guided")).toBe(false);
    expect(isActivationAllowed("verified", "production_ready", "unsupported")).toBe(false);
  });
  it("bridges canonical secret-stream status conservatively", () => {
    expect(mapSecretStreamStatusToInstallationState("rotation_required")).toBe("revoke_required");
    expect(mapSecretStreamStatusToInstallationState("not-a-status")).toBe("blocked");
  });
});
