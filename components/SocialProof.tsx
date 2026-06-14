type SocialProofProps = {
  title: string;
  segments: Array<{ label: string; initials: string }>;
};

const SEGMENT_COLORS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-indigo-400 to-indigo-600",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-600",
  "from-blue-600 to-violet-600",
];

export default function SocialProof({ title, segments }: SocialProofProps) {
  return (
    <section className="border-y border-gray-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {segments.map((segment, index) => (
            <div
              key={segment.label}
              className="flex h-16 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 sm:h-[4.5rem] sm:px-4"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]} text-xs font-bold text-white`}
                aria-hidden="true"
              >
                {segment.initials}
              </span>
              <span className="truncate text-xs font-semibold text-gray-600 sm:text-sm">
                {segment.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
