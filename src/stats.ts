import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import { contramap } from "fp-ts/Ord";
import { Ord as NOrd } from "fp-ts/number";
import { gameConfig } from "./GameState";
import { pipe } from "fp-ts/lib/function";
import { GameResults } from "./useGameResults";

type GuessDistributionLookup = Record<string, number>;

const initialGuessDistributionLookup = Array.from({
  length: gameConfig.maxGuesses,
}).reduce<GuessDistributionLookup>(
  (l, v, i): GuessDistributionLookup => ({ ...l, [`${i + 1}`]: 0 }),
  {} as GuessDistributionLookup
);

export const getGuessDistribution = (winList: number[]) => {
  return pipe(
    winList,
    A.reduce(initialGuessDistributionLookup, (lookup, r) =>
      pipe(
        lookup,
        R.modifyAt(`${r}`, (guesses) => guesses + 1),
        O.getOrElse(() => lookup)
      )
    ),
    R.toArray
  );
};

/**
 * An Ord instance for sorting a list of result tuples
 * by the game number, where a result tuple is something
 * like `[gameNumber, result]`. E.g. [3, 6]
 */
const byGameNumber = pipe(
  NOrd,
  contramap(([gameNumber, _]: readonly [number, number | "x"]) => gameNumber)
);

/**
 * Given some game results, calculate the current and max streaks, where
 * a streak is defined as a run of consecutive games played.
 *
 * @param results
 * @returns
 */
export const getStreaks = (results: GameResults) => {
  return pipe(
    results,
    R.toArray,
    A.filter(([, result]) => typeof result === "number"),
    A.map(
      ([gameNumber, result]) => [parseInt(gameNumber, 10), result] as const
    ),
    A.sort(byGameNumber),
    A.reduce(
      { currentStreak: 0, prevGameNumber: -99, maxStreak: 0 },
      ({ currentStreak, prevGameNumber, maxStreak }, [gameNumber]) => {
        const newCurrentStreak =
          gameNumber - 1 === prevGameNumber ? currentStreak + 1 : 1;

        return {
          currentStreak: newCurrentStreak,
          prevGameNumber: gameNumber,
          maxStreak: Math.max(newCurrentStreak, maxStreak),
        };
      }
    ),
    ({ maxStreak, currentStreak }) => ({ maxStreak, currentStreak })
  );
};
