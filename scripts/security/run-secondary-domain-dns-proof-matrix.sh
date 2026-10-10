#!/usr/bin/env bash
# Isolated Postgres security matrix for PR95 DNS proof bypass repair.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTAINER="aipify-pr95-dns-proof-matrix"
IMAGE="postgres:16-alpine"
PORT=55432
DB_URL="postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres"
MIGRATION="${ROOT}/supabase/migrations/20261937500000_core_secondary_host_dns_verify_existing_install_v1.sql"
STUBS="${ROOT}/scripts/security/secondary-domain-dns-proof-stubs.sql"
MATRIX="${ROOT}/scripts/security/secondary-domain-dns-proof-matrix.sql"
RESULT="${ROOT}/.tmp/pr95-dns-proof-matrix-result.txt"

mkdir -p "${ROOT}/.tmp"

cleanup() {
  docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cleanup
docker run -d --name "${CONTAINER}" \
  -e POSTGRES_PASSWORD=postgres \
  -p "${PORT}:5432" \
  "${IMAGE}" >/dev/null

echo "Waiting for Postgres..."
for i in $(seq 1 40); do
  if docker exec "${CONTAINER}" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done
docker exec "${CONTAINER}" pg_isready -U postgres >/dev/null

psql_c() {
  docker exec -i "${CONTAINER}" psql -U postgres -v ON_ERROR_STOP=1 "$@"
}

psql_c <<'SQL'
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
SQL

psql_c -f - < "${STUBS}"
psql_c <<'SQL'
grant anon, authenticated, service_role to postgres;
grant usage on schema public to anon, authenticated, service_role;
grant usage on schema extensions to public, anon, authenticated, service_role;
SQL

psql_c -f - < "${MIGRATION}"

# Explicit privilege probe output for report
psql_c -c "\df+ verify_and_bind_platform_portal_secondary_domain_dns_challenge" > "${RESULT}" || true
psql_c -c "
select grantee, privilege_type
from information_schema.role_routine_grants
where routine_name = 'verify_and_bind_platform_portal_secondary_domain_dns_challenge'
order by grantee;
" >> "${RESULT}"

set +e
psql_c -f - < "${MATRIX}" >> "${RESULT}" 2>&1
RC=$?
set -e

if [[ ${RC} -ne 0 ]]; then
  echo "MATRIX_FAIL exit=${RC}" | tee -a "${RESULT}"
  tail -80 "${RESULT}"
  exit ${RC}
fi

if ! grep -q 'MATRIX_PASS' "${RESULT}"; then
  echo "MATRIX_FAIL: missing MATRIX_PASS marker" | tee -a "${RESULT}"
  tail -80 "${RESULT}"
  exit 1
fi

echo "MATRIX_OK" | tee -a "${RESULT}"
exit 0
