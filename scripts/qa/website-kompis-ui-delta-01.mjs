/**
 * Local UI.DELTA.01 QA — avatar, compact thinking, credit link, locale host binding.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REPORT = "/Users/veltrix/Downloads/AIPIFY_KOMPIS_UI_DELTA_01_LOCAL_QA.json";
const CORE_PORT = 4331;
const HOST_PORT = 4332;
const INSTALL = "00000000-0000-4000-8000-000000000019";
const DOMAIN = "customer.example";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EXPECTED_AVATAR_SHA =
  "9646db7d446c150c8567dd28b812c82ba9c66d435e83e08106a8915951a41ef6";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startHostServer() {
  const loader = fs.readFileSync(path.join(ROOT, "public/embed/website-kompis.js"), "utf8");
  const hostHtml = `<!doctype html><html lang="no"><head><meta charset="utf-8"><title>UI delta host</title>
<style>body{margin:0;background:#1b2430;color:#e8eef7;font-family:system-ui}main{padding:40px}</style></head>
<body><main><h1>Host</h1></main>
<script src="http://127.0.0.1:${HOST_PORT}/embed/website-kompis.js"
  data-install-id="${INSTALL}" data-domain="${DOMAIN}" data-locale="no"
  data-core-origin="http://127.0.0.1:${CORE_PORT}"></script></body></html>`;
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith("/embed/website-kompis.js")) {
      res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
      res.end(loader);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(hostHtml);
  });
  return new Promise((resolve) => server.listen(HOST_PORT, "127.0.0.1", () => resolve(server)));
}

function startNextDev() {
  const child = spawn("npx", ["next", "dev", "-p", String(CORE_PORT), "-H", "127.0.0.1"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(CORE_PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let ready = false;
  let buf = "";
  const on = (chunk) => {
    buf += chunk.toString();
    if (/Ready in|Local:/i.test(buf)) ready = true;
  };
  child.stdout.on("data", on);
  child.stderr.on("data", on);
  return {
    async waitReady(timeoutMs = 180_000) {
      const start = Date.now();
      while (!ready && Date.now() - start < timeoutMs) {
        if (child.exitCode != null) throw new Error(buf.slice(-2000));
        await sleep(400);
      }
      if (!ready) throw new Error(buf.slice(-2000));
    },
    stop() {
      try {
        child.kill("SIGTERM");
      } catch {
        /* ignore */
      }
    },
  };
}

async function main() {
  const findings = {
    task: "AIPIFY.KOMPIS.CORE.UI.DELTA.01",
    started: new Date().toISOString(),
    checks: {},
  };

  const avatarPng = fs.readFileSync(
    path.join(ROOT, "public/website-kompis/design-v1/images/aipify-kompis-avatar.png"),
  );
  findings.checks.avatarSha = createHash("sha256").update(avatarPng).digest("hex");
  findings.checks.avatarShaOk = findings.checks.avatarSha === EXPECTED_AVATAR_SHA;

  const host = await startHostServer();
  const next = startNextDev();
  try {
    await next.waitReady();
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({
      executablePath: CHROME,
      headless: true,
      args: ["--no-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      let askCount = 0;
      let releaseAsk = null;
      const askGate = new Promise((resolve) => {
        releaseAsk = resolve;
      });

      await page.setRequestInterception(true);
      page.on("request", async (req) => {
        const url = req.url();
        const type = req.resourceType();
        try {
          if (type !== "fetch" && type !== "xhr") {
            await req.continue();
            return;
          }
          if (url.includes("/api/embed/companion/launcher-icon")) {
            await req.respond({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                enabled: true,
                available: true,
                welcomeMessageVariant: "standard",
              }),
            });
            return;
          }
          if (url.includes("/api/marketing/companion/ask") && req.method() === "POST") {
            askCount += 1;
            await askGate;
            await req.respond({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                locale: "no",
                answer: {
                  directAnswer: `Delta fixturesvar ${askCount}.`,
                  explanation: null,
                  steps: [],
                },
                actions: [],
                sources: [{ title: "Eksempelguide", route: "https://customer.example/guide" }],
                confidence: { level: "high", score: 0.9 },
                supportEscalation: { offered: false, reason: null },
              }),
            });
            return;
          }
          await req.continue();
        } catch {
          /* ignore */
        }
      });

      await page.goto(`http://127.0.0.1:${HOST_PORT}/`, {
        waitUntil: "networkidle0",
        timeout: 90_000,
      });
      await page.waitForSelector('iframe[title="Website Kompis"]', { timeout: 30_000 });

      findings.checks.iframeSandbox = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe?.getAttribute("sandbox");
      });
      findings.checks.iframeSrcLocale = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe?.src || null;
      });

      let frame = null;
      {
        const handle = await page.$('iframe[title="Website Kompis"]');
        const start = Date.now();
        while (Date.now() - start < 45_000) {
          frame = (await handle.contentFrame()) || null;
          if (frame?.url().includes("/embed/website-kompis")) break;
          await sleep(250);
        }
      }
      if (!frame) throw new Error("embed frame missing");

      await frame.waitForSelector('button[aria-label="Åpne Kompis"]', { timeout: 30_000 });
      await frame.evaluate(() => document.querySelector('button[aria-label="Åpne Kompis"]')?.click());
      await page.waitForFunction(
        () =>
          parseInt(
            document.querySelector('iframe[title="Website Kompis"]')?.style.width || "0",
            10,
          ) >= 300,
        { timeout: 15_000 },
      );
      {
        const handle = await page.$('iframe[title="Website Kompis"]');
        frame = await handle.contentFrame();
      }

      findings.checks.avatar = await frame.evaluate(() => {
        const hero = document.querySelector("img.ak-hero");
        const logo = document.querySelector("img.ak-logo");
        const mark = document.querySelector(".ak-launcher img");
        return {
          heroSrc: hero?.getAttribute("src") || null,
          logoSrc: logo?.getAttribute("src") || null,
          markSrc: mark?.getAttribute("src") || null,
        };
      });

      findings.checks.credit = await frame.evaluate(() => {
        const link = document.querySelector(".ak-credit a");
        return {
          text: link?.textContent?.trim() || null,
          href: link?.getAttribute("href") || null,
          target: link?.getAttribute("target") || null,
          rel: link?.getAttribute("rel") || null,
        };
      });

      findings.checks.welcomeLocaleNo = await frame.evaluate(() => ({
        h1: document.querySelector(".ak-welcome h1")?.textContent?.trim() || null,
        placeholder: document.querySelector("textarea.ak-input")?.getAttribute("placeholder"),
        openLabel: document.querySelector(".ak-launcher")?.getAttribute("aria-label") || null,
      }));

      await frame.evaluate(() => document.querySelector(".ak-quick")?.click());
      await sleep(200);
      {
        const handle = await page.$('iframe[title="Website Kompis"]');
        frame = await handle.contentFrame();
      }
      await frame.waitForFunction(
        () => {
          const btn = document.querySelector("button.ak-send");
          const ta = document.querySelector("textarea.ak-input");
          return btn && !btn.disabled && (ta?.value || "").trim().length > 0;
        },
        { timeout: 5_000 },
      );
      await frame.click("button.ak-send");

      const pendingStart = Date.now();
      while (askCount < 1 && Date.now() - pendingStart < 15_000) {
        await sleep(50);
      }

      findings.checks.pending = await frame.evaluate(() => {
        const row = document.querySelector(".ak-thinking-row");
        const thinking = document.querySelector(".ak-thinking");
        const status = document.querySelector(".ak-thinking-row [role='status']");
        const statusClass = status?.className || "";
        const visibleStatusText = (() => {
          if (!status) return null;
          const style = window.getComputedStyle(status);
          const clipped =
            style.position === "absolute" &&
            (style.clip === "rect(0px, 0px, 0px, 0px)" ||
              style.clipPath === "inset(50%)" ||
              statusClass.includes("ak-sr-only") ||
              statusClass.includes("sr-only"));
          return clipped ? null : status.textContent?.trim() || null;
        })();
        const emptyBubble = !!document.querySelector(".ak-thinking-row .ak-bubble");
        const rect = thinking?.getBoundingClientRect();
        return {
          hasThinkingRow: !!row,
          hasThinking: !!thinking,
          statusText: status?.textContent?.trim() || null,
          visibleStatusText,
          emptyBubble,
          thinkingWidth: rect ? Math.round(rect.width) : null,
          thinkingHeight: rect ? Math.round(rect.height) : null,
          rowMinHeight: row ? parseInt(window.getComputedStyle(row).minHeight, 10) : null,
        };
      });

      releaseAsk?.();
      await frame
        .waitForFunction(
          () =>
            (document.body?.innerText || "").includes("Delta fixturesvar") ||
            (document.body?.innerText || "").includes("Noe gikk galt"),
          { timeout: 15_000 },
        )
        .catch(() => {});

      findings.checks.afterAnswer = await frame.evaluate(() => ({
        thinkingGone: !document.querySelector(".ak-thinking-row"),
        hasAnswer: (document.body?.innerText || "").includes("Delta fixturesvar"),
        emptyAssistantBubble: [...document.querySelectorAll(".ak-row .ak-bubble")].some(
          (el) => !(el.textContent || "").trim(),
        ),
      }));

      findings.checks.askCount = askCount;
      findings.checks.closedResize = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe ? { width: iframe.style.width, height: iframe.style.height } : null;
      });
    } finally {
      await browser.close();
    }

    findings.finished = new Date().toISOString();
    findings.pass =
      findings.checks.avatarShaOk === true &&
      findings.checks.avatar?.heroSrc?.includes("aipify-kompis-avatar") === true &&
      findings.checks.avatar?.logoSrc?.includes("aipify-logo") === true &&
      findings.checks.avatar?.markSrc?.includes("aipify-mark") === true &&
      findings.checks.credit?.href === "https://aipify.ai" &&
      findings.checks.credit?.target === "_blank" &&
      findings.checks.credit?.rel?.includes("noopener") === true &&
      findings.checks.credit?.text === "Drevet av Aipify" &&
      findings.checks.welcomeLocaleNo?.h1 === "Hei! Hva kan jeg hjelpe deg med?" &&
      findings.checks.iframeSrcLocale?.includes("locale=no") === true &&
      findings.checks.iframeSandbox == null &&
      findings.checks.pending?.hasThinkingRow === true &&
      findings.checks.pending?.emptyBubble === false &&
      findings.checks.pending?.visibleStatusText == null &&
      findings.checks.pending?.thinkingWidth != null &&
      findings.checks.pending.thinkingWidth <= 48 &&
      findings.checks.pending?.rowMinHeight === 48 &&
      findings.checks.afterAnswer?.thinkingGone === true &&
      findings.checks.afterAnswer?.hasAnswer === true &&
      findings.checks.afterAnswer?.emptyAssistantBubble === false &&
      findings.checks.askCount === 1;

    fs.writeFileSync(REPORT, JSON.stringify(findings, null, 2));
    console.log(JSON.stringify({ report: REPORT, pass: findings.pass, checks: findings.checks }, null, 2));
    if (!findings.pass) process.exitCode = 2;
  } catch (error) {
    findings.error = String(error?.stack || error);
    findings.finished = new Date().toISOString();
    fs.writeFileSync(REPORT, JSON.stringify(findings, null, 2));
    console.error(findings.error);
    process.exitCode = 1;
  } finally {
    next.stop();
    host.close();
  }
}

main();
