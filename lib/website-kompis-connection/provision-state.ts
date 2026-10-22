export type DomainActionName =
  | "create_domain"
  | "purchase_domain_license"
  | "activate_domain"
  | "remove_domain"
  | string;

export type DomainActionOutcome = {
  installationCreated: false;
  licensePurchased: false;
  verificationRecorded: false;
  knowledgeScopeCreated: false;
  scriptReady: false;
  runtimeObserved: false;
  notice: "pending_without_installation" | "refused" | "failed";
};

/**
 * create_domain inserts a pending organization domain.
 * It does not create an installation, a knowledge scope, or a verified host.
 */
export function classifyDomainActionResult(
  action: DomainActionName,
  httpOk: boolean,
  body: { ok?: unknown } | null,
): DomainActionOutcome {
  const accepted = httpOk && body?.ok === true && action === "create_domain";
  return {
    installationCreated: false,
    licensePurchased: false,
    verificationRecorded: false,
    knowledgeScopeCreated: false,
    scriptReady: false,
    runtimeObserved: false,
    notice: accepted ? "pending_without_installation" : httpOk ? "failed" : "refused",
  };
}

export function domainActionHttpError(message: string): { status: number; code: string } {
  if (/insufficient|owner or admin|permission/i.test(message)) {
    return { status: 403, code: "management_role_required" };
  }
  if (/no available domain license/i.test(message)) {
    return { status: 409, code: "license_unavailable" };
  }
  if (/domain name required/i.test(message)) {
    return { status: 400, code: "domain_required" };
  }
  return { status: 400, code: "domain_action_failed" };
}
