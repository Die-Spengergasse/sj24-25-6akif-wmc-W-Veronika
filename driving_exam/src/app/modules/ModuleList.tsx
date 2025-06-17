import Link from "next/link";
import { Module } from "../types/Module";
import styles from "./ModuleList.module.css";

export default function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <div className={styles.moduleList}>
      <ul>
        {modules.map(m => (
          <li key={m.guid}>
            <Link href={`/modules/${m.guid}`}>
              <span className={styles.moduleName}>{m.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Topics werden über /modules/[guid] geladen, keine weitere Verschachtelung nötig. */}
    </div>
  );
}
