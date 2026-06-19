import CategoryStatementSection from "./CategoryStatementSection";
import WhatIsBosSection from "./WhatIsBosSection";

type CategoryPositioningIntroProps = {
  categoryStatement: {
    title: string;
    negations: string[];
    affirmation: string;
    closing: string;
  };
  whatIsBos: {
    title: string;
    paragraphs: string[];
  };
  compact?: boolean;
};

/** Reusable category ownership block for product, enterprise, and why pages. */
export default function CategoryPositioningIntro({
  categoryStatement,
  whatIsBos,
  compact = false,
}: CategoryPositioningIntroProps) {
  return (
    <>
      <CategoryStatementSection {...categoryStatement} compact={compact} />
      <WhatIsBosSection title={whatIsBos.title} paragraphs={whatIsBos.paragraphs} />
    </>
  );
}

export { CategoryStatementSection, WhatIsBosSection };
