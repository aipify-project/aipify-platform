import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { publishDialogInitialFocus } from "@/lib/website-kompis-faq/publish-dialog-placement";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function main() {
  assert.equal(publishDialogInitialFocus(false), "cancel");
  assert.equal(publishDialogInitialFocus(true), "acknowledge");

  const shell = read("components/dashboard/DashboardShell.tsx");
  const css = read("app/globals.css");
  const dialog = read("components/app/website-kompis/WebsiteKompisFaqPublishDialog.tsx");

  assert.match(shell, /animate-fade-in-up/);
  assert.match(css, /@keyframes fade-in-up[\s\S]*transform:\s*translateY\(0\)/);
  assert.match(css, /\.animate-fade-in-up\s*\{[^}]*forwards/);

  assert.match(dialog, /createPortal\(/);
  assert.match(dialog, /document\.body/);
  assert.match(dialog, /fixed inset-0/);
  assert.match(dialog, /items-center justify-center/);
  assert.match(dialog, /100dvh/);
  assert.match(dialog, /safe-area-inset-top/);
  assert.match(dialog, /safe-area-inset-bottom/);
  assert.match(dialog, /max-h-\[min\(32rem/);
  assert.match(dialog, /overflow-y-auto/);
  assert.match(dialog, /break-words/);
  assert.match(dialog, /preventScroll:\s*true/);
  assert.match(dialog, /event\.key === "Escape"/);
  assert.match(dialog, /type="button"/);
  assert.match(dialog, /publishDialogInitialFocus/);
  assert.doesNotMatch(dialog, /confirmRef\.current\)\?\.focus/);
  assert.doesNotMatch(dialog, /<form/);

  const panel = read("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx");
  assert.match(panel, /setPublishDialogOpen\(true\)/);
  assert.match(panel, /<WebsiteKompisFaqPublishDialog/);

  console.log("publish-dialog-placement.test.ts: ok");
}

main();
