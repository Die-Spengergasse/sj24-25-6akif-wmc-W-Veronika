"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../../utils/apiClient";
import { Question, isQuestion } from "../../types/Question";
import QuestionClient from "../../modules/[moduleGuid]/topics/[topicGuid]/QuestionClient";
import { saveExamResult } from "../results";

export default function ExamPage({ params }: { params: { moduleGuid: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<{ [guid: string]: number }>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    apiClient.get(`exam/${params.moduleGuid}?count=20`).then(res => {
      setQuestions(res.data.filter(isQuestion));
    });
  }, [params.moduleGuid]);

  const handleResult = (guid: string, points: number) => {
    setResults(r => ({ ...r, [guid]: points }));
  };

  const handleFinish = () => {
    const pointsReached = Object.values(results).reduce((a, b) => a + b, 0);
    const pointsTotal = questions.reduce((a, q) => a + q.points, 0);
    saveExamResult({
      date: new Date().toISOString(),
      moduleGuid: params.moduleGuid,
      moduleName: questions[0]?.moduleGuid || params.moduleGuid,
      pointsReached,
      pointsTotal,
    });
    setFinished(true);
  };

  if (questions.length === 0) return <div>Lade Fragen...</div>;

  return (
    <div>
      <h1>Prüfungssimulation</h1>
      <div>
        <QuestionClient
          question={questions[current]}
          onResult={(points: number) => handleResult(questions[current].guid, points)}
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
          <div style={{ color: "green", marginTop: 16 }}>
            Prüfung gespeichert! <a href="/exam/meinepruefungen">Zu "Meine Prüfungen"</a>
          </div>
        )}
      </div>
    </div>
  );
}
