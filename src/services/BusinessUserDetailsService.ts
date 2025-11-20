import { apiRequest } from "./httpClient";

const BUSINESS_USER_DETAILS_BASE_URL = "https://apisalwa.rushkarprojects.in/api/BusinessUserDetails";

export interface BusinessUserParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface BusinessUserRecord {
  id: number;
  businessName: string;
  businessType: string;
  businessRegistrationNumber: string;
  businessLicenseNumber: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  businessCountry: string;
  businessPostalCode: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonPosition: string;
  businessWebsite: string;
  businessDescription: string;
  numberOfEmployees: number;
  businessSector: string;
  annualRevenue: number;
  businessStatus: string;
  registrationDate: string;
  lastUpdatedDate: string;
  isActive: boolean;
  isVerified: boolean;
  businessDocuments: string[];
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  paymentStatus: string;
  notes: string;
}

export interface BusinessUserResponse {
  code: number;
  message: string;
  totalRecords: number;
  data: BusinessUserRecord[];
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
  payload: BusinessUserResponse | BusinessUserRecord[] | unknown
): BusinessUserRecord[] => {
  if (Array.isArray(payload)) {
    return payload as BusinessUserRecord[];
  }
  if (payload && typeof payload === "object") {
    const typed = payload as BusinessUserResponse;
    if (Array.isArray(typed.data)) {
      return typed.data;
    }
  }
  return [];
};

// Transform BusinessUserRecord to SubscriberRecord for table display
const transformToSubscriberRecord = (record: BusinessUserRecord): any => {
  const status = record.isActive 
    ? (record.isVerified ? "Active" : "Pending Approval")
    : "Inactive";
  
  const joinedDate = record.registrationDate 
    ? new Date(record.registrationDate).toLocaleDateString()
    : "N/A";

  const subscriptionAmount = record.annualRevenue || 0;

  return {
    id: record.id.toString(),
    idNo: record.businessRegistrationNumber || record.businessLicenseNumber || record.id.toString(),
    userType: "Business",
    subUserType: record.businessType || "Business",
    name: record.businessName || record.contactPersonName || "N/A",
    email: record.businessEmail || record.contactPersonEmail || "N/A",
    phoneNumber: record.businessPhone || record.contactPersonPhone || "N/A",
    subscriptionAmount,
    subscriptionUpdatedDate: record.lastUpdatedDate || "N/A",
    country: record.businessCountry || "N/A",
    region: record.businessRegion || "N/A",
    city: record.businessCity || "N/A",
    district: record.businessAddress || "N/A",
    status: status as "Active" | "Inactive" | "Pending Approval",
    joinedDate,
    // Additional business-specific fields
    businessName: record.businessName,
    businessType: record.businessType,
    contactPersonName: record.contactPersonName,
    contactPersonPosition: record.contactPersonPosition,
    businessSector: record.businessSector,
    numberOfEmployees: record.numberOfEmployees,
    businessStatus: record.businessStatus,
    subscriptionPlan: record.subscriptionPlan,
    subscriptionStatus: record.subscriptionStatus,
    paymentStatus: record.paymentStatus,
    isVerified: record.isVerified,
    businessWebsite: record.businessWebsite,
    businessDescription: record.businessDescription,
    isActive: record.isActive,
  };
};

export const getAllBusinessUserDetails = async (
  params: BusinessUserParams = {}
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

  const response = await apiRequest<BusinessUserResponse>(
    `${BUSINESS_USER_DETAILS_BASE_URL}/GetAllBusinessUserDetails${query}`,
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

export const getBusinessUserDetailById = async (businessId: string) => {
  const query = buildQuery({ businessId });
  return apiRequest<BusinessUserRecord>(
    `${BUSINESS_USER_DETAILS_BASE_URL}/GetBusinessUserDetailById${query}`,
    { method: "GET" }
  );
};

export const GetBusinessUserDetailsById = async (id: string | number) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("id is required");
  }

  const query = buildQuery({ Id: id });
  return apiRequest<BusinessUserRecord>(
    `${BUSINESS_USER_DETAILS_BASE_URL}/GetBusinessUserDetailsById${query}`,
    { method: "GET" }
  );
};
