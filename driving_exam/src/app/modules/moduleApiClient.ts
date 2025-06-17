import { ErrorResponse, axiosInstance, createErrorResponse } from "@/app/utils/apiClient";
import { Module, isModule } from "@/app/types/Module";

export async function getModules(): Promise<Module[] | ErrorResponse> {
    try {
        const modulesResponse = await axiosInstance.get("modules");
        return modulesResponse.data.filter(isModule);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function addModule(formData: FormData): Promise<ErrorResponse | undefined> {
  const data = {
    name: formData.get("name"),
  };
  try {
    await axiosInstance.post("modules", data);
    // revalidatePath("/modules"); // Optional: falls du Next.js Cache verwendest
  } catch (e) {
    return createErrorResponse(e);
  }
}
