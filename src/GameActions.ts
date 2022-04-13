import { GameState } from "./GameState";

export type SubmitLetterAction = { type: "SubmitLetter"; letter: string };
export type InitStateAction = { type: "InitState"; state: GameState };
export type DeleteLetterAction = { type: "DeleteLetter" };
export type SubmitGuessAction = { type: "SubmitGuess" };
export type SetErrorAction = {
  type: "SetError";
  message: GameState["errorMessage"];
};

export type GameAction =
  | { type: "Noop" }
  | InitStateAction
  | SubmitLetterAction
  | DeleteLetterAction
  | SubmitGuessAction
  | SetErrorAction;
