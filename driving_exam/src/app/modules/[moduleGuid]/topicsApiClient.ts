"use server";

import { ErrorResponse, axiosInstance, createErrorResponse } from "@/app/utils/apiClient";
import { revalidatePath } from "next/cache";
import { Topic, isTopic } from "@/app/types/Topic";

export async function getTopics(): Promise<Topic[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get("topics");
    return response.data.filter(isTopic);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export async function addTopic(formData: FormData): Promise<ErrorResponse | undefined> {
  const data = {
    name: formData.get("name"),
  };

  try {
    await axiosInstance.post("topics", data);
    revalidatePath("/topics"); // oder der Pfad, wo die Liste ist
  } catch (e) {
    return createErrorResponse(e);
  }
}
