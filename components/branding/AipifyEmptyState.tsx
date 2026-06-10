import AipifyPulse from "./AipifyPulse";

type AipifyEmptyStateProps = {
  message: string;
  pulseLabel: string;
  className?: string;
};

export default function AipifyEmptyState({
  message,
  pulseLabel,
  className = "",
}: AipifyEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center ${className}`}
    >
      <AipifyPulse
        size="lg"
        variant="gradient"
        opacity={0.14}
        title={pulseLabel}
        aria-label={pulseLabel}
        className="text-violet-600"
      />
      <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500">{message}</p>
    </div>
  );
}
