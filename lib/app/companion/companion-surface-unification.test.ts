import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

// Desktop chat must delegate to unified Companion surface (persistent queue).
const desktopChat = read("components/app/desktop/DesktopChatPanel.tsx");
assert.match(desktopChat, /CompanionUnifiedSurface/);
assert.doesNotMatch(desktopChat, /desktop_chat_history/);
assert.doesNotMatch(desktopChat, /\/api\/aipify\/desktop\/chat/);

// Full-page companion reads ?conversation= deep links.
const companionPageClient = read("components/app/companion-experience/CompanionPageClient.tsx");
assert.match(companionPageClient, /searchParams\.get\("conversation"\)/);

// Lifecycle APIs exist for tenant-scoped archive/delete.
assert.ok(fs.existsSync(path.join(ROOT, "app/api/aipify/companion/chat/delete/route.ts")));
assert.ok(fs.existsSync(path.join(ROOT, "app/api/aipify/companion/chat/archive/route.ts")));

// Reply-ready toast wired into global Companion shell.
const shell = read("components/app/companion-experience/CompanionShell.tsx");
assert.match(shell, /CompanionReplyReadyToast/);

console.log("companion-surface-unification.test.ts: all assertions passed");
