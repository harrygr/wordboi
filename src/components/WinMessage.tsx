import * as React from "react";
import { useGameState } from "../GameState";
import { getShareString } from "../shareString";
import { useShare } from "../useShare";
import { useSolution } from "../useSolution";

interface Props {}

export const WinMessage: React.FC<Props> = ({}) => {
  const [state] = useGameState();
  const { solution, gameNumber } = useSolution();

  const share = useShare({
    text: getShareString(state.board, solution, gameNumber),
  });

  return (
    <div className="text-green-700">
      <p>
        Congratulations! You got it! 🎉{" "}
        <button
          onClick={share}
          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded ml-4"
        >
          Share
        </button>
      </p>
    </div>
  );
};
