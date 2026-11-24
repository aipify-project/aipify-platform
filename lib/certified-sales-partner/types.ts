import type {
  CspCertificationStatus,
  CspChannelOrigin,
  CspLedgerEntryType,
  CspPartnerStatus,
  CspSaleStatus,
  CspSettlementStatus,
} from "./constants";

/** ISO 8601 timestamp string. */
export type IsoTimestamp = string;

export type PartnerProfile = {
  id: string;
  authUserId: string;
  displayName: string;
  /** ISO 3166-1 alpha-2 — never defaulted globally. */
  country: string;
  status: CspPartnerStatus;
  createdAt: IsoTimestamp;
};

export type SalesProduct = {
  id: string;
  /** Canonical product key (maps to existing catalog; never invented here). */
  productKey: string;
  fixedCommissionAmount: number;
  currency: string;
  published: boolean;
};

export type CommissionRateVersion = {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  effectiveFrom: IsoTimestamp;
};

export type Certification = {
  id: string;
  partnerId: string;
  productId: string;
  status: CspCertificationStatus;
  /** Percent, 0–100. */
  score: number | null;
  passedAt: IsoTimestamp | null;
};

export type AttributionLink = {
  id: string;
  partnerId: string;
  code: string;
  channelOrigin: CspChannelOrigin;
  active: boolean;
  createdAt: IsoTimestamp;
};

export type QualifiedSale = {
  id: string;
  partnerId: string;
  customerOrgId: string;
  productId: string;
  status: CspSaleStatus;
  attributedAt: IsoTimestamp;
  /** First confirmed paid period (commission snapshot anchor). */
  firstConfirmedAt: IsoTimestamp | null;
  paidPeriodsCount: number;
  /** Snapshot taken at first confirmed sale — immutable afterwards. */
  snapshotAmount: number | null;
  snapshotCurrency: string | null;
  snapshotRateVersionId: string | null;
};

export type CommissionLedgerEntry = {
  id: string;
  partnerId: string;
  qualifiedSaleId: string | null;
  entryType: CspLedgerEntryType;
  /** Signed: reversals are negative. */
  amount: number;
  currency: string;
  createdAt: IsoTimestamp;
};

export type MonthlySettlement = {
  id: string;
  partnerId: string;
  /** `YYYY-MM` in Europe/Oslo. */
  periodMonth: string;
  status: CspSettlementStatus;
  totalAmount: number;
  currency: string;
  closedAt: IsoTimestamp | null;
};
