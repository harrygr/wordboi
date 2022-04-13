import { config } from "./config";
import { gameResult } from "./GameReducers";
import { GameState } from "./GameState";

export const reportGameResult = (
  state: Pick<GameState, "board" | "gameNumber">
) => {
  const { hasLost, hasWon, hasEnded } = gameResult(state);
  if (hasEnded) {
    fetch(`/api/stats?stat=wordboi.${config.env}.game_played`).catch(
      () => null
    );
  }

  if (hasWon) {
    fetch(`/api/stats?stat=wordboi.${config.env}.game_won`).catch(() => null);
  }
  if (hasLost) {
    fetch(`/api/stats?stat=wordboi.${config.env}.game_lost`).catch(() => null);
  }
};
