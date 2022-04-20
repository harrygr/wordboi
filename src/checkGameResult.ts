import { pipe } from "fp-ts/lib/function";
import { GameEvents } from "./gameEvents";
import { gameResult, submitGuess } from "./GameReducers";
import { GameState } from "./GameState";

/**
 * Calculate the game result seperately from the main reducer and broadcast the
 * outcome of submitting a guess if the game ends as a result of this submission.
 * @param state
 */
export const checkGameResult = (state: GameState) => {
  // get the new state and determine whether the game has ended
  const { hasWon, hasEnded, guessCount } = pipe(
    submitGuess(state, { type: "SubmitGuess" }),
    gameResult
  );
  if (hasEnded) {
    GameEvents.publish("game_played", {
      gameNumber: state.gameNumber,
      result: hasWon ? "win" : "loss",
      guesses: guessCount,
    });
  }
};
