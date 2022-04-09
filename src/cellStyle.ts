import { LetterEvaluation } from "./evaluation";

export const getCellStyle = (evaluation: LetterEvaluation) => {
  switch (evaluation) {
    case "correct":
      return "bg-green-700 border-green-700 text-white";
    case "present":
      return "bg-amber-600 border-amber-600 text-white";
    case "absent":
      return "bg-gray-500 border-gray-500 text-white";
    default:
      return "border-gray-400";
  }
};
