import * as React from "react";
import { useGameState } from "../GameState";
import { useSolution } from "../useSolution";

interface Props {
  showStats: () => void;
}

export const Header: React.FC<Props> = ({ showStats }) => {
  const { gameNumber } = useSolution();
  return (
    <header className="text-3xl mb-6 py-4 flex justify-between">
      <h1>
        Wordboi<span className="text-gray-400">#{gameNumber}</span>
      </h1>
      <button onClick={showStats}>📊</button>
    </header>
  );
};
