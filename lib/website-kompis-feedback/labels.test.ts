import assert from "node:assert/strict";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";

function main() {
  const labels = buildWebsiteKompisFeedbackLabels((key) => key);
  assert.equal(labels.title, "customerApp.websiteKompisFeedback.title");
  assert.equal(labels.totals.helpful, "customerApp.websiteKompisFeedback.totals.helpful");
  assert.equal(labels.votes.notHelpful, "customerApp.websiteKompisFeedback.votes.notHelpful");
  assert.equal(labels.reuseOffNote, "customerApp.websiteKompisFeedback.reuseOffNote");
  console.log("website-kompis-feedback-labels.test.ts: all assertions passed");
}

main();
