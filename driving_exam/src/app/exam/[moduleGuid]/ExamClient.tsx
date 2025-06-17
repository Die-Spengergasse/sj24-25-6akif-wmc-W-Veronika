/* "use client";
import { useState } from "react";
import { Question } from "@/app/types/Question";
// Update the import path below if the actual location is different
import QuestionClient from "@/app/modules/[moduleGuid]/topics/[topicGuid]/QuestionsClient";
import { saveExamResult } from "../results";
import Link from "next/link";

export default function ExamClient({ questions, guid }: { questions: Question[], guid: string }) {
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<{ [guid: string]: number }>({});
  const [finished, setFinished] = useState(false);

  const handleResult = (points: number) => {
    setResults(r => ({ ...r, [questions[current].guid]: points }));
  };

  const handleFinish = () => {
    const pointsReached = Object.values(results).reduce((a, b) => a + b, 0);
    const pointsTotal = questions.reduce((a, q) => a + q.points, 0);
    saveExamResult({
      date: new Date().toISOString(),
      moduleGuid: guid,
      moduleName: questions[0]?.moduleGuid || guid,
      pointsReached,
      pointsTotal,
    });
    setFinished(true);
  };

  return (
    <div>
      <QuestionClient
      questions={[questions[current]]}
      onResult={handleResult}
      />
      <div style={{ marginTop: 16 }}>
      <button
        onClick={() => setCurrent(c => Math.max(0, c - 1))}
        disabled={current === 0}
      >
        Zurück
      </button>
      <button
        onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
        disabled={current === questions.length - 1}
        style={{ marginLeft: 8 }}
      >
        Nächste Frage
      </button>
      </div>
      <div style={{ marginTop: 8 }}>
      Frage {current + 1} von {questions.length}
      </div>
      <div style={{ marginTop: 16 }}>
      <b>Punkte erreicht:</b> {Object.values(results).reduce((a, b) => a + b, 0)} / {questions.reduce((a, q) => a + q.points, 0)}
      </div>
      {!finished && current === questions.length - 1 && (
      <button onClick={handleFinish} style={{ marginTop: 16 }}>
        Prüfung abschließen und speichern
      </button>
      )}
      {finished && (
      <div>
        Prüfung gespeichert! <Link href="/exam/meinepruefungen">Zu meinen Prüfungen</Link>
      </div>
      )}
    </div>
  );
}
 */