import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import {
  CSP_CERTIFICATE_BLOCKED,
  CSP_CERTIFICATE_PRODUCT_LABEL,
  buildCertificateMeta,
  buildCertificatePdfText,
  toPdfSafeText,
} from "./certificate";

const passedAt = "2026-11-25T10:30:00.000Z";

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

test("certificate id: server-supplied is kept; derived is uuid-like and deterministic", () => {
  const given = buildCertificateMeta({ fullName: "A B", passedAt, certificateId: "0b9f1c6e-2c1d-4a77-9c0e-5a3f1d2e7b10" });
  assert.equal(given.certificateId, "0b9f1c6e-2c1d-4a77-9c0e-5a3f1d2e7b10");
  const a = buildCertificateMeta({ fullName: "A B", passedAt, derivationSeed: "x" });
  const b = buildCertificateMeta({ fullName: "A B", passedAt, derivationSeed: "x" });
  const c = buildCertificateMeta({ fullName: "A B", passedAt, derivationSeed: "y" });
  assert.match(a.certificateId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(a.certificateId, b.certificateId);
  assert.notEqual(a.certificateId, c.certificateId);
  assert.throws(() => buildCertificateMeta({ fullName: "A B", passedAt, certificateId: "../x" }), /invalid_certificate_id/);
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

test("PDF is a minimal valid single page with correct xref offsets and required content", () => {
  const meta = buildCertificateMeta({ fullName: "Kari Nordmann (Test) \\ Ærlig", passedAt, locale: "en" });
  const bytes = buildCertificatePdfText(meta);
  assert.ok(bytes instanceof Uint8Array);
  const pdf = Buffer.from(bytes).toString("latin1");
  assert.ok(pdf.startsWith("%PDF-1.4\n"));
  assert.ok(pdf.trimEnd().endsWith("%%EOF"));
  assert.match(pdf, /\/Count 1/);
  assert.match(pdf, /Certificate of Completion/);
  assert.ok(pdf.includes(`Certificate ID: ${meta.certificateId}`));
  assert.ok(pdf.includes("Date passed: 2026-11-25"));
  assert.ok(pdf.includes(`Issued by Aipify Group AS - Org. no. ${COMPANY_CONFIG.organizationNumber} - Norway`));
  assert.ok(pdf.includes("Certified Aipify Sales Partner \\226 Kompis Web"));
  assert.ok(pdf.includes("Kari Nordmann \\(Test\\) \\\\ \\306rlig"));
  assert.ok(Array.from(bytes).every((b) => b < 128), "PDF stays 7-bit ASCII");

  // xref offsets must point at "N 0 obj".
  const xrefAt = Number(/startxref\n(\d+)\n/.exec(pdf)![1]);
  assert.ok(pdf.slice(xrefAt).startsWith("xref\n0 7\n"));
  const entries = pdf.slice(xrefAt).split("\n").slice(3, 9);
  entries.forEach((entry, i) => {
    const offset = Number(entry.slice(0, 10));
    assert.ok(pdf.slice(offset).startsWith(`${i + 1} 0 obj`), `object ${i + 1} offset`);
  });

  // Stream /Length matches the actual stream body.
  const stream = /\/Length (\d+) >>\nstream\n([\s\S]*?)\nendstream/.exec(pdf)!;
  assert.equal(Number(stream[1]), stream[2].length);
});

test("PDF text safety: Cyrillic is transliterated and unsupported characters never break the file", () => {
  assert.equal(toPdfSafeText("Олена Шевченко"), "Olena Shevchenko");
  assert.equal(toPdfSafeText("Łukasz Żółć"), "Lukasz Z\u00f3lc"); // ó is Latin-1 and kept
  assert.equal(toPdfSafeText("日本"), "??");
  const meta = buildCertificateMeta({ fullName: "Олена Шевченко", passedAt, locale: "uk" });
  assert.ok(Buffer.from(buildCertificatePdfText(meta)).toString("latin1").includes("Olena Shevchenko"));
});
