/*  eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Module, isModule } from "../types/Module";
import { axiosInstance } from "../utils/apiClient";
import styles from "./ExamPage.module.css";

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
    <div className={styles.examPage}>
      <h1>Prüfungssimulation</h1>
      {!error ? (
        <ul className={styles.moduleList}>
          {modules.map(m => (
            <li key={m.guid}>
              <Link href={`/exam/${m.guid}`}>
                <span className={styles.moduleName}>{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="errorbox">{error}</div>
      )}
    </div>
  );
}
