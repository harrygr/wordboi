import * as React from "react";
import { useGameState } from "../GameState";
import { useSolution } from "../useSolution";
import { ChartIcon } from "./ChartIcon";

interface Props {
  showStats: () => void;
}

export const Header: React.FC<Props> = ({ showStats }) => {
  const { gameNumber } = useSolution();
  return (
    <header className="text-3xl py-4 flex justify-between">
      <h1>
        <span className="font-semibold">Wordboi</span>
        <span className="text-gray-400">#{gameNumber}</span>
      </h1>
      <button
        onClick={showStats}
        title="Show stats"
        className="hover:bg-gray-200/70 bg-transparent w-12 h-12 rounded-full grid place-items-center transition"
      >
        <ChartIcon />
      </button>
    </header>
  );
};
