import {
  DeleteLetterAction,
  SetErrorAction,
  SubmitGuessAction,
  SubmitLetterAction,
} from "./GameActions";
import { gameConfig, GameState } from "./GameState";
import { isValidLetter } from "./letterValidation";
import { isValidWord } from "./utils";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import { constNull, pipe } from "fp-ts/function";
import { Lens } from "monocle-ts";
import { wordList } from "./wordList";
import { reportGameResult } from "./reportGameResult";

export const gameResult = ({
  board,
  gameNumber,
}: Pick<GameState, "board" | "gameNumber">) => {
  const hasWon = board.some((word) => word === wordList[gameNumber]);
  const hasLost =
    !hasWon &&
    board.filter((word) => word !== "").length >= gameConfig.maxGuesses;

  return { hasWon, hasLost, hasEnded: hasWon || hasLost };
};

const currentGuessLens = Lens.fromProp<GameState>()("currentGuess");
const errorMessageLens = Lens.fromProp<GameState>()("errorMessage");
const boardLens = Lens.fromProp<GameState>()("board");

export const submitLetter: React.Reducer<GameState, SubmitLetterAction> = (
  state,
  action
) => {
  if (gameResult(state).hasEnded) {
    return state;
  }

  const solution = wordList[state.gameNumber];
  const sanitizedLetter = action.letter.toLowerCase();
  if (
    isValidLetter(sanitizedLetter) &&
    state.currentGuess.length < solution.length
  ) {
    return pipe(
      state,
      currentGuessLens.modify((c) => c + sanitizedLetter)
    );
  }
  return state;
};

export const deleteLetter: React.Reducer<GameState, DeleteLetterAction> = (
  state
) => {
  if (state.currentGuess.length < 1 || gameResult(state).hasEnded) {
    return state;
  }
  return pipe(
    state,
    errorMessageLens.modify(constNull),
    currentGuessLens.modify((currentGuess) => currentGuess.slice(0, -1))
  );
};

export const submitGuess: React.Reducer<GameState, SubmitGuessAction> = (
  state,
  _action
) => {
  console.log("submitGuess dispatched");
  const solution = wordList[state.gameNumber];

  const { hasEnded } = gameResult(state);
  if (state.currentGuess.length !== solution.length || hasEnded) {
    return state;
  }
  if (!isValidWord(state.currentGuess)) {
    return pipe(
      state,
      errorMessageLens.modify(() => "Not a valid word")
    );
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
      (updatedBoard): GameState =>
        pipe(
          state,
          currentGuessLens.modify(() => ""),
          errorMessageLens.modify(constNull),
          boardLens.modify(() => updatedBoard)
        )
    ),
    O.getOrElse(() => state),
    (state) => {
      // a bit of a smell to report the result in the reducer, but 🤷‍♂️
      console.log("reporting game result");
      reportGameResult(state);
      return state;
    }
  );
};

export const setError: React.Reducer<GameState, SetErrorAction> = (
  state,
  { message }
) =>
  pipe(
    state,
    errorMessageLens.modify(() => message)
  );
