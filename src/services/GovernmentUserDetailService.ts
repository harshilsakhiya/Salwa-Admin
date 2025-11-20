import { apiRequest } from "./httpClient";

const GOVERNMENT_USER_DETAIL_BASE_URL = "https://apisalwa.rushkarprojects.in/api/GovernmentUserDetail";

export interface GovernmentUserParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface GovernmentUserRecord {
  id: number;
  employeeId: string;
  governmentId: string;
  departmentName: string;
  ministryName: string;
  positionTitle: string;
  employmentLevel: string;
  employmentType: string;
  employmentStatus: string;
  hireDate: string;
  salaryGrade: string;
  basicSalary: number;
  allowances: number;
  totalSalary: number;
  workLocation: string;
  workCity: string;
  workRegion: string;
  workCountry: string;
  directManagerName: string;
  directManagerEmail: string;
  directManagerPhone: string;
  hrContactName: string;
  hrContactEmail: string;
  hrContactPhone: string;
  employeeEmail: string;
  employeePhone: string;
  employeeAddress: string;
  employeeCity: string;
  employeeRegion: string;
  employeeCountry: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  qualifications: string;
  certifications: string;
  skills: string;
  languages: string;
  previousExperience: string;
  trainingRecords: string;
  performanceRating: string;
  lastPerformanceReview: string;
  nextPerformanceReview: string;
  leaveBalance: number;
  attendanceRecord: string;
  disciplinaryActions: string;
  awards: string;
  isActive: boolean;
  isVerified: boolean;
  securityClearance: string;
  accessLevel: string;
  systemPermissions: string;
  lastLoginDate: string;
  accountStatus: string;
  notes: string;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface GovernmentUserResponse {
  code: number;
  message: string;
  totalRecords: number;
  data: GovernmentUserRecord[];
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
  payload: GovernmentUserResponse | GovernmentUserRecord[] | unknown
): GovernmentUserRecord[] => {
  if (Array.isArray(payload)) {
    return payload as GovernmentUserRecord[];
  }
  if (payload && typeof payload === "object") {
    const typed = payload as GovernmentUserResponse;
    if (Array.isArray(typed.data)) {
      return typed.data;
    }
  }
  return [];
};

// Transform GovernmentUserRecord to SubscriberRecord for table display
const transformToSubscriberRecord = (record: GovernmentUserRecord): any => {
  const status = record.isActive 
    ? (record.isVerified ? "Active" : "Pending Approval")
    : "Inactive";
  
  const joinedDate = record.hireDate 
    ? new Date(record.hireDate).toLocaleDateString()
    : "N/A";

  const fullName = record.positionTitle || record.departmentName || "N/A";
  const idNo = record.employeeId || record.governmentId || record.id.toString();

  return {
    id: record.id.toString(),
    idNo,
    userType: "Government",
    subUserType: record.employmentType || "Government Employee",
    name: fullName,
    email: record.employeeEmail || "N/A",
    phoneNumber: record.employeePhone || "N/A",
    subscriptionAmount: record.totalSalary || 0,
    subscriptionUpdatedDate: record.lastUpdatedDate || "N/A",
    country: record.workCountry || record.employeeCountry || "N/A",
    region: record.workRegion || record.employeeRegion || "N/A",
    city: record.workCity || record.employeeCity || "N/A",
    district: record.workLocation || record.employeeAddress || "N/A",
    status: status as "Active" | "Inactive" | "Pending Approval",
    joinedDate,
    // Additional government-specific fields
    employeeId: record.employeeId,
    governmentId: record.governmentId,
    departmentName: record.departmentName,
    ministryName: record.ministryName,
    positionTitle: record.positionTitle,
    employmentLevel: record.employmentLevel,
    employmentType: record.employmentType,
    employmentStatus: record.employmentStatus,
    salaryGrade: record.salaryGrade,
    basicSalary: record.basicSalary,
    totalSalary: record.totalSalary,
    directManagerName: record.directManagerName,
    hrContactName: record.hrContactName,
    securityClearance: record.securityClearance,
    accessLevel: record.accessLevel,
    performanceRating: record.performanceRating,
    isVerified: record.isVerified,
    accountStatus: record.accountStatus,
    lastLoginDate: record.lastLoginDate,
    isActive: record.isActive,
  };
};

export const getAllGovernmentUserDetails = async (
  params: GovernmentUserParams = {}
) => {
  const {
    searchText = "",
    pageNumber = 1,
    pageSize = 10,
    orderByColumn = "CreatedDate",
    orderDirection = "DESC",
  } = params;

  const query = buildQuery({
    searchText,
    pageNumber,
    pageSize,
    orderByColumn,
    orderDirection,
  });

  const response = await apiRequest<GovernmentUserResponse>(
    `${GOVERNMENT_USER_DETAIL_BASE_URL}/GetAllGovernmentUserDetails${query}`,
    { method: "GET" }
  );

  const rawRecords = extractList(response);
  const records = rawRecords.map(transformToSubscriberRecord);

  return {
    records,
    totalCount: response.totalRecords ?? rawRecords.length,
    pageNumber: pageNumber,
    pageSize: pageSize,
    raw: response,
  };
};

export const getGovernmentUserDetailById = async (userId: string) => {
  const query = buildQuery({ userId });
  return apiRequest<GovernmentUserRecord>(
    `${GOVERNMENT_USER_DETAIL_BASE_URL}/GetGovernmentUserDetailById${query}`,
    { method: "GET" }
  );
};
