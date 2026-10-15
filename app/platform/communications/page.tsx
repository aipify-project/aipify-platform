import Link from "next/link";
import { Megaphone, Mail } from "lucide-react";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";
import { PlatformLayoutClasses } from "@/lib/design";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Communications landing — announcements and outgoing message drafts.
 * Not a support ticket inbox (that remains under Customers → Support).
 */
export default async function PlatformCommunicationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const cards = [
    {
      href: "/platform/communications/announcement-center",
      title: t("platform.communications.cards.announcements.title"),
      description: t("platform.communications.cards.announcements.description"),
      cta: t("platform.communications.cards.announcements.cta"),
      icon: Megaphone,
    },
    {
      href: "/platform/communications/website-kompis-plans",
      title: t("platform.communications.cards.planMessages.title"),
      description: t("platform.communications.cards.planMessages.description"),
      cta: t("platform.communications.cards.planMessages.cta"),
      icon: Mail,
    },
  ] as const;

  return (
    <PlatformPageFrame>
      <div className={PlatformLayoutClasses.pageHeader}>
        <h1 className={PlatformLayoutClasses.pageTitle}>{t("platform.communications.title")}</h1>
        <p className={PlatformLayoutClasses.pageSubtitle}>
          {t("platform.communications.subtitle")}
        </p>
        <p className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-5 py-4 text-sm text-slate-800">
          {t("platform.communications.notSupportInbox")}
        </p>
      </div>

      <div className={`${PlatformLayoutClasses.navCardGrid} mt-8`}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`${PlatformLayoutClasses.card} block transition hover:border-sky-200 hover:shadow-md`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-sky-700">
                {card.cta} →
              </span>
            </Link>
          );
        })}
      </div>
    </PlatformPageFrame>
  );
}
