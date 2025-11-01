import { apiRequest } from "./httpClient";

const SUBSCRIBER_BASE_URL =
  "https://apisalwa.rushkarprojects.in/api/Subscriber";

export interface SubscriberParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
  status?: "Individual" | "Business" | "Government";
}

export interface SubscriberRecord {
  id: string;
  idNo: string;
  userType: string;
  subUserType: string;
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionAmount: number;
  subscriptionUpdatedDate: string;
  country: string;
  region: string;
  city: string;
  district: string;
  status: "Active" | "Inactive" | "Pending Approval";
  joinedDate: string;
  // Additional fields that might come from the Individual API
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  coverageType?: string;
  expiryDate?: string;
  currentStage?: string;
  isApproved?: boolean;
}

export interface SubscriberResponse {
  code: number;
  message: string;
  totalRecords: number;
  data: SubscriberRecord[];
}

export interface SubscriberAnalytics {
  totalActive: number;
  totalInactive: number;
  totalUsers: number;
  monthlyData: Array<{
    month: string;
    active: number;
    inactive: number;
  }>;
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const extractList = (
  payload: SubscriberResponse | SubscriberRecord[] | unknown
): SubscriberRecord[] => {
  if (Array.isArray(payload)) {
    return payload as SubscriberRecord[];
  }
  if (payload && typeof payload === "object") {
    const typed = payload as SubscriberResponse;
    if (Array.isArray(typed.data)) {
      return typed.data;
    }
  }
  return [];
};

export const getAllSubscribers = async (params: SubscriberParams = {}) => {
  const {
    searchText = "",
    pageNumber = 1,
    pageSize = 10,
    orderByColumn = "CreatedDate",
    orderDirection = "DESC",
    status = "Individual",
  } = params;

  const query = buildQuery({
    searchText,
    pageNumber,
    pageSize,
    orderByColumn,
    orderDirection,
    userType: status,
  });

  const response = await apiRequest<SubscriberResponse>(
    `${SUBSCRIBER_BASE_URL}/GetAllSubscribers${query}`,
    { method: "GET" }
  );

  const records = extractList(response);

  return {
    records,
    totalCount: response.totalRecords ?? records.length,
    pageNumber: pageNumber,
    pageSize: pageSize,
    raw: response,
  };
};

export const getSubscriberById = (subscriberId: string) =>
  apiRequest<SubscriberRecord | { data?: SubscriberRecord }>(
    `${SUBSCRIBER_BASE_URL}/GetSubscriberById${buildQuery({ subscriberId })}`,
    { method: "GET" }
  );

export const getSubscriberAnalytics =
  async (): Promise<SubscriberAnalytics> => {
    const response = await apiRequest<SubscriberAnalytics>(
      `${SUBSCRIBER_BASE_URL}/GetSubscriberAnalytics`,
      { method: "GET" }
    );

    return response;
  };

export const updateSubscriberStatus = (
  subscriberId: string,
  status: "Active" | "Inactive" | "Pending Approval"
) =>
  apiRequest<{ message?: string; status?: number }>(
    `${SUBSCRIBER_BASE_URL}/UpdateSubscriberStatus`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriberId, status }),
    }
  );

export const exportSubscribers = async (params: SubscriberParams = {}) => {
  const query = buildQuery(
    params as Record<string, string | number | undefined>
  );
  const response = await fetch(
    `${SUBSCRIBER_BASE_URL}/ExportSubscribers${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Export failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
