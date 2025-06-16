/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Module {
  number: number;
  guid: string;
  name: string;
}

export function isModule(item: any): item is Module {
  return (
    typeof item === "object" &&
    "number" in item &&
    "guid" in item &&
    "name" in item
  );
}
