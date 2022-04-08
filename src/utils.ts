import { validWords } from "./validWords";

export const diffInDays = (d1: Date, d2: Date) => {
  return Math.floor((d1.valueOf() - d2.valueOf()) / (1000 * 60 * 60 * 24));
};

export const isNil = <T>(
  item: T | null | undefined
): item is null | undefined => item == null;

export const isValidWord = (word: string) => {
  return validWords.includes(word);
};
