import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import type { PublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import KompisWebSalesChrome from "./KompisWebSalesChrome";

type Props = {
  labels: KompisWebSalesLabels;
  appName: string;
  locale: PublicFooterEnabledLocale;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/**
 * Privacy/Terms wrapper — same sales chrome family as the homepage.
 * Does not remount the legacy mega-nav.
 */
export default function KompisWebLegalShell({
  labels,
  appName,
  locale,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <KompisWebSalesChrome
      labels={labels}
      appName={appName}
      locale={locale}
      title={title}
      subtitle={subtitle}
      contentMaxWidth={760}
    >
      {children}
    </KompisWebSalesChrome>
  );
}
