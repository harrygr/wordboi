import * as React from "react";
import * as A from "fp-ts/Array";
import * as t from "io-ts";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import { pipe } from "fp-ts/function";

import { isValidWord } from "./utils";

import { useSolution } from "./useSolution";

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

type GameState = t.TypeOf<typeof GameState>;

type ValidLetter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

const validLetters: ValidLetter[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const isValidLetter = (letter: any): letter is ValidLetter => {
  return validLetters.indexOf(letter) > -1;
};

export type GameAction =
  | { type: "Noop" }
  | { type: "InitState"; state: GameState }
  | { type: "SubmitLetter"; letter: string }
  | { type: "DeleteLetter" }
  | { type: "SubmitGuess" };

const GameStateContext = React.createContext<
  null | [GameState, React.Dispatch<GameAction>]
>(null);

const reducer =
  (solution: string): React.Reducer<GameState, GameAction> =>
  (state, action) => {
    if (action.type === "InitState") {
      return action.state;
    }

    const hasWon = state.board.some((word) => word === solution);

    if (action.type === "SubmitLetter") {
      if (hasWon) {
        return state;
      }

      const sanitizedLetter = action.letter.toLowerCase();
      if (
        isValidLetter(sanitizedLetter) &&
        state.currentGuess.length < solution.length
      ) {
        return {
          ...state,
          currentGuess: state.currentGuess + sanitizedLetter,
        };
      }
      return state;
    }

    if (action.type === "DeleteLetter") {
      if (hasWon) {
        return state;
      }

      return {
        ...state,
        errorMessage: null,
        currentGuess: state.currentGuess.slice(0, -1),
      };
    }

    if (action.type === "SubmitGuess") {
      if (hasWon || state.currentGuess.length !== solution.length) {
        return state;
      }
      if (!isValidWord(state.currentGuess)) {
        return { ...state, errorMessage: "Not a valid word" };
      }

      return pipe(
        O.of(state.currentGuess),
        O.chain((guess) =>
          pipe(
            state.board,
            A.updateAt(
              state.board.findIndex((word) => word === ""),
              guess
            )
          )
        ),
        O.map(
          (updatedBoard): GameState => ({
            ...state,
            currentGuess: "",
            board: updatedBoard,
            errorMessage: null,
          })
        ),
        O.getOrElse(() => state)
      );
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

  const [state, dispatch] = React.useReducer(reducer(solution), initialState);

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
  }, [state.board]);

  React.useEffect(() => {
    // load any persisted state if the solution matches the currect solution
    pipe(
      localStorage.getItem("gameState") ?? "",
      J.parse,
      E.chain<any, unknown, GameState>(GameState.decode),
      O.fromEither,
      O.filter((state) => state.solution === solution),
      O.map((state) => {
        // the persisted state matches the current game, so use it
        dispatch({ type: "InitState", state });
      })
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
