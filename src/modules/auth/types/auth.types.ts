import type { LoginFormValues, RegisterFormValues } from "../schemas/auth.schemas";

export type EmploymentType = "CLT" | "PJ" | "OTHER";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  CLT: "CLT (Formal)",
  PJ: "PJ (Pessoa Jurídica)",
  OTHER: "Other",
};

// Derived from Zod schemas — single source of truth for form data shapes.
export type LoginFormData = LoginFormValues;
export type RegisterFormData = RegisterFormValues;

export interface AuthResponse {
  accessToken?: string;
  token?: string;
}
