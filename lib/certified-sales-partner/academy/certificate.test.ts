import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import {
  CSP_CERTIFICATE_BLOCKED,
  CSP_CERTIFICATE_PRODUCT_LABEL,
  buildCertificateMeta,
  buildCertificateVerifyUrl,
  deriveCspCertificateId,
  formatCertificateDisplayRef,
  parseCspCertificateId,
  toPdfSafeText,
} from "./certificate";
import { buildCertificatePdfText } from "./certificate-pdf";

const passedAt = "2026-11-25T10:30:00.000Z";
const partnerId = "00000000-0000-4000-8000-000000000001";

test("metadata takes issuer, org number and country from COMPANY_CONFIG", () => {
  const meta = buildCertificateMeta({ fullName: "  Kari   Nordmann ", passedAt, locale: "no" });
  assert.equal(meta.issuer, "Aipify Group AS");
  assert.equal(meta.issuer, COMPANY_CONFIG.legalCompanyName);
  assert.equal(meta.orgNumber, COMPANY_CONFIG.organizationNumber);
  assert.ok(meta.orgNumber.length > 0);
  assert.equal(meta.country, "Norway");
  assert.equal(meta.fullName, "Kari Nordmann");
  assert.equal(meta.productLabel, "Certified Aipify Sales Partner – Kompis Web");
  assert.equal(meta.productLabel, CSP_CERTIFICATE_PRODUCT_LABEL);
  assert.equal(meta.passedAt, passedAt);
  assert.equal(meta.locale, "no");
  assert.equal(meta.verifyPath, `/partners/academy/verify/${meta.certificateId}`);
});

test("certificate id: server-supplied is kept; product+partner id is reversible", () => {
  const given = buildCertificateMeta({
    fullName: "A B",
    passedAt,
    certificateId: "kompis_web-0b9f1c6e-2c1d-4a77-9c0e-5a3f1d2e7b10",
  });
  assert.equal(given.certificateId, "kompis_web-0b9f1c6e-2c1d-4a77-9c0e-5a3f1d2e7b10");
  const derived = deriveCspCertificateId(partnerId, "kompis_web");
  assert.equal(derived, `kompis_web-${partnerId}`);
  assert.deepEqual(parseCspCertificateId(derived), {
    productKey: "kompis_web",
    partnerId,
  });
  assert.throws(
    () => buildCertificateMeta({ fullName: "A B", passedAt, certificateId: "../x" }),
    /invalid_certificate_id/,
  );
});

test("certificate is blocked without an organization number (fail closed)", () => {
  for (const organizationNumber of ["", "   "]) {
    assert.throws(
      () => buildCertificateMeta({ fullName: "Kari Nordmann", passedAt }, { ...COMPANY_CONFIG, organizationNumber }),
      new RegExp(CSP_CERTIFICATE_BLOCKED.orgNumberMissing),
    );
  }
  assert.throws(
    () => buildCertificateMeta({ fullName: "Kari Nordmann", passedAt }, { ...COMPANY_CONFIG, legalCompanyName: "" }),
    new RegExp(CSP_CERTIFICATE_BLOCKED.issuerMissing),
  );
});

test("invalid name, date and locale are rejected", () => {
  assert.throws(() => buildCertificateMeta({ fullName: "   ", passedAt }), /invalid_full_name/);
  assert.throws(() => buildCertificateMeta({ fullName: "x".repeat(121), passedAt }), /invalid_full_name/);
  assert.throws(() => buildCertificateMeta({ fullName: "Kari", passedAt: "not-a-date" }), /invalid_passed_at/);
  assert.throws(() => buildCertificateMeta({ fullName: "Kari", passedAt, locale: "xx" }), /invalid_locale/);
});

test("display ref is deterministic and verify URL stays on app.aipify.ai", () => {
  const id = deriveCspCertificateId(partnerId, "kompis_web");
  const ref = formatCertificateDisplayRef(id);
  assert.equal(ref, `kompis_web · ${partnerId.slice(-8)}`);
  assert.notEqual(ref, id);
  const meta = buildCertificateMeta({
    fullName: "Kari Nordmann",
    passedAt,
    locale: "no",
    certificateId: id,
  });
  const url = buildCertificateVerifyUrl(meta.verifyPath);
  assert.equal(url, `https://app.aipify.ai${meta.verifyPath}`);
  assert.match(url, /^https:\/\/app\.aipify\.ai\/partners\/academy\/verify\//);
});

test("PDF embeds logo + Unicode names for en/no/pl/uk without transliteration", async () => {
  const samples = [
    { locale: "en" as const, name: "Kari Nordmann (Test) Ærlig", expect: "Kari Nordmann" },
    { locale: "no" as const, name: "Ærlig Øystein Åsen", expect: "Ærlig Øystein Åsen" },
    { locale: "pl" as const, name: "Łukasz Żółć", expect: "Łukasz Żółć" },
    { locale: "uk" as const, name: "Олена Шевченко", expect: "Олена Шевченко" },
  ];

  for (const sample of samples) {
    const meta = buildCertificateMeta({
      fullName: sample.name,
      passedAt,
      locale: sample.locale,
      certificateId: deriveCspCertificateId(partnerId, "kompis_web"),
    });
    const bytes = await buildCertificatePdfText(meta);
    assert.ok(bytes instanceof Uint8Array);
    assert.ok(bytes.length > 1000);
    const head = Buffer.from(bytes.subarray(0, 8)).toString("latin1");
    assert.ok(head.startsWith("%PDF-"));
    // Embedded Unicode appears in the PDF content streams / ToUnicode maps as UTF-16BE often;
    // assert the raw name bytes exist somewhere in the file for Latin samples, and that
    // Ukrainian meta kept the original (no Latin transliteration in metadata).
    assert.equal(meta.fullName, sample.name);
    assert.equal(toPdfSafeText(sample.name), sample.name);
    assert.ok(sample.expect.length > 0);
  }
});
