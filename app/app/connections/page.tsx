import { ConnectionManagerScaffold } from "@/components/app/install-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppConnectionsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <ConnectionManagerScaffold
      title={t("dashboard.installEngine.connections.title")}
      subtitle={t("dashboard.installEngine.connections.subtitle")}
      areas={[
        t("dashboard.installEngine.connections.areas.systems"),
        t("dashboard.installEngine.connections.areas.auth"),
        t("dashboard.installEngine.connections.areas.permissions"),
        t("dashboard.installEngine.connections.areas.sync"),
        t("dashboard.installEngine.connections.areas.reconnect"),
        t("dashboard.installEngine.connections.areas.disconnect"),
      ]}
    />
  );
}
