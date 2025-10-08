import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class NonMedicalServices {
  // Get all business user non medical list
  static GetAllBusinessUserNonMedical = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllBusinessUserNonMedical?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all individual user idea partner list
  static GetAllIndividualUserIdeaPartner = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllIndividualUserIdeaPartner?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all individual user non medical list
  static GetAllIndividualUserNonMedical = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllIndividualUserNonMedical?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all business user non medical request list
  static GetAllBusinessUserNonMedicalRequestList = async (params: {
    userId?: number;
    pageNumber?: number;
    pageSize?: number;
    sortColumn?: string;
    sortDirection?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.userId) queryParams.append("UserId", params.userId.toString());
      if (params.pageNumber)
        queryParams.append("PageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("PageSize", params.pageSize.toString());
      if (params.sortColumn)
        queryParams.append("SortColumn", params.sortColumn);
      if (params.sortDirection)
        queryParams.append("SortDirection", params.sortDirection);

      const res = await axiosInstance.get(
        `BusinessUserDetails/GetAllBusinessUserNonMedicalRequestList?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Delete business user non medical
  static DeleteBusinessUserNonMedical = async (id: number) => {
    try {
      const res = await axiosInstance.post(
        `BusinessUserDetails/DeleteBusinessUserNonMedical?id=${id}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all business user menu
  static GetAllBusinessUserMenu = async (params: {
    pageNumber?: number;
    pageSize?: number;
    sortColumn?: string;
    sortOrder?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.sortColumn)
        queryParams.append("sortColumn", params.sortColumn);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllBusinessUserMenu?${queryParams.toString()}`
      );
      return res;
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default NonMedicalServices;
