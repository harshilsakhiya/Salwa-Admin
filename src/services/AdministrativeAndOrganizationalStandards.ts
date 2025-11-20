import { apiRequest } from "./httpClient";

const ACCOUNT_BASE_URL = "https://apisalwa.rushkarprojects.in/api/Account";

export interface UserWisePointsAndClassParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface UserWisePointsAndClassRecord {
  id: number;
  businessName: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  category: string;
  points: number;
  createdDate: string;
  updatedDate: string;
  userId: number;
  userTypeId: number;
  isUpgradeFlag: number;
}

export interface UserWisePointsAndClassResponse {
  code: number;
  message: string;
  totalRecords: number;
  data: UserWisePointsAndClassRecord[];
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getUserWisePointsAndClassById = (userId: string) =>
  apiRequest<
    UserWisePointsAndClassRecord | { data?: UserWisePointsAndClassRecord }
  >(
    `${ACCOUNT_BASE_URL}/GetUserWisePointsAndClassById${buildQuery({
      userId,
    })}`,
    { method: "GET" }
  );

export const updateUpsertAdministrativeOrganizationalStandards = (
  userId: number,
  admOrgId: number,
  UserType: number,
  SubTypeId: number | null,
  formData: Record<string, any>
) => {
  const finalFormData = {
    ...formData.step1,
    ...formData.step2,
    ...formData.step3,
    ...formData.step4,
    ...formData.step5,
    ...formData.step6,
  };

  return apiRequest<{ message?: string; status?: number }>(
    `${ACCOUNT_BASE_URL}/UpsertAdministrativeOrganizationalStandards`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserId: userId,
        AdmOrgId: admOrgId,
        UserType,
        SubTypeId,
        ...finalFormData,
      }),
    }
  );
};
