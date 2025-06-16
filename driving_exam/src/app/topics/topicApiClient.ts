import { axiosInstance, createErrorResponse, ErrorResponse } from "../utils/apiClient";
import { Topic, isTopic } from "../types/Topic";

export async function getTopics(moduleGuid: string): Promise<Topic[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get(`topics?assignedModule=${moduleGuid}`);
    return response.data.filter(isTopic);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export async function addTopic(formData: FormData, moduleGuid: string): Promise<ErrorResponse | undefined> {
  const data = {
    name: formData.get("name"),
    moduleGuid
  };
  try {
    await axiosInstance.post("topics", data);
  } catch (e) {
    return createErrorResponse(e);
  }
}
