import { AipifyHostsReferralDashboardPanel } from "@/components/app/aipify-hosts-referral";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsReferralsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsReferral");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsReferral";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsReferralDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          backToHosts: t(`${p}.backToHosts`),
          referralsThisMonth: t(`${p}.referralsThisMonth`),
          activeReferrals: t(`${p}.activeReferrals`),
          pendingRewards: t(`${p}.pendingRewards`),
          lifetimeReferrals: t(`${p}.lifetimeReferrals`),
          generateLink: t(`${p}.generateLink`),
          generateLinkDescription: t(`${p}.generateLinkDescription`),
          referralRole: t(`${p}.referralRole`),
          roleHost: t(`${p}.roleHost`),
          roleServiceProvider: t(`${p}.roleServiceProvider`),
          roleGrowthPartner: t(`${p}.roleGrowthPartner`),
          generateLinkAction: t(`${p}.generateLinkAction`),
          generating: t(`${p}.generating`),
          copyLink: t(`${p}.copyLink`),
          copied: t(`${p}.copied`),
          rewardCatalog: t(`${p}.rewardCatalog`),
          emptyReferralsTitle: t(`${p}.emptyReferralsTitle`),
          emptyReferralsMessage: t(`${p}.emptyReferralsMessage`),
          referralTracking: t(`${p}.referralTracking`),
          rewards: t(`${p}.rewards`),
          growthPartner: t(`${p}.growthPartner`),
          accountsOversight: t(`${p}.accountsOversight`),
          conversionRate: t(`${p}.conversionRate`),
          commissionPending: t(`${p}.commissionPending`),
          referralAssets: t(`${p}.referralAssets`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          recentActivity: t(`${p}.recentActivity`),
          notifications: t(`${p}.notifications`),
          status_invited: t(`${p}.status.invited`),
          status_registered: t(`${p}.status.registered`),
          status_trial_started: t(`${p}.status.trialStarted`),
          status_converted: t(`${p}.status.converted`),
          status_active: t(`${p}.status.active`),
          status_rewarded: t(`${p}.status.rewarded`),
        }}
      />
    </div>
  );
}
