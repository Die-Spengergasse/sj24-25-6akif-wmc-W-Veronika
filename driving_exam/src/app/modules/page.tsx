import ModuleList from "./ModuleList";
import ModuleAdd from "./ModuleAdd";
import { getModules } from "./moduleApiClient";
import { isErrorResponse } from "../utils/apiClient";

export default async function ModulesPage() {
  const response = await getModules();

  return (
    <div>
      <h1>Module</h1>
      {!isErrorResponse(response) ? (
        <div>
          <ModuleList modules={response} />
          <h2>Modul hinzufügen</h2>
          <ModuleAdd />
        </div>
      ) : (
        <div className="errorbox">{response.message}</div>
      )}
    </div>
  );
}
