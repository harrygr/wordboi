import * as React from "react";

import { gameConfig, useGameState } from "../GameState";
import { GameRow } from "./GameRow";

interface Props {}

export const Game: React.FC<Props> = ({}) => {
  const [state, dispatch] = useGameState();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      dispatch({ type: "SubmitLetter", letter: e.key });
    };

    addEventListener("keypress", handler);

    return () => removeEventListener("keypress", handler);
  }, [dispatch]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        dispatch({ type: "DeleteLetter" });
      }
      if (e.key === "Enter") {
        dispatch({ type: "SubmitGuess" });
      }
    };

    addEventListener("keydown", handler);

    return () => removeEventListener("keydown", handler);
  }, [dispatch]);

  const guessRow = state.board.findIndex((row) => row === "");
  const hasWon = state.board.some((word) => word === state.solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length === gameConfig.maxGuesses;

  const gameOver = hasWon || hasLost;

  const submitGuess = () =>
    !hasWon ? dispatch({ type: "SubmitGuess" }) : null;

  return (
    <div className="space-y-2">
      {state.board.map((word, rowIdx) => {
        const rowWord =
          word !== ""
            ? word
            : rowIdx === guessRow
            ? state.currentGuess + " ".repeat(6 - state.currentGuess.length)
            : " ".repeat(6);

        return (
          <GameRow
            key={rowIdx}
            word={rowWord}
            submitted={guessRow === -1 || rowIdx < guessRow}
          />
        );
      })}

      <button
        onClick={submitGuess}
        className="px-4 py-2 border border-gray-600"
        disabled={gameOver}
      >
        Submit
      </button>

      {hasWon ? (
        <div className="text-green-700">Congratulations! You got it! 🎉</div>
      ) : null}
      {hasLost ? (
        <div className="text-red-600">
          You lose! The answer was{" "}
          <span className="font-bold">{state.solution}</span>
        </div>
      ) : null}

      {state.errorMessage ? (
        <div className="text-red-500">{state.errorMessage}</div>
      ) : null}
    </div>
  );
};
