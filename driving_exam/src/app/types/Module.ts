/* eslint-disable @typescript-eslint/no-explicit-any */
export type Module = {
  number: number;
  guid: string;
  name: string;
};

export function isModule(obj: any): obj is Module {
  return typeof obj === 'object' &&
    typeof obj.number === 'number' &&
    typeof obj.guid === 'string' &&
    typeof obj.name === 'string';
}
