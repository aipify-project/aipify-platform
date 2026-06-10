type ChartPoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: number[];
  labels: string[];
  ariaLabel: string;
};

type BarChartProps = {
  data: ChartPoint[];
  ariaLabel: string;
};

type DonutChartProps = {
  value: number;
  max?: number;
  label: string;
  ariaLabel: string;
};

function normalize(values: number[]) {
  const max = Math.max(...values, 1);
  return values.map((value) => value / max);
}

export function MetricsLineChart({ data, labels, ariaLabel }: LineChartProps) {
  const normalized = normalize(data);
  const width = 320;
  const height = 120;
  const padding = 12;
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = normalized
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - value * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${padding + (data.length - 1) * step},${height - padding}`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="metrics-line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#metrics-line-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {normalized.map((value, index) => {
          const x = padding + index * step;
          const y = height - padding - value * (height - padding * 2);
          return <circle key={labels[index]} cx={x} cy={y} r="3.5" fill="#7c3aed" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-gray-400">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function MetricsBarChart({ data, ariaLabel }: BarChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className="w-full" role="img" aria-label={ariaLabel}>
      <div className="flex h-32 items-end gap-2">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400"
              style={{ height: `${Math.max((point.value / max) * 100, 8)}%` }}
            />
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricsDonutChart({ value, max = 100, label, ariaLabel }: DonutChartProps) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-5" role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#ede9fe"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="56"
          textAnchor="middle"
          className="fill-gray-900 text-[18px] font-bold"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          {Math.round(percentage)}%
        </text>
        <text
          x="60"
          y="74"
          textAnchor="middle"
          className="fill-gray-500 text-[10px]"
          style={{ fontSize: "10px" }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

export function MetricsSparkline({ data, ariaLabel }: { data: number[]; ariaLabel: string }) {
  const normalized = normalize(data);
  const width = 72;
  const height = 28;
  const step = width / Math.max(data.length - 1, 1);
  const points = normalized
    .map((value, index) => {
      const x = index * step;
      const y = height - value * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-7 w-[4.5rem]"
      role="img"
      aria-label={ariaLabel}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500"
      />
    </svg>
  );
}
