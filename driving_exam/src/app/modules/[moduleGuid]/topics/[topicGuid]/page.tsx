"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../../../../utils/apiClient";
import { Question, isQuestion } from "../../../../types/Question";
import QuestionClient from "./QuestionClient";

export default function QuestionsPage({ params }: { params: { moduleGuid: string, topicGuid: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    apiClient.get(`questions?moduleGuid=${params.moduleGuid}&topicGuid=${params.topicGuid}`).then(res => {
      setQuestions(res.data.filter(isQuestion));
    });
  }, [params.moduleGuid, params.topicGuid]);

  if (questions.length === 0) return <div>Lade Fragen...</div>;

  return (
    <div>
      <h1>Fragen</h1>
      <div>
        <QuestionClient question={questions[current]} />
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
      </div>
    </div>
  );
}
