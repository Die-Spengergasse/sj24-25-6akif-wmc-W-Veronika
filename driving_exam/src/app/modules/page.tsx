"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../utils/apiClient";
import { Module, isModule } from "../types/Module";
import ModuleAdd from "./ModuleAdd";

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);

  const reload = () => {
    apiClient.get("modules").then(res => {
      setModules(res.data.filter(isModule));
    });
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <h1>Module</h1>
      <ModuleAdd onAdded={reload} />
      <ul>
        {modules.map(m => (
          <li key={m.guid}>
            <Link href={`/modules/${m.guid}`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
