import * as React from "react";
import { useGameState } from "../GameState";
import { getShareString } from "../shareString";
import { useShare } from "../useShare";

interface Props {}

export const WinMessage: React.FC<Props> = ({}) => {
  const [state] = useGameState();

  const share = useShare({
    text: getShareString(state.board, state.solution, state.gameNumber),
  });

  return (
    <div className="text-green-700 text-center">
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
