import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import type { PublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import type { PersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import type { PersonalSalesPublication } from "@/lib/personal-sales-page/contract";
import { personalSalesLocalePath } from "@/lib/personal-sales-page/locale";
import { SyncSalesLocale } from "./SyncSalesLocale";

export function PersonalSalesPageView({
  chrome,
  appName,
  locale,
  code,
  labels,
  publication,
  startHref,
  productBlocked,
}: {
  chrome: KompisWebSalesLabels;
  appName: string;
  locale: PublicFooterEnabledLocale;
  code: string;
  labels: PersonalSalesLabels;
  publication: PersonalSalesPublication;
  startHref: string;
  productBlocked: boolean;
}) {
  const published = publication.state === "published" && !productBlocked;
  const advisor =
    published && publication.state === "published" && publication.advisorName
      ? labels.recommendedBy.replace("{name}", publication.advisorName)
      : null;
  const closedNotice = published ? null : productBlocked ? labels.productUnavailable : labels.closedNotice;

  return (
    <>
      <SyncSalesLocale locale={locale} />
      <KompisWebSalesPage
        labels={chrome}
        appName={appName}
        locale={locale}
        startHref={startHref}
        advisorLine={advisor}
        closedNotice={closedNotice}
        localePath={(next) => personalSalesLocalePath(code, next)}
        followUp={
          published
            ? {
                title: labels.interestTitle,
                pending: labels.interestPending,
                privacy: labels.interestPrivacy,
                privacyLabel: labels.privacyLink,
              }
            : null
        }
      />
    </>
  );
}
