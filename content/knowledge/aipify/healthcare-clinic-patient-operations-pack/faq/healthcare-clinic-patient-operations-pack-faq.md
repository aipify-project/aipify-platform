# Healthcare & Clinical Operations Pack — FAQ

## How does Healthcare Pack work?

The Healthcare Pack is the Industry Pack home for clinics, healthcare providers, private practices, treatment centers, and medical service organizations at `/app/healthcare`. It coordinates patients, appointments, providers, care operations, documentation, and compliance with strict privacy, consent, access controls, and audit logging on the shared ABOS foundation. Aipify coordinates operations — it does not replace healthcare professionals. Install via Industry Packs at `/app/industry-packs`.

## How are appointments managed?

Appointments are tracked in `healthcare_appointments` with type, provider, patient, location, schedule, status (scheduled, confirmed, checked in, completed, cancelled, no show, archived), and follow-up requirements. Manage appointments from the Healthcare Center at `/app/healthcare/appointments`.

## How is patient consent handled?

Consent records in `healthcare_consent_records` track consent type, status (pending, granted, expired, withdrawn), dates, expiration, and audit history. Consent grant and withdrawal events are logged in `healthcare_audit_logs`. Open Compliance from `/app/healthcare/compliance`.

## How are providers managed?

Providers in `healthcare_providers` track profile metadata, role, specialization, availability, capacity, performance, and compliance status. Manage providers from `/app/healthcare/providers`.

## How is compliance monitored?

Compliance operations include privacy controls, access governance via `healthcare_access_grants`, audit reviews, consent governance, and compliance status on `healthcare_pack_settings`. Compliance review completion is audited. Open Compliance from `/app/healthcare/compliance`.

## How are healthcare operations measured?

Healthcare analytics combine patient volume, appointment performance, provider utilization, operational capacity, compliance status, patient satisfaction, and healthcare health score in the overview and executive dashboard at `/app/healthcare/intelligence`.

## Patient Management

Track patient profiles with governed display names, status, care plans, consent flags, and satisfaction metadata — strict tenant isolation with immutable audit logging.

## Appointments

Schedule and track appointments with provider and patient linkage, location, status workflow, and follow-up flags.

## Provider Operations

Manage provider capacity, availability, compliance status, and performance indicators.

## Consent Management

Track consent types, grant/withdrawal lifecycle, expiration, and full audit history.

## Compliance Operations

Privacy controls, role-based access grants, compliance reviews, and security monitoring scaffolds.

## Healthcare Reporting

Executive dashboard metrics for enrollment volume, completion performance, provider utilization, compliance, and patient satisfaction.
