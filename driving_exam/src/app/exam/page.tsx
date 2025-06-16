"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../utils/apiClient";
import { Module, isModule } from "../types/Module";

export default function ExamModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    apiClient.get("modules").then(res => {
      setModules(res.data.filter(isModule));
    });
  }, []);

  return (
    <div>
      <h1>Prüfungssimulation</h1>
      <ul>
        {modules.map(m => (
          <li key={m.guid}>
            <Link href={`/exam/${m.guid}`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
