"use client";
import { Module } from "@/app/types/Module";
import Link from "next/link";

export default function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <ul>
      {modules.map(module => (
        <li key={module.guid}>
          <Link href={`/modules/${module.guid}`}>{module.name}</Link>
        </li>
      ))}
    </ul>
  );
}

