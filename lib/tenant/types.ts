export const USER_ROLES = ["owner", "admin", "support", "staff"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type Company = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type AppUser = {
  id: string;
  auth_user_id: string;
  company_id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export type DashboardProfile = {
  user: AppUser;
  company: Company;
};
