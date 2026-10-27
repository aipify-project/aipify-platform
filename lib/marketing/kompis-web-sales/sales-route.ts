import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { PublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import {
  parseKompisWebSalesLabels,
  type KompisWebSalesLabels,
} from "@/lib/marketing/kompis-web-sales/labels";
import { resolveKompisWebSalesLocale } from "@/lib/marketing/kompis-web-sales/locale";

export type KompisWebSalesRouteContext = {
  locale: PublicFooterEnabledLocale;
  labels: KompisWebSalesLabels;
  appName: string;
};

/** Shared loader for `/` and `/kompis-web` — cookie locale only (EN anonymous default). */
export async function loadKompisWebSalesRouteContext(): Promise<KompisWebSalesRouteContext> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
  const locale = resolveKompisWebSalesLocale({ cookieLocale });
  const dict = await getDictionary(locale, ["common", "marketing"]);
  const marketing = { ...(dict.marketing as Record<string, unknown>) };
  const common = dict.common as Record<string, string>;
  const labels = parseKompisWebSalesLabels(marketing);
  return {
    locale,
    labels,
    appName: typeof common.appName === "string" ? common.appName : "Aipify",
  };
}
