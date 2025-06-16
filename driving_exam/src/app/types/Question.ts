/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QuestionAnswer {
  guid: string;
  text: string;
}

export function isQuestionAnswer(item: any): item is QuestionAnswer {
  return (
    typeof item === "object" &&
    "guid" in item &&
    "text" in item
  );
}

export interface Question {
  guid: string;
  number: number;
  text: string;
  points: number;
  imageUrl: string;
  moduleGuid: string;
  topicGuid: string;
  answers: QuestionAnswer[];
}

export function isQuestion(item: any): item is Question {
  return (
    typeof item === "object" &&
    "guid" in item &&
    "number" in item &&
    "text" in item &&
    "points" in item &&
    "imageUrl" in item &&
    "moduleGuid" in item &&
    "topicGuid" in item &&
    Array.isArray(item.answers) &&
    item.answers.every(isQuestionAnswer)
  );
}
