import Link from "next/link";
import { Module } from "../types/Module";

export default function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <ul>
      {modules.map(m => (
        <li key={m.guid}>
          <Link href={`/modules/${m.guid}`}>{m.name}</Link>
        </li>
      ))}
    </ul>
  );
}
