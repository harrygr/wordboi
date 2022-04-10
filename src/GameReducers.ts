import {
  DeleteLetterAction,
  SubmitGuessAction,
  SubmitLetterAction,
} from "./GameActions";
import { GameState } from "./GameState";
import { isValidLetter } from "./letterValidation";
import { isValidWord } from "./utils";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import { constNull, pipe } from "fp-ts/function";
import { Lens } from "monocle-ts";

export const hasWon = (state: GameState) =>
  state.board.some((word) => word === state.solution);

const currentGuessLens = Lens.fromProp<GameState>()("currentGuess");
const errorMessageLens = Lens.fromProp<GameState>()("errorMessage");
const boardLens = Lens.fromProp<GameState>()("board");

export const submitLetter: React.Reducer<GameState, SubmitLetterAction> = (
  state,
  action
) => {
  if (hasWon(state)) {
    return state;
  }

  const sanitizedLetter = action.letter.toLowerCase();
  if (
    isValidLetter(sanitizedLetter) &&
    state.currentGuess.length < state.solution.length
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
  if (state.currentGuess.length < 1 || hasWon(state)) {
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
  if (state.currentGuess.length !== state.solution.length || hasWon(state)) {
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
    O.getOrElse(() => state)
  );
};
