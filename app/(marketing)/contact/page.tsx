import type { Metadata } from "next";
import ContactExperiencePageContent from "@/components/marketing/ContactExperiencePageContent";
import { parseContactExperienceLabels } from "@/lib/marketing/governance/labels";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const contact = parseContactExperienceLabels(marketing);
  const meta = (marketing.meta ?? {}) as Record<string, string>;
  return {
    title: meta.contactTitle ?? contact.title,
    description: meta.contactDescription ?? contact.subtitle,
  };
}

export default async function ContactPage() {
  const { marketing } = await getMarketingContext();
  const contact = parseContactExperienceLabels(marketing);
  const ctaBand = parseCtaBandLabels(marketing);

  return (
    <ContactExperiencePageContent
      title={contact.title}
      subtitle={contact.subtitle}
      continueLabel={contact.continueLabel}
      paths={contact.paths}
      ctaBand={ctaBand}
      trustSignals={parseStringList(marketing, "trustSignalStrip", "signals")}
      differentiationThemes={parseStringList(marketing, "differentiationStrip", "themes")}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
    />
  );
}
