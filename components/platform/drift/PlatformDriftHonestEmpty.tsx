import Link from "next/link";

type Action = {
  href: string;
  label: string;
};

type PlatformDriftHonestEmptyProps = {
  title: string;
  body: string;
  actions?: Action[];
};

export function PlatformDriftHonestEmpty({
  title,
  body,
  actions = [],
}: PlatformDriftHonestEmptyProps) {
  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[color:var(--aipify-text)]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
        {body}
      </p>
      {actions.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex min-h-10 items-center rounded-lg bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
