import { pipe } from "fp-ts/lib/function";
import * as React from "react";

import { gameConfig, useGameState } from "../GameState";
import { isValidWord } from "../isValidWord";
import { useSolution } from "../useSolution";
import { useStats } from "../useStats";

import { Board } from "./Board";
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
  const hasWon = state.board.some((word) => word === solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length === gameConfig.maxGuesses;

  const results = useStats(state);

  const submitGuess = React.useCallback(async () => {
    if (state.currentGuess.length !== state.solution.length || hasWon) {
      return;
    }

    if (await isValidWord(state.currentGuess)()) {
      dispatch({ type: "SubmitGuess" });
    } else {
      dispatch({ type: "SetError", error: "Invalid word" });
    }
  }, [dispatch, state.currentGuess, hasWon, state.solution]);

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
        submitGuess();
      }
    };

    addEventListener("keydown", handler);

    return () => removeEventListener("keydown", handler);
  }, [dispatch, submitGuess]);

  return (
    <div className="space-y-6">
      <Board board={state.board} currentGuess={state.currentGuess} />

      {hasWon ? <WinMessage /> : null}
      {hasLost ? <FailMessage solution={solution} /> : null}

      {state.errorMessage ? (
        <div className="text-red-500">{state.errorMessage}</div>
      ) : null}

      <Keyboard
        dispatch={dispatch}
        guesses={state.board}
        solution={solution}
        submitGuess={submitGuess}
      />
      <GameStats
        results={results}
        isOpen={statsVisible}
        setIsOpen={setStatsVisible}
      />
    </div>
  );
};
