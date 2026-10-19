export function WebsiteKompisSettingsIntro({
  eyebrow,
  title,
  description,
  contextLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  contextLabel?: string | null;
}) {
  return (
    <header className="rounded-[18px] border border-[#E4E6F2] bg-white p-6 shadow-[0_8px_22px_rgba(65,54,132,0.045)] sm:p-8">
      <p className="text-sm font-medium text-[#7055EE]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#20243E] sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#65708A]">{description}</p>
      {contextLabel ? <p className="mt-3 text-sm text-[#65708A]">{contextLabel}</p> : null}
    </header>
  );
}
