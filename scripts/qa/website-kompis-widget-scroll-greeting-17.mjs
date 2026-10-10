/**
 * Local interaction QA for SCROLL.AND.GREETING.17
 * Host page (4318) + Core Next embed (4317) with ask/metadata stubs via request interception.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = "/Users/veltrix/Downloads";
const REPORT = path.join(OUT_DIR, "AIPIFY_KOMPIS_WIDGET_SCROLL_GREETING_17_LOCAL_QA.json");
const CORE_PORT = 4317;
const HOST_PORT = 4318;
const INSTALL = "00000000-0000-4000-8000-000000000017";
const DOMAIN = "customer.example";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const LONG_ANSWER =
  "Dette er et langt fixturesvar.\n\n" +
  Array.from({ length: 24 }, (_, i) => `Avsnitt ${i + 1}: ekstra kontekst for scroll-test.`).join(
    "\n\n",
  );

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startHostServer() {
  const loader = fs.readFileSync(path.join(ROOT, "public/embed/website-kompis.js"), "utf8");
  const hostHtml = `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <title>Kompis scroll greeting host fixture</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #1b2430; color: #e8eef7; }
    main { padding: 48px 24px; max-width: 720px; }
    h1 { font-size: 28px; margin: 0 0 12px; }
    p { line-height: 1.5; opacity: 0.9; }
    .marker { margin-top: 120vh; padding: 24px; background: #243041; border-radius: 12px; }
  </style>
</head>
<body>
  <main>
    <h1>Host fixture</h1>
    <p>Cross-origin host for Website Kompis embed QA. Dark background makes white overlay obvious.</p>
    <div class="marker">Scroll marker (host page should not jump when chat scrolls).</div>
  </main>
  <script
    src="http://127.0.0.1:${HOST_PORT}/embed/website-kompis.js"
    data-install-id="${INSTALL}"
    data-domain="${DOMAIN}"
    data-locale="no"
    data-core-origin="http://127.0.0.1:${CORE_PORT}"
  ></script>
</body>
</html>`;

  const server = http.createServer((req, res) => {
    if (req.url?.startsWith("/embed/website-kompis.js")) {
      res.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(loader);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(hostHtml);
  });
  return new Promise((resolve) => {
    server.listen(HOST_PORT, "127.0.0.1", () => resolve(server));
  });
}

function startNextDev() {
  const child = spawn("npx", ["next", "dev", "-p", String(CORE_PORT), "-H", "127.0.0.1"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(CORE_PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let ready = false;
  let buf = "";
  const onData = (chunk) => {
    buf += chunk.toString();
    if (/Ready in|Local:/i.test(buf)) ready = true;
  };
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);
  return {
    child,
    async waitReady(timeoutMs = 180_000) {
      const start = Date.now();
      while (!ready && Date.now() - start < timeoutMs) {
        if (child.exitCode != null) {
          throw new Error(`next exited ${child.exitCode}\n${buf.slice(-2000)}`);
        }
        await sleep(400);
      }
      if (!ready) throw new Error(`next dev not ready\n${buf.slice(-2000)}`);
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
    task: "AIPIFY.KOMPIS.PUBLIC.WIDGET.SCROLL.AND.GREETING.17",
    started: new Date().toISOString(),
    checks: {},
  };

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
          // Never stall document/script/style navigations (iframe load).
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
            const long = askCount >= 3;
            await req.respond({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                locale: "no",
                answer: {
                  directAnswer: long ? LONG_ANSWER : `Kort fixturesvar nummer ${askCount}.`,
                  explanation: null,
                  steps: [],
                },
                actions: [],
                sources:
                  askCount === 2
                    ? [{ title: "Eksempelside", href: "https://customer.example/info" }]
                    : [],
                confidence: { level: "high", score: 0.9 },
                supportEscalation: { offered: false, reason: null },
              }),
            });
            return;
          }
          await req.continue();
        } catch {
          /* request may already be handled */
        }
      });

      await page.goto(`http://127.0.0.1:${HOST_PORT}/`, {
        waitUntil: "networkidle0",
        timeout: 90_000,
      });

      await page.waitForSelector('iframe[title="Website Kompis"]', { timeout: 30_000 });
      const iframeHandle = await page.$('iframe[title="Website Kompis"]');
      let frame = null;
      const frameWaitStart = Date.now();
      while (Date.now() - frameWaitStart < 45_000) {
        frame = await iframeHandle.contentFrame();
        if (frame && frame.url().includes("/embed/website-kompis")) break;
        frame = page.frames().find((f) => f.url().includes("/embed/website-kompis")) || null;
        if (frame) break;
        await sleep(250);
      }
      if (!frame) throw new Error("embed frame missing after wait");

      findings.checks.closedResize = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        if (!iframe) return null;
        return {
          width: iframe.style.width,
          height: iframe.style.height,
          background: iframe.style.background,
        };
      });

      await frame.waitForSelector('button[aria-label="Åpne Website Kompis"]', { timeout: 30_000 });
      await frame.click('button[aria-label="Åpne Website Kompis"]');
      await sleep(1000);

      findings.checks.openResize = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe
          ? { width: iframe.style.width, height: iframe.style.height }
          : null;
      });

      await frame.waitForFunction(
        () => (document.body?.innerText || "").includes("Hei! Hva kan jeg hjelpe deg med?"),
        { timeout: 15_000 },
      );

      findings.checks.greeting = await frame.evaluate(() => {
        const text = document.body?.innerText || "";
        return text.includes("Hei! Hva kan jeg hjelpe deg med?")
          ? "Hei! Hva kan jeg hjelpe deg med?"
          : null;
      });
      findings.checks.placeholder = await frame.evaluate(
        () => document.querySelector("textarea")?.getAttribute("placeholder") || null,
      );
      findings.checks.headerText = await frame.evaluate(
        () => document.querySelector("header")?.textContent || "",
      );
      findings.checks.headerHasGreeting = findings.checks.headerText.includes(
        "Hei! Hva kan jeg hjelpe deg med?",
      );
      findings.checks.headerHasOldOpening = findings.checks.headerText.includes(
        "Spør meg om det du lurer på",
      );

      async function send(text) {
        const before = askCount;
        const ta = await frame.waitForSelector("textarea", { timeout: 10_000 });
        await ta.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
        await ta.type(text, { delay: 8 });
        await frame.click('button[type="submit"]');
        const waitStart = Date.now();
        while (askCount <= before && Date.now() - waitStart < 15_000) {
          await sleep(100);
        }
        await frame
          .waitForFunction(
            () => {
              const text = document.body?.innerText || "";
              return text.includes("fixturesvar") || text.includes("Avsnitt 20");
            },
            { timeout: 15_000 },
          )
          .catch(() => {});
        await sleep(500);
      }

      await send("Kort spørsmål 1");
      await send("Kort spørsmål 2");
      await send("Kort spørsmål 3 langt svar");

      findings.checks.afterLongAnswer = await frame.evaluate(() => {
        const scroller = [...document.querySelectorAll("div")].find((el) => {
          const oy = getComputedStyle(el).overflowY;
          return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 40;
        });
        if (!scroller) return { found: false };
        const nearBottom =
          scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 140;
        return {
          found: true,
          nearBottom,
          hasLong: (scroller.textContent || "").includes("Avsnitt 20"),
          scrollTop: scroller.scrollTop,
          scrollHeight: scroller.scrollHeight,
          clientHeight: scroller.clientHeight,
        };
      });

      await frame.evaluate(() => {
        const scroller = [...document.querySelectorAll("div")].find((el) => {
          const oy = getComputedStyle(el).overflowY;
          return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 40;
        });
        if (scroller) scroller.scrollTop = 0;
      });
      await sleep(400);
      findings.checks.afterManualScrollUp = await frame.evaluate(() => {
        const scroller = [...document.querySelectorAll("div")].find((el) => {
          const oy = getComputedStyle(el).overflowY;
          return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 40;
        });
        if (!scroller) return null;
        return {
          scrollTop: scroller.scrollTop,
          nearBottom:
            scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 140,
        };
      });

      async function refreshFrame() {
        const handle = await page.$('iframe[title="Website Kompis"]');
        if (!handle) throw new Error("iframe missing during refresh");
        const next = await handle.contentFrame();
        if (!next) throw new Error("contentFrame missing during refresh");
        frame = next;
        return frame;
      }

      async function closePanel() {
        await refreshFrame();
        await frame.waitForSelector("header button", { timeout: 10_000 });
        await frame.evaluate(() => {
          document.querySelector("header button")?.click();
        });
        await page.waitForFunction(
          () => {
            const iframe = document.querySelector('iframe[title="Website Kompis"]');
            return iframe && iframe.style.width === "72px";
          },
          { timeout: 10_000 },
        );
      }

      async function openPanel() {
        await refreshFrame();
        const clicked = await frame.evaluate(() => {
          const buttons = [...document.querySelectorAll("button")];
          const openBtn =
            buttons.find((b) => (b.getAttribute("aria-label") || "").includes("Åpne")) ||
            buttons.find((b) => !b.closest("header") && b.getAttribute("aria-expanded") != null);
          if (!openBtn) return false;
          openBtn.click();
          return true;
        });
        if (!clicked) throw new Error("open launcher button not found in frame");
        await page.waitForFunction(
          () => {
            const iframe = document.querySelector('iframe[title="Website Kompis"]');
            return iframe && parseInt(iframe.style.width, 10) >= 300;
          },
          { timeout: 15_000 },
        );
        await refreshFrame();
        await frame.waitForSelector("header", { timeout: 10_000 });
      }

      await closePanel();
      findings.checks.closedAfterUse = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        return iframe ? { width: iframe.style.width, height: iframe.style.height } : null;
      });
      findings.checks.hostScrollY = await page.evaluate(() => window.scrollY);

      await openPanel();
      findings.checks.greetingCountAfterReopen = await frame.evaluate(() => {
        const text = document.body?.innerText || "";
        return (text.match(/Hei! Hva kan jeg hjelpe deg med\?/g) || []).length;
      });
      findings.checks.reopenShowsMessages = await frame.evaluate(() => {
        const text = document.body?.innerText || "";
        return text.includes("fixturesvar") || text.includes("Avsnitt");
      });

      await closePanel();
      findings.checks.whitePaneProbe = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        if (!iframe) return null;
        const rect = iframe.getBoundingClientRect();
        return {
          iframeWidth: Math.round(rect.width),
          iframeHeight: Math.round(rect.height),
          withinClosedBudget: rect.width <= 80 && rect.height <= 80,
        };
      });

      // Mobile-width viewport: resize the successful desktop page (same frame/session).
      await page.setViewport({ width: 390, height: 844 });
      await sleep(300);
      await openPanel();
      findings.checks.mobile = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="Website Kompis"]');
        if (!iframe) return null;
        return {
          width: iframe.style.width,
          height: iframe.style.height,
          maxWidthOk: parseInt(iframe.style.width, 10) <= window.innerWidth,
          maxHeightOk: parseInt(iframe.style.height, 10) <= window.innerHeight,
        };
      });
      findings.checks.mobileComposer = await frame.evaluate(() => {
        const ta = document.querySelector("textarea");
        const btn = document.querySelector('button[type="submit"]');
        if (!ta || !btn) return null;
        const tr = ta.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        return {
          textareaVisible: tr.height > 0 && tr.width > 0,
          sendVisible: br.height > 0 && br.width > 0,
          greeting: false,
          messagesVisible:
            (document.body?.innerText || "").includes("fixturesvar") ||
            (document.body?.innerText || "").includes("Avsnitt"),
        };
      });

      findings.checks.askCount = askCount;
    } finally {
      await browser.close();
    }

    findings.finished = new Date().toISOString();
    findings.pass =
      findings.checks.greeting === "Hei! Hva kan jeg hjelpe deg med?" &&
      findings.checks.placeholder === "Skriv en melding…" &&
      findings.checks.headerHasGreeting === false &&
      findings.checks.headerHasOldOpening === false &&
      findings.checks.closedResize?.width === "72px" &&
      findings.checks.closedResize?.height === "72px" &&
      findings.checks.openResize?.width === "420px" &&
      findings.checks.greetingCountAfterReopen === 0 &&
      findings.checks.reopenShowsMessages === true &&
      findings.checks.afterLongAnswer?.nearBottom === true &&
      findings.checks.afterManualScrollUp?.nearBottom === false &&
      findings.checks.hostScrollY === 0 &&
      findings.checks.closedAfterUse?.width === "72px" &&
      findings.checks.whitePaneProbe?.withinClosedBudget === true &&
      findings.checks.mobileComposer?.textareaVisible === true &&
      findings.checks.mobileComposer?.sendVisible === true &&
      findings.checks.mobileComposer?.messagesVisible === true &&
      findings.checks.mobile?.maxWidthOk === true &&
      findings.checks.mobile?.maxHeightOk === true;

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
