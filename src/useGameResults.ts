import React from "react";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { GameEvents } from "./gameEvents";

const GameResults = t.record(t.string, t.union([t.number, t.literal("x")]));
export type GameResults = t.TypeOf<typeof GameResults>;

const RESULTS_STORAGE_KEY = "gameResults";

const fetchResults = (): GameResults => {
  return pipe(
    E.tryCatch(
      () => localStorage.getItem(RESULTS_STORAGE_KEY) || "",
      () => "failed to get results"
    ),
    E.chain(J.parse),
    E.chainW(GameResults.decode),
    E.getOrElse(() => ({}))
  );
};

export const useGameResults = () => {
  const [results, setResults] = React.useState(() => fetchResults());

  React.useEffect(() => {
    const unsubscribe = GameEvents.subscribe(
      "game_played",
      ({ result, guesses, gameNumber }) => {
        const score = result === "win" ? guesses : "x";
        setResults(R.upsertAt(`${gameNumber}`, score));
      }
    );
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    // update localstorage when the results change
    pipe(
      results,
      J.stringify,
      E.chainW((r) =>
        E.tryCatch(
          () => localStorage.setItem(RESULTS_STORAGE_KEY, r),
          () => null
        )
      )
    );
  }, [results]);

  return results;
};
