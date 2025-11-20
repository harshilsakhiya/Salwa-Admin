import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalLegalServiceParams {
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

interface MedicalLegalServiceResponse {
  data: MedicalLegalServiceRecord[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalLegalService {
  /**
   * Get all medical legal services
   * Uses the exact API endpoint: /api/MedicalLegalServices/GetAllMedicalLegalServices
   */
  static GetAllMedicalLegalServices = async (
    params: MedicalLegalServiceParams = {}
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
   * Approve or reject medical legal services by admin
   * Uses the API endpoint: /api/MedicalLegalServices/UpdateMedicalLegalServicesStatus
   */
  static MedicalLegalServicesApproveRejectByAdmin = async (params: {
    id: number;
    newStatusId: number;
    requestNumber: string;
    reason: string;
  }) => {
    try {
      // Use POST request with JSON body
      const res = await axiosInstance.post(
        `MedicalLegalServices/UpdateMedicalLegalServicesStatus`,
        params
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

export default MedicalLegalService;
export type {
  MedicalLegalServiceParams,
  MedicalLegalServiceRecord,
  MedicalLegalServiceResponse,
};