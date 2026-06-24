#!/usr/bin/env node
/**
 * Report and time-out stuck companion queue jobs.
 * Usage: source .env.local && node scripts/companion-queue-cleanup-stuck.mjs [--apply]
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const apply = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function countByStatus(status) {
  const { count, error } = await supabase
    .from("companion_message_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

const [queuedCount, processingCount, timedOutCount] = await Promise.all([
  countByStatus("waiting"),
  countByStatus("processing"),
  countByStatus("timed_out"),
]);

console.log(
  JSON.stringify(
    {
      phase: "report",
      queued: queuedCount,
      processing: processingCount,
      timed_out: timedOutCount,
    },
    null,
    2,
  ),
);

const { data: stuck, error } = await supabase
  .from("companion_message_queue")
  .select(
    "id, conversation_id, status, route_type, created_at, started_at, last_heartbeat_at, lease_owner, lease_expires_at, attempt_count, error_code",
  )
  .eq("status", "processing");

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

const rows = stuck ?? [];
console.log(`\nFound ${rows.length} processing job(s) to inspect`);

let leasesReleased = 0;
let orphanedConversationJobs = 0;

for (const row of rows) {
  const { data: conv } = await supabase
    .from("companion_conversations")
    .select("id, deleted_at")
    .eq("id", row.conversation_id)
    .maybeSingle();

  const orphaned = !conv || conv.deleted_at;
  if (orphaned) orphanedConversationJobs += 1;

  console.log(
    JSON.stringify(
      {
        queue_id: row.id,
        conversation_id: row.conversation_id,
        orphaned_conversation: orphaned,
        route_type: row.route_type,
        created_at: row.created_at,
        started_at: row.started_at,
        last_heartbeat_at: row.last_heartbeat_at,
        lease_owner: row.lease_owner,
        lease_expires_at: row.lease_expires_at,
        attempt_count: row.attempt_count,
      },
      null,
      2,
    ),
  );

  if (apply) {
    const { data: result, error: failError } = await supabase.rpc("companion_queue_worker_fail", {
      p_queue_id: row.id,
      p_worker_id: row.lease_owner ?? "cleanup-script",
      p_error_code: "timed_out",
      p_error_message: "manual_cleanup_timed_out",
      p_retryable: false,
    });
    if (failError) {
      console.error(`  fail ${row.id}:`, failError.message);
    } else {
      leasesReleased += 1;
      console.log(`  -> timed_out`, result);
    }
  }
}

if (apply) {
  const processingAfter = await countByStatus("processing");
  console.log(
    JSON.stringify(
      {
        phase: "apply_complete",
        leases_released: leasesReleased,
        orphaned_conversation_jobs: orphanedConversationJobs,
        processing_remaining: processingAfter,
      },
      null,
      2,
    ),
  );
} else if (rows.length > 0) {
  console.log("\nRe-run with --apply to mark jobs timed_out (no auto-retry).");
}
