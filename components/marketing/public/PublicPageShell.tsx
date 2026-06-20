import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

type PublicPageShellProps = {
  children: React.ReactNode;
  /** Optional max-width class — defaults to 90rem marketing width */
  maxWidth?: string;
  className?: string;
};

export default function PublicPageShell({
  children,
  maxWidth = "max-w-[90rem]",
  className = "",
}: PublicPageShellProps) {
  return (
    <div className={`${AipifyMarketingClasses.canvas} ${className}`}>
      <div className={`mx-auto ${maxWidth} px-4 sm:px-6 lg:px-8`}>{children}</div>
    </div>
  );
}
