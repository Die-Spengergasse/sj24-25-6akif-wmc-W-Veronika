/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/app/types/Question";
import { CheckAnswersResponse } from "@/app/types/CheckedAnswer";
import ModalDialog from "@/app/components/ModalDialog";
import { saveExamResult } from "../results";
import styles from "./style.module.css";

type Props = {
  questions: Question[];
  moduleGuid: string;
  moduleName: string;
};

export default function ExamClient({ questions, moduleGuid, moduleName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [totalPointsReached, setTotalPointsReached] = useState(0);
  const [totalPointsReachable, setTotalPointsReachable] = useState(0);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const router = useRouter();
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const toggleAnswer = (guid: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [guid]: !prev[guid],
    }));
  };

  const handleNextQuestion = async () => {
    try {
      const res = await fetch(
        `http://localhost:5080/api/Questions/${currentQuestion.guid}/checkanswers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkedAnswers: currentQuestion.answers.map((a) => ({
              guid: a.guid,
              isChecked: !!selectedAnswers[a.guid],
            })),
          }),
        }
      );

      if (!res.ok) throw new Error("Antwortprüfung fehlgeschlagen");

      const data: CheckAnswersResponse = await res.json();
      const reached = totalPointsReached + data.pointsReached;
      const total = totalPointsReachable + data.pointsReachable;

      setTotalPointsReached(reached);
      setTotalPointsReachable(total);

      if (currentIndex < questions.length - 1) {
        setSelectedAnswers({});
        setCurrentIndex((prev) => prev + 1);
      } else {
        saveExamResult({
          date: new Date().toISOString(),
          moduleGuid,
          moduleName,
          pointsReached: reached,
          pointsTotal: total,
        });

        setShowResultDialog(true);
      }
    } catch (error) {
      console.error("Fehler beim Prüfen der Antworten:", error);
      alert("Fehler bei der Überprüfung. Bitte später erneut versuchen.");
    }
  };

  const handleDialogOk = () => router.push("/modules");

  const resultPercentage =
    totalPointsReachable > 0 ? (totalPointsReached / totalPointsReachable) * 100 : 0;

  return (
    <div className={styles.questionsContainer}>
      <div className={styles.progressWrapper}>
        <p className={styles.progressText}>
          Frage {currentIndex + 1} von {questions.length}
        </p>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

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
          {currentQuestion.answers.map((answer) => (
            <li key={answer.guid} className={styles.answerItem}>
              <input
                type="checkbox"
                checked={!!selectedAnswers[answer.guid]}
                onChange={() => toggleAnswer(answer.guid)}
                className={styles.checkbox}
              />
              <span>{answer.text}</span>
            </li>
          ))}
        </ul>

        <button
          className={styles.actionButton}
          onClick={handleNextQuestion}
          disabled={!Object.values(selectedAnswers).some(Boolean)}
        >
          {isLastQuestion ? "Abschließen" : "Nächste Frage"}
        </button>

      </div>

      {showResultDialog && (
        <ModalDialog title="Ergebnis" onOk={handleDialogOk} onCancel={() => setShowResultDialog(false)}>
          {resultPercentage >= 80 ? (
            <p>
              Glückwunsch! Du hast die Prüfung bestanden mit{" "}
              <strong>{totalPointsReached}</strong> von{" "}
              <strong>{totalPointsReachable}</strong> Punkten (
              {resultPercentage.toFixed(1)}%).
            </p>
          ) : (
            <p>
              Leider nicht bestanden. Du hast <strong>{totalPointsReached}</strong> von{" "}
              <strong>{totalPointsReachable}</strong> Punkten erreicht (
              {resultPercentage.toFixed(1)}%). Weiter üben!
            </p>
          )}
        </ModalDialog>
      )}
    </div>
  );
}
