import * as React from "react";

import { gameConfig, useGameState } from "../GameState";
import { useSolution } from "../useSolution";
import { useStats } from "../useStats";
import { Board } from "./Board";
import { ErrorMessage } from "./ErrorMessage";
import { FailMessage } from "./FailMessage";
import { GameStats } from "./GameStats";
import { Keyboard } from "./Keyboard";
import { WinMessage } from "./WinMessage";

interface Props {
  statsVisible: boolean;
  setStatsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Game: React.FC<Props> = ({ statsVisible, setStatsVisible }) => {
  const [state, dispatch] = useGameState();
  const { solution } = useSolution();

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

  const hasWon = state.board.some((word) => word === solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length === gameConfig.maxGuesses;

  const results = useStats(state);

  return (
    <div className="space-y-6">
      <Board board={state.board} currentGuess={state.currentGuess} />

      {hasWon ? <WinMessage /> : null}
      {hasLost ? <FailMessage solution={solution} /> : null}

      <ErrorMessage message={state.errorMessage} dispatch={dispatch} />

      <Keyboard dispatch={dispatch} guesses={state.board} solution={solution} />
      <GameStats
        results={results}
        isOpen={statsVisible}
        setIsOpen={setStatsVisible}
      />
    </div>
  );
};
