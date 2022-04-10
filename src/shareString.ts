import { getEvaluations } from "./evaluation";
import { gameConfig, GameState } from "./GameState";

export const getShareString = (
  board: GameState["board"],
  solution: string,
  gameNumber: number
) => {
  const emojis = board
    .filter((guess) => guess.length === solution.length)
    .map((guess) =>
      getEvaluations(solution, guess)
        .map(({ evaluation }) => {
          if (evaluation === "correct") {
            return "🟩";
          }
          if (evaluation === "absent") {
            return "⬜️";
          }
          if (evaluation === "present") {
            return "🟧";
          }
          throw new Error(`invalid evaluation "${evaluation}"`);
        })
        .join("")
    );

  return [
    `Wordboi #${gameNumber} ${emojis.length}/${gameConfig.maxGuesses}`,
    "",
    emojis.join("\n"),
  ].join("\n");
};
