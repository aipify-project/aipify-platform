import { SkillDetailPanel } from "@/components/app/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type SkillDetailPageProps = {
  params: Promise<{ key: string }>;
};

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { key } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <SkillDetailPanel
      skillKey={key}
      labels={{
        loading: t("customerApp.skillStore.loading"),
        notFound: t("customerApp.skillStore.notFound"),
        back: t("customerApp.skillStore.back"),
        risk: t("customerApp.skillStore.risk"),
        permissions: t("customerApp.skillStore.permissions"),
        noPermissions: t("customerApp.skillStore.noPermissions"),
        dependencies: t("customerApp.skillStore.dependencies"),
        noDependencies: t("customerApp.skillStore.noDependencies"),
        required: t("customerApp.skillStore.required"),
        missingDeps: t("customerApp.skillStore.missingDeps"),
        install: t("customerApp.skillStore.install"),
        installWithApproval: t("customerApp.skillStore.installWithApproval"),
        disable: t("customerApp.skillStore.disable"),
        learnMore: t("customerApp.skillStore.learnMore"),
      }}
    />
  );
}
