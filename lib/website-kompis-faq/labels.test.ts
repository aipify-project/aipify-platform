import assert from "node:assert/strict";
import { buildWebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

function main() {
  const labels = buildWebsiteKompisFaqLabels((key) => key);

  assert.equal(labels.title, "customerApp.websiteKompisFaq.title");
  assert.equal(labels.contentTypes.faq, "customerApp.websiteKompisFaq.contentTypes.faq");
  assert.equal(labels.statuses.draft, "customerApp.websiteKompisFaq.statuses.draft");
  assert.equal(labels.previewTitle, "customerApp.websiteKompisFaq.previewTitle");
  assert.equal(
    labels.feedbackOverviewLink,
    "customerApp.websiteKompisFaq.feedbackOverviewLink",
  );
  assert.equal(
    labels.visibility.run,
    "customerApp.websiteKompisFaq.visibility.run",
  );
  assert.equal(
    labels.visibility.visitorLocaleDa,
    "customerApp.websiteKompisFaq.visibility.visitorLocaleDa",
  );
  assert.equal(
    labels.visibility.visitorLocaleSv,
    "customerApp.websiteKompisFaq.visibility.visitorLocaleSv",
  );

  console.log("website-kompis-faq-labels.test.ts: all assertions passed");
}

main();
