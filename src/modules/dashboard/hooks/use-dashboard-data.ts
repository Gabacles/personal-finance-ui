"use client";

import {
  useReportingControllerGetDashboard,
  getReportingControllerGetDashboardQueryKey,
} from "@/generated/api/reporting/reporting";
import type { ReportingControllerGetDashboardParams } from "@/generated/api/personalFinanceAPI.schemas";
import type { DashboardApiResponse, DashboardData } from "../types/dashboard.types";

export function useDashboardData(params?: ReportingControllerGetDashboardParams) {
  return useReportingControllerGetDashboard<DashboardData>(params, {
    query: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      select: (raw) => (raw as unknown as DashboardApiResponse).data,
    },
  });
}

export { getReportingControllerGetDashboardQueryKey as getDashboardQueryKey };
