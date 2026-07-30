import { NextResponse } from "next/server";
import { resolvePublicWebsiteActiveVersion } from "@/lib/website-cms/context";
import { resolvePublicRenderResult, resolveRenderRobotsMode, robotsHeaderValue } from "@/lib/website-cms/renderer";

/**
 * Public, anon-safe website renderer resolve. No install tokens, no secrets —
 * only the published manifest subset for one page/locale on a verified domain.
 * Feature owner: APP (authoritative content) via a PLATFORM-safe public path
 * (Install Engine boundary — never exposes customer identity beyond the
 * verified domain the caller already supplied).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain") ?? "";
  const path = url.searchParams.get("path") ?? "/";
  const locale = url.searchParams.get("locale");

  const headers = new Headers({ "Cache-Control": "no-store" });

  if (!domain.trim()) {
    headers.set("X-Robots-Tag", robotsHeaderValue("noindex"));
    return NextResponse.json({ ok: false, reason: "domain_required" }, { status: 400, headers });
  }

  const resolved = await resolvePublicWebsiteActiveVersion(domain.trim().toLowerCase());
  const rendered = resolvePublicRenderResult(resolved, path, locale);
  const robotsMode = resolveRenderRobotsMode({ isPreview: false, resolved: { ok: resolved.ok } });
  headers.set("X-Robots-Tag", robotsHeaderValue(robotsMode));

  if (!rendered.ok) {
    const status = rendered.reason === "domain_required" ? 400 : 404;
    return NextResponse.json({ ok: false, reason: rendered.reason }, { status, headers });
  }

  return NextResponse.json(
    {
      ok: true,
      domain: resolved.domain ?? domain,
      page: rendered.page,
      locale: rendered.locale,
      activeLocales: rendered.activeLocales,
      versionNumber: rendered.versionNumber,
      publishedAt: rendered.publishedAt,
    },
    { headers },
  );
}
