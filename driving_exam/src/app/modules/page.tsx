
import ModuleList from "./ModuleList";
import { getModules } from "./moduleApiClient";
import { isErrorResponse } from "../utils/apiClient";

export default async function ModulesPage() {
  const response = await getModules();

  return (
    <div>
      <h1>Module</h1>
      {!isErrorResponse(response) ? (
        <ModuleList modules={response} />
      ) : (
        <div className="errorbox">{response.message}</div>
      )}
    </div>
  );
}

