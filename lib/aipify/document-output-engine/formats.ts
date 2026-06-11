/**
 * Output format constants and adapter scaffold metadata (Phase A.59).
 * Format generation returns structured payload + download URL metadata — not raw customer PII.
 */

export const OUTPUT_FORMATS = [
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "csv",
  "json",
  "md",
  "txt",
  "rtf",
  "xml",
  "yaml",
  "ods",
  "odp",
] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export const OUTPUT_FORMAT_MIME_TYPES: Record<OutputFormat, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  json: "application/json",
  md: "text/markdown",
  txt: "text/plain",
  rtf: "application/rtf",
  xml: "application/xml",
  yaml: "application/yaml",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
};

export const OUTPUT_FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  pdf: ".pdf",
  docx: ".docx",
  xlsx: ".xlsx",
  pptx: ".pptx",
  csv: ".csv",
  json: ".json",
  md: ".md",
  txt: ".txt",
  rtf: ".rtf",
  xml: ".xml",
  yaml: ".yaml",
  ods: ".ods",
  odp: ".odp",
};

/** Adapter scaffold — client-side preview of format adapter response shape. */
export function buildFormatAdapterScaffold(
  format: OutputFormat,
  reportType: string,
  generationId: string
): Record<string, unknown> {
  return {
    adapter: "scaffold",
    format,
    report_type: reportType,
    mime_type: OUTPUT_FORMAT_MIME_TYPES[format],
    download_url: `/api/aipify/document-output-engine/download/${generationId}`,
    extension: OUTPUT_FORMAT_EXTENSIONS[format],
    metadata_only: true,
    no_raw_content: true,
    sections: ["summary", "metrics", "metadata"],
  };
}

export function isSupportedOutputFormat(value: string): value is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(value);
}
