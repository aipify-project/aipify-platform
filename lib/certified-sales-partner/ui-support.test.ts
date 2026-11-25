import assert from "node:assert/strict";
import test from "node:test";
import { maskIban, sanitizeBankProfileResponse } from "./bank-profile";
import { validateSalesProductInput } from "./product-input";
import {
  classifyCspApiResponse,
  extractCspExamCourses,
  extractCspList,
  extractCspOverviewMetrics,
  hasAnyCspOverviewMetric,
} from "./ui-support";

test("classify: 503 / backend_ready false / found false are not ready", () => {
  assert.equal(classifyCspApiResponse(503, { backend_ready: false, error: "csp_backend_not_applied" }).kind, "not_ready");
  assert.equal(classifyCspApiResponse(200, { backend_ready: false }).kind, "not_ready");
  assert.equal(classifyCspApiResponse(200, { found: false }).kind, "not_ready");
  assert.equal(classifyCspApiResponse(200, { found: true, products: [] }).kind, "ready");
});

test("classify: auth and validation statuses", () => {
  assert.equal(classifyCspApiResponse(401, { error: "Unauthorized" }).kind, "unauthorized");
  assert.equal(classifyCspApiResponse(403, { error: "sales_link_gates_not_met" }).kind, "forbidden");
  const bad = classifyCspApiResponse(400, { error: "reason_required" });
  assert.equal(bad.kind, "invalid");
  if (bad.kind !== "ready") {
    assert.equal(bad.code, "reason_required");
  }
  assert.equal(classifyCspApiResponse(500, null).kind, "error");
});

test("overview metrics are null when absent — never fabricated", () => {
  const m = extractCspOverviewMetrics({ found: true });
  assert.equal(hasAnyCspOverviewMetric(m), false);
  assert.equal(m.earnedAmount, null);
});

test("overview metrics read from payload and summary", () => {
  const m = extractCspOverviewMetrics({
    products: [{ id: "a" }, { id: "b" }],
    summary: { pending_sales_count: 3, earned_amount: "120.5", upcoming_payout_amount: 0, currency: "eur" },
  });
  assert.equal(m.productsCount, 2);
  assert.equal(m.pendingSalesCount, 3);
  assert.equal(m.earnedAmount, 120.5);
  assert.equal(m.upcomingPayoutAmount, 0);
  assert.equal(m.currency, "EUR");
});

test("extractCspList handles arrays and missing keys", () => {
  assert.deepEqual(extractCspList([{ a: 1 }, 3, null], "sales"), [{ a: 1 }]);
  assert.deepEqual(extractCspList({ sales: [{ id: "1" }] }, "sales"), [{ id: "1" }]);
  assert.deepEqual(extractCspList({}, "sales"), []);
});

test("exam courses only when backend returns well-formed questions", () => {
  assert.deepEqual(extractCspExamCourses({ found: true }), []);
  assert.deepEqual(extractCspExamCourses({ courses: [{ id: "c1", questions: [] }] }), []);
  const courses = extractCspExamCourses({
    courses: [
      {
        id: "c1",
        title: "Course",
        questions: [
          { id: "q1", text: "Q?", correct: "o1", options: [{ id: "o1", label: "A" }, { id: "o2", label: "B" }] },
          { id: "q2", text: "Single option dropped", options: [{ id: "o1", label: "A" }] },
        ],
      },
    ],
  });
  assert.equal(courses.length, 1);
  assert.equal(courses[0].questions.length, 1);
  assert.ok(!("correct" in courses[0].questions[0]));
});

test("sanitizeBankProfileResponse never returns plaintext IBAN or account number", () => {
  const out = sanitizeBankProfileResponse({
    found: true,
    profile: { iban: "GB82WEST12345698765432", local_account_number: "123456789", swift_bic: "DEUTDEFF", holder: "X" },
  }) as { profile: Record<string, string> };
  assert.equal(out.profile.iban, maskIban("GB82WEST12345698765432"));
  assert.ok(!JSON.stringify(out).includes("WEST1234"));
  assert.ok(!JSON.stringify(out).includes("123456789"));
  assert.equal(out.profile.swift_bic, "DEUTDEFF");
});

test("sales product validation", () => {
  const ok = validateSalesProductInput({
    productKey: " Core-Starter ",
    title: "Starter",
    currency: "nok",
    fixedCommissionAmount: "250,50",
    published: false,
  });
  assert.ok(ok.ok);
  if (ok.ok) {
    assert.equal(ok.payload.productKey, "core-starter");
    assert.equal(ok.payload.currency, "NOK");
    assert.equal(ok.payload.fixedCommissionAmount, 250.5);
  }
  const base = { productKey: "abc", title: "Ab", currency: "EUR", fixedCommissionAmount: 10, published: true };
  assert.equal(validateSalesProductInput({ ...base, productKey: "A B" }).ok, false);
  assert.equal(validateSalesProductInput({ ...base, currency: "EURO" }).ok, false);
  assert.equal(validateSalesProductInput({ ...base, fixedCommissionAmount: 0 }).ok, false);
  assert.equal(validateSalesProductInput({ ...base, fixedCommissionAmount: 10.123 }).ok, false);
  assert.equal(validateSalesProductInput({ ...base, published: "yes" }).ok, false);
});
