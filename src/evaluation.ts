import { isNil } from "./utils";

export type LetterEvaluation = "pending" | "absent" | "present" | "correct";

export interface EvalutionResult {
  letter: string;
  evaluation: LetterEvaluation;
}

export const getEvaluations = (
  solution: string,
  guess: string
): EvalutionResult[] => {
  const splitSolution = solution.split("");
  // init a lookup of correct guess location that we can use
  // to check if we've used the letter in a correct guess previously
  const solutionCharsTaken = splitSolution.map(() => false);

  return guess
    .split("")
    .map(
      (
        letterGuess,
        i
      ): { letter: string; evaluation: LetterEvaluation | null } => {
        // handle all correct guesses first
        if (letterGuess === solution[i]) {
          solutionCharsTaken[i] = true;
          return { letter: letterGuess, evaluation: "correct" };
        }
        return { letter: letterGuess, evaluation: null };
      }
    )
    .map(({ letter, evaluation }, i) => {
      if (!isNil(evaluation)) {
        return { letter, evaluation };
      }

      const indexOfPresentChar = splitSolution.findIndex(
        (char, index) => char === letter && !solutionCharsTaken[index]
      );

      if (indexOfPresentChar > -1) {
        const guessesSoFar = guess
          .slice(0, i)
          .split("")
          .filter((char) => char === letter).length;
        const occurrancesOfLetterInSolution = splitSolution.filter(
          (char) => char === letter
        ).length;

        // only mark it present if we haven't already guessed this letter as
        // many times as it occurs in the solution
        const evaluation =
          guessesSoFar < occurrancesOfLetterInSolution ? "present" : "absent";
        return { letter, evaluation };
      }

      return { letter: letter, evaluation: "absent" };
    });
};
