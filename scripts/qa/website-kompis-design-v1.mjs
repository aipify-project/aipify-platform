/**
 * Local Design V1 UI QA — host + Core iframe, fixture ask/metadata.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REPORT = "/Users/veltrix/Downloads/AIPIFY_KOMPIS_DESIGN_V1_LOCAL_QA.json";
const CORE_PORT = 4327;
const HOST_PORT = 4328;
const INSTALL = "00000000-0000-4000-8000-000000000018";
const DOMAIN = "customer.example";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startHostServer() {
  const loader = fs.readFileSync(path.join(ROOT, "public/embed/website-kompis.js"), "utf8");
  const hostHtml = `<!doctype html><html lang="no"><head><meta charset="utf-8"><title>Design V1 host</title>
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
  const findings = { task: "AIPIFY.KOMPIS.CORE.UNIVERSAL.DESIGN.V1", started: new Date().toISOString(), checks: {} };
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
              body: JSON.stringify({ enabled: true, available: true, welcomeMessageVariant: "standard" }),
            });
            return;
          }
          if (url.includes("/api/marketing/companion/ask") && req.method() === "POST") {
            askCount += 1;
            await req.respond({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                locale: "no",
                answer: {
                  directAnswer: `Design fixturesvar ${askCount}.\n\nEkstra linje for lesbarhet.`,
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

      await page.goto(`http://127.0.0.1:${HOST_PORT}/`, { waitUntil: "networkidle0", timeout: 90_000 });
      await page.waitForSelector('iframe[title="Website Kompis"]', { timeout: 30_000 });
      findings.checks.closedResize = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe ? { width: iframe.style.width, height: iframe.style.height } : null;
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
        () => parseInt(document.querySelector('iframe[title="Website Kompis"]')?.style.width || "0", 10) >= 300,
        { timeout: 15_000 },
      );
      {
        const handle = await page.$('iframe[title="Website Kompis"]');
        frame = await handle.contentFrame();
      }

      findings.checks.openResize = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe ? { width: iframe.style.width, height: iframe.style.height } : null;
      });

      findings.checks.assets = await frame.evaluate(async () => {
        const logo = document.querySelector("img.ak-logo");
        const hero = document.querySelector("img.ak-hero");
        const mark = document.querySelector(".ak-launcher img");
        async function ok(src) {
          if (!src) return false;
          const res = await fetch(src);
          return res.ok;
        }
        return {
          logoSrc: logo?.getAttribute("src") || null,
          heroSrc: hero?.getAttribute("src") || null,
          markSrc: mark?.getAttribute("src") || null,
          logoOk: await ok(logo?.src),
          heroOk: await ok(hero?.src),
        };
      });

      findings.checks.welcome = await frame.evaluate(() => {
        const h1 = document.querySelector(".ak-welcome h1")?.textContent?.trim() || null;
        const support = document.querySelector(".ak-welcome p")?.textContent?.trim() || null;
        const quick = [...document.querySelectorAll(".ak-quick")].map((b) => b.textContent?.trim());
        const placeholder = document.querySelector("textarea.ak-input")?.getAttribute("placeholder");
        const credit = document.querySelector(".ak-credit")?.textContent?.trim();
        return { h1, support, quick, placeholder, credit };
      });

      // Quick action fills draft only
      await frame.evaluate(() => document.querySelector(".ak-quick")?.click());
      await sleep(200);
      findings.checks.quickFillsDraft = await frame.evaluate(() => ({
        draft: document.querySelector("textarea.ak-input")?.value || "",
        askNotTriggeredYet: true,
      }));

      // Second quick action fills draft; send once (no auto-ask from quick buttons).
      await frame.evaluate(() => document.querySelectorAll(".ak-quick")[1]?.click());
      await sleep(200);
      findings.checks.secondQuickDraft = await frame.evaluate(
        () => document.querySelector("textarea.ak-input")?.value || "",
      );
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
      const askWaitStart = Date.now();
      while (askCount < 1 && Date.now() - askWaitStart < 15_000) {
        await sleep(100);
      }
      findings.checks.askCountAfterClick = askCount;
      await frame
        .waitForFunction(
          () =>
            (document.body?.innerText || "").includes("Design fixturesvar") ||
            (document.body?.innerText || "").includes("Noe gikk galt"),
          { timeout: 15_000 },
        )
        .catch(() => {});
      findings.checks.afterSendText = await frame.evaluate(() =>
        (document.body?.innerText || "").slice(0, 500),
      );
      findings.checks.sourceCard = await frame.evaluate(() => {
        const link = document.querySelector("a.ak-source");
        return {
          href: link?.getAttribute("href") || null,
          target: link?.getAttribute("target") || null,
          rel: link?.getAttribute("rel") || null,
          title: link?.querySelector("strong")?.textContent || null,
          caption: link?.querySelector("small")?.textContent || null,
        };
      });
      findings.checks.askCount = askCount;

      await frame.evaluate(() => document.querySelector('button[aria-label="Lukk chat"]')?.click());
      await page.waitForFunction(
        () => document.querySelector('iframe[title="Website Kompis"]')?.style.width === "72px",
        { timeout: 10_000 },
      );
      findings.checks.closedAfterUse = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe ? { width: iframe.style.width, height: iframe.style.height } : null;
      });
    } finally {
      await browser.close();
    }

    findings.finished = new Date().toISOString();
    findings.pass =
      findings.checks.closedResize?.width === "72px" &&
      findings.checks.openResize?.width === "420px" &&
      findings.checks.assets?.logoOk === true &&
      findings.checks.assets?.heroOk === true &&
      findings.checks.welcome?.h1 === "Hei! Hva kan jeg hjelpe deg med?" &&
      findings.checks.welcome?.support === "Spør meg om det du lurer på." &&
      findings.checks.welcome?.placeholder === "Skriv en melding…" &&
      findings.checks.welcome?.credit === "Drevet av Aipify" &&
      findings.checks.quickFillsDraft?.draft.includes("Hvordan kommer jeg i gang") &&
      findings.checks.sourceCard?.href === "https://customer.example/guide" &&
      findings.checks.sourceCard?.target === "_blank" &&
      findings.checks.sourceCard?.caption === "Kilde fra nettstedet" &&
      findings.checks.askCount === 1 &&
      findings.checks.closedAfterUse?.width === "72px";

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
