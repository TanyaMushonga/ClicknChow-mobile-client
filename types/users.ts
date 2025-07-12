export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  sex: "MALE" | "FEMALE" | "UNSPECIFIED";
  role: string;
  date_of_birth: string | null;
  profile_photo: string | null;
  last_password_change: string | null;
  last_login_method: string | null;
  device_token: string | null;
  admin_token: string | null;
  low_permissions: boolean;
  medium_permissions: boolean;
  high_permissions: boolean;
  super_permissions: boolean;
  ultra_permissions: boolean;
  extreme_permissions: boolean;
  is_active: boolean;
  is_org_owner: boolean;
  is_branch_owner: boolean;
  privacy_policy_accepted: boolean;
  terms_accepted: boolean;
  data_processing_consent: boolean;
  deletion_requested: boolean;
  email_verified: boolean;
  phone_number_verified: boolean;
  organisation: string | null;
  branch: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}