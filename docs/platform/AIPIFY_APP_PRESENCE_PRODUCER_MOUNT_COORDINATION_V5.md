# APP Presence Producer Mount — coordination (Master V5 / Phase L)

**Status:** BLOCKED — waiting on Agent 4 contract  
**APP action taken:** none (no mount prepared)

## Agent 4 owns

- `lib/platform-portal/live-presence/` (not present on `main` at V5 authoring)
- `POST /api/live-presence/heartbeat`
- Core SQL, statusbar, writer gate

## Agent 2 rules (this module)

1. Do **not** invent a parallel tracker.
2. Do **not** mount a producer until Agent 4 publishes an agreed typed contract.
3. Snapshot field: `presenceProducerMount: "blocked_needs_agent4_contract"` in `buildOperationalConfigurationSnapshot()`.
4. No PII / URL / content in heartbeat beyond authorized user/role/tenant fields.
5. Mount must be non-blocking for navigation; cleanup, backoff, fail-closed.
6. No Production writer activation from Agent 2.

## Exact YES required before APP mount

1. Agent 4 contract path + version documented on an agreed branch/main merge  
2. Staging writer gate semantics confirmed  
3. Separate Production activation YES  

Until then APP shells stay unchanged for presence.
