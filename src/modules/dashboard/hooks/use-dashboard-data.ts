"use client";

import {
  useReportingControllerGetDashboard,
  getReportingControllerGetDashboardQueryKey,
} from "@/generated/api/reporting/reporting";
import type { ReportingControllerGetDashboardParams } from "@/generated/api/personalFinanceAPI.schemas";
import type { DashboardResponse } from "../types/dashboard.types";

export function useDashboardData(params?: ReportingControllerGetDashboardParams) {
  return useReportingControllerGetDashboard<DashboardResponse>(params, {
    query: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  });
}

export { getReportingControllerGetDashboardQueryKey as getDashboardQueryKey };
