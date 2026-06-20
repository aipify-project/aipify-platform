import PublicPageHero from "./public/PublicPageHero";

type MarketingPageHeaderProps = {
  title: string;
  subtitle?: string;
  subtitleLines?: string[];
  eyebrow?: string;
  breadcrumbs?: Parameters<typeof PublicPageHero>[0]["breadcrumbs"];
  primaryCta?: Parameters<typeof PublicPageHero>[0]["primaryCta"];
  secondaryCta?: Parameters<typeof PublicPageHero>[0]["secondaryCta"];
  compact?: boolean;
  align?: "left" | "center";
};

/** Light Enterprise page hero — matches homepage typography. */
export default function MarketingPageHeader({
  title,
  subtitle,
  subtitleLines,
  eyebrow,
  breadcrumbs,
  primaryCta,
  secondaryCta,
  compact = false,
  align = "left",
}: MarketingPageHeaderProps) {
  return (
    <PublicPageHero
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      subtitleLines={subtitleLines}
      breadcrumbs={breadcrumbs}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      compact={compact}
      align={align}
    />
  );
}
