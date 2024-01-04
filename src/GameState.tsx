import * as React from "react";
import * as t from "io-ts";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import { pipe } from "fp-ts/function";

import { GameAction } from "./GameActions";
import {
  setGameNumber,
  deleteLetter,
  setError,
  submitGuess,
  submitLetter,
} from "./GameReducers";
import { gameConfig } from "./config";
import { diffInDays } from "./utils";
import { wordList } from "./wordList";

interface Props {
  children: React.ReactNode;
}

const GameState = t.type({
  board: t.array(t.string),
  currentGuess: t.string,
  errorMessage: t.union([t.null, t.string]),
  gameNumber: t.number,
});

export type GameState = t.TypeOf<typeof GameState>;

const GameStateContext = React.createContext<
  null | [GameState & { solution: string }, React.Dispatch<GameAction>]
>(null);

const reducer: React.Reducer<GameState, GameAction> = (state, action) => {
  if (action.type === "InitState") {
    return action.state;
  }

  if (action.type === "SubmitLetter") {
    return submitLetter(state, action);
  }

  if (action.type === "DeleteLetter") {
    return deleteLetter(state, action);
  }

  if (action.type === "SubmitGuess") {
    return submitGuess(state, action);
  }

  if (action.type === "SetError") {
    return setError(state, action);
  }

  if (action.type === "SetGameNumber") {
    return setGameNumber(state, action);
  }

  return state;
};

const getTodaysGameNumber = () => {
  return diffInDays(new Date(Date.now()), gameConfig.firstDay);
};

export const getInitialBoard = () => {
  return Array.from({ length: gameConfig.maxGuesses }).map(() => "");
};

const getInitialState = (): GameState => ({
  board: getInitialBoard(),
  currentGuess: "",
  errorMessage: null,
  gameNumber: getTodaysGameNumber(),
});

export const GameStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState);

  const solution = React.useMemo(
    () => wordList[state.gameNumber],
    [state.gameNumber]
  );

  React.useEffect(() => {
    // Refresh the game number when tab is focused
    const refreshGameNumber = () => {
      if (document.visibilityState === "visible") {
        dispatch({ type: "SetGameNumber", gameNumber: getTodaysGameNumber() });
      }
    };
    document.addEventListener("visibilitychange", refreshGameNumber);

    return () =>
      document.removeEventListener("visibilitychange", refreshGameNumber);
  }, []);

  React.useEffect(() => {
    // persist the game state when a new guess is submitted
    if (state.board.some((g) => g !== "")) {
      pipe(
        state,
        J.stringify,
        O.fromEither,
        O.map((s) => localStorage.setItem("gameState", s))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.board]);

  React.useEffect(() => {
    // load any persisted state if the solution matches the current solution
    pipe(
      localStorage.getItem("gameState") ?? "",
      J.parse,
      E.chain<any, unknown, GameState>(GameState.decode),
      O.fromEither,
      // discard any persisted state if it's not for the current game
      O.filter((localState) => localState.gameNumber === state.gameNumber),
      O.fold(
        () => dispatch({ type: "InitState", state: getInitialState() }),
        // the persisted state matches the current game, so use it
        (state) => dispatch({ type: "InitState", state })
      )
    );
  }, [state.gameNumber]);

  return (
    <GameStateContext.Provider value={[{ ...state, solution }, dispatch]}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const value = React.useContext(GameStateContext);

  if (!value) {
    throw new Error("useGameState must be used inside a GameStateProvider");
  }

  return value;
};
