import { IndustryBlueprintDetailPanel } from "@/components/app/industry-blueprints";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function IndustryBlueprintDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <IndustryBlueprintDetailPanel
        blueprintKey={id}
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          notFound: t(`${p}.notFound`),
          riskLevel: t(`${p}.riskLevel`),
          version: t(`${p}.version`),
          deployment: t(`${p}.deployment`),
          recommendedSkills: t(`${p}.recommendedSkills`),
          recommendedPacks: t(`${p}.recommendedPacks`),
          recommendedWorkflows: t(`${p}.recommendedWorkflows`),
          selectBlueprint: t(`${p}.selectBlueprint`),
          apply: t(`${p}.apply`),
          applyWithApproval: t(`${p}.applyWithApproval`),
          applying: t(`${p}.applying`),
          selected: t(`${p}.selected`),
          applied: t(`${p}.appliedSuccess`),
          approvalRequired: t(`${p}.approvalRequired`),
          precheckFailed: t(`${p}.precheckFailed`),
          failed: t(`${p}.failed`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
