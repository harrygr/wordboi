import React from "react";
import { gameConfig } from "./GameState";
import { diffInDays } from "./utils";
import { words } from "./wordList";

export const useSolution = () => {
  const now = React.useMemo(() => new Date(), []);
  const gameNumber = diffInDays(now, gameConfig.firstDay);
  const solution = React.useMemo(() => words[gameNumber], [gameNumber]);

  return { gameNumber, solution };
};
