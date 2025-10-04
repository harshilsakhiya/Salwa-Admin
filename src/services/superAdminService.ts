import { apiRequest } from "./httpClient";

const BASE_URL = "https://apisalwa.rushkarprojects.in/api/SuperAdmin";
const ACCOUNT_BASE_URL = "https://apisalwa.rushkarprojects.in/api/Account";

export type SuperAdminStatusId = 0 | 1 | 2 | 3;

export interface SuperAdminTypeOption {
  id: number;
  name: string;
}

export interface SuperAdminRecord {
  employeeId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  idNumber: string;
  idExpiryDate?: string;
  dateOfBirth?: string;
  graduationCertificate?: string;
  acquiredLanguages?: string;
  telephone?: string;
  officialEmail: string;
  type: number;
  country?: string;
  region?: string;
  city?: string;
  nationalAddress?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  bankName?: string;
  ibanNumber?: string;
  password?: string | null;
  otp?: number;
  isPasswordset?: number;
  isOtpVerify?: number;
  isMobileNoVerify?: boolean;
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
  statusId?: SuperAdminStatusId;
}

export interface SuperAdminListResponse {
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  data?: SuperAdminRecord[];
  items?: SuperAdminRecord[];
  superAdminList?: SuperAdminRecord[];
  result?: SuperAdminRecord[];
  message?: string;
  status?: number;
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

const extractList = (payload: SuperAdminListResponse | SuperAdminRecord[] | unknown): SuperAdminRecord[] => {
  if (Array.isArray(payload)) {
    return payload as SuperAdminRecord[];
  }
  if (payload && typeof payload === "object") {
    const typed = payload as SuperAdminListResponse;
    if (Array.isArray(typed.data)) {
      return typed.data;
    }
    if (Array.isArray(typed.items)) {
      return typed.items;
    }
    if (Array.isArray(typed.superAdminList)) {
      return typed.superAdminList;
    }
    if (Array.isArray(typed.result)) {
      return typed.result;
    }
  }
  return [];
};

export const upsertSuperAdmin = (payload: SuperAdminRecord) =>
  apiRequest<{ message?: string; status?: number }>(`${BASE_URL}/UpsertSuperAdmin`, {
    method: "POST",
    body: payload,
  });

export const getSuperAdmins = async (params: { pageNumber?: number; pageSize?: number; search?: string } = {}) => {
  const query = buildQuery(params);
  const response = await apiRequest<SuperAdminListResponse | SuperAdminRecord[]>(
    `${BASE_URL}/GetAllSuperAdmins${query}`,
    { method: "GET" }
  );

  const records = extractList(response);
  const meta = (response && typeof response === "object" ? response : {}) as SuperAdminListResponse;

  return {
    records,
    totalCount: meta.totalCount ?? records.length,
    pageNumber: meta.pageNumber ?? params.pageNumber ?? 1,
    pageSize: meta.pageSize ?? params.pageSize ?? records.length,
    raw: response,
  };
};

export const getSuperAdminById = (employeeId: number) =>
  apiRequest<SuperAdminRecord | { data?: SuperAdminRecord }>(
    `${BASE_URL}/GetSuperAdminById${buildQuery({ employeeId })}`,
    { method: "GET" }
  );

export const updateSuperAdminStatus = (employeeId: number, statusId: SuperAdminStatusId) =>
  apiRequest<{ message?: string; status?: number }>(
    `${BASE_URL}/UpdateSuperAdminStatus${buildQuery({ employeeId, statusId })}`,
    { method: "PATCH" }
  );

export const softDeleteSuperAdmin = (employeeId: number) =>
  apiRequest<{ message?: string; status?: number }>(
    `${BASE_URL}/SoftDeleteSuperAdmin${buildQuery({ employeeId })}`,
    { method: "DELETE" }
  );

export const fetchSuperAdminTypes = async (): Promise<SuperAdminTypeOption[]> => {
  const response = await apiRequest<{ data?: unknown; message?: string; status?: number }>(
    `${ACCOUNT_BASE_URL}/Common`,
    {
      method: "POST",
      body: { parameter: "{}", spName: "USP_GetSuperAdminTypeDropdown", language: "EN" },
    }
  );

  const rawData = response?.data;
  let decoded: unknown = rawData;
  if (typeof rawData === "string") {
    try {
      decoded = JSON.parse(rawData);
    } catch (error) {
      throw new Error("Unable to parse supervisor type response");
    }
  }

  if (!Array.isArray(decoded)) {
    throw new Error("Supervisor type response malformed");
  }

  return decoded
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const typed = item as { ID?: number; id?: number; Id?: number; EName?: string; name?: string; Name?: string };
      const id = typed.ID ?? typed.id ?? typed.Id;
      const name = typed.EName ?? typed.name ?? typed.Name;
      if (typeof id !== "number" || typeof name !== "string") {
        return null;
      }
      return { id, name: name.trim() };
    })
    .filter((option): option is SuperAdminTypeOption => Boolean(option && option.name));
};


