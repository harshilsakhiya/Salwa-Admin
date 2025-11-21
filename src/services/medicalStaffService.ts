import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalRecruitmentJobParams {
  searchText?: string;
  statusId?: number;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface MedicalRecruitmentJobRecord {
  id: number;
  requestNumber: string;
  jobTitle: string;
  jobDescription: string;
  department: string;
  location: string;
  experienceRequired: string;
  qualification: string;
  salaryRange: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
}

interface MedicalRecruitmentJobResponse {
  data: MedicalRecruitmentJobRecord[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalRecruitmentJobService {
  /**
   * Get all medical recruitment jobs
   * POST API: /api/MedicalRecruitmentJob/GetAllMedicalRecruitmentJob
   */
  static GetAllMedicalRecruitmentJob = async (
    params: MedicalRecruitmentJobParams = {}
  ) => {
    try {
      const {
        searchText = "",
        statusId = undefined,
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "CreatedDate",
        orderDirection = "ASC",
      } = params;

      const body = {
        searchText,
        statusId,
        pageNumber,
        pageSize,
        orderByColumn,
        orderDirection,
      };

      const res = await axiosInstance.post(
        `MedicalRecruitmentJob/GetAllMedicalRecruitmentJob`,
        body
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
   * Get recruitment job by Request Number
   * GET API: /api/MedicalRecruitmentJob/GetAllMedicalRecruitmentJobByRequestNumber/{requestNumber}
   */
  static GetAllMedicalRecruitmentJobByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `MedicalRecruitmentJob/GetAllMedicalRecruitmentJobByRequestNumber/${requestNumber}`
      );

      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Approve or Reject job by Admin
   * POST API:
   * /api/MedicalRecruitmentJob/MedicalRecruitmentJobAdminApproveReject
   * Params passed in URL
   */
  static MedicalRecruitmentJobAdminApproveReject = async (params: {
    RequestId: number;
    NewStatusId: number;
    RequestNumber: string;
    Reason: string;
  }) => {
    try {
      const { RequestId, NewStatusId, RequestNumber, Reason } = params;

      const url = `MedicalRecruitmentJob/MedicalRecruitmentJobAdminApproveReject?RequestId=${RequestId}&NewStatusId=${NewStatusId}&RequestNumber=${RequestNumber}&Reason=${Reason}`;

      const res = await axiosInstance.post(url);

      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalRecruitmentJobService;
export type {
  MedicalRecruitmentJobParams,
  MedicalRecruitmentJobRecord,
  MedicalRecruitmentJobResponse,
};