import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalLegalServicesParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface MedicalLegalServiceRecord {
  id: number;
  requestNumber: string;
  requestTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  legalCaseType: string;
  caseDescription: string;
  urgencyLevel: string;
  estimatedDuration: string;
  budgetRange: string;
  preferredLanguage: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  isApproved: boolean;
  notes?: string;
  assignedLawyer?: string;
  caseFileNumber?: string;
}

interface MedicalLegalServicesResponse {
  data: MedicalLegalServiceRecord[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalLegalServices {
  /**
   * Get all medical legal services with pagination and search
   * Uses the exact API endpoint: /api/MedicalLegalServices/GetAllMedicalLegalServices
   */
  static GetAllMedicalLegalServices = async (
    params: MedicalLegalServicesParams = {}
  ) => {
    try {
      const {
        searchText = "",
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

      // Add searchText only if provided
      if (searchText && searchText.trim() !== "") {
        queryParams.append("searchText", searchText.trim());
      }

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `MedicalLegalServices/GetAllMedicalLegalServices?${queryParams.toString()}`
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
   * Get medical legal service by ID
   */
  static GetMedicalLegalServiceById = async (serviceId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalLegalServices/GetMedicalLegalServiceById/${serviceId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical legal service status
   */
  static UpdateMedicalLegalServiceStatus = async (data: {
    serviceId: number;
    statusId: number;
    reason: string;
    notes?: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalLegalServices/UpdateStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Assign lawyer to medical legal service
   */
  static AssignLawyer = async (data: {
    serviceId: number;
    lawyerId: number;
    caseFileNumber?: string;
    notes?: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalLegalServices/AssignLawyer`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical legal service by request number
   */
  static GetMedicalLegalServiceByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `MedicalLegalServices/GetMedicalLegalServiceByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Create new medical legal service request
   */
  static CreateMedicalLegalService = async (data: {
    requestTitle: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    serviceType: string;
    legalCaseType: string;
    caseDescription: string;
    urgencyLevel: string;
    estimatedDuration: string;
    budgetRange: string;
    preferredLanguage: string;
    notes?: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalLegalServices/CreateMedicalLegalService`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Delete medical legal service
   */
  static DeleteMedicalLegalService = async (serviceId: number) => {
    try {
      const res = await axiosInstance.delete(
        `MedicalLegalServices/DeleteMedicalLegalService/${serviceId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalLegalServices;
export type {
  MedicalLegalServicesParams,
  MedicalLegalServiceRecord,
  MedicalLegalServicesResponse,
};
