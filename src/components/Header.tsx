import * as React from "react";
import { useGameState } from "../GameState";

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const [{ gameNumber }] = useGameState();
  return (
    <h1 className="text-3xl mb-6">
      Wordboi<span className="text-gray-400">#{gameNumber}</span>
    </h1>
  );
};
