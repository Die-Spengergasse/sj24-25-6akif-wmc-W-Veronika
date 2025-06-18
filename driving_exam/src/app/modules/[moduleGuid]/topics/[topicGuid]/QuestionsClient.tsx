/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { CheckAnswersResponse } from "@/app/types/CheckedAnswer";
import { Question } from "@/app/types/Question";
import styles from "./style.module.css";

type Props = {
  questions: Question[];
};

export default function QuestionsClient({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [checkResult, setCheckResult] = useState<Record<string, boolean> | null>(null);
  const [pointsReached, setPointsReached] = useState<number | null>(null);
  const [pointsReachable, setPointsReachable] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  function toggleAnswer(guid: string) {
    if (checkResult) return; // Keine Änderungen nach Prüfung
    setSelectedAnswers((prev) => ({
      ...prev,
      [guid]: !prev[guid],
    }));
  }

  async function handleCheckAnswers() {
    setLoading(true);
    try {
      const checkedAnswers = Object.entries(selectedAnswers).map(([guid, isChecked]) => ({
        guid,
        isChecked,
      }));
      const res = await fetch(
        `https://localhost:5443/api/Questions/${currentQuestion.guid}/checkanswers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkedAnswers }),
        }
      );
      if (!res.ok) throw new Error("Fehler bei der Antwortprüfung");
      const data: CheckAnswersResponse = await res.json();
      setCheckResult(data.checkResult);
      setPointsReached(data.pointsReached);
      setPointsReachable(data.pointsReachable);
    } catch (error) {
      console.error(error);
      alert("Fehler beim Prüfen der Antworten");
    } finally {
      setLoading(false);
    }
  }

  function handleNextQuestion() {
    setSelectedAnswers({});
    setCheckResult(null);
    setPointsReached(null);
    setPointsReachable(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Am Ende: hier kannst du eine Ergebnis-Seite anzeigen oder zurück zur Übersicht
      alert(`Quiz beendet! Deine Punktzahl: ${pointsReached} von ${pointsReachable}`);
      // Optional: Seite neu laden oder zurück zur Modul-/Topic-Übersicht
      window.location.href = "/modules"; // Beispiel: Zurück zur Modul-Übersicht
    }
  }

  return (
    <div className={styles.questionsContainer}>
      <div className={styles.questionCard}>
        <h2>
          Frage {currentQuestion.number}: {currentQuestion.text}
        </h2>
        {currentQuestion.imageUrl && (
          <img
            src={currentQuestion.imageUrl}
            alt="Fragebild"
            className={styles.questionImage}
          />
        )}
        <ul className={styles.answersList}>
          {currentQuestion.answers.map((answer) => {
            const isChecked = !!selectedAnswers[answer.guid];
            const isCorrect = checkResult ? checkResult[answer.guid] : undefined;
            const answerClassName = [
              styles.answerItem,
              checkResult
                ? isCorrect
                  ? styles.correctAnswer
                  : isChecked
                  ? styles.wrongAnswer
                  : ""
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={answer.guid} className={answerClassName} onClick={() => toggleAnswer(answer.guid)}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAnswer(answer.guid)}
                  disabled={!!checkResult}
                  className={styles.checkbox}
                />
                <span>{answer.text}</span>
              </li>
            );
          })}
        </ul>
        {!checkResult ? (
          <button
            className={styles.actionButton}
            onClick={handleCheckAnswers}
            disabled={loading || Object.values(selectedAnswers).every((v) => !v)}
          >
            {loading ? "Überprüfen..." : "Auflösen"}
          </button>
        ) : (
          <button className={styles.actionButton} onClick={handleNextQuestion}>
            Nächste Frage
          </button>
        )}
      </div>
      {checkResult && pointsReached !== null && pointsReachable !== null && (
        <p>
          Punktzahl: {pointsReached} / {pointsReachable}
        </p>
      )}
    </div>
  );
}
