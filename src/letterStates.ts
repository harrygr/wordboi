import { LetterEvaluation } from "./evaluation";
import * as R from "fp-ts/Record";

export const letterStates = (guesses: string[], solution: string) => {
  const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "z",
    "y",
    "z",
  ];

  return letters.reduce<Record<string, LetterEvaluation>>((map, letter) => {
    if (guesses.some((guess) => hasCorrectLetter(guess, solution, letter))) {
      return R.upsertAt<LetterEvaluation>(letter, "correct")(map);
    }
    if (guesses.some((guess) => hasPresentLetter(guess, solution, letter))) {
      return R.upsertAt<LetterEvaluation>(letter, "present")(map);
    }
    if (guesses.some((guess) => hasAbsentLetter(guess, solution, letter))) {
      return R.upsertAt<LetterEvaluation>(letter, "absent")(map);
    }
    return map;
  }, {});
};

const hasCorrectLetter = (word: string, solution: string, letter: string) => {
  return word
    .split("")
    .some((char, i) => char === letter && solution[i] === char);
};
const hasPresentLetter = (word: string, solution: string, letter: string) => {
  return word
    .split("")
    .some((char, i) => char === letter && solution.includes(char));
};

const hasAbsentLetter = (word: string, _solution: string, letter: string) => {
  return word.split("").some((char) => char === letter);
};
