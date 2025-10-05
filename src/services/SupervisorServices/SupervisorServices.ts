import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class SupervisorServices {
  static UpsertSuperAdmin = async (data: any) => {
    try {
      const res = await axiosInstance.post(`SuperAdmin/UpsertSuperAdmin`, data);
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  static UpdateSuperAdmin = async (id: any, status: any, data: any) => {
    try {
      const res = await axiosInstance.patch(
        `SuperAdmin/UpdateSuperAdminStatus?employeeId=${id}&statusId=${status}`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
  static GetSuperAdminById = async (id: any) => {
    try {
      const res = await axiosInstance.get(
        `SuperAdmin/GetSuperAdminById?employeeId=${id}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default SupervisorServices;
