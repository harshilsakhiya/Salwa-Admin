import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface UpdateStatusParams {
  requestId: number;
  newStatusId: number;
  userId: number;
  requestNumber: string;
  reason: string;
}

export interface MedicalRealEstateServiceRecord {
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  buildingLicenseNumber: string;
  medicalLicenseNumber: string;
  workingEmp: number;
  contactPersonName: string;
  contactEmail: string;
  clinicHours: string;
  rentPeriod: number;
  rentPeriodType: string;
  serviceType: string;
  provideWith: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  clinicSiteId: number;
  categoryId: number;
  serviceId: number;
  confirmedFlag: boolean;
  isActive: boolean;
  isAdminApprove: boolean;
  sterilizationEquipmentFlag: boolean;
  otherTermsAndCon: string;
  reason: string;
  media: string;
  validityTime: number;
  transactionId: string | null;
  quotation: string | null;
  deletedBy: number | null;
  deletedDate: string | null;
  rowNum: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface MedicalFactoriesSectorRecord {
  requestId: number;
  requestNumber?: string;
  orderTitle: string;
  itemName: string;
  itemQuantity: number;
  facPrices: number;
  discount: number;
  discountPrice: number;
  totalWeight: number;
  country: string | null;
  region: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  businessName: string | null;
  categoryId: number;
  choosePostTimeValidityTime: number;
  contactPersonEmail: string;
  contactPersonName: string;
  ename: string;
  isAdminApprove: string;
  isConfirmedFlag: boolean;
  isTransportationFlag: boolean;
  latitude: string | null;
  longitude: string | null;
  mediaFiles: string | null;
  nationalAddress: string | null;
  otherDetails: string;
  serviceId: number;
  serviceType: number;
  statusId: number;
  transactionId: string | null;
  // Legacy fields for backward compatibility
  buildingLicenseNumber?: string;
  medicalLicenseNumber?: string;
  workingEmp?: number;
  contactEmail?: string;
  clinicHours?: string;
  rentPeriod?: number;
  rentPeriodType?: string;
  provideWith?: string;
  statusName?: string;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: number;
  updatedBy?: number;
  clinicSiteId?: number;
  confirmedFlag?: boolean;
  isActive?: boolean;
  sterilizationEquipmentFlag?: boolean;
  otherTermsAndCon?: string;
  reason?: string;
  media?: string;
  validityTime?: number;
  quotation?: string | null;
  deletedBy?: number | null;
  deletedDate?: string | null;
  rowNum?: number;
}

export interface GetAllMedicalFactoriesSectorParams {
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface MedicalFactoriesSectorApproveRejectParams {
  RequestId: number;
  NewStatusId: number;
  RequestNumber: string;
  Reason: string;
}

export interface GetAllMedicalSellServicesParams {
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface GetAllRentMedicalEquipmentParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface MedicalSellServiceRecord {
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  buildingLicenseNumber: string;
  medicalLicenseNumber: string;
  workingEmp: number;
  contactPersonName: string;
  contactEmail: string;
  clinicHours: string;
  rentPeriod: number;
  rentPeriodType: string;
  serviceType: string;
  provideWith: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  clinicSiteId: number;
  categoryId: number;
  serviceId: number;
  confirmedFlag: boolean;
  isActive: boolean;
  isAdminApprove: boolean;
  sterilizationEquipmentFlag: boolean;
  otherTermsAndCon: string;
  reason: string;
  media: string;
  validityTime: number;
  transactionId: string | null;
  quotation: string | null;
  deletedBy: number | null;
  deletedDate: string | null;
  rowNum: number;
}

export interface RentMedicalEquipmentRecord {
  requestId: number;
  rentMedicalType: string;
  contactPersonName: string;
  contactPersonEmail: string;
  orderPostValidityTime: string;
  discountType: string;
  discountValue: number;
  orderTitle: string;
  deviceName: string;
  deviceServiceType: string;
  fdaNumber: string;
  postValidityTime: string;
  deviceApprovalNumber: string;
  termsAndConditions: string;
  damageInformation: string;
  rentValue: number;
  securityDepositRequired: boolean;
  rentPeriod: string;
  leftDays: string;
  mediaFilePath: string;
  facility: string;
  fdaDeviceLicenseNo: string;
  createdBy: number;
  isAdminApprove: boolean;
  country: string | null;
  region: string | null;
  city: string | null;
  district: string | null;
  nationalAddress: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  statusName: string;
  deviceTypeName: string | null;
}

export interface RentMedicalEquipmentResponse {
  data: RentMedicalEquipmentRecord[];
  totalRecords: number;
}

class MedicalEquipmentAndFacilitiesService {
  /**
   * Get all medical factories sector for admin
   * Uses the exact API endpoint: /api/MedicalFactoriesSector/GetAllMedicalFactoriesSectorforAdmin
   */
  static GetAllMedicalFactoriesSectorforAdmin = async (
    params: GetAllMedicalFactoriesSectorParams
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.orderByColumn)
        queryParams.append("orderByColumn", params.orderByColumn);
      if (params.orderDirection)
        queryParams.append("orderDirection", params.orderDirection);

      const res = await axiosInstance.get(
        `MedicalFactoriesSector/GetAllMedicalFactoriesSectorforAdmin?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical factories sector by ID
   * Uses the exact API endpoint: /api/MedicalFactoriesSector/GetMedicalFactoriesSectorById/{requestId}
   */
  static GetMedicalFactoriesSectorById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalFactoriesSector/GetMedicalFactoriesSectorById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Approve or reject medical factories sector request by admin
   * Uses the exact API endpoint: /api/MedicalFactoriesSector/MedicalFactoriesSectorAdminApproveReject
   */
  static MedicalFactoriesSectorAdminApproveReject = async (
    params: MedicalFactoriesSectorApproveRejectParams
  ) => {
    try {
      const formData = new FormData();
      formData.append("RequestId", params.RequestId.toString());
      formData.append("NewStatusId", params.NewStatusId.toString());
      formData.append("RequestNumber", params.RequestNumber);
      formData.append("Reason", params.Reason);

      const res = await axiosInstance.post(
        "MedicalFactoriesSector/MedicalFactoriesSectorAdminApproveReject",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical real estate service by ID
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/GetMedicalRealEstateServiceById
   */
  static GetMedicalRealEstateServiceById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetMedicalRealEstateServiceById?requestId=${requestId}`
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical real estate service status
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/UpdateMedicalRealEstateServiceStatus
   */
  static UpdateMedicalRealEstateServiceStatus = async (
    data: UpdateStatusParams
  ) => {
    try {
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/UpdateMedicalRealEstateServiceStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all medical sell services for admin
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/GetAllMedicalSellServices
   */
  static GetAllMedicalSellServices = async (
    params: GetAllMedicalSellServicesParams = {}
  ) => {
    try {
      const {
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "RequestId",
        orderDirection = "ASC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetAllMedicalSellServices?${queryParams.toString()}`
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical sell service status
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/UpdateMedicalSellServiceStatus
   */
  static UpdateMedicalSellServiceStatus = async (data: {
    requestId: number;
    newStatusId: number;
    requestNumber: string;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/UpdateMedicalSellServiceStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical sell service by request number
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/GetMedicalSellServiceByRequestNumber
   */
  static GetMedicalSellServiceByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetMedicalSellServiceByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all rent medical equipment
   * Uses the exact API endpoint: /api/MedicalEquipmentAndFacilities/GetAllRentMedicalEquipment
   */
  static GetAllRentMedicalEquipment = async (
    params: GetAllRentMedicalEquipmentParams = {}
  ) => {
    try {
      const {
        searchText,
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "Id",
        orderDirection = "ASC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Add searchText only if provided
      if (searchText) {
        queryParams.append("searchText", searchText);
      }

      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetAllRentMedicalEquipment?${queryParams.toString()}`
      );
      return {
        success: true,
        data: res.data.data || [],
        totalRecords: res.data.totalRecords || 0,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalEquipmentAndFacilitiesService;
