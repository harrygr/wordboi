import * as React from "react";
import { LetterEvaluation } from "../evaluation";

interface Props {
  letter?: string;
  status?: LetterEvaluation;
}

const getCellStyle = (evaluation: LetterEvaluation) => {
  switch (evaluation) {
    case "correct":
      return "bg-green-700 border-green-700 text-white";
    case "present":
      return "bg-amber-600 border-amber-600 text-white";
    case "absent":
      return "bg-gray-600 border-gray-600 text-white";
    default:
      return "border-gray-400";
  }
};

export const GameTile: React.FC<Props> = ({ letter, status = "pending" }) => {
  return (
    <div
      className={`w-10 h-10 border flex justify-center items-center font-bold text-xl ${getCellStyle(
        status
      )}`}
    >
      {letter?.toUpperCase() ?? null}
    </div>
  );
};
