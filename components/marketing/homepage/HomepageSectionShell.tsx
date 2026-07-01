import type { ReactNode } from "react";

type HomepageSectionShellProps = {
  id?: string;
  children: ReactNode;
  alt?: boolean;
  className?: string;
  ariaLabelledBy?: string;
};

/** Shared homepage section container — max ~1400px, consistent horizontal rhythm. */
export default function HomepageSectionShell({
  id,
  children,
  alt = false,
  className = "",
  ariaLabelledBy,
}: HomepageSectionShellProps) {
  return (
    <section
      id={id}
      className={`${alt ? "border-y border-aipify-border bg-aipify-surface-muted/50" : ""} ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
    >
      <div className="mx-auto max-w-[87.5rem] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">{children}</div>
    </section>
  );
}
