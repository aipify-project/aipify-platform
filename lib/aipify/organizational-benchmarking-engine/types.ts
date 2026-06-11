export type BenchmarkProfile = {
  id?: string;
  benchmark_category?: string;
  benchmark_source?: string;
  benchmark_period?: string;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type BenchmarkComparison = {
  id?: string;
  profile_id?: string;
  metric_key?: string;
  org_value?: number;
  benchmark_value?: number;
  position_metadata?: Record<string, unknown>;
  compared_at?: string;
  [key: string]: unknown;
};

export type BenchmarkRecommendation = {
  id?: string;
  recommendation?: string;
  source_comparison_id?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationalBenchmarkingEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  profiles_count?: number;
  below_benchmark_count?: number;
  pending_recommendations?: number;
  [key: string]: unknown;
};

export type OrganizationalBenchmarkingEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  profiles?: BenchmarkProfile[];
  comparisons?: BenchmarkComparison[];
  recommendations?: BenchmarkRecommendation[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type BenchmarkReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  report_type?: string;
  report_id?: string;
  profiles?: BenchmarkProfile[];
  comparisons?: BenchmarkComparison[];
  recommendations?: BenchmarkRecommendation[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
