import React from "react";
import { gameConfig, GameState } from "./GameState";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { wordList } from "./wordList";

const GameResults = t.record(t.string, t.union([t.number, t.literal("x")]));
export type GameResults = t.TypeOf<typeof GameResults>;

const persistResult = (gameNumber: number, result: number | "x") => {
  pipe(
    fetchResults(),
    R.upsertAt(`${gameNumber}`, result),
    J.stringify,
    E.chainW((results) =>
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
    E.chainW(GameResults.decode),
    E.getOrElse(() => ({}))
  );
};

export const useStats = ({ gameNumber, board }: GameState) => {
  const [results, setResults] = React.useState(() => fetchResults());

  React.useEffect(() => {
    const hasWon = board.some((word) => word === wordList[gameNumber]);
    const hasLost =
      !hasWon &&
      board.filter((word) => word !== "").length >= gameConfig.maxGuesses;

    if (hasWon || hasLost) {
      const result = hasWon ? board.filter((g) => g !== "").length : "x";
      persistResult(gameNumber, result);
      setResults(R.upsertAt(`${gameNumber}`, result));
    }
  }, [gameNumber, board]);

  return results;
};
