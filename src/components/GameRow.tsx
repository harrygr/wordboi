import * as React from "react";
import {
  EvalutionResult,
  getEvaluations,
  LetterEvaluation,
} from "../evaluation";
import { useGameState } from "../GameState";
import { useSolution } from "../useSolution";

import { GameTile } from "./GameTile";

interface Props {
  word: string;
  submitted: boolean;
}

export const GameRow: React.FC<Props> = ({ word, submitted }) => {
const { solution } = useSolution();

  const evaluations = submitted
    ? getEvaluations(solution, word)
    : word
        .split("")
        .map((letter): EvalutionResult => ({ letter, evaluation: "pending" }));
  return (
    <div className="flex gap-2 justify-center">
      {evaluations.map(({ letter, evaluation }, i) => (
        <GameTile key={i} letter={letter} status={evaluation} />
      ))}
    </div>
  );
};
