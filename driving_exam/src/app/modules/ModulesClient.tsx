'use client';

import { Module } from "@/app/types/Module";
import Link from "next/link";
import styles from "./style.module.css";

type Props = {
  modules: Module[];
};

export default function ModulesClient({ modules }: Props) {
  return (
    <div className={styles.moduleList}>
      <ul>
        {modules.map((mod) => (
          <li key={mod.guid}>
            <Link href={`/modules/${mod.guid}`} className={styles.moduleName}>
              {mod.number}. {mod.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
