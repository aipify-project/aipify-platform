type VisibilityRole = {
  role: string;
  need: string;
  answer: string;
};

type OperationalVisibilitySectionProps = {
  title: string;
  roles: VisibilityRole[];
  closing: string;
};

export default function OperationalVisibilitySection({ title, roles, closing }: OperationalVisibilitySectionProps) {
  return (
    <section aria-labelledby="operational-visibility-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="operational-visibility-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {roles.map((item) => (
            <li key={item.role} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6">
              <h3 className="text-base font-semibold text-aipify-companion">{item.role}</h3>
              <p className="mt-3 text-sm text-aipify-text-muted">{item.need}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base font-medium text-aipify-text">{closing}</p>
      </div>
    </section>
  );
}
