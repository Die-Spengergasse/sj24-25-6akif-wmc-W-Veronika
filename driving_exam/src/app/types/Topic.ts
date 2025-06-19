/* eslint-disable @typescript-eslint/no-explicit-any */
export type Topic = {
  guid: string;
  name: string;
  questionCount: number;
};

export function isTopic(obj: any): obj is Topic {
  return typeof obj === 'object' &&
    typeof obj.guid === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.questionCount === 'number';
}
