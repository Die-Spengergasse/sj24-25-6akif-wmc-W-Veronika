"use server";

import { ErrorResponse, axiosInstance, createErrorResponse } from "@/app/utils/apiClient";
import { revalidatePath } from "next/cache";
import { Topic, isTopic } from "@/app/types/Topic";

export async function getTopics(assignedModule?: string): Promise<Topic[] | ErrorResponse> {
  try {
    const url = assignedModule ? `topics?assignedModule=${assignedModule}` : "topics";
    const response = await axiosInstance.get(url);
    return response.data.filter(isTopic);
  } catch (e) {
    return createErrorResponse(e);
  }
}

/**
 * Neuer addTopic-Aufruf mit zwei Parametern:
 *  - name: der Name des neuen Themas
 *  - moduleGuid: zur Revalidierung der passenden Seite (nicht an API gesendet!)
 */
export async function addTopic(name: string, moduleGuid: string): Promise<ErrorResponse | undefined> {
  try {
    // Nur "name" wird an API gesendet
    await axiosInstance.post("topics", { name });

    // Revalidiere den Pfad, der die Topics für dieses Modul zeigt
    revalidatePath(`/modules/${moduleGuid}/topics`);
  } catch (e) {
    return createErrorResponse(e);
  }
}
