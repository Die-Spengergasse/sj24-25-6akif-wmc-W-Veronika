"use client";
import { useEffect, useState } from "react";
import { getExamResults, ExamResult, clearExamResults } from "../results";

export default function MeinePruefungenPage() {
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    setResults(getExamResults());
  }, []);

  return (
    <div>
      <h1>Meine Prüfungen</h1>
      {results.length === 0 ? (
        <div>Keine gespeicherten Prüfungen.</div>
      ) : (
        <div>
          <button onClick={() => { clearExamResults(); setResults([]); }}>
            Alle Ergebnisse löschen
          </button>
          <ul>
            {results.map((r, idx) => (
              <li key={idx}>
                <b>{r.moduleName}</b> am {new Date(r.date).toLocaleString()}<br />
                Punkte: {r.pointsReached} / {r.pointsTotal}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
