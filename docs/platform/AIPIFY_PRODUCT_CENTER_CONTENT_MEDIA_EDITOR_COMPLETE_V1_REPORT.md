# AIPIFY_PRODUCT_CENTER_CONTENT_MEDIA_EDITOR_COMPLETE_V1

**Status:** code complete for PR review — Production upload remains **fail-closed**

## Exact Staging synthetic runtime test approval scope (separate YES)

| Field | Value |
|---|---|
| Project | Staging `auedugihkduoaikfusqe` only |
| Env | `PRODUCT_MEDIA_UPLOAD_ACTIVATION=staging` |
| Product | synthetic key only, e.g. `synthetic_media_qa_v1` (create then delete/archive after QA) — **never** kompis_web / kompis_bedrift / aipify_voice |
| Paths | `products/synthetic_media_qa_v1/{logo\|hero}/{uuid}.{png\|jpg\|webp}` |
| Data changes allowed | locale draft/approve for synthetic key; media path register for synthetic key only |
| Forbidden | real product writes, publish flips, commission/price edits, Production env flag |

## Production upload activation plan (separate YES later)

1. Staging synthetic upload + commit + signed-url verified with authorized Platform Admin session  
2. Exact owner YES naming Production project `qbcqoixhrvhnuwphefvw` and activation scope  
3. Do **not** set `PRODUCT_MEDIA_UPLOAD_ACTIVATION` on Production until that YES  
4. Gate remains `production_closed` when `VERCEL_ENV=production`

## Rollback

Revert PR. No SQL/storage rollback required for this app-layer job.
