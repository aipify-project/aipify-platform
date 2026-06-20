type AppSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function AppSectionHeader({ title, subtitle, action }: AppSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-aipify-text sm:text-xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
