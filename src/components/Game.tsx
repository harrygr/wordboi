import * as React from "react";

import { gameConfig, useGameState } from "../GameState";
import { Board } from "./Board";
import { GameRow } from "./GameRow";
import { Keyboard } from "./Keyboard";

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

  const hasWon = state.board.some((word) => word === state.solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length === gameConfig.maxGuesses;

  return (
    <div className="space-y-6">
      <Board board={state.board} currentGuess={state.currentGuess} />

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

      <Keyboard
        dispatch={dispatch}
        guesses={state.board}
        solution={state.solution}
      />
    </div>
  );
};
