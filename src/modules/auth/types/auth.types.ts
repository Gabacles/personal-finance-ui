export type EmploymentType = "CLT" | "PJ" | "OTHER";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  CLT: "CLT (Formal)",
  PJ: "PJ (Pessoa Jurídica)",
  OTHER: "Other",
};

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  employmentType: EmploymentType;
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
}
