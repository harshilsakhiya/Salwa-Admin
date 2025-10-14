import { errorHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface TermsConditionsParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface TermsConditionsResponse {
  data: any[];
  success: boolean;
}

interface TermsConditionsByIdResponse {
  data: any;
  success: boolean;
}

interface UpdateServiceTermsRequest {
  serviceId: number;
  categoryId: number;
  category: string;
  subServiceId: number;
  service: string;
  subService: string;
  eTermsAndCondition: string;
  aTermsAndCondition: string;
  isActive: boolean;
  updatedBy: number;
}

interface UpdateServiceTermsResponse {
  success: boolean;
  message?: string;
}

// Registration APIs interfaces
interface RegistrationTermsByIdResponse {
  data: any;
  success: boolean;
}

interface UpdateRegistrationTermsRequest {
  subTypeId: number | null;
  userTypeId: number;
  userType: string;
  categoryId: number;
  category: string;
  subType: string | null;
  eTermsAndCondition: string;
  aTermsAndCondition: string;
  updatedBy: number;
}

interface UpdateRegistrationTermsResponse {
  success: boolean;
  message?: string;
}

class TermsConditionsService {
  static getServiceTermsAndConditionsAdmin = async (
    params: TermsConditionsParams = {}
  ): Promise<TermsConditionsResponse> => {
    try {
      // Get current language from localStorage or default to 'en'
      const currentLanguage = localStorage.getItem("i18nextLng") || "en";
      const languageParam = currentLanguage.toUpperCase(); // Convert to EN or AR

      // Set default values
      const defaultParams = {
        searchText: "",
        pageNumber: 1,
        pageSize: 10,
        orderByColumn: "CreatedDate",
        orderDirection: "DESC",
        ...params,
        Language: languageParam,
      };

      const res = await axiosInstance.get(
        `Account/GetserviceTermsAndConditionsAdmin`,
        {
          params: defaultParams,
        }
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        data: [],
        ...errorResponse,
      };
    }
  };

  static getRegistrationTermsAndConditionsAdmin = async (
    params: TermsConditionsParams = {}
  ): Promise<TermsConditionsResponse> => {
    try {
      // Get current language from localStorage or default to 'en'
      const currentLanguage = localStorage.getItem("i18nextLng") || "en";
      const languageParam = currentLanguage.toUpperCase(); // Convert to EN or AR

      // Set default values
      const defaultParams = {
        searchText: "",
        pageNumber: 1,
        pageSize: 10,
        orderByColumn: "CreatedDate",
        orderDirection: "DESC",
        ...params,
        Language: languageParam,
      };

      const res = await axiosInstance.get(
        `Account/GetregsitrationTermsAndConditionsAdmin`,
        {
          params: defaultParams,
        }
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        data: [],
        ...errorResponse,
      };
    }
  };

  static getServiceTermsAndConditionsAdminById = async (
    categoryId: number
  ): Promise<TermsConditionsByIdResponse> => {
    try {
      const res = await axiosInstance.get(
        `Account/GetserviceTermsAndConditionsAdminById`,
        {
          params: {
            categoryId,
          },
        }
      );
      return {
        success: true,
        data: res.data.data, // Extract the actual data from the response
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        data: null,
        ...errorResponse,
      };
    }
  };

  static updateServiceTermsAndConditions = async (
    requestData: UpdateServiceTermsRequest
  ): Promise<UpdateServiceTermsResponse> => {
    try {
      const res = await axiosInstance.post(
        `Account/UpdateServiceTermsAndConditions`,
        requestData
      );
      return {
        success: true,
        message:
          res.data?.message || "Terms and conditions updated successfully",
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        message:
          errorResponse?.message || "Failed to update terms and conditions",
        ...errorResponse,
      };
    }
  };

  static getRegistrationTermsAndConditionsAdminById = async (
    categoryId: number
  ): Promise<RegistrationTermsByIdResponse> => {
    try {
      const res = await axiosInstance.get(
        `Account/GetregsitrationTermsAndConditionsAdminById`,
        {
          params: {
            UserTypeId: 0,
            categoryId,
          },
        }
      );
      return {
        success: true,
        data: res.data.data, // Extract the actual data from the response
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        data: null,
        ...errorResponse,
      };
    }
  };

  static updateRegistrationTermsAndConditions = async (
    requestData: UpdateRegistrationTermsRequest
  ): Promise<UpdateRegistrationTermsResponse> => {
    try {
      const res = await axiosInstance.post(
        `Account/UpdateRegistrationTermsAndConditions`,
        requestData
      );
      return {
        success: true,
        message:
          res.data?.message ||
          "Registration terms and conditions updated successfully",
      };
    } catch (error: any) {
      const errorResponse = errorHandler(error);
      return {
        success: false,
        message:
          errorResponse?.message ||
          "Failed to update registration terms and conditions",
        ...errorResponse,
      };
    }
  };
}

export default TermsConditionsService;
