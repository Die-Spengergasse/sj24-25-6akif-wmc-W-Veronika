/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Answer {
  text: string;
  isCorrect: boolean;
}

export function isAnswer(item: any): item is Answer {
  return (
    typeof item === "object" &&
    "text" in item &&
    "isCorrect" in item
  );
}
