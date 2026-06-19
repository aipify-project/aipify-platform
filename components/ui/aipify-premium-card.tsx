import type { ReactNode } from "react";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Premium card surface — rounded, soft shadow, consistent padding. */
export function AipifyPremiumCard({ title, description, children, footer, className = "" }: Props) {
  return (
    <section className={`${AipifyShellClasses.surfaceCard} p-5 sm:p-6 ${className}`}>
      {title ? <h2 className="text-base font-semibold text-aipify-text sm:text-lg">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-aipify-text-secondary">{description}</p> : null}
      <div className={title || description ? "mt-4" : undefined}>{children}</div>
      {footer ? <div className="mt-4 border-t border-aipify-border pt-4">{footer}</div> : null}
    </section>
  );
}
