import { axiosInstance } from "../utils/apiClient";
import { ErrorResponse, createErrorResponse } from "../utils/apiClient";


export async function deleteTodo(guid: string, deleteTasks: boolean): Promise<ErrorResponse | undefined> {
  try {
    await axiosInstance.delete(`/TodoItems/${guid}?deleteTasks=${deleteTasks}`);
    
  } catch (e) {
    return createErrorResponse(e);
  }
}

