import PublicSectionHeader from "./PublicSectionHeader";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

type PublicSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  alt?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function PublicSection({
  id,
  eyebrow,
  title,
  subtitle,
  alt = false,
  children,
  className = "",
}: PublicSectionProps) {
  return (
    <section
      id={id}
      className={`${alt ? PublicMarketingClasses.sectionAlt : ""} ${PublicMarketingClasses.section} ${className}`}
    >
      <div className={PublicMarketingClasses.container}>
        {title ? <PublicSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} /> : null}
        <div className={title ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}
