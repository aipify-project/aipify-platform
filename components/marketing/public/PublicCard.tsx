import Link from "next/link";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

type PublicCardProps = {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
};

export default function PublicCard({
  title,
  description,
  href,
  actionLabel,
  icon,
  badge,
  className = "",
}: PublicCardProps) {
  const content = (
    <>
      {badge ? <p className={PublicMarketingClasses.scenarioBadge}>{badge}</p> : null}
      {icon ? <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-aipify-accent-soft text-aipify-companion">{icon}</div> : null}
      <h3 className={PublicMarketingClasses.cardTitle}>{title}</h3>
      <p className={PublicMarketingClasses.cardBody}>{description}</p>
      {href && actionLabel ? (
        <span className="mt-4 inline-block text-sm font-semibold text-aipify-companion">{actionLabel} →</span>
      ) : null}
    </>
  );

  const cardClass = `${href ? PublicMarketingClasses.cardInteractive : PublicMarketingClasses.card} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${cardClass}`}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}
