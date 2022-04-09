import * as React from "react";
import { getCellStyle } from "../cellStyle";
import { LetterEvaluation } from "../evaluation";

interface Props {
  letter?: string;
  status?: LetterEvaluation;
}

export const GameTile: React.FC<Props> = ({ letter, status = "pending" }) => {
  return (
    <div
      className={`w-12 h-12 border flex justify-center items-center font-bold text-xl ${getCellStyle(
        status
      )}`}
    >
      {letter?.toUpperCase() ?? null}
    </div>
  );
};
