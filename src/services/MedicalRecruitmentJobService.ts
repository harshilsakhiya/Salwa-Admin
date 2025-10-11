import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalRecruitmentJobRequest {
  searchText?: any;
  statusId?: any;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface MedicalRecruitmentJob {
  id: number;
  jobTitle: string;
  jobDescription: string;
  department: string;
  requiredQualifications: string;
  experienceYears: number;
  salaryRange: string;
  location: string;
  employmentType: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate?: string;
  createdBy: number;
  updatedBy?: number;
  isActive: boolean;
  applicationDeadline?: string;
  contactEmail: string;
  contactPhone: string;
  benefits: string;
  responsibilities: string;
  requirements: string;
  jobCategory: string;
  recruitmentType: string;
  urgentFlag: boolean;
  internalOnly: boolean;
  externalAllowed: boolean;
}

interface MedicalRecruitmentJobResponse {
  data: MedicalRecruitmentJob[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalRecruitmentJobService {
  /**
   * Get all medical recruitment jobs
   * Uses the exact API endpoint: /api/MedicalRecruitmentJob/GetAllMedicalRecruitmentJob
   */
  static GetAllMedicalRecruitmentJob = async (
    params: MedicalRecruitmentJobRequest = {}
  ) => {
    try {
      const {
        searchText = null,
        statusId = null,
        pageNumber = 0,
        pageSize = 0,
        orderByColumn = "CreatedDate",
        orderDirection = "DESC",
      } = params;

      const requestBody = {
        searchText,
        statusId,
        pageNumber,
        pageSize,
        orderByColumn,
        orderDirection,
      };

      // Use POST request with JSON body as shown in the API documentation
      const res = await axiosInstance.post(
        `MedicalRecruitmentJob/GetAllMedicalRecruitmentJob`,
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

  /**
   * Get medical recruitment job by ID
   */
  static GetMedicalRecruitmentJobById = async (jobId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalRecruitmentJob/GetMedicalRecruitmentJobById/${jobId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical recruitment job status
   */
  static UpdateMedicalRecruitmentJobStatus = async (data: {
    jobId: number;
    statusId: number;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalRecruitmentJob/UpdateStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Create new medical recruitment job
   */
  static CreateMedicalRecruitmentJob = async (
    data: Partial<MedicalRecruitmentJob>
  ) => {
    try {
      const res = await axiosInstance.post(
        `MedicalRecruitmentJob/CreateMedicalRecruitmentJob`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical recruitment job
   */
  static UpdateMedicalRecruitmentJob = async (
    jobId: number,
    data: Partial<MedicalRecruitmentJob>
  ) => {
    try {
      const res = await axiosInstance.put(
        `MedicalRecruitmentJob/UpdateMedicalRecruitmentJob/${jobId}`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Delete medical recruitment job
   */
  static DeleteMedicalRecruitmentJob = async (jobId: number) => {
    try {
      const res = await axiosInstance.delete(
        `MedicalRecruitmentJob/DeleteMedicalRecruitmentJob/${jobId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalRecruitmentJobService;
export type {
  MedicalRecruitmentJobRequest,
  MedicalRecruitmentJob,
  MedicalRecruitmentJobResponse,
};
