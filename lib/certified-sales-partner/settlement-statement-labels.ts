import type { Translator } from "@/lib/i18n/translate";

export type SettlementStatementLabels = {
  title: string;
  preview: string;
  previewOnly: string;
  documentNumber: string;
  notIssued: string;
  coreActivation: string;
  issueBlocked: string;
  taxPending: string;
  paymentUnavailable: string;
  paidConfirm: string;
  paidConfirmRequired: string;
  filterAll: string;
  currencyNote: string;
  earnIntervalNote: string;
  downloadPreview: string;
  generateDisabled: string;
  recipientPending: string;
  issuer: string;
  period: string;
  amount: string;
  lines: string;
  status: string;
  basis: string;
  previewFailed: string;
};

const KEYS: (keyof SettlementStatementLabels)[] = [
  "title",
  "preview",
  "previewOnly",
  "documentNumber",
  "notIssued",
  "coreActivation",
  "issueBlocked",
  "taxPending",
  "paymentUnavailable",
  "paidConfirm",
  "paidConfirmRequired",
  "filterAll",
  "currencyNote",
  "earnIntervalNote",
  "downloadPreview",
  "generateDisabled",
  "recipientPending",
  "issuer",
  "period",
  "amount",
  "lines",
  "status",
  "basis",
  "previewFailed",
];

export function buildSettlementStatementLabels(t: Translator): SettlementStatementLabels {
  return Object.fromEntries(KEYS.map((key) => [key, t(`partnerSettlements.statement.${key}`)])) as SettlementStatementLabels;
}
