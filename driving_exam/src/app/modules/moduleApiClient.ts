import { axiosInstance, createErrorResponse, ErrorResponse } from "../utils/apiClient";
import { Module, isModule } from "../types/Module";

export async function getModules(): Promise<Module[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get("modules");
    return response.data.filter(isModule);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export async function addModule(formData: FormData): Promise<ErrorResponse | undefined> {
  const data = {
    name: formData.get("name"),
  };
  try {
    await axiosInstance.post("modules", data);
  } catch (e) {
    return createErrorResponse(e);
  }
}
// (bereits wie categoryApiClient, kein Edit nötig)
