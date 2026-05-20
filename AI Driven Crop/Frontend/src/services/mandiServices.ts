// services/mandiServices.ts
import apiClient from "./apiClient";

export const fetchMandiRates = async (state?: string, commodity?: string) => {
  const params: any = {};
  if (state && state !== "all") params.state = state;
  if (commodity && commodity !== "all") params.commodity = commodity;

  const response = await apiClient.get("/mandi/rates", { params });
  return response.data.records;
};

export const fetchStates = async () => {
  const response = await apiClient.get("/mandi/states");
  return response.data.states;
};

export const fetchCommodities = async () => {
  const response = await apiClient.get("/mandi/commodities");
  return response.data.commodities;
};