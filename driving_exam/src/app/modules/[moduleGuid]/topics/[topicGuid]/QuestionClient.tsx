"use client";
import { useState } from "react";
import { apiClient } from "../../../../utils/apiClient";
import { Question } from "../../../../types/Question";
import { CheckAnswersResponse } from "../../../../types/CheckAnswersResponse";
import { CheckAnswersRequest } from "../../../../types/CheckAnswersRequest";

export default function QuestionClient({ question }: { question: Question }) {
  const [checked, setChecked] = useState<{ [guid: string]: boolean }>({});
  const [result, setResult] = useState<CheckAnswersResponse | null>(null);

  const handleCheck = (guid: string) => {
    setChecked(prev => ({ ...prev, [guid]: !prev[guid] }));
  };

  const handleSubmit = async () => {
    const checkedAnswers = question.answers.map(a => ({
      guid: a.guid,
      isChecked: !!checked[a.guid],
    }));
    const res = await apiClient.post<CheckAnswersResponse>(
      `questions/${question.guid}/checkanswers`,
      { checkedAnswers } as CheckAnswersRequest
    );
    setResult(res.data);
  };

  return (
    <div>
      <div>{question.text}</div>
      {question.imageUrl && (
        <img src={question.imageUrl} alt="Fragenbild" style={{ maxWidth: 200, margin: 10 }} />
      )}
      <ul>
        {question.answers.map(a => (
          <li key={a.guid}>
            <label>
              <input
                type="checkbox"
                checked={!!checked[a.guid]}
                onChange={() => handleCheck(a.guid)}
                disabled={!!result}
              />
              {a.text}
              {result && (
                <span style={{ color: result.checkResult[a.guid] ? "green" : "red", marginLeft: 8 }}>
                  {result.checkResult[a.guid] ? "✔" : "✖"}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
      {!result && <button onClick={handleSubmit}>Antwort prüfen</button>}
      {result && (
        <div>
          {result.pointsReached === result.pointsReachable
            ? <span style={{ color: "green" }}>Richtig!</span>
            : <span style={{ color: "red" }}>Leider falsch.</span>}
        </div>
      )}
    </div>
  );
}
