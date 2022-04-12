import * as React from "react";

import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import { LetterEvaluation } from "../evaluation";

import { letterStates } from "../letterStates";
import { getCellStyle } from "../cellStyle";
import { GameAction } from "../GameActions";

export const Key: React.FC<{
  letter: string;
  dispatch: React.Dispatch<GameAction>;
  letterStates: Record<string, LetterEvaluation>;
}> = ({ letter, dispatch, letterStates }) => {
  const bgClass = pipe(
    O.fromNullable(letterStates[letter]),
    O.map(getCellStyle),
    O.getOrElse(() => "bg-gray-300")
  );

  return (
    <button
      type="button"
      className={`${bgClass} rounded-md flex justify-center items-center h-12 flex-1 font-bold`}
      onClick={() => dispatch({ type: "SubmitLetter", letter })}
    >
      {letter.toUpperCase()}
    </button>
  );
};

export const Keyboard: React.FC<{
  dispatch: React.Dispatch<GameAction>;
  guesses: string[];
  solution: string;
  submitGuess: () => void;
}> = ({ dispatch, guesses, solution, submitGuess }) => {
  const ls = React.useMemo(
    () => letterStates(guesses, solution),
    [guesses, solution]
  );
  return (
    <div className="space-y-1">
      <div className="flex space-x-1">
        <Key letterStates={ls} dispatch={dispatch} letter="q" />
        <Key letterStates={ls} dispatch={dispatch} letter="w" />
        <Key letterStates={ls} dispatch={dispatch} letter="e" />
        <Key letterStates={ls} dispatch={dispatch} letter="r" />
        <Key letterStates={ls} dispatch={dispatch} letter="t" />
        <Key letterStates={ls} dispatch={dispatch} letter="y" />
        <Key letterStates={ls} dispatch={dispatch} letter="u" />
        <Key letterStates={ls} dispatch={dispatch} letter="i" />
        <Key letterStates={ls} dispatch={dispatch} letter="o" />
        <Key letterStates={ls} dispatch={dispatch} letter="p" />
      </div>
      <div className="flex space-x-1">
        <div className="flex-[0.5] -mr-1" />
        <Key letterStates={ls} dispatch={dispatch} letter="a" />
        <Key letterStates={ls} dispatch={dispatch} letter="s" />
        <Key letterStates={ls} dispatch={dispatch} letter="d" />
        <Key letterStates={ls} dispatch={dispatch} letter="f" />
        <Key letterStates={ls} dispatch={dispatch} letter="g" />
        <Key letterStates={ls} dispatch={dispatch} letter="h" />
        <Key letterStates={ls} dispatch={dispatch} letter="j" />
        <Key letterStates={ls} dispatch={dispatch} letter="k" />
        <Key letterStates={ls} dispatch={dispatch} letter="l" />
        <div className="flex-[0.5]" />
      </div>
      <div className="flex space-x-1">
        <button
          className="bg-gray-300 rounded-md flex justify-center items-center h-12 flex-[1.5]"
          onClick={submitGuess}
        >
          ↩
        </button>
        <Key letterStates={ls} dispatch={dispatch} letter="z" />
        <Key letterStates={ls} dispatch={dispatch} letter="x" />
        <Key letterStates={ls} dispatch={dispatch} letter="c" />
        <Key letterStates={ls} dispatch={dispatch} letter="v" />
        <Key letterStates={ls} dispatch={dispatch} letter="b" />
        <Key letterStates={ls} dispatch={dispatch} letter="n" />
        <Key letterStates={ls} dispatch={dispatch} letter="m" />
        <button
          className="bg-gray-300 rounded-md flex justify-center items-center h-12 flex-[1.5]"
          onClick={() => dispatch({ type: "DeleteLetter" })}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};
