#!/usr/bin/env node
/**
 * Write-free public site index discovery for Phase 2C prepare.
 *
 * - Fetches only public verified hosts (no cookies / auth).
 * - Does NOT call ingest, replace_tenant_*, or any Core write RPC.
 * - Writes a manifest JSON to the path given by --out (default: Downloads).
 *
 * Usage:
 *   node scripts/website-kompis-public-site-index-dry-discovery.mjs \
 *     --hosts www.customer.example,customer.example \
 *     --install-id <uuid> --company-id <uuid> --customer-id <uuid> \
 *     --out /path/to/manifest.json
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MAX_DISCOVERED = 5_000;
const MAX_SITEMAP_DEPTH = 3;
const MAX_MANIFEST_ELIGIBLE = 250;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;

const PRIVATE_PREFIXES = [
  "/admin",
  "/account",
  "/accounts",
  "/login",
  "/logout",
  "/signin",
  "/signup",
  "/register",
  "/auth",
  "/member",
  "/members",
  "/membership/private",
  "/billing",
  "/checkout",
  "/payment",
  "/payments",
  "/cart",
  "/checkout",
  "/api/",
  "/wp-admin",
  "/dashboard",
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function normalizeHost(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function isPrivatePath(pathname) {
  const p = pathname.toLowerCase();
  return PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`) || p.startsWith(prefix));
}

function evaluateUrl(urlString, allowedHosts) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return { eligible: false, reason: "invalid_url", host: null, canonical: null, pathname: null };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { eligible: false, reason: "non_http", host: url.hostname, canonical: null, pathname: url.pathname };
  }
  const host = url.hostname.toLowerCase();
  if (!allowedHosts.has(host)) {
    return { eligible: false, reason: "foreign_host", host, canonical: null, pathname: url.pathname };
  }
  if (url.username || url.password) {
    return { eligible: false, reason: "credentials_in_url", host, canonical: null, pathname: url.pathname };
  }
  if (isPrivatePath(url.pathname || "/")) {
    return { eligible: false, reason: "private_path", host, canonical: null, pathname: url.pathname };
  }
  url.hash = "";
  // Drop common tracking params
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((k) =>
    url.searchParams.delete(k),
  );
  const canonical = url.toString().replace(/\/$/, "") || url.origin;
  return { eligible: true, reason: "eligible", host, canonical, pathname: url.pathname || "/" };
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent": "AipifyPublicSiteIndexDryDiscovery/1.0 (+https://aipify.ai)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      return { ok: false, status: res.status, redirect: loc, body: "", contentType: res.headers.get("content-type") };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const sliced = buf.subarray(0, MAX_BODY_BYTES);
    return {
      ok: res.ok,
      status: res.status,
      body: sliced.toString("utf8"),
      contentType: res.headers.get("content-type") || "",
      truncated: buf.length > MAX_BODY_BYTES,
    };
  } catch (error) {
    return { ok: false, status: 0, body: "", error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

function parseRobotsDisallow(robotsTxt, userAgent = "*") {
  const lines = robotsTxt.split(/\r?\n/);
  let inStar = false;
  const disallow = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const ua = trimmed.match(/^user-agent:\s*(.+)$/i);
    if (ua) {
      inStar = ua[1].trim() === "*";
      continue;
    }
    if (!inStar) continue;
    const d = trimmed.match(/^disallow:\s*(.*)$/i);
    if (d) {
      const pathValue = d[1].trim();
      if (pathValue) disallow.push(pathValue);
    }
  }
  return disallow;
}

function isDisallowed(pathname, disallowPaths) {
  return disallowPaths.some((rule) => {
    if (rule === "/") return true;
    return pathname === rule || pathname.startsWith(rule.endsWith("/") ? rule : `${rule}/`) || pathname.startsWith(rule);
  });
}

function extractLocsFromSitemap(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) && locs.length < MAX_DISCOVERED) {
    locs.push(m[1].trim());
  }
  return locs;
}

function extractLinksFromHtml(html, baseUrl) {
  const hrefs = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) && hrefs.length < 2_000) {
    try {
      hrefs.push(new URL(m[1], baseUrl).toString());
    } catch {
      // ignore
    }
  }
  return hrefs;
}

function looksLikeJsShell(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const visible = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return visible.length < 80 && /__NEXT_DATA__|window\.__|id="__next"|data-reactroot/i.test(html);
}

function extractLocaleHint(pathname, html) {
  if (/^\/en(\/|$)/i.test(pathname)) return "en";
  if (/^\/(no|nb|nn)(\/|$)/i.test(pathname)) return "no";
  const htmlLang = html.match(/<html[^>]*lang=["']([^"']+)/i);
  if (htmlLang) return htmlLang[1].slice(0, 8).toLowerCase();
  return null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim().slice(0, 200) : null;
}

async function discoverForHost(host, allowedHosts) {
  const origin = `https://${host}`;
  const entries = new Map();
  const robots = await fetchText(`${origin}/robots.txt`);
  const disallow = robots.ok ? parseRobotsDisallow(robots.body) : [];
  const sitemapCandidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const queue = [];

  for (const sm of sitemapCandidates) {
    const res = await fetchText(sm);
    if (!res.ok) continue;
    const locs = extractLocsFromSitemap(res.body);
    for (const loc of locs) {
      if (/\.xml($|\?)/i.test(loc)) {
        queue.push({ url: loc, kind: "sitemap", depth: 1 });
      } else {
        queue.push({ url: loc, kind: "page", depth: 0 });
      }
    }
  }

  // Always consider homepage
  queue.push({ url: origin + "/", kind: "page", depth: 0 });

  let sitemapFetches = 0;
  while (queue.length > 0 && entries.size < MAX_DISCOVERED) {
    const item = queue.shift();
    if (!item) break;
    if (item.kind === "sitemap") {
      if (item.depth > MAX_SITEMAP_DEPTH || sitemapFetches >= 20) continue;
      sitemapFetches += 1;
      const res = await fetchText(item.url);
      if (!res.ok) continue;
      for (const loc of extractLocsFromSitemap(res.body)) {
        if (/\.xml($|\?)/i.test(loc)) {
          queue.push({ url: loc, kind: "sitemap", depth: item.depth + 1 });
        } else {
          queue.push({ url: loc, kind: "page", depth: 0 });
        }
      }
      continue;
    }

    const evaluated = evaluateUrl(item.url, allowedHosts);
    if (!evaluated.canonical || entries.has(evaluated.canonical)) continue;
    if (!evaluated.eligible) {
      entries.set(evaluated.canonical || item.url, {
        canonicalUrl: evaluated.canonical || item.url,
        host: evaluated.host,
        pathname: evaluated.pathname,
        locale: null,
        eligibility: "skipped",
        skipReason: evaluated.reason,
        extractionStatus: "not_fetched",
        source: "sitemap_or_seed",
        title: null,
        robotsDisallow: false,
        jsRenderedLikely: null,
      });
      continue;
    }
    if (isDisallowed(evaluated.pathname || "/", disallow)) {
      entries.set(evaluated.canonical, {
        canonicalUrl: evaluated.canonical,
        host: evaluated.host,
        pathname: evaluated.pathname,
        locale: null,
        eligibility: "skipped",
        skipReason: "robots_disallow",
        extractionStatus: "not_fetched",
        source: "sitemap_or_seed",
        title: null,
        robotsDisallow: true,
        jsRenderedLikely: null,
      });
      continue;
    }

    // Lightweight HTML probe for first N eligible only (coverage sample)
    entries.set(evaluated.canonical, {
      canonicalUrl: evaluated.canonical,
      host: evaluated.host,
      pathname: evaluated.pathname,
      locale: null,
      eligibility: "eligible",
      skipReason: null,
      extractionStatus: "pending_probe",
      source: "sitemap_or_seed",
      title: null,
      robotsDisallow: false,
      jsRenderedLikely: null,
    });
  }

  // Homepage HTML link expansion (bounded)
  const home = await fetchText(origin + "/");
  if (home.ok && home.body) {
    for (const href of extractLinksFromHtml(home.body, origin + "/")) {
      const evaluated = evaluateUrl(href, allowedHosts);
      if (!evaluated.eligible || !evaluated.canonical || entries.has(evaluated.canonical)) continue;
      if (isDisallowed(evaluated.pathname || "/", disallow)) continue;
      entries.set(evaluated.canonical, {
        canonicalUrl: evaluated.canonical,
        host: evaluated.host,
        pathname: evaluated.pathname,
        locale: null,
        eligibility: "eligible",
        skipReason: null,
        extractionStatus: "pending_probe",
        source: "homepage_link",
        title: null,
        robotsDisallow: false,
        jsRenderedLikely: null,
      });
      if (entries.size >= MAX_DISCOVERED) break;
    }
  }

  // Probe up to 40 eligible pages for extraction quality / topic coverage (still write-free)
  const eligible = [...entries.values()].filter((e) => e.eligibility === "eligible");
  const probeTargets = eligible.slice(0, 40);
  for (const entry of probeTargets) {
    const res = await fetchText(entry.canonicalUrl);
    if (!res.ok) {
      entry.extractionStatus = "fetch_failed";
      entry.skipReason = `http_${res.status || "error"}`;
      entry.eligibility = "skipped";
      continue;
    }
    if (!/html/i.test(res.contentType || "") && !/<html/i.test(res.body.slice(0, 500))) {
      entry.extractionStatus = "non_html";
      entry.eligibility = "skipped";
      entry.skipReason = "non_html";
      continue;
    }
    if (/noindex/i.test(res.body.slice(0, 4000))) {
      entry.extractionStatus = "noindex";
      entry.eligibility = "skipped";
      entry.skipReason = "meta_noindex";
      continue;
    }
    entry.title = extractTitle(res.body);
    entry.locale = extractLocaleHint(entry.pathname || "/", res.body);
    entry.jsRenderedLikely = looksLikeJsShell(res.body);
    entry.extractionStatus = entry.jsRenderedLikely ? "js_shell_low_text" : "html_ok";
    const text = res.body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    entry.topicHints = {
      pricing: /\b(pris|price|koster|kr\b|nok|medlemskap|membership|standard|gull|gold)\b/i.test(text),
      about: /\b(om oss|about|hvem vi er|how it works|slik fungerer)\b/i.test(text),
      safety: /\b(sikkerhet|safety|verifisering|samtykke|consent)\b/i.test(text),
      textChars: Math.min(text.length, 50_000),
    };
  }

  return {
    host,
    robotsStatus: robots.ok ? "ok" : `failed_${robots.status || "error"}`,
    disallowCount: disallow.length,
    entries: [...entries.values()],
  };
}

async function main() {
  const hostsArg = argValue("--hosts");
  if (!hostsArg) {
    throw new Error("Required: --hosts host1,host2 (verified public hosts only)");
  }
  const outPath =
    argValue("--out") ||
    path.join(ROOT, "tmp", "public-site-index-dry-manifest.json");
  const hosts = hostsArg
    .split(",")
    .map(normalizeHost)
    .filter(Boolean);
  if (hosts.length === 0) {
    throw new Error("No valid hosts after normalize");
  }
  const allowedHosts = new Set(hosts);
  const installId = argValue("--install-id") || null;
  const companyId = argValue("--company-id") || null;
  const customerId = argValue("--customer-id") || null;

  const perHost = [];
  for (const host of hosts) {
    perHost.push(await discoverForHost(host, allowedHosts));
  }

  const byCanonical = new Map();
  for (const block of perHost) {
    for (const entry of block.entries) {
      const existing = byCanonical.get(entry.canonicalUrl);
      if (!existing) {
        byCanonical.set(entry.canonicalUrl, entry);
        continue;
      }
      // Prefer probed HTML details
      if (existing.extractionStatus === "pending_probe" && entry.extractionStatus !== "pending_probe") {
        byCanonical.set(entry.canonicalUrl, entry);
      }
    }
  }

  const all = [...byCanonical.values()];
  const eligibleAll = all.filter((e) => e.eligibility === "eligible");
  const firstIngestSet = eligibleAll.slice(0, MAX_MANIFEST_ELIGIBLE);

  const manifest = {
    generatedAt: new Date().toISOString(),
    task: "AIPIFY.KOMPIS.PHASE2C.PUBLIC.INDEX.PREPARE.07",
    writeFree: true,
    note: "Discovery/dry-run only. No Core ingest RPCs, no index/docs/chunks/runs writes, no publicSiteIndex enable.",
    codeCaps: {
      maxDiscovered: MAX_DISCOVERED,
      maxSitemapDepth: MAX_SITEMAP_DEPTH,
      ingestMaxPagesPerBatch: 80,
      firstIngestEligibleCap: MAX_MANIFEST_ELIGIBLE,
      fetchTimeoutMs: FETCH_TIMEOUT_MS,
      maxBodyBytes: MAX_BODY_BYTES,
    },
    installContext: {
      installId,
      companyId,
      customerId,
      verifiedHosts: hosts,
      publicSiteIndexConfig: false,
      note: "IDs are operator-supplied CLI metadata for the approval object; not resolved from Core in this write-free script.",
    },
    hosts: perHost.map((h) => ({
      host: h.host,
      robotsStatus: h.robotsStatus,
      disallowCount: h.disallowCount,
      entryCount: h.entries.length,
    })),
    counts: {
      totalEntries: all.length,
      eligible: eligibleAll.length,
      skipped: all.filter((e) => e.eligibility === "skipped").length,
      firstIngestSet: firstIngestSet.length,
      probedHtmlOk: all.filter((e) => e.extractionStatus === "html_ok").length,
      jsShellLowText: all.filter((e) => e.extractionStatus === "js_shell_low_text").length,
    },
    coverageSample: {
      pricing: firstIngestSet.filter((e) => e.topicHints?.pricing).map((e) => e.canonicalUrl),
      about: firstIngestSet.filter((e) => e.topicHints?.about).map((e) => e.canonicalUrl),
      safety: firstIngestSet.filter((e) => e.topicHints?.safety).map((e) => e.canonicalUrl),
    },
    urls: all.sort((a, b) => a.canonicalUrl.localeCompare(b.canonicalUrl)),
    firstIngestEligibleUrls: firstIngestSet.map((e) => e.canonicalUrl),
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const body = `${JSON.stringify(manifest, null, 2)}\n`;
  fs.writeFileSync(outPath, body, "utf8");
  const sha = crypto.createHash("sha256").update(body).digest("hex");
  console.log(
    JSON.stringify(
      {
        outPath,
        sha256: sha,
        counts: manifest.counts,
        coverageSampleCounts: {
          pricing: manifest.coverageSample.pricing.length,
          about: manifest.coverageSample.about.length,
          safety: manifest.coverageSample.safety.length,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
