/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "./style.module.css";
import { Question } from "../../../../types/Question";

type Props = {
  questions: Question[];
};

export default function QuestionsClient({ questions }: Props) {
  return (
    <div className={styles.questionsContainer}>
      <h1>Fragen</h1>
      {questions.length === 0 && <p>Keine Fragen gefunden.</p>}
      <ul>
        {questions.map((q) => (
          <li key={q.guid} className={styles.questionCard}>
            <h2>{q.number}. {q.text}</h2>
            {q.imageUrl && (
              <img src={q.imageUrl} alt={`Bild zu Frage ${q.number}`} className={styles.questionImage} />
            )}
            <ul className={styles.answersList}>
              {q.answers.map((a) => (
                <li key={a.guid} className={styles.answerItem}>
                  {a.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
