/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Answer {
  guid: string;
  text: string;
}

export function isAnswer(obj: any): obj is Answer {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.guid === "string" &&
    typeof obj.text === "string"
  );
}

