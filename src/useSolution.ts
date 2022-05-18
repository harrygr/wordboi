import { useRouter } from "next/router";
import React from "react";
import { gameConfig } from "./config";

import { diffInDays } from "./utils";
import { wordList } from "./wordList";

const todaysGameNumber = diffInDays(new Date(), gameConfig.firstDay);

export const useSolution = () => {
  const router = useRouter();

  // derive the game number from the `n` querystring.
  // otherwise get today's game number
  const gameNumber = React.useMemo(() => {
    const n = parseInt(`${router.query.n}`, 10);

    return typeof n === "number" && !isNaN(n) ? n : todaysGameNumber;
  }, [router.query.n]);

  const solution = React.useMemo(() => wordList[gameNumber], [gameNumber]);

  return { gameNumber, solution };
};
