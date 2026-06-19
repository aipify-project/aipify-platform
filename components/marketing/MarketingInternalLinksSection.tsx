import Link from "next/link";

type MarketingInternalLinksSectionProps = {
  title: string;
  articles?: Array<{ slug: string; title: string }>;
  businessPacks?: Array<{ slug: string; name: string }>;
  features?: string[];
  integrations?: string[];
  useCases?: string[];
};

export default function MarketingInternalLinksSection({
  title,
  articles = [],
  businessPacks = [],
  features = [],
  integrations = [],
  useCases = [],
}: MarketingInternalLinksSectionProps) {
  const hasLinks =
    articles.length > 0 || businessPacks.length > 0 || features.length > 0 || integrations.length > 0 || useCases.length > 0;

  if (!hasLinks) return null;

  return (
    <aside className="mt-12 rounded-2xl border border-aipify-border bg-aipify-surface-muted/40 p-6">
      <h2 className="text-lg font-semibold text-aipify-text">{title}</h2>
      <div className="mt-4 space-y-5">
        {articles.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">Articles</h3>
            <ul className="mt-2 space-y-2">
              {articles.map((item) => (
                <li key={item.slug}>
                  <Link href={`/knowledge/articles/${item.slug}`} className="text-sm text-aipify-companion hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {businessPacks.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">Business Packs</h3>
            <ul className="mt-2 space-y-2">
              {businessPacks.map((pack) => (
                <li key={pack.slug}>
                  <Link href={`/business-packs/${pack.slug}`} className="text-sm text-aipify-companion hover:underline">
                    {pack.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {features.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">Capabilities</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {features.map((feature) => (
                <li key={feature} className="rounded-full border border-aipify-border bg-aipify-surface px-3 py-1 text-xs text-aipify-text-secondary">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {integrations.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">Integrations</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {integrations.map((item) => (
                <li key={item} className="rounded-full border border-aipify-border bg-aipify-surface px-3 py-1 text-xs text-aipify-text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {useCases.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">Use cases</h3>
            <ul className="mt-2 space-y-1">
              {useCases.map((item) => (
                <li key={item} className="text-sm text-aipify-text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
