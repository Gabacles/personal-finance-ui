import type { AxiosError } from "axios";

/**
 * Extracts a human-readable error message from an Axios API error.
 * Handles both plain string messages and NestJS validation arrays.
 */
export function extractApiError(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const message = axiosError?.response?.data?.message;

  if (!message) return fallback;
  if (Array.isArray(message)) return message.join(". ");
  return message;
}
