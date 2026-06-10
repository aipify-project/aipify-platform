import AipifyPulse from "./AipifyPulse";

type AipifyBillingDocumentHeaderProps = {
  title: string;
  subtitle?: string;
  pulseLabel: string;
};

export default function AipifyBillingDocumentHeader({
  title,
  subtitle,
  pulseLabel,
}: AipifyBillingDocumentHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-base text-gray-500">{subtitle}</p>}
      </div>
      <AipifyPulse
        size="md"
        variant="gradient"
        opacity={0.18}
        title={pulseLabel}
        aria-label={pulseLabel}
        className="shrink-0 text-violet-600"
      />
    </div>
  );
}
