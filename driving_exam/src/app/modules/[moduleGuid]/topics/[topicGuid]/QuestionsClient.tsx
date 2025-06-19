/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckAnswersResponse } from "@/app/types/CheckedAnswer";
import { Question } from "@/app/types/Question";
import ModalDialog from "@/app/components/ModalDialog";
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
  const [totalPointsReached, setTotalPointsReached] = useState(0);
  const [totalPointsReachable, setTotalPointsReachable] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const router = useRouter();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  function toggleAnswer(guid: string) {
    if (checkResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [guid]: !prev[guid],
    }));
  }

  async function handleCheckAnswers() {
    console.log("handleCheckAnswers wird aufgerufen");

    setLoading(true);
    try {
      const checkedAnswers = currentQuestion.answers.map((a) => ({
        guid: a.guid,
        isChecked: !!selectedAnswers[a.guid],
      }));

      console.log("Sende POST an /checkanswers mit Daten:", checkedAnswers);

      const res = await fetch(
        `http://localhost:5080/api/Questions/${currentQuestion.guid}/checkanswers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkedAnswers }),
        }
      );

      if (!res.ok) {
        throw new Error("Fehler bei der Antwortprüfung");
      }

      const data: CheckAnswersResponse = await res.json();

      console.log("Antwort von Server:", data);

      setCheckResult(data.checkResult);
      setPointsReached(data.pointsReached);
      setPointsReachable(data.pointsReachable);

      setTotalPointsReached((prev) => prev + data.pointsReached);
      setTotalPointsReachable((prev) => prev + data.pointsReachable);
    } catch (error) {
      console.error("Fehler beim POST:", error);
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
      setShowResultDialog(true);
    }
  }

  function handleDialogOk() {
    router.push("/modules"); // Pfad ggf. anpassen
  }

  function handleDialogCancel() {
    setShowResultDialog(false);
  }

  return (
    <div className={styles.questionsContainer}>
      {/* Fortschrittsanzeige */}
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
          {currentQuestion.answers.map((answer) => {
            const isChecked = !!selectedAnswers[answer.guid]; // Ob Nutzer angeklickt hat
            const isCorrect = checkResult?.[answer.guid];      // Ob seine Entscheidung korrekt war

            const answerClassName = [
              styles.answerItem,
              checkResult
                ? isCorrect
                  ? isChecked
                    ? styles.correctAnswer // ✅ Richtig angekreuzt
                    : ""                   // ✅ Richtig ausgelassen – keine Farbe
                  : isChecked
                    ? styles.wrongAnswer   // ❌ Falsch angekreuzt
                    : styles.correctAnswer // ❌ Falsch ausgelassen
                : "",
            ]
              .filter(Boolean)
              .join(" ");


            return (
              <li key={answer.guid} className={answerClassName}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAnswer(answer.guid)}
                  disabled={!!checkResult} // Keine Änderung nach Auswertung
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
            disabled={loading || !Object.values(selectedAnswers).some((v) => v)}
          >
            {loading ? "Überprüfen..." : "Auflösen"}
          </button>
        ) : (
          <button className={styles.actionButton} onClick={handleNextQuestion}>
            {isLastQuestion ? "Abschließen" : "Nächste Frage"}
          </button>

        )}
      </div>

      {checkResult && pointsReached !== null && pointsReachable !== null && (
        <p>
          Punktzahl: {pointsReached} / {pointsReachable}
        </p>
      )}

      {showResultDialog && (
        <ModalDialog
          title="Ergebnis"
          onOk={handleDialogOk}
          onCancel={handleDialogCancel}
        >
          <p>
            Du hast insgesamt <strong>{totalPointsReached}</strong> von{" "}
            <strong>{totalPointsReachable}</strong> Punkten erreicht.
          </p>
          <p>Möchtest du zur Modulübersicht zurückkehren?</p>
        </ModalDialog>
      )}
    </div>
  );
}
