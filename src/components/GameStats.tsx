import { boolean } from "fp-ts";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import * as React from "react";
import { GameResults } from "../useStats";
import { Dialog } from "@headlessui/react";
import { pipe } from "fp-ts/lib/function";
import { gameConfig } from "../GameState";
import { getGuessDistribution, getStreaks } from "../stats";

interface Props {
  results: GameResults;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameStats: React.FC<Props> = ({ isOpen, setIsOpen, results }) => {
  const resultList = Object.values(results);
  const winList = resultList.filter((r): r is number => r !== "x");
  const gamesPlayed = resultList.length;
  const wins = winList.length;

  const guessDistribution = React.useMemo(
    () => getGuessDistribution(winList),
    [winList]
  );

  const maxGuessFreq = guessDistribution.reduce(
    (max, [, freq]) => Math.max(freq, max),
    0
  );
  const { currentStreak, maxStreak } = React.useMemo(
    () => getStreaks(results),
    [results]
  );

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0" />
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded space-y-4 relative">
          <div className="flex justify-between">
            <Dialog.Title className="text-2xl">Stats</Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              ✖️
            </button>
          </div>

          <div className="grid grid-cols-2 text-center gap-4">
            <div>
              <h3 className="font-semibold mb-2">Played</h3>
              <p className="text-4xl">{gamesPlayed}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Win rate</h3>
              <p className="text-4xl">
                {Math.round((wins / gamesPlayed) * 100)}%
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Current Streak</h3>
              <p className="text-4xl">{currentStreak}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Max Streak</h3>
              <p className="text-4xl">{maxStreak}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Guess Distribution</h3>
            <ul>
              {pipe(
                guessDistribution,
                A.map(([guessCount, freq]) => (
                  <li key={guessCount} className="flex items-center">
                    <div className="tabular-nums mr-2">{guessCount}</div>
                    <div className="flex-1">
                      <div
                        className="h-5 bg-gray-700 min-w-[24px] text-white flex justify-end items-center px-2 text-xs"
                        style={{ width: `${(freq / maxGuessFreq) * 100}%` }}
                      >
                        {freq}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
