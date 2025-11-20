import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface IndividualClinicServiceParams {
  clinicSiteId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: string;
}

interface ClinicRentalServiceParams {
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface ClinicRentalApproveRejectParams {
  requestId: number;
  newStatusId: number;
  requestNumber: string;
  reason: string;
}

interface IndividualClinicServiceRequest {
  id: number;
  requestNumber: string;
  clinicName: string;
  clinicSiteId: number;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  region: string;
  country: string;
  licenseNumber: string;
  medicalLicenseNumber: string;
  numberOfEmployees: number;
  fdaRegistrationNumber: string;
  rentPeriod: string;
  status: string;
  createdDate: string;
  updatedDate?: string;
  notes?: string;
}

interface IndividualClinicServiceResponse {
  data: IndividualClinicServiceRequest[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface ClinicRentalService {
  id: number;
  serviceName: string;
  description: string;
  category: string;
  pricePerDay: number;
  availabilityStatus: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  equipmentDetails: string;
  rentalTerms: string;
  createdDate: string;
  updatedDate?: string;
  status: string;
}

interface ClinicRentalServiceResponse {
  data: ClinicRentalService[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class IndividualClinicService {
  /**
   * Get all individual clinic service requests for admin
   * Uses the exact API endpoint: /api/IndividualClinicService/GetAllForAdminIndividualClinicServiceRequests
   */
  static GetAllForAdminIndividualClinicServiceRequests = async (
    params: IndividualClinicServiceParams = {}
  ) => {
    try {
      const {
        clinicSiteId,
        pageNumber = 1,
        pageSize = 10,
        sortColumn = "CreatedDate",
        sortDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      });

      // Add clinicSiteId only if provided
      if (clinicSiteId !== undefined) {
        queryParams.append("clinicSiteId", clinicSiteId.toString());
      }

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `IndividualClinicService/GetAllForAdminIndividualClinicServiceRequests?${queryParams.toString()}`
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
   * Get individual clinic service request by ID
   */
  static GetIndividualClinicServiceRequestById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `IndividualClinicService/GetIndividualClinicServiceRequestById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update individual clinic service request status
   */
  static UpdateIndividualClinicServiceRequestStatus = async (data: {
    requestId: number;
    status: string;
    notes?: string;
    userId: number;
  }) => {
    try {
      const res = await axiosInstance.post(
        `IndividualClinicService/UpdateIndividualClinicServiceRequestStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update status using the new UpdateStatus endpoint
   */
  static UpdateStatus = async (data: {
    requestId: number;
    statusId: number;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `IndividualClinicService/UpdateStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get individual clinic service request by request number
   */
  static GetIndividualClinicServiceRequestByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `IndividualClinicService/GetIndividualClinicServiceRequestByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all clinic rental services
   * Uses the API endpoint: /api/MedicalEquipmentAndFacilities/GetAllClinicRentalServices
   */
  static GetAllClinicRentalServices = async (
    params: ClinicRentalServiceParams = {}
  ) => {
    try {
      const {
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "CreatedDate",
        orderDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetAllClinicRentalServices?${queryParams.toString()}` 
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
   * Approve or reject clinic rental services by admin
   * Uses the API endpoint: /api/MedicalEquipmentAndFacilities/ClinicRentalServicesApproveRejectByAdmin
   */
  static ClinicRentalServicesApproveRejectByAdmin = async (
    params: ClinicRentalApproveRejectParams
  ) => {
    try {
      const { requestId, newStatusId, requestNumber, reason } = params;

      const requestBody = {
        requestId,
        newStatusId,
        requestNumber,
        reason,
      };

      // Use POST request with JSON body
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/ClinicRentalServicesApproveRejectByAdmin`,
        requestBody
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default IndividualClinicService;
export type {
  IndividualClinicServiceParams,
  IndividualClinicServiceRequest,
  IndividualClinicServiceResponse,
  ClinicRentalServiceParams,
  ClinicRentalService,
  ClinicRentalServiceResponse,
  ClinicRentalApproveRejectParams,
};
