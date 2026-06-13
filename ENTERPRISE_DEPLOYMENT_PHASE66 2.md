# Enterprise Deployment Architecture (Phase 66)

Phase 66 prepares Aipify for businesses behind firewalls, on intranets, and in regulated environments where data cannot freely leave the organization.

## Deployment modes

| Mode | Description |
|------|-------------|
| `cloud_saas` | Aipify Cloud — standard SaaS (Unonight, SMB, ecommerce) |
| `hybrid` | Cloud control plane + local Aipify Agent (outbound-only) |
| `on_premise` | Full stack inside customer environment |

## Architecture principle

**Control plane** (Aipify Cloud): admin UI, governance, billing, summaries.  
**Data plane** (Aipify Agent): internal data access, intranet scans, local Knowledge/Memory.

Raw sensitive data never syncs to cloud unless explicitly allowed by policy.

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/enterprise` | Enterprise deployment dashboard |
| `/app/enterprise/deployment` | Deployment mode, connectivity, desktop endpoint |
| `/app/enterprise/agents` | Register and manage Aipify Agents |
| `/app/enterprise/data-residency` | Per-category residency policies |
| `/app/enterprise/connectors` | Enterprise integration connectors |
| `/app/enterprise/audit` | Audit log exports |

## API routes

### Admin (authenticated user)

| Route | Methods |
|-------|---------|
| `/api/aipify/enterprise/card` | GET |
| `/api/aipify/enterprise/dashboard` | GET |
| `/api/aipify/enterprise/deployment` | GET, PATCH |
| `/api/aipify/enterprise/agents` | GET, POST |
| `/api/aipify/enterprise/agents/[id]/disable` | POST |
| `/api/aipify/enterprise/agents/[id]/jobs` | POST |
| `/api/aipify/enterprise/data-residency` | GET, PATCH |
| `/api/aipify/enterprise/connectors` | GET |
| `/api/aipify/enterprise/connectors/[id]` | PATCH |
| `/api/aipify/enterprise/audit/export` | POST |
| `/api/aipify/enterprise/audit/exports` | GET |

### Agent runtime (`X-Aipify-Agent-Key` header)

| Route | Method |
|-------|--------|
| `/api/aipify/enterprise/agent/heartbeat` | POST |
| `/api/aipify/enterprise/agent/jobs/claim` | POST |
| `/api/aipify/enterprise/agent/jobs/[jobId]/complete` | POST |
| `/api/aipify/enterprise/agent/jobs/[jobId]/fail` | POST |

## Database (migration `20260615600000_enterprise_deployment_phase66.sql`)

- `tenant_deployment_settings` — deployment mode, residency, connectivity, desktop endpoint
- `aipify_agents` — agent registry (hybrid/on-premise)
- `agent_jobs` — job queue (scan_intranet, index_documents, run_quality_scan, etc.)
- `agent_job_results` — redacted results with `safe_for_cloud` flag
- `data_residency_policies` — per-category storage and sync rules
- `enterprise_audit_exports` — audit export requests
- `enterprise_connectors` — SharePoint, AD, intranet scanner, etc.
- `agent_access_events` — agent action audit trail

Skills extended: `deployment_support`, `requires_agent`, `data_residency_behavior`.

## Library

`lib/aipify/enterprise/` — types, parse, module constants.

## Plan gating

- All tenants: `cloud_saas` default, view deployment info
- **Enterprise plan** required for hybrid/on-premise configuration and agent registration

## Integrations

| Module | Deployment awareness |
|--------|---------------------|
| **Skill Store** | `deployment_support`, `requires_agent` metadata |
| **Desktop Companion** | `desktop_endpoint_mode`, `custom_desktop_endpoint_url` |
| **Quality Guardian** | Intranet scans via agent jobs |
| **Knowledge Center** | Local vs cloud mode flags |
| **Memory Engine** | `local_memory_enabled` flag |
| **Governance** | Audit via `_tacc_log_audit` + agent events |

## Knowledge Center

Category: `enterprise-deployment`  
Seed: `content/knowledge/aipify/enterprise/faq/enterprise-deployment-faq.md`

Import after deploy:

```json
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```

## What is NOT in V1

- Full air-gapped deployment
- All enterprise connector implementations
- Advanced licensing
- Inbound local services by default

## Unonight

Unonight remains `cloud_saas`. Architecture does not hardcode cloud-only assumptions.
