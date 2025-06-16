/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CheckedAnswer {
  guid: string;
  isChecked: boolean;
}

export interface CheckAnswersRequest {
  checkedAnswers: CheckedAnswer[];
}

export function isCheckedAnswer(item: any): item is CheckedAnswer {
  return (
    typeof item === "object" &&
    "guid" in item &&
    "isChecked" in item
  );
}

export function isCheckAnswersRequest(item: any): item is CheckAnswersRequest {
  return (
    typeof item === "object" &&
    Array.isArray(item.checkedAnswers) &&
    item.checkedAnswers.every(isCheckedAnswer)
  );
}
