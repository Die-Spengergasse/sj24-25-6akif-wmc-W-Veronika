/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Module, isModule } from "../types/Module";
import { axiosInstance } from "../utils/apiClient";

export default async function ExamModulesPage() {
  let modules: Module[] = [];
  let error: string | null = null;
  try {
    const response = await axiosInstance.get("modules");
    modules = response.data.filter(isModule);
  } catch (e: any) {
    error = e?.message ?? "Fehler beim Laden der Module";
  }

  return (
    <div>
      <h1>Prüfungssimulation</h1>
      {!error ? (
        <ul>
          {modules.map(m => (
            <li key={m.guid}>
              <Link href={`/exam/${m.guid}`}>{m.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="errorbox">{error}</div>
      )}
    </div>
  );
}
