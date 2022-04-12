import * as React from "react";
import * as t from "io-ts";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import { pipe } from "fp-ts/function";

import { useSolution } from "./useSolution";
import { GameAction } from "./GameActions";
import {
  deleteLetter,
  setError,
  submitGuess,
  submitLetter,
} from "./GameReducers";

export const gameConfig = {
  firstDay: new Date(2022, 3, 1),
  maxGuesses: 6,
};

interface Props {
  children: React.ReactNode;
}

const GameState = t.type({
  board: t.array(t.string),
  currentGuess: t.string,
  errorMessage: t.union([t.null, t.string]),
  solution: t.string,
});

export type GameState = t.TypeOf<typeof GameState>;

const GameStateContext = React.createContext<
  null | [GameState, React.Dispatch<GameAction>]
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

  return state;
};

export const GameStateProvider: React.FC<Props> = ({ children }) => {
  const { solution } = useSolution();

  const initialState: GameState = React.useMemo(
    () => ({
      board: Array.from({ length: gameConfig.maxGuesses }).map(() => ""),
      currentGuess: "",
      errorMessage: null,
      solution,
    }),
    [solution]
  );

  const [state, dispatch] = React.useReducer(reducer, initialState);

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
      O.filter((state) => state.solution === solution),
      O.fold(
        () => dispatch({ type: "InitState", state: initialState }),
        // the persisted state matches the current game, so use it
        (state) => dispatch({ type: "InitState", state })
      )
    );
  }, [solution, initialState]);

  return (
    <GameStateContext.Provider value={[state, dispatch]}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const value = React.useContext(GameStateContext);

  if (!value) {
    throw new Error("useGameState must be using inside a GameStateProvider");
  }

  return value;
};
