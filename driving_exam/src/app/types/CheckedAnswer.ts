/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CheckedAnswer {
  guid: string;
  isChecked: boolean;
}

export function isCheckedAnswer(obj: any): obj is CheckedAnswer {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.guid === "string" &&
    typeof obj.isChecked === "boolean"
  );
}

export interface CheckAnswersRequest {
  checkedAnswers: CheckedAnswer[];
}

export function isCheckAnswersRequest(obj: any): obj is CheckAnswersRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.checkedAnswers) &&
    obj.checkedAnswers.every(isCheckedAnswer)
  );
}

export interface CheckAnswersResponse {
  pointsReachable: number;
  pointsReached: number;
  checkResult: Record<string, boolean>;
}

export function isCheckAnswersResponse(obj: any): obj is CheckAnswersResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.pointsReachable === 'number' &&
    typeof obj.pointsReached === 'number' &&
    typeof obj.checkResult === 'object' &&
    obj.checkResult !== null &&
    Object.values(obj.checkResult).every(val => typeof val === 'boolean')
  );
}
