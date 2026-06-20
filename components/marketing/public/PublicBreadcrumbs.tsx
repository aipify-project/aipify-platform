import Link from "next/link";

export type PublicBreadcrumbItem = {
  label: string;
  href?: string;
};

type PublicBreadcrumbsProps = {
  items: PublicBreadcrumbItem[];
};

export default function PublicBreadcrumbs({ items }: PublicBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-aipify-text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span className="text-aipify-border-strong" aria-hidden="true">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium text-aipify-text-secondary transition hover:text-aipify-companion"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-aipify-text" : "font-medium text-aipify-text-secondary"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
