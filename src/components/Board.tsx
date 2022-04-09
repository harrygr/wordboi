import * as React from "react";
import { useGameState } from "../GameState";
import { GameRow } from "./GameRow";

interface Props {
  board: string[];
  currentGuess: string;
}

export const Board: React.FC<Props> = ({ board, currentGuess }) => {
  const [state] = useGameState();
  const guessRow = board.findIndex((row) => row === "");
  return (
    <div className="space-y-2">
      {board.map((word, rowIdx) => {
        const rowWord =
          word !== ""
            ? word
            : rowIdx === guessRow
            ? currentGuess + " ".repeat(6 - currentGuess.length)
            : " ".repeat(6);

        return (
          <GameRow
            key={rowIdx}
            word={rowWord}
            submitted={guessRow === -1 || rowIdx < guessRow}
          />
        );
      })}
    </div>
  );
};
