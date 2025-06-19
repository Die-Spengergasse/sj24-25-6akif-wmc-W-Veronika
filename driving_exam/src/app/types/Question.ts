/* eslint-disable @typescript-eslint/no-explicit-any */
import { Answer, isAnswer } from "./Answer";

export interface Question {
  guid: string;
  number: number;
  text: string;
  points: number;
  imageUrl: string | null;
  moduleGuid: string;
  topicGuid: string;
  answers: Answer[];
}

export function isQuestion(obj: any): obj is Question {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.guid === "string" &&
    typeof obj.number === "number" &&
    typeof obj.text === "string" &&
    typeof obj.points === "number" &&
    (typeof obj.imageUrl === "string" || obj.imageUrl === null) &&
    typeof obj.moduleGuid === "string" &&
    typeof obj.topicGuid === "string" &&
    Array.isArray(obj.answers) &&
    obj.answers.every(isAnswer)
  );
}