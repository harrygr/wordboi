import * as React from "react";
import { checkGameResult } from "../checkGameResult";

import { useGameState } from "../GameState";

import { Board } from "./Board";
import { ErrorMessage } from "./ErrorMessage";
import { FailMessage } from "./FailMessage";
import { GameStats } from "./GameStats";
import { Keyboard } from "./Keyboard";
import { WinMessage } from "./WinMessage";
import { useReportGameResult } from "../useReportGameResult";
import { gameResult } from "../GameReducers";

interface Props {
  statsVisible: boolean;
  setStatsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Game: React.FC<Props> = ({ statsVisible, setStatsVisible }) => {
  const [state, dispatch] = useGameState();

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

  const { hasWon, hasLost } = gameResult(state);

  return (
    <div className="space-y-6">
      <Board board={state.board} currentGuess={state.currentGuess} />

      {hasWon ? <WinMessage /> : null}
      {hasLost ? <FailMessage solution={state.solution} /> : null}

      <ErrorMessage message={state.errorMessage} dispatch={dispatch} />

      <Keyboard
        dispatch={dispatch}
        guesses={state.board}
        solution={state.solution}
        submitGuess={submitGuess}
      />
      <GameStats isOpen={statsVisible} setIsOpen={setStatsVisible} />
    </div>
  );
};
