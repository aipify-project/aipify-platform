import type {
  PartnerComplianceAgreements,
  PartnerComplianceDocuments,
  PartnerComplianceOverview,
  PartnerComplianceTaxProfile,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parsePartnerComplianceOverview(data: unknown): PartnerComplianceOverview | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const dashboard = d.dashboard ? asRecord(d.dashboard) : null;
  const business = d.business ? asRecord(d.business) : null;
  const banking = d.banking ? asRecord(d.banking) : null;
  const empty = d.empty_state ? asRecord(d.empty_state) : null;

  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    team_role: d.team_role ? String(d.team_role) : undefined,
    access_denied: Boolean(d.access_denied),
    filtered_out: Boolean(d.filtered_out),
    positioning: d.positioning ? String(d.positioning) : undefined,
    dashboard: dashboard
      ? {
          compliance_status: String(dashboard.compliance_status ?? ""),
          business_verification_status: String(dashboard.business_verification_status ?? ""),
          identity_verification_status: String(dashboard.identity_verification_status ?? ""),
          self_billing_agreement_status: String(dashboard.self_billing_agreement_status ?? ""),
          tax_information_status: String(dashboard.tax_information_status ?? ""),
          settlement_eligibility: String(dashboard.settlement_eligibility ?? ""),
          banking_verification_status: String(dashboard.banking_verification_status ?? ""),
          health_score_label: String(dashboard.health_score_label ?? ""),
          health_score_pct: Number(dashboard.health_score_pct ?? 0),
          requirements_approved: Boolean(dashboard.requirements_approved),
          country_code: String(dashboard.country_code ?? ""),
        }
      : undefined,
    business: business
      ? {
          company_name: String(business.company_name ?? ""),
          registration_number: String(business.registration_number ?? ""),
          vat_number: String(business.vat_number ?? ""),
          country_code: String(business.country_code ?? ""),
          registered_address: String(business.registered_address ?? ""),
          legal_representative: String(business.legal_representative ?? ""),
          verification_status: String(business.verification_status ?? ""),
        }
      : undefined,
    banking: banking
      ? {
          account_holder: String(banking.account_holder ?? ""),
          account_number: String(banking.account_number ?? ""),
          iban: String(banking.iban ?? ""),
          swift_bic: String(banking.swift_bic ?? ""),
          country_code: String(banking.country_code ?? ""),
          verification_status: String(banking.verification_status ?? ""),
          expires_at: String(banking.expires_at ?? ""),
        }
      : undefined,
    alerts: asArray<unknown>(d.alerts).map((row) => {
      const a = asRecord(row);
      return {
        alert_key: String(a.alert_key ?? ""),
        message: String(a.message ?? ""),
        severity: String(a.severity ?? ""),
      };
    }),
    timeline: asArray<unknown>(d.timeline).map((row) => {
      const t = asRecord(row);
      return {
        id: String(t.id ?? ""),
        event_type: String(t.event_type ?? ""),
        title: String(t.title ?? ""),
        summary: String(t.summary ?? ""),
        created_at: String(t.created_at ?? ""),
      };
    }),
    empty_state: empty
      ? {
          title: String(empty.title ?? ""),
          message: String(empty.message ?? ""),
          cta: String(empty.cta ?? ""),
        }
      : undefined,
  };
}

export function parsePartnerComplianceDocuments(data: unknown): PartnerComplianceDocuments | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    documents: asArray<unknown>(d.documents).map((row) => {
      const doc = asRecord(row);
      return {
        id: String(doc.id ?? ""),
        document_type: String(doc.document_type ?? ""),
        file_name: String(doc.file_name ?? ""),
        document_status: String(doc.document_status ?? ""),
        expires_at: String(doc.expires_at ?? ""),
        created_at: String(doc.created_at ?? ""),
      };
    }),
  };
}

export function parsePartnerComplianceTaxProfile(data: unknown): PartnerComplianceTaxProfile | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const tax = asRecord(d.tax_profile);
  return {
    has_access: true,
    tax_profile: {
      vat_registered: Boolean(tax.vat_registered),
      vat_number: String(tax.vat_number ?? ""),
      country_code: String(tax.country_code ?? ""),
      tax_classification: String(tax.tax_classification ?? ""),
      reverse_charge_eligible: Boolean(tax.reverse_charge_eligible),
      additional_tax_references: asArray(tax.additional_tax_references),
      profile_status: String(tax.profile_status ?? ""),
      verified_at: String(tax.verified_at ?? ""),
    },
  };
}

export function parsePartnerComplianceAgreements(data: unknown): PartnerComplianceAgreements | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const current = asRecord(d.current);
  return {
    has_access: true,
    current: {
      agreement_version: String(current.agreement_version ?? ""),
      accepted: Boolean(current.accepted),
      accepted_at: String(current.accepted_at ?? ""),
      accepted_by: current.accepted_by ? String(current.accepted_by) : null,
      status: String(current.status ?? ""),
    },
    history: asArray<unknown>(d.history).map((row) => {
      const h = asRecord(row);
      return {
        agreement_version: String(h.agreement_version ?? ""),
        accepted: Boolean(h.accepted),
        accepted_at: String(h.accepted_at ?? ""),
        status: String(h.status ?? ""),
      };
    }),
  };
}
