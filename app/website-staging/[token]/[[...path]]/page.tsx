import type { Metadata } from "next";
import { resolvePublicRenderResult, robotsHeaderValue } from "@/lib/website-cms/renderer";
import {
  isPlausibleWebsiteStagingToken,
  resolveWebsiteStagingAccessToken,
} from "@/lib/website-staging-verification/path-token";
import { buildWebsiteStagingVerificationLabels } from "@/lib/website-staging-verification/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ token: string; path?: string[] }>;
  searchParams: Promise<{ locale?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    alternates: { canonical: undefined },
  };
}

function joinPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return "/";
  return `/${segments.map((part) => encodeURIComponent(part)).join("/").replace(/%2F/gi, "/")}`;
}

export default async function WebsiteStagingPublicPage({ params, searchParams }: PageProps) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const labels = buildWebsiteStagingVerificationLabels(createTranslator(dict));
  const { token, path: pathSegments } = await params;
  const query = await searchParams;
  const path = joinPath(pathSegments);

  if (!isPlausibleWebsiteStagingToken(token)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-amber-700">{labels.rendererBanner}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.rendererInvalidTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">{labels.rendererInvalidBody}</p>
      </main>
    );
  }

  const resolved = await resolveWebsiteStagingAccessToken(token);
  if (!resolved.ok) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-amber-700">{labels.rendererBanner}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.rendererNotFoundTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">{labels.rendererNotFoundBody}</p>
      </main>
    );
  }

  const render = resolvePublicRenderResult(
    {
      ok: true,
      websiteId: resolved.websiteId,
      versionId: resolved.versionId,
      versionNumber: resolved.versionNumber,
      defaultLocale: resolved.defaultLocale,
      activeLocales: resolved.activeLocales,
      manifest: resolved.manifest,
      contentChecksum: resolved.contentChecksum,
      manifestChecksum: resolved.manifestChecksum,
      publishedAt: resolved.publishedAt ?? undefined,
    },
    path,
    typeof query.locale === "string" ? query.locale : null,
  );

  if (!render.ok) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-amber-700">{labels.rendererBanner}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.rendererPageNotFoundTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">{labels.rendererPageNotFoundBody}</p>
      </main>
    );
  }

  const title =
    typeof render.page.seo?.title === "string" && render.page.seo.title
      ? render.page.seo.title
      : render.page.title || labels.rendererTitle;
  const blocks = Array.isArray(render.page.content?.blocks)
    ? (render.page.content.blocks as Array<Record<string, unknown>>)
    : [];

  return (
    <main className="min-h-screen bg-[#F7F6F3] text-slate-900">
      <div
        className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
        role="status"
      >
        {labels.rendererBanner} · v{render.versionNumber}
        <span className="sr-only"> {robotsHeaderValue("noindex")}</span>
      </div>
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{render.locale}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-800">
          {blocks.length === 0 ? (
            <p>{labels.rendererEmptyBlocks}</p>
          ) : (
            blocks.map((block, index) => {
              const type = typeof block.type === "string" ? block.type : "paragraph";
              const text = typeof block.text === "string" ? block.text : "";
              if (type === "heading") {
                return (
                  <h2 key={index} className="text-xl font-semibold">
                    {text}
                  </h2>
                );
              }
              if (type === "list" && Array.isArray(block.items)) {
                return (
                  <ul key={index} className="list-disc space-y-1 pl-5">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{typeof item === "string" ? item : ""}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index}>{text}</p>;
            })
          )}
        </div>
      </article>
    </main>
  );
}
