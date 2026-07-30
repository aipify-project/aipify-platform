import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveWebsitePreviewById } from "@/lib/website-cms/preview";
import { buildWebsiteCmsLabels } from "@/lib/website-cms/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Preview pages must never be indexable — the content is unpublished. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ previewId: string }> };

function contentText(content: Record<string, unknown>): string {
  const value = content.body ?? content.text ?? content.summary;
  return typeof value === "string" ? value : JSON.stringify(content);
}

export default async function WebsiteCmsPreviewPage({ params }: Props) {
  const { previewId } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const labels = buildWebsiteCmsLabels(t);

  const supabase = await createClient();
  const resolved = await resolveWebsitePreviewById(supabase, previewId);

  if (!resolved.ok) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-950">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {labels.previewNotFoundTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.previewNotFoundBody}</p>
          <Link
            href="/app/kompis"
            className="mt-4 inline-block rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
          >
            {labels.previewBackToWorkspace}
          </Link>
        </div>
      </div>
    );
  }

  if (resolved.expired) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-950/30">
          <h1 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
            {labels.previewExpiredTitle}
          </h1>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">{labels.previewExpiredBody}</p>
          <Link
            href="/app/kompis"
            className="mt-4 inline-block rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
          >
            {labels.previewBackToWorkspace}
          </Link>
        </div>
      </div>
    );
  }

  const pages = resolved.manifest.pages.filter((page) => page.locale === resolved.locale);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div
        role="status"
        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
      >
        {labels.previewBanner} — v{resolved.versionNumber} · {resolved.locale.toUpperCase()}
      </div>

      <header>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{labels.previewPageTitle}</h1>
      </header>

      {pages.length === 0 ? (
        <p className="text-sm text-slate-500">{labels.pagesEmpty}</p>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <article
              key={`${page.pageId}-${page.locale}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{page.path}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                {page.title || page.path}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                {contentText(page.content)}
              </p>
            </article>
          ))}
        </div>
      )}

      <Link
        href="/app/kompis"
        className="inline-block rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
      >
        {labels.previewBackToWorkspace}
      </Link>
    </div>
  );
}
