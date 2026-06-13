import type {
  PRINT_JOB_STATUSES,
  PRINT_PERMISSION_LEVELS,
  PRINT_SENSITIVITY_LEVELS,
  PRINTER_CONNECTION_TYPES,
  PRINTER_STATUSES,
} from "./constants";

export type PrintJobStatus = (typeof PRINT_JOB_STATUSES)[number];
export type PrintSensitivityLevel = (typeof PRINT_SENSITIVITY_LEVELS)[number];
export type PrintPermissionLevel = (typeof PRINT_PERMISSION_LEVELS)[number];
export type PrinterConnectionType = (typeof PRINTER_CONNECTION_TYPES)[number];
export type PrinterStatus = (typeof PRINTER_STATUSES)[number];

export type PrintPrinter = {
  id: string;
  printer_key: string;
  name: string;
  location: string | null;
  department: string | null;
  connection_type: PrinterConnectionType;
  default_paper_size: string;
  supports_color: boolean;
  supports_duplex: boolean;
  status: PrinterStatus;
  is_default: boolean;
};

export type PrintPolicy = {
  enabled: boolean;
  printing_disabled: boolean;
  require_approval_sensitive: boolean;
  restrict_office_network: boolean;
  approved_printers_only: boolean;
  force_watermark_confidential: boolean;
  default_permission_level: PrintPermissionLevel;
};

export type PrintJob = {
  id: string;
  job_key: string;
  document_title: string;
  document_type: string;
  printer_id: string | null;
  printer_name?: string | null;
  status: PrintJobStatus;
  sensitivity_level: PrintSensitivityLevel;
  copies: number;
  color_mode: string;
  duplex: boolean;
  paper_size: string;
  page_count: number;
  approval_status: string;
  pdf_fallback_available: boolean;
  error_summary: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PrintAuditEntry = {
  id: string;
  action_type: string;
  document_title: string | null;
  document_type: string | null;
  printer_name: string | null;
  status: string | null;
  sensitivity_level: string | null;
  approval_status: string | null;
  summary: string | null;
  created_at: string;
};

export type PrintOutputCenter = {
  printers: PrintPrinter[];
  recent_jobs: PrintJob[];
  policy: PrintPolicy;
  recent_audit: PrintAuditEntry[];
  metrics?: {
    completed_jobs?: number;
    failed_jobs?: number;
    pdf_fallbacks?: number;
  };
};

export type PrintPreview = {
  document_title: string;
  document_type: string;
  page_count: number;
  printer_id: string | null;
  printer_name: string | null;
  paper_size: string;
  color_mode: string;
  duplex: boolean;
  copies: number;
  sensitivity_level: PrintSensitivityLevel;
  include_header_footer: boolean;
  include_company_logo: boolean;
  prepared_by: string;
};

export type PrintOfferDetection = {
  should_offer: boolean;
  document_type: string | null;
  prompt_en: string;
  prompt_no: string;
  contextual_en: string;
  contextual_no: string;
};
