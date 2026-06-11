# Aipify Developer Knowledge Center

Official developer knowledge source for Aipify. Stored in Knowledge Center and used by Aipify Assistant as the primary source of truth for developer technical questions.

## Location

```
content/knowledge/aipify/developers/
├── faq/
├── getting-started/
├── sdk/
├── manifests/
├── permissions/
├── sandbox/
├── marketplace/
├── publishing/
├── governance/
├── agents/
├── desktop/
├── workflows/
├── blueprints/
├── troubleshooting/
├── examples/
└── guidelines/
```

## Assistant integration

When a message matches `isDeveloperKnowledgeQuestion()` (lib/aipify/knowledge/developer-detection.ts), the Assistant calls `retrieve_developer_knowledge_answer` instead of general knowledge retrieval.

**Priority topics:** SDK, Skills, Agents, Marketplace, Governance, Permissions, Sandbox, Desktop Extensions, Blueprints, Publishing, Integrations, Workflows.

**Assistant rules:** See `content/knowledge/aipify/developers/guidelines/assistant-developer-guidance.md`

## Import seed content

After adding or updating markdown files:

```
POST /api/aipify/knowledge/import-seed-content
```

Or import the developers subtree via Knowledge Center admin.

## Migration

`supabase/migrations/20260616600000_developer_knowledge_center.sql`

- Extends `search_knowledge_articles` with optional `p_category_slug` boost
- Adds `retrieve_developer_knowledge_answer` RPC

## API

| Endpoint | Behavior |
|----------|----------|
| `POST /app/api/assistant` | Developer questions → `retrieve_developer_knowledge_answer` |
| `POST /api/aipify/knowledge/retrieve-answer` | Pass `developer: true` for developer-scoped retrieval |

## Principle

Aipify acts as the developer's senior engineer — explain, guide, teach, troubleshoot, and recommend best practices while never suggesting security or governance bypasses.
