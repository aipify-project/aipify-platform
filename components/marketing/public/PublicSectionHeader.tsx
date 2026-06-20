type PublicSectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  id?: string;
};

export default function PublicSectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left",
  id,
}: PublicSectionHeaderProps) {
  const alignClass = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";

  return (
    <header className={alignClass}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className={`${eyebrow ? "mt-2" : ""} text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p>
      ) : null}
    </header>
  );
}
