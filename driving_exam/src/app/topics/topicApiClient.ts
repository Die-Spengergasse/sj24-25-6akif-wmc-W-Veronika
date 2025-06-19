import { axiosInstance, createErrorResponse, ErrorResponse } from "../utils/apiClient";
import { Topic, isTopic } from "../types/Topic";

// Holt alle Topics für ein Modul
export async function getTopics(moduleGuid: string): Promise<Topic[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get(`topics?assignedModule=${moduleGuid}`);
    return response.data.filter(isTopic);
  } catch (e) {
    return createErrorResponse(e);
  }
}

// Fügt ein neues Topic hinzu (POST /api/Topics, nur name im Body)
export async function addTopic(formData: FormData): Promise<{ guid: string } | ErrorResponse> {
  const data = {
    name: formData.get("name")
  };
  try {
    const response = await axiosInstance.post("topics", data);
    return response.data; // { guid: ... }
  } catch (e) {
    return createErrorResponse(e);
  }
}
