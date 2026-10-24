/**
 * Dev-only browser harness. Run with tsx. Do not import this from the Customer App.
 */
import { createRequire } from "node:module";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  FaqLocalFixture,
  parseFixtureOptions,
  type FaqLocalFixture as Fixture,
} from "@/lib/website-kompis-faq/local-fixture-api";

const root = process.cwd();
const require = createRequire("/tmp/faq-esbuild/package.json");
const esbuild = require("esbuild") as {
  build: (options: Record<string, unknown>) => Promise<unknown>;
};

const port = Number(process.env.FAQ_FIXTURE_PORT ?? "8767");
let bundle = "";
const sessions = new Map<string, Fixture>();

function cookieOptions(request: IncomingMessage): string {
  const header = request.headers.cookie ?? "";
  const match = header.split(";").map((part) => part.trim()).find((part) => part.startsWith("faq_fixture="));
  return match ? decodeURIComponent(match.slice("faq_fixture=".length)) : "count=8";
}

function session(request: IncomingMessage): Fixture {
  const key = cookieOptions(request);
  const existing = sessions.get(key);
  if (existing) return existing;
  const created = new FaqLocalFixture(parseFixtureOptions(key));
  sessions.set(key, created);
  return created;
}

function send(response: ServerResponse, status: number, body: unknown, type = "application/json") {
  const payload = type === "application/json" ? JSON.stringify(body) : String(body);
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
  });
  response.end(payload);
}

function labels(locale: string) {
  const read = (code: string) =>
    JSON.parse(readFileSync(join(root, "locales", code, "customer-app/core.json"), "utf8")) as {
      websiteKompisFaq?: Record<string, unknown>;
    };
  const english = read("en");
  if (locale === "en") return english;
  try {
    const local = read(locale);
    if (!local.websiteKompisFaq) return english;
    return { ...english, ...local, websiteKompisFaq: { ...english.websiteKompisFaq, ...local.websiteKompisFaq } };
  } catch {
    return english;
  }
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  try {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const css = readdirSync(join(root, ".next/static/css")).filter((name) => name.endsWith(".css"));
      const links = css.map((name) => `<link rel="stylesheet" href="/__fixture/css/${name}" />`).join("");
      send(
        response,
        200,
        `<!doctype html><html lang="${url.searchParams.get("locale") ?? "en"}"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />${links}<title>FAQ fixture</title></head><body class="bg-[#F7F6F3]"><script>document.cookie="faq_fixture="+encodeURIComponent(location.search.slice(1)||"count=8")+"; path=/";</script><main id="root" class="mx-auto max-w-6xl p-4"></main><script type="module" src="/fixture.js"></script></body></html>`,
        "text/html; charset=utf-8",
      );
      return;
    }
    if (url.pathname === "/fixture.js") {
      send(response, 200, bundle, "text/javascript; charset=utf-8");
      return;
    }
    if (url.pathname.startsWith("/__fixture/css/")) {
      const name = url.pathname.slice("/__fixture/css/".length);
      send(response, 200, readFileSync(join(root, ".next/static/css", name), "utf8"), "text/css; charset=utf-8");
      return;
    }
    if (url.pathname === "/__fixture/labels") {
      send(response, 200, labels(url.searchParams.get("locale") || "en"));
      return;
    }
    if (url.pathname === "/__fixture/stats") {
      send(response, 200, session(request).stats());
      return;
    }
    const current = session(request);
    if (url.pathname === "/api/website-kompis/sites") {
      const denied = current.role === "anonymous" ? 401 : current.role === "viewer" ? 403 : 0;
      if (denied) {
        send(response, denied, { error: denied === 401 ? "Unauthorized" : "owner or admin required" });
        return;
      }
      send(response, 200, {
        sites: current.sites(),
        state: current.sites().length === 0 ? "no_sites" : current.sites().length === 1 ? "single_site" : "multi_site",
      });
      return;
    }
    if (url.pathname === "/api/website-kompis/faq/match-ids" && request.method === "GET") {
      const result = current.matchIds(url);
      send(response, result.status, result.body);
      return;
    }
    if (url.pathname === "/api/website-kompis/faq/public-safe" && request.method === "POST") {
      const body = await readBody(request);
      const result = current.markPublicSafe({
        confirm: body.confirm === true,
        installId: typeof body.installId === "string" ? body.installId : null,
        status: typeof body.status === "string" ? body.status : null,
        locale: typeof body.locale === "string" ? body.locale : null,
        contentType: typeof body.contentType === "string" ? body.contentType : null,
        query: typeof body.query === "string" ? body.query : null,
        itemIds: Array.isArray(body.itemIds) ? body.itemIds.filter((id): id is string => typeof id === "string") : [],
      });
      send(response, result.status, result.body);
      return;
    }
    const publishMatch = url.pathname.match(/^\/api\/website-kompis\/faq\/([^/]+)\/publish$/);
    if (publishMatch && request.method === "POST") {
      const result = current.publish(decodeURIComponent(publishMatch[1] ?? ""));
      send(response, result.status, result.body);
      return;
    }
    if (url.pathname === "/api/website-kompis/faq/locale-version" && request.method === "GET") {
      const result = current.localeVersion(url.searchParams.get("itemId") ?? "", url.searchParams.get("locale") ?? "");
      send(response, result.status, result.body);
      return;
    }
    if (url.pathname === "/api/website-kompis/faq/locale-version" && request.method === "POST") {
      const body = await readBody(request);
      const result = current.createLocaleVersion(body as Parameters<FaqLocalFixture["createLocaleVersion"]>[0]);
      send(response, result.status, result.body);
      return;
    }
    if (url.pathname === "/api/website-kompis/faq" && request.method === "GET") {
      const result = current.list(url);
      send(response, result.status, result.body);
      return;
    }
    send(response, 404, { error: "Not found" });
  } catch (error) {
    send(response, 500, { error: error instanceof Error ? error.message : "Fixture failed" });
  }
});

async function main() {
const built = await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, "scripts/faq-fixture-entry.tsx")],
  bundle: true,
  format: "esm",
  write: false,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": "\"development\"" },
  alias: {
    "next/link": join(root, "scripts/faq-fixture-shims/next-link.tsx"),
    "next/navigation": join(root, "scripts/faq-fixture-shims/next-navigation.tsx"),
    "server-only": join(root, "scripts/faq-fixture-shims/empty.ts"),
  },
  plugins: [
    {
      name: "aipify-alias",
      setup(build: { onResolve: (args: { filter: RegExp }, callback: (args: { path: string }) => { path: string }) => void }) {
        build.onResolve({ filter: /^@\// }, (args: { path: string }) => {
          const base = join(root, args.path.slice(2));
          const candidates = [base, `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`, join(base, "index.tsx"), join(base, "index.ts")];
          const path = candidates.find((candidate) => existsSync(candidate));
          if (!path) return { path: base };
          return { path };
        });
      },
    },
  ],
}) as { outputFiles?: Array<{ text: string }> };
bundle = built.outputFiles?.[0]?.text ?? "";
if (!bundle) throw new Error("Fixture bundle was empty");

server.listen(port, "127.0.0.1", () => {
  console.log(`FAQ_FIXTURE_READY http://127.0.0.1:${port}`);
});
}

void main();
