#!/usr/bin/env node
/**
 * Prepare chunked SQL files for Supabase MCP apply_migration/execute_sql.
 * Splits large migration payloads into <18KB chunks for agent CallMcpTool calls.
 *
 * Usage:
 *   node scripts/mcp-chunked-apply-runner.mjs prepare <index>
 *   node scripts/mcp-chunked-apply-runner.mjs chunks <index>
 *   node scripts/mcp-chunked-apply-runner.mjs mark-ok
 *   node scripts/mcp-chunked-apply-runner.mjs mark-baseline
 *   node scripts/mcp-chunked-apply-runner.mjs mark-fail "message"
 *   node scripts/mcp-chunked-apply-runner.mjs status
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = '/tmp/aipify-mcp-apply-state.json';
const PENDING = '/tmp/aipify-pending-migrations.json';
const BATCH_DIR = '/tmp/aipify-mcp-batch';
const CHUNK_DIR = '/tmp/aipify-mcp-chunks';
const LOG_FILE = '/tmp/aipify-migration-apply-run.log';
const TOTAL = 507;
const MAX_CHUNK = 18000;

function loadState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
function getPayload(index) {
  const f = path.join(BATCH_DIR, `${String(index).padStart(4, '0')}.json`);
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}
function logProgress(n, file) {
  if (n % 10 !== 0) return;
  const line = `[${n}/${TOTAL}] applied ${file}`;
  fs.appendFileSync(LOG_FILE, line + '\n');
  console.error(line);
}
function splitSql(sql) {
  const sections = sql.split(/\n(?=-- -{10,})/);
  const chunks = [];
  let buf = '';
  for (const sec of sections) {
    if ((buf + sec).length > MAX_CHUNK && buf) {
      chunks.push(buf.trim());
      buf = sec;
    } else {
      buf += (buf ? '\n' : '') + sec;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  if (chunks.length === 0) chunks.push(sql);
  return chunks;
}

const [,, cmd, arg] = process.argv;

if (cmd === 'status') {
  console.log(JSON.stringify(loadState(), null, 2));
} else if (cmd === 'prepare' || cmd === 'chunks') {
  const state = loadState();
  const index = Number(arg ?? state.lastIndex + 1);
  if (index > 506) {
    console.log(JSON.stringify({ done: true, state }));
    process.exit(0);
  }
  const payload = getPayload(index);
  const pending = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
  const chunks = splitSql(payload.query);
  const dir = path.join(CHUNK_DIR, String(index).padStart(4, '0'));
  fs.mkdirSync(dir, { recursive: true });
  chunks.forEach((c, i) => {
    fs.writeFileSync(path.join(dir, `chunk-${String(i).padStart(2, '0')}.sql`), c);
  });
  const meta = {
    index,
    file: pending[index].file,
    name: payload.name,
    version: payload.version,
    project_id: payload.project_id,
    chunk_count: chunks.length,
    chunk_dir: dir,
    chunk_sizes: chunks.map((c) => c.length),
  };
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log(JSON.stringify(meta));
} else if (cmd === 'mark-ok') {
  const state = loadState();
  const pending = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
  const index = state.lastIndex + 1;
  state.appliedThisRun = (state.appliedThisRun || 0) + 1;
  state.failed = null;
  state.lastIndex = index;
  state.lastFile = pending[index].file;
  saveState(state);
  logProgress(index + 1, pending[index].file);
  console.log(JSON.stringify(state));
} else if (cmd === 'mark-baseline') {
  const state = loadState();
  const pending = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
  const index = state.lastIndex + 1;
  state.baselined = (state.baselined || 0) + 1;
  state.failed = null;
  state.lastIndex = index;
  state.lastFile = pending[index].file;
  saveState(state);
  logProgress(index + 1, pending[index].file);
  console.log(JSON.stringify(state));
} else if (cmd === 'mark-fail') {
  const state = loadState();
  const pending = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
  const index = state.lastIndex + 1;
  state.failed = { index, file: pending[index].file, message: arg || 'unknown' };
  saveState(state);
  console.log(JSON.stringify(state));
  process.exit(1);
} else {
  console.error('prepare|chunks <index> | mark-ok | mark-baseline | mark-fail | status');
  process.exit(1);
}
