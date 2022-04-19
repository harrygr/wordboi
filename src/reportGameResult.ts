import { pipe } from "fp-ts/lib/function";
import { config } from "./config";
import { gameResult, submitGuess } from "./GameReducers";
import { GameState } from "./GameState";
import { StatName } from "./statTypes";

/**
 * Calculate the game result seperately from the main reducer and report the
 * outcome of submitting a guess if the game ends as a result of this submission.
 * @param state
 */
export const checkGameResult = (state: GameState) => {
  const { hasLost, hasWon, hasEnded } = pipe(
    submitGuess(state, { type: "SubmitGuess" }),
    gameResult
  );
  if (hasEnded) {
    console.log("Game ended");
    reportStat(`wordboi.${config.env}.game_played`);
  }

  if (hasWon) {
    reportStat(`wordboi.${config.env}.game_won`);
  }
  if (hasLost) {
    reportStat(`wordboi.${config.env}.game_lost`);
  }
};

const reportStat = (stat: StatName) => {
  fetch(`/api/stats?stat=${stat}`).catch(() => null);
};
