import { ApprovalProfilesPanel } from "@/components/app/governance/ApprovalProfilesPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApprovalProfilesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "approvalProfiles");
  const t = createTranslator(dict);
  const p = "customerApp.approvalProfiles";

  return (
    <ApprovalProfilesPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        activeTitle: t(`${p}.activeTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        activityTitle: t(`${p}.activityTitle`),
        savingsTitle: t(`${p}.savingsTitle`),
        governanceTitle: t(`${p}.governanceTitle`),
        accept: t(`${p}.accept`),
        dismiss: t(`${p}.dismiss`),
        disable: t(`${p}.disable`),
        delete: t(`${p}.delete`),
        completeReview: t(`${p}.completeReview`),
        privacyNote: t(`${p}.privacyNote`),
        approvalsLink: t(`${p}.approvalsLink`),
        actionMemoryLink: t(`${p}.actionMemoryLink`),
        governanceLink: t(`${p}.governanceLink`),
        profileTypes: {
          personal: t(`${p}.profileTypes.personal`),
          business: t(`${p}.profileTypes.business`),
          executive: t(`${p}.profileTypes.executive`),
          department: t(`${p}.profileTypes.department`),
        },
        approvalModes: {
          always_ask: t(`${p}.approvalModes.always_ask`),
          simplified: t(`${p}.approvalModes.simplified`),
          rule_based: t(`${p}.approvalModes.rule_based`),
        },
        reviewStates: {
          current: t(`${p}.reviewStates.current`),
          needs_review: t(`${p}.reviewStates.needs_review`),
          suspended: t(`${p}.reviewStates.suspended`),
          expired: t(`${p}.reviewStates.expired`),
        },
      }}
    />
  );
}
