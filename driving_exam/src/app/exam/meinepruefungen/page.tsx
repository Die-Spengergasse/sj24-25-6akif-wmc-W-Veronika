"use client";

import { useEffect, useState } from "react";
import { getExamResults, ExamResult } from "../results";
import styles from "./style.module.css";

export default function MeinePruefungenPage() {
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    const loaded = getExamResults().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setResults(loaded);
  }, []);

  return (
    <div className={styles.examPage}>
      <h1>Meine Prüfungen</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Modul</th>
            <th>Punkte</th>
            <th>Prozent</th>
            <th>Bestanden</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => {
            const percent =
              r.pointsTotal > 0
                ? (r.pointsReached / r.pointsTotal) * 100
                : 0;
            return (
              <tr key={idx}>
                <td>{new Date(r.date).toLocaleString()}</td>
                <td>{r.moduleName}</td>
                <td>
                  {r.pointsReached} / {r.pointsTotal}
                </td>
                <td>{percent.toFixed(1)}%</td>
                <td className={percent >= 80 ? styles.statusPassed : styles.statusFailed}>
                  {percent >= 80 ? "✅" : "❌"}
                </td>
              </tr>
            );
          })}
          {results.length === 0 && (
            <tr className={styles.emptyRow}>
              <td colSpan={5}>&nbsp;</td>
            </tr>
          )}
        </tbody>
      </table>

      {results.length === 0 && (
        <div className={styles.emptyMessage}>Keine gespeicherten Prüfungen.</div>
      )}
    </div>
  );
}
