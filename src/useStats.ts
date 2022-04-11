import React from "react";
import { gameConfig, GameState } from "./GameState";
import { useSolution } from "./useSolution";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";

const GameResults = t.record(t.string, t.union([t.number, t.literal("x")]));
export type GameResults = t.TypeOf<typeof GameResults>;

const persistResult = (gameNumber: number, result: number | "x") => {
  pipe(
    fetchResults(),
    R.upsertAt(`${gameNumber}`, result),
    J.stringify,
    E.chain<any, string, void>((results) =>
      E.tryCatch(
        () => localStorage.setItem("gameResults", results),
        () => null
      )
    )
  );
};

const fetchResults = (): GameResults => {
  return pipe(
    E.tryCatch(
      () => localStorage.getItem("gameResults") || "",
      () => "failed to get results"
    ),
    E.chain(J.parse),
    E.chain<any, unknown, GameResults>(GameResults.decode),
    E.getOrElse(() => ({}))
  );
};

export const useStats = (state: GameState) => {
  const { gameNumber } = useSolution();
  const hasWon = state.board.some((word) => word === state.solution);
  const hasLost =
    !hasWon &&
    state.board.filter((word) => word !== "").length >= gameConfig.maxGuesses;
  const [results, setResults] = React.useState(() => fetchResults());

  React.useEffect(() => {
    if (hasWon || hasLost) {
      const result = hasWon ? state.board.filter((g) => g !== "").length : "x";
      persistResult(gameNumber, result);
      setResults(R.upsertAt(`${gameNumber}`, result));
    }
  }, [hasWon, hasLost, gameNumber]);

  return results;
};
