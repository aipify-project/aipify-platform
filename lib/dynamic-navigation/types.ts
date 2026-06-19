export type DynamicNavItem = {
  nav_key: string;
  label: string;
  href: string;
  icon?: string;
  module_key?: string | null;
  permission_key?: string | null;
  business_pack_key?: string | null;
  pinned?: boolean;
  favorite?: boolean;
  last_used_at?: string | null;
  use_count?: number;
};

export type DynamicNavCategory = {
  category_key: string;
  label_key: string;
  icon?: string;
  collapsible?: boolean;
  items: DynamicNavItem[];
};

export type DynamicAppNavigation = {
  found: boolean;
  license_status?: string;
  suspended?: boolean;
  suspended_notice?: string | null;
  principle?: string;
  visibility_rule?: string;
  layout_mode?: "flat" | "grouped";
  default_landing_href?: string;
  categories?: DynamicNavCategory[];
  personalization?: {
    recent?: DynamicNavItem[];
    pinned?: DynamicNavItem[];
    favorites?: DynamicNavItem[];
    quick_actions?: DynamicNavItem[];
  };
  mobile_nav_keys?: string[];
  settings_route?: string;
  preferences_route?: string;
};

export type DynamicPortalNavigation = {
  found: boolean;
  principle?: string;
  categories?: DynamicNavCategory[];
  error?: string;
};

export type CompanionNavigationContext = {
  found: boolean;
  license_status?: string;
  suspended?: boolean;
  visible_modules?: {
    module_key: string;
    label: string;
    href: string;
    permission_key?: string | null;
    business_pack_key?: string | null;
  }[];
  principle?: string;
};

export type NavigationSearchResult = {
  found: boolean;
  query?: string | null;
  items?: {
    nav_key: string;
    label: string;
    href: string;
    module_key?: string | null;
    category_key?: string;
  }[];
  privacy_note?: string;
};

export type NavigationPreferencesCenter = {
  found: boolean;
  principle?: string;
  navigation?: DynamicAppNavigation;
  owner_preferences?: {
    nav_key: string;
    pinned: boolean;
    hidden: boolean;
    sort_override?: number | null;
    is_default_landing?: boolean;
    department_id?: string | null;
    shortcut_label?: string | null;
  }[];
  departments?: { id: string; name: string; department_key: string }[];
};
