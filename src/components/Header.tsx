import * as React from "react";
import { useGameState } from "../GameState";

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const [{ gameNumber }] = useGameState();
  return (
    <header className="text-3xl mb-6 py-4">
      <h1>
        Wordboi<span className="text-gray-400">#{gameNumber}</span>
      </h1>
    </header>
  );
};
