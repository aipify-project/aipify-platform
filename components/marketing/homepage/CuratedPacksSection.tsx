import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepagePack } from "@/lib/marketing/parse-homepage";
import HomepageSectionShell from "./HomepageSectionShell";

type CuratedPacksSectionProps = {
  title: string;
  subtitle: string;
  viewDetails: string;
  exploreAll: string;
  packs: HomepagePack[];
};

export default function CuratedPacksSection({
  title,
  subtitle,
  viewDetails,
  exploreAll,
  packs,
}: CuratedPacksSectionProps) {
  return (
    <HomepageSectionShell ariaLabelledBy="business-packs-title">
      <div className="max-w-2xl">
        <h2 id="business-packs-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {packs.map((pack) => (
          <li
            key={pack.id}
            className="flex flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-7 shadow-sm transition hover:border-aipify-companion/25"
          >
            <h3 className="text-xl font-semibold text-aipify-text">Aipify {pack.name}</h3>
            <p className="mt-2 text-sm font-medium text-aipify-companion">{pack.audience}</p>
            <p className="mt-3 flex-1 text-base leading-relaxed text-aipify-text-secondary">{pack.value}</p>
            <Link
              href={pack.href}
              className="mt-6 text-sm font-semibold text-aipify-companion hover:text-aipify-companion-hover"
              {...marketingDataAttr("cta_click", `pack_${pack.id}`)}
            >
              {viewDetails} →
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href="/pricing#business-packs"
          className={`${AipifyMarketingClasses.secondaryCta} inline-flex`}
          {...marketingDataAttr("cta_click", "explore_all_packs")}
        >
          {exploreAll}
        </Link>
      </div>
    </HomepageSectionShell>
  );
}
