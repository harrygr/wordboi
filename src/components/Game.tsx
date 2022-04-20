import * as React from "react";
import { checkGameResult } from "../checkGameResult";

import { gameConfig, useGameState } from "../GameState";

import { useSolution } from "../useSolution";

import { Board } from "./Board";
import { ErrorMessage } from "./ErrorMessage";
import { FailMessage } from "./FailMessage";
import { GameStats } from "./GameStats";
import { Keyboard } from "./Keyboard";
import { WinMessage } from "./WinMessage";
import { useReportGameResult } from "../useReportGameResult";

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

  const submitGuess = React.useCallback(() => {
    dispatch({ type: "SubmitGuess" });
    checkGameResult(state);
  }, [state, dispatch]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        dispatch({ type: "DeleteLetter" });
      }
      if (e.key === "Enter") {
        submitGuess();
      }
    };

    addEventListener("keydown", handler);

    return () => removeEventListener("keydown", handler);
  }, [dispatch, submitGuess]);

  useReportGameResult();

  const hasWon = state.board.some((word) => word === solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length === gameConfig.maxGuesses;

  return (
    <div className="space-y-6">
      <Board board={state.board} currentGuess={state.currentGuess} />

      {hasWon ? <WinMessage /> : null}
      {hasLost ? <FailMessage solution={solution} /> : null}

      <ErrorMessage message={state.errorMessage} dispatch={dispatch} />

      <Keyboard
        dispatch={dispatch}
        guesses={state.board}
        solution={solution}
        submitGuess={submitGuess}
      />
      <GameStats isOpen={statsVisible} setIsOpen={setStatsVisible} />
    </div>
  );
};
