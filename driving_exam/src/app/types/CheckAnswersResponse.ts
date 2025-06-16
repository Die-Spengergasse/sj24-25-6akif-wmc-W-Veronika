/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CheckAnswersResponse {
  pointsReachable: number;
  pointsReached: number;
  checkResult: Record<string, boolean>;
}

export function isCheckAnswersResponse(item: any): item is CheckAnswersResponse {
  return (
    typeof item === "object" &&
    "pointsReachable" in item &&
    "pointsReached" in item &&
    "checkResult" in item &&
    typeof item.checkResult === "object"
  );
}
