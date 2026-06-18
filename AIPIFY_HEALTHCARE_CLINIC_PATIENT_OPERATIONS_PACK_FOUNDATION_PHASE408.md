# AIPIFY — PHASE 408
## Healthcare, Clinic & Patient Operations Pack Foundation

**Feature owner:** Customer App  
**Route:** `/app/healthcare`  
**Migration:** `20261688000000_healthcare_clinic_patient_operations_pack_foundation_phase408.sql`  
**Helpers:** `_ghcpo408_*`

## Purpose

Healthcare and clinical operations platform for clinics, providers, and medical service organizations — patients, appointments, providers, care operations, documentation, consent, and compliance with enterprise-grade privacy and audit governance.

## Critical design

- Metadata-first operational coordination — not clinical record replacement
- Consent management with grant/withdrawal audit
- Access grants with revoke audit
- Strict tenant isolation
- Immutable healthcare audit logs

## Modules

- Healthcare Overview
- Patients
- Appointments
- Providers
- Care Operations
- Documentation
- Compliance
- Healthcare Intelligence

## Tables

`healthcare_pack_settings` · `healthcare_patients` · `healthcare_providers` · `healthcare_appointments` · `healthcare_care_plans` · `healthcare_consent_records` · `healthcare_access_grants` · `healthcare_advisor_signals` · `healthcare_audit_logs`

## RPCs

- `get_healthcare_clinic_patient_operations_center()`
- `healthcare_clinic_patient_operations_action()`

## Permissions

- `healthcare.view`
- `healthcare.manage`

## i18n

`customerApp.healthcareClinicPatientOperationsPack.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/healthcare-clinic-patient-operations-pack/faq/`

## END OF PHASE
