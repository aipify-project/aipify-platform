import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type {
  PostP1AuditCheck,
  PostP1UnitTestResult,
} from "./post-p1-companion-production-readiness-types";

export const POST_P1_UNIT_TEST_MATRIX: { phase: string; test_file: string }[] = [
  { phase: "P1.01", test_file: "lib/app/companion/companion-attachments-ui.test.ts" },
  { phase: "P1.02", test_file: "lib/companion-runtime/artifact-context/external-handoff.test.ts" },
  { phase: "P1.03", test_file: "lib/app/companion/chat-queue/chat-queue.test.ts" },
  { phase: "P1.04", test_file: "lib/app/companion/chat-queue/worker-config.test.ts" },
  { phase: "P1.05", test_file: "lib/app/companion/companion-surface-unification.test.ts" },
];

export const POST_P1_COMMIT_RECORDS = [
  { phase: "P1.01", commit_hash: "cd081337", summary: "Secure attachments and active artifact context" },
  { phase: "P1.02", commit_hash: "4bcead7b", summary: "Governed Canva artifact handoff adapter" },
  { phase: "P1.03", commit_hash: "eee46497", summary: "Persistent queue background execution" },
  { phase: "P1.04", commit_hash: "e52bfe81", summary: "Durable background queue worker and recovery" },
  { phase: "P1.05", commit_hash: "62f3c938", summary: "Unify chat surfaces and conversation lifecycle" },
] as const;

function audit(
  check_id: string,
  status: PostP1AuditCheck["status"],
  failure_reason: string | null = null,
): PostP1AuditCheck {
  return { check_id, status, failure_reason };
}

export function runPostP1StaticAudits(repoRoot: string): PostP1AuditCheck[] {
  const checks: PostP1AuditCheck[] = [];
  const requiredPaths = [
    "supabase/migrations/20261910000000_companion_conversation_attachments_post_p1_01.sql",
    "supabase/migrations/20261911000000_companion_canva_artifact_handoff_post_p1_02.sql",
    "supabase/migrations/20261912000000_companion_chat_queue_persistent.sql",
    "supabase/migrations/20261913000000_companion_queue_worker.sql",
    "supabase/migrations/20261914000000_companion_conversation_lifecycle.sql",
    "app/api/cron/companion-queue-worker/route.ts",
    "app/api/aipify/companion/chat/enqueue/route.ts",
    "app/api/aipify/companion/chat/cancel/route.ts",
    "app/api/aipify/companion/chat/retry/route.ts",
    "app/api/aipify/companion/chat/read/route.ts",
    "app/api/aipify/companion/chat/archive/route.ts",
    "app/api/aipify/companion/chat/delete/route.ts",
    "app/api/aipify/companion/attachments/route.ts",
    "components/app/companion-experience/CompanionReplyReadyToast.tsx",
    "components/app/companion-experience/CompanionUnifiedSurface.tsx",
  ];

  for (const relativePath of requiredPaths) {
    const exists = fs.existsSync(path.join(repoRoot, relativePath));
    checks.push(
      audit(
        `path_exists:${relativePath}`,
        exists ? "pass" : "fail",
        exists ? null : `Missing required path ${relativePath}`,
      ),
    );
  }

  const desktopChat = fs.readFileSync(
    path.join(repoRoot, "components/app/desktop/DesktopChatPanel.tsx"),
    "utf8",
  );
  checks.push(
    audit(
      "desktop_chat_uses_unified_surface",
      desktopChat.includes("CompanionUnifiedSurface") ? "pass" : "fail",
      desktopChat.includes("CompanionUnifiedSurface")
        ? null
        : "DesktopChatPanel must delegate to CompanionUnifiedSurface",
    ),
  );
  checks.push(
    audit(
      "desktop_chat_no_legacy_history",
      !desktopChat.includes("/api/aipify/desktop/chat") ? "pass" : "fail",
      desktopChat.includes("/api/aipify/desktop/chat")
        ? "Legacy desktop chat API still referenced"
        : null,
    ),
  );

  const cronRoute = fs.readFileSync(
    path.join(repoRoot, "app/api/cron/companion-queue-worker/route.ts"),
    "utf8",
  );
  checks.push(
    audit(
      "cron_route_requires_secret",
      cronRoute.includes("CRON_SECRET") && cronRoute.includes("authorizeCron") ? "pass" : "fail",
      null,
    ),
  );

  const lifecycleSql = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20261914000000_companion_conversation_lifecycle.sql"),
    "utf8",
  );
  for (const rpc of [
    "archive_companion_conversation",
    "delete_companion_conversation",
    "companion_conversation_audit_logs",
  ]) {
    checks.push(
      audit(
        `lifecycle_rpc:${rpc}`,
        lifecycleSql.includes(rpc) ? "pass" : "fail",
        lifecycleSql.includes(rpc) ? null : `Missing ${rpc} in lifecycle migration`,
      ),
    );
  }

  const queueSql = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20261912000000_companion_chat_queue_persistent.sql"),
    "utf8",
  );
  for (const rpc of ["cancel_companion_queue_item", "retry_companion_queue_item", "enqueue_companion_chat_message"]) {
    checks.push(
      audit(
        `queue_rpc:${rpc}`,
        queueSql.includes(rpc) ? "pass" : "fail",
        queueSql.includes(rpc) ? null : `Missing ${rpc} in queue migration`,
      ),
    );
  }

  const attachmentSql = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20261910000000_companion_conversation_attachments_post_p1_01.sql"),
    "utf8",
  );
  for (const rpc of ["set_companion_active_artifact", "companion_conversation_attachments"]) {
    checks.push(
      audit(
        `attachment_rpc:${rpc}`,
        attachmentSql.includes(rpc) ? "pass" : "fail",
        attachmentSql.includes(rpc) ? null : `Missing ${rpc} in attachment migration`,
      ),
    );
  }

  const workerSql = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20261913000000_companion_queue_worker.sql"),
    "utf8",
  );
  for (const rpc of [
    "companion_queue_worker_claim_batch",
    "companion_queue_worker_recover_stale",
    "companion_queue_worker_complete",
  ]) {
    checks.push(
      audit(
        `worker_rpc:${rpc}`,
        workerSql.includes(rpc) ? "pass" : "fail",
        workerSql.includes(rpc) ? null : `Missing ${rpc} in worker migration`,
      ),
    );
  }

  return checks;
}

export function runPostP1UnitTests(repoRoot: string): PostP1UnitTestResult[] {
  return POST_P1_UNIT_TEST_MATRIX.map(({ phase, test_file }) => {
    try {
      execSync(`npx --yes tsx ${test_file}`, {
        cwd: repoRoot,
        stdio: "pipe",
        encoding: "utf8",
      });
      return { phase, test_file, status: "pass" as const, failure_reason: null };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.slice(0, 500)
          : "Unit test execution failed.";
      return { phase, test_file, status: "fail" as const, failure_reason: message };
    }
  });
}
