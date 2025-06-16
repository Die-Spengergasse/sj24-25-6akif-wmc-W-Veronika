"use client";
import { useState } from "react";
import Image from "next/image";
import { Question } from "@/app/types/Question";
import { axiosInstance, isErrorResponse, createEmptyErrorResponse, ErrorResponse } from "@/app/utils/apiClient";
import { CheckAnswersResponse } from "@/app/types/CheckAnswersResponse";
import { CheckAnswersRequest } from "@/app/types/CheckAnswersRequest";

export default function QuestionClient({
  questions,
  onResult,
}: {
  questions: Question[];
  onResult?: (points: number) => void;
}) {
  const question = questions[0];
  const [checked, setChecked] = useState<{ [guid: string]: boolean }>({});
  const [result, setResult] = useState<CheckAnswersResponse | null>(null);
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());

  const handleCheck = (guid: string) => {
    setChecked(prev => ({ ...prev, [guid]: !prev[guid] }));
  };

  const handleSubmit = async () => {
    try {
      const checkedAnswers = question.answers.map(a => ({
        guid: a.guid,
        isChecked: !!checked[a.guid],
      }));
      const res = await axiosInstance.post<CheckAnswersResponse>(
        `questions/${question.guid}/checkanswers`,
        { checkedAnswers } as CheckAnswersRequest
      );
      if (isErrorResponse(res.data)) {
        setError(res.data);
      } else {
        setResult(res.data);
        if (onResult) onResult(res.data.pointsReached);
      }
    } catch {
      setError(createEmptyErrorResponse());
    }
  };

  return (
    <div>
      {question.imageUrl && (
        <Image
          src={question.imageUrl}
          alt="Fragenbild"
          width={200}
          height={120}
          style={{ maxWidth: 200, margin: 10, height: "auto" }}
        />
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
      {error.message && <div style={{ color: "red" }}>{error.message}</div>}
    </div>
  );
}
