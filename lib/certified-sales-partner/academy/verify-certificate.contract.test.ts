import assert from "node:assert/strict";
import test from "node:test";
import { deriveCspCertificateId, parseCspCertificateId } from "./certificate";

test("certificate verify path prefix stays public and stable", () => {
  const id = deriveCspCertificateId("00000000-0000-4000-8000-000000000001", "kompis_web");
  assert.equal(id, "kompis_web-00000000-0000-4000-8000-000000000001");
  assert.deepEqual(parseCspCertificateId(id), {
    productKey: "kompis_web",
    partnerId: "00000000-0000-4000-8000-000000000001",
  });
  assert.equal(`/partners/academy/verify/${id}`.includes(".."), false);
});

test("invalid certificate ids are rejected by pattern used in public verify", () => {
  const bad = ["", "../x", "a".repeat(3), "a".repeat(100), "evil.com/x"];
  const pattern = /^[0-9a-zA-Z_-]{8,64}$/;
  for (const value of bad) {
    assert.equal(pattern.test(value), false, value);
  }
  assert.equal(
    pattern.test(deriveCspCertificateId("00000000-0000-4000-8000-000000000001", "kompis_web")),
    true,
  );
});

test("legacy UUID-only certificate ids are not reversible (no table scan)", () => {
  assert.equal(parseCspCertificateId("0b9f1c6e-2c1d-4a77-9c0e-5a3f1d2e7b10"), null);
});
