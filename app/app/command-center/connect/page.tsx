import Link from "next/link";
import { DesktopConnectPanel } from "@/components/app/presence/DesktopConnectPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopConnectPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["presence"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/app/command-center" className="text-sm text-indigo-600 hover:underline">
        ← {t("presence.desktopConnect.back")}
      </Link>
      <DesktopConnectPanel
        labels={{
          title: t("presence.desktopConnect.title"),
          subtitle: t("presence.desktopConnect.subtitle"),
          platform: t("presence.desktopConnect.platform"),
          deviceName: t("presence.desktopConnect.deviceName"),
          connect: t("presence.desktopConnect.connect"),
          connecting: t("presence.desktopConnect.connecting"),
          tokenTitle: t("presence.desktopConnect.tokenTitle"),
          tokenHint: t("presence.desktopConnect.tokenHint"),
          copy: t("presence.desktopConnect.copy"),
          copied: t("presence.desktopConnect.copied"),
          error: t("presence.desktopConnect.error"),
          planRequired: t("presence.desktopConnect.planRequired"),
          securityNote: t("presence.desktopConnect.securityNote"),
        }}
      />
    </div>
  );
}
