import Link from "next/link";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";
import PlatformSuperRevisionPanel from "@/components/platform/platform-portal/PlatformSuperRevisionPanel";
import { PlatformLayoutClasses } from "@/lib/design";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { canRenderPlatformSuperRevisionLog } from "@/lib/super-portal/dashboard-access";
import { buildPlatformSuperRevisionLabels } from "@/lib/super-portal/platform-revision-labels";

export default async function PlatformSuperRevisionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformSuperRevisionLabels(t);
  const canRender = await canRenderPlatformSuperRevisionLog();

  return (
    <PlatformPageFrame>
      <div className={PlatformLayoutClasses.sectionGap}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t("platform.navGroups.auditGovernance")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {labels.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              {labels.subtitle}
            </p>
          </div>
          <Link
            href="/platform"
            className="text-sm font-medium text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
          >
            ← {labels.backToPlatform}
          </Link>
        </div>

        {canRender ? (
          <PlatformSuperRevisionPanel labels={labels} locale={locale} />
        ) : (
          <section
            className={`${PlatformLayoutClasses.card} border-slate-200 bg-white dark:border-slate-700`}
            data-area="super-revision-unavailable"
            aria-labelledby="super-revision-unavailable-title"
          >
            <h2
              id="super-revision-unavailable-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {labels.unavailableTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {labels.unavailableMessage}
            </p>
          </section>
        )}
      </div>
    </PlatformPageFrame>
  );
}
