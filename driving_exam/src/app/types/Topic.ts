/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Topic {
  id: number;
  name: string;
  guid: string;
}

export function isTopic(item: any): item is Topic {
  return (
    typeof item === "object" &&
    "id" in item &&
    "name" in item &&
    "guid" in item
  );
}
