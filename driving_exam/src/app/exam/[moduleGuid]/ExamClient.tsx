/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/app/types/Question";
import { CheckAnswersResponse } from "@/app/types/CheckedAnswer";
import ModalDialog from "@/app/components/ModalDialog";
import styles from "./style.module.css";

type Props = {
  questions: Question[];
};

export default function ExamClient({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [totalPointsReached, setTotalPointsReached] = useState(0);
  const [totalPointsReachable, setTotalPointsReachable] = useState(0);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const router = useRouter();
  const currentQuestion = questions[currentIndex];

  function toggleAnswer(guid: string) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [guid]: !prev[guid],
    }));
  }

  async function handleNextQuestion() {
    const checkedAnswers = currentQuestion.answers.map((a) => ({
      guid: a.guid,
      isChecked: !!selectedAnswers[a.guid],
    }));

    try {
      const res = await fetch(
        `http://localhost:5080/api/Questions/${currentQuestion.guid}/checkanswers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkedAnswers }),
        }
      );

      if (!res.ok) throw new Error("Fehler beim Prüfen");

      const data: CheckAnswersResponse = await res.json();

      setTotalPointsReached((prev) => prev + data.pointsReached);
      setTotalPointsReachable((prev) => prev + data.pointsReachable);
    } catch (err) {
      console.error("Fehler beim Prüfen der Antworten", err);
      alert("Fehler bei der Überprüfung. Bitte später erneut versuchen.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setSelectedAnswers({});
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResultDialog(true);
    }
  }

  function handleDialogOk() {
    router.push("/modules");
  }

  function handleDialogCancel() {
    setShowResultDialog(false);
  }

  const resultPercentage =
    totalPointsReachable > 0
      ? (totalPointsReached / totalPointsReachable) * 100
      : 0;

  return (
    <div className={styles.questionsContainer}>
      {/* Fortschritt */}
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

      {/* Fragenkarte */}
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
            return (
              <li key={answer.guid} className={styles.answerItem}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAnswer(answer.guid)}
                  className={styles.checkbox}
                />
                <span>{answer.text}</span>
              </li>
            );
          })}
        </ul>

        <button
          className={styles.actionButton}
          onClick={handleNextQuestion}
          disabled={!Object.values(selectedAnswers).some(Boolean)}
        >
          Nächste Frage
        </button>
      </div>

      {showResultDialog && (
        <ModalDialog
          title="Ergebnis"
          onOk={handleDialogOk}
          onCancel={handleDialogCancel}
        >
          {resultPercentage >= 80 ? (
            <p>
              Glückwunsch. Diese Prüfung hättest du bestanden. Du hast insgesamt{" "}
              <strong>{totalPointsReached}</strong> von{" "}
              <strong>{totalPointsReachable}</strong> Punkten erreicht.
            </p>
          ) : (
            <p>
              Diese Fragen solltest du dir vielleicht nochmal anschauen. Viel Spaß beim Lernen!<br />
              Du hast insgesamt <strong>{totalPointsReached}</strong> von{" "}
              <strong>{totalPointsReachable}</strong> Punkten erreicht.
            </p>
          )}
        </ModalDialog>
      )}
    </div>
  );
}
