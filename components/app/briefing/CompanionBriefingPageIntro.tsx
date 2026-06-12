import type { CompanionBriefingContext } from "@/lib/aipify/briefing";
import type { CompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { AipifyCompanionBriefingBanner } from "./AipifyCompanionBriefingBanner";

type CompanionBriefingPageIntroProps = {
  title: string;
  subtitle?: string;
  context: CompanionBriefingContext;
  labels: CompanionBriefingLabels;
  className?: string;
};

export function CompanionBriefingPageIntro({
  title,
  subtitle,
  context,
  labels,
  className,
}: CompanionBriefingPageIntroProps) {
  return (
    <div className={className ?? "space-y-4"}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-gray-600">{subtitle}</p> : null}
      </div>
      <AipifyCompanionBriefingBanner context={context} labels={labels} />
    </div>
  );
}
