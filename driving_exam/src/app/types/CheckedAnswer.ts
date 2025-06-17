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
