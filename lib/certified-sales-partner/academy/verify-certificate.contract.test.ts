import assert from "node:assert/strict";
import test from "node:test";
import { deriveCspCertificateId } from "./certificate";

test("certificate verify path prefix stays public and stable", () => {
  const id = deriveCspCertificateId("00000000-0000-4000-8000-000000000001", "kompis_web");
  assert.match(id, /^[0-9a-f-]{36}$/i);
  assert.equal(`/partners/academy/verify/${id}`.includes(".."), false);
});

test("invalid certificate ids are rejected by pattern used in public verify", () => {
  const bad = ["", "../x", "a".repeat(3), "a".repeat(100), "evil.com/x"];
  const pattern = /^[0-9a-zA-Z-]{8,64}$/;
  for (const value of bad) {
    assert.equal(pattern.test(value), false, value);
  }
  assert.equal(pattern.test(deriveCspCertificateId("partner", "kompis_web")), true);
});
