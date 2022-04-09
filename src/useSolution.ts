import { useRouter } from "next/router";
import React from "react";
import { gameConfig } from "./GameState";
import { diffInDays } from "./utils";
import { words } from "./wordList";

export const useSolution = () => {
  const router = useRouter();

  // derive the game number from the `n` querystring.
  // otherwise get today's game number
  const gameNumber = React.useMemo(() => {
    const n = parseInt(`${router.query.n}`, 10);

    return typeof n === "number" && !isNaN(n)
      ? n
      : diffInDays(new Date(), gameConfig.firstDay);
  }, [router.query.n]);

  const solution = React.useMemo(() => words[gameNumber], [gameNumber]);

  return { gameNumber, solution };
};
