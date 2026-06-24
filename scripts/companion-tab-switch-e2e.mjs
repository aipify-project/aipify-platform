#!/usr/bin/env node
/**
 * Tab-switch stability check for Companion — uses Playwright (npx, not committed dep).
 * Never logs secrets.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { generate } from "otplib";
import {
  buildSupabaseAuthCookieHeader,
  buildSupabaseAuthPlaywrightCookies,
} from "./lib/companion-e2e-auth.mjs";

const BASE_URL = (process.env.COMPANION_E2E_BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const parsed = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && value) parsed[key] = value;
  }
  return parsed;
}

function loadEnv() {
  for (const file of [".env.local", ".env.vercel.prod"]) {
    for (const [key, value] of Object.entries(parseEnvFile(path.join(process.cwd(), file)))) {
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
  const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  const raw = execSync(`npx supabase projects api-keys --project-ref ${ref} -o json`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.keys ?? [];
  const key = entries.find((entry) => entry.name === "service_role")?.api_key;
  if (!key?.trim()) throw new Error("service_role unavailable");
  return key.trim();
}

function authCookieHeader(session) {
  return buildSupabaseAuthCookieHeader(session);
}

async function authenticateSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.APP_LIVE_E2E_EMAIL?.trim()?.toLowerCase();
  const anon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const serviceRole = resolveServiceRoleKey();
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${BASE_URL}/app/command-center` },
  });
  if (linkError || !linkData?.properties?.hashed_token) throw new Error(linkError?.message ?? "magiclink failed");
  const { data: otpData, error: otpError } = await anon.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpError || !otpData.session) throw new Error(otpError?.message ?? "verify failed");
  return otpData.session;
}

async function completeTwoFactorIfRequired(session) {
  const cookie = authCookieHeader(session);
  const statusRes = await fetch(`${BASE_URL}/api/auth/2fa/status`, {
    headers: { Cookie: cookie },
  });
  if (!statusRes.ok) return { required: false, completed: false };

  const status = await statusRes.json().catch(() => null);
  if (!status?.needs_verification) {
    return { required: Boolean(status?.enabled), completed: true };
  }

  const { decryptTotpSecret } = await import("../lib/auth/two-factor/encryption.ts");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authed = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
  });
  await authed.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const { data: encrypted, error: secretError } = await authed.rpc("_tfa_get_active_secret_encrypted");
  if (secretError || !encrypted) {
    throw new Error("2FA verification required but active secret unavailable");
  }

  const secret = decryptTotpSecret(String(encrypted));
  const code = await generate({ secret, strategy: "totp", digits: 6, period: 30 });

  const challengeRes = await fetch(`${BASE_URL}/api/auth/2fa/challenge`, {
    method: "POST",
    headers: { Cookie: cookie },
  });
  const challengeJson = await challengeRes.json().catch(() => ({}));
  if (!challengeRes.ok || !challengeJson.challengeId) {
    throw new Error("2FA challenge creation failed");
  }

  const verifyRes = await fetch(`${BASE_URL}/api/auth/2fa/verify`, {
    method: "POST",
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: challengeJson.challengeId, code }),
  });
  if (!verifyRes.ok) {
    throw new Error("2FA verification failed");
  }

  return { required: true, completed: true };
}

function buildAuthCookies(session) {
  return buildSupabaseAuthPlaywrightCookies(session, BASE_URL);
}

async function launchBrowser(chromium) {
  const launchOptions = { headless: true };
  try {
    return await chromium.launch({ ...launchOptions, channel: "chrome" });
  } catch {
    const chromiumPath =
      process.env.PLAYWRIGHT_CHROMIUM_PATH ??
      `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
    if (fs.existsSync(chromiumPath)) {
      return chromium.launch({ ...launchOptions, executablePath: chromiumPath });
    }
    return chromium.launch(launchOptions);
  }
}

const COMPANION_UI_SESSION_KEY = "aipify.companion.ui.v1";

async function sendCompanionMessage(session, conversationId, question) {
  const clientMessageId = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timeZone = "Europe/Oslo";
  const res = await fetch(`${BASE_URL}/api/aipify/companion/chat/enqueue`, {
    method: "POST",
    headers: {
      Cookie: authCookieHeader(session),
      "Content-Type": "application/json",
      "x-timezone": timeZone,
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      idempotency_key: `${conversationId}:${clientMessageId}`,
      question,
      locale: "no",
      timezone: timeZone,
      companion_active: true,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.execution !== "direct") {
    throw new Error(json.error ?? "companion enqueue failed during tab-switch setup");
  }
  return json;
}

async function fetchChatState(session, conversationId) {
  const res = await fetch(
    `${BASE_URL}/api/aipify/companion/chat/state?conversation_id=${encodeURIComponent(conversationId)}`,
    { headers: { Cookie: authCookieHeader(session) } },
  );
  if (!res.ok) return null;
  return res.json();
}

async function readCompanionUiSession(page) {
  return page.evaluate((storageKey) => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, COMPANION_UI_SESSION_KEY);
}

async function completeTwoFactorInBrowser(page, session) {
  if (!page.url().includes("/verify-2fa")) return false;

  const { decryptTotpSecret } = await import("../lib/auth/two-factor/encryption.ts");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authed = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
  });
  await authed.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  const { data: encrypted, error: secretError } = await authed.rpc("_tfa_get_active_secret_encrypted");
  if (secretError || !encrypted) {
    throw new Error("2FA browser gate: active secret unavailable");
  }
  const secret = decryptTotpSecret(String(encrypted));
  const code = await generate({ secret, strategy: "totp", digits: 6, period: 30 });
  await page.locator('input[inputmode="numeric"], input[autocomplete="one-time-code"]').first().fill(code);
  await page.getByRole("button", { name: /verify|verifiser|bekreft/i }).click();
  await page.waitForURL(/\/app\//, { timeout: 30000 });
  return true;
}

async function isCompanionPanelOpen(page) {
  const dialogVisible = await page
    .locator('[role="dialog"][aria-hidden="false"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (dialogVisible) return true;
  const ui = await readCompanionUiSession(page);
  return ui?.panelOpen === true;
}
async function resolveOrganizationKey(session) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const client = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
  });
  await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  const { data } = await client.rpc("get_app_organization_context");
  return typeof data?.organization_id === "string" ? data.organization_id : null;
}

async function main() {
  loadEnv();
  const session = await authenticateSession();
  const twoFactor = await completeTwoFactorIfRequired(session);
  const organizationKey = await resolveOrganizationKey(session);
  const conversationId = randomUUID();
  await sendCompanionMessage(session, conversationId, "Hva er klokken nå?");
  let chatState = await fetchChatState(session, conversationId);
  const setupMessages = Array.isArray(chatState?.messages) ? chatState.messages : [];
  if (setupMessages.length < 2) {
    throw new Error("expected seeded conversation with user and assistant messages");
  }

  const { chromium } = await import("playwright");
  const browser = await launchBrowser(chromium);
  const context = await browser.newContext();
  await context.addInitScript(
    ({ storageKey, conversationId, organizationKey }) => {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          version: 1,
          panelOpen: true,
          activeConversationId: conversationId,
          draftText: "",
          scrollTop: 0,
          organizationKey,
          pathname: "/app/command-center",
          updatedAt: Date.now(),
        }),
      );
    },
    { storageKey: COMPANION_UI_SESSION_KEY, conversationId, organizationKey },
  );
  await context.addCookies(buildAuthCookies(session));
  const page = await context.newPage();

  const mountLog = [];
  const requestLog = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[companion-mount]")) mountLog.push(text);
  });
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/api/aipify/companion/")) {
      requestLog.push({ method: req.method(), url: url.replace(BASE_URL, "") });
    }
  });

  let navigations = 0;
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) navigations += 1;
  });

  await page.goto(`${BASE_URL}/app/command-center`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await completeTwoFactorInBrowser(page, session).catch(() => false);
  if (page.url().includes("/verify-2fa")) {
    throw new Error(`still on 2FA gate after browser verify: ${page.url()}`);
  }
  await page.waitForTimeout(3000);
  const landedUrl = page.url();

  let panelOpenBefore = await isCompanionPanelOpen(page);

  if (!panelOpenBefore) {
    const floating = page.locator("[data-companion-floating]");
    if (await floating.isVisible().catch(() => false)) {
      await floating.click();
      await page.waitForTimeout(1500);
      panelOpenBefore = await isCompanionPanelOpen(page);
    }
  }

  if (!panelOpenBefore) {
    throw new Error(`companion panel did not open (url=${landedUrl.replace(BASE_URL, "")})`);
  }

  const uiAfterSend = await readCompanionUiSession(page);
  const activeConversationId = uiAfterSend?.activeConversationId ?? conversationId;
  if (!activeConversationId) {
    throw new Error("companion session missing activeConversationId after seeded reload");
  }

  chatState = await fetchChatState(session, activeConversationId);
  const messagesBefore = Array.isArray(chatState?.messages) ? chatState.messages : setupMessages;
  const messageIdsBefore = messagesBefore.map((m) => m.id).filter(Boolean);
  const messageCountBefore = messagesBefore.length;
  const organizationKeyBefore = uiAfterSend?.organizationKey ?? organizationKey;

  const requestsBefore = requestLog.length;
  navigations = 0;
  const mountLogStartIndex = mountLog.length;

  const panelOpenForSwitch = await isCompanionPanelOpen(page);

  const mountsBefore = mountLog.slice(mountLogStartIndex).filter((l) => l.includes('"event":"mount"')).length;
  const unmountsBefore = mountLog.slice(mountLogStartIndex).filter((l) => l.includes('"event":"unmount"')).length;

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(800);

  const uiAfterVisibility = await readCompanionUiSession(page);
  const conversationAfter = uiAfterVisibility?.activeConversationId ?? null;
  const organizationKeyAfter = uiAfterVisibility?.organizationKey ?? null;
  chatState = await fetchChatState(session, conversationAfter ?? conversationId);
  const messagesAfter = Array.isArray(chatState?.messages) ? chatState.messages : [];
  const messageIdsAfter = messagesAfter.map((m) => m.id).filter(Boolean);
  const messageCountAfter = messagesAfter.length;
  const duplicateMessages =
    messageIdsAfter.length !== new Set(messageIdsAfter).size ||
    messageCountAfter > messageCountBefore;

  const visibilityMountSlice = mountLog.slice(mountLogStartIndex);
  const mountsAfter = visibilityMountSlice.filter((l) => l.includes('"event":"mount"')).length;
  const unmountsAfter = visibilityMountSlice.filter((l) => l.includes('"event":"unmount"')).length;
  const organizationKeysSeen = visibilityMountSlice
    .filter((line) => line.includes('"event":"visibility_visible"'))
    .map((line) => {
      try {
        return JSON.parse(line.replace(/^\[companion-mount\]\s*/, "")).organizationKey ?? null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const organizationKeyFlicker =
    organizationKeysSeen.length > 1 &&
    new Set(organizationKeysSeen).size > 1;

  const panelOpenAfter = await isCompanionPanelOpen(page);
  const requestsAfter = requestLog.length;
  const requestDelta = requestsAfter - requestsBefore;

  const mountDelta = mountsAfter - mountsBefore;
  const unmountDelta = unmountsAfter - unmountsBefore;
  const conversationBefore = activeConversationId;
  const historyStable =
    messageCountAfter === messageCountBefore &&
    messageIdsBefore.every((id) => messageIdsAfter.includes(id));
  const pass =
    mountDelta === 0 &&
    unmountDelta === 0 &&
    panelOpenForSwitch &&
    panelOpenAfter &&
    conversationBefore !== null &&
    conversationAfter === conversationBefore &&
    historyStable &&
    !duplicateMessages &&
    !organizationKeyFlicker &&
    navigations === 0 &&
    requestDelta === 0;

  console.log(
    JSON.stringify({
      phase: "tab_switch",
      pass,
      two_factor: twoFactor,
      landed_url: landedUrl.replace(BASE_URL, ""),
      panel_open_before: panelOpenForSwitch,
      panel_open_after: panelOpenAfter,
      conversation_id_before: conversationBefore,
      conversation_id_after: conversationAfter,
      organization_key_before: organizationKeyBefore,
      organization_key_after: organizationKeyAfter,
      organization_key_flicker: organizationKeyFlicker,
      message_count_before: messageCountBefore,
      message_count_after: messageCountAfter,
      message_ids_before: messageIdsBefore,
      message_ids_after: messageIdsAfter,
      history_stable: historyStable,
      duplicate_messages: duplicateMessages,
      mount_events_before: mountsBefore,
      mount_events_after: mountsAfter,
      mount_delta: mountDelta,
      unmount_delta: unmountDelta,
      page_navigations: navigations,
      companion_request_delta: requestDelta,
      companion_requests_after_visibility: requestLog.slice(requestsBefore, requestsAfter),
      recent_mount_logs: visibilityMountSlice.slice(-8),
      mount_counters: Object.fromEntries(
        [...new Set(visibilityMountSlice.map((line) => {
          try {
            const parsed = JSON.parse(line.replace(/^\[companion-mount\]\s*/, ""));
            return parsed.component;
          } catch {
            return null;
          }
        }).filter(Boolean))].map((name) => [name, {
          mounts: visibilityMountSlice.filter((l) => l.includes(`"component":"${name}"`) && l.includes('"event":"mount"')).length,
          unmounts: visibilityMountSlice.filter((l) => l.includes(`"component":"${name}"`) && l.includes('"event":"unmount"')).length,
        }]),
      ),
      checks: {
        no_remount: mountDelta === 0 && unmountDelta === 0,
        panel_stays_open: panelOpenAfter,
        conversation_stable: conversationAfter === conversationBefore && conversationBefore !== null,
        history_stable: historyStable,
        no_duplicates: !duplicateMessages,
        no_org_key_flicker: !organizationKeyFlicker,
        no_full_refresh: navigations === 0,
        no_refetch_storm: requestDelta === 0,
      },
    }),
  );

  await browser.close();
  process.exit(pass ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({ phase: "tab_switch_fatal", message: error.message }));
  process.exit(1);
});
