import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class AgentServices {
  // Get all agent discount business list
  static GetAllAgentDiscountForBusinessList = async (data: any) => {
    try {
      const res = await axiosInstance.post(
        `AgentDiscountForBusinessAndIndividual/GetAllAgentDiscountForBusinessList`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all agent discount individual list
  static GetAllAgentDiscountForIndividualList = async (data: any) => {
    try {
      const res = await axiosInstance.post(
        `AgentDiscountForBusinessAndIndividual/GetAllAgentDiscountForIndividualList`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get agent discount for business by ID
  static GetAgentDiscountForBusinessById = async (id: any) => {
    try {
      const res = await axiosInstance.get(
        `AgentDiscountForBusinessAndIndividual/GetAgentDiscountForBusinessById?id=${id}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get agent discount for individual by ID
  static GetAgentDiscountForIndividualById = async (id: any) => {
    try {
      const res = await axiosInstance.get(
        `AgentDiscountForBusinessAndIndividual/GetAgentDiscountForIndividualById?id=${id}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Upsert agent discount for business and individual
  static UpsertAgentDiscountForBusinessAndIndividual = async (data: any) => {
    try {
      const res = await axiosInstance.post(
        `AgentDiscountForBusinessAndIndividual/UpsertAgentDiscountForBusinessAndIndividual`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all agent discount for business and individual (combined)
  static GetAllAgentDiscountForBusinessAndIndividual = async (data: any) => {
    try {
      const res = await axiosInstance.post(
        `AgentDiscountForBusinessAndIndividual/GetAllAgentDiscountForBusinessAndIndividual`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default AgentServices;
