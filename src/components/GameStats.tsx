import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as React from "react";
import { useGameResults } from "../useGameResults";
import { Dialog, Transition } from "@headlessui/react";
import { pipe } from "fp-ts/lib/function";
import { getGuessDistribution, getStreaks } from "../stats";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameStats: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const results = useGameResults();

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
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            enter="transition duration-100 ease-out"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            enter="transition duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded space-y-4 relative">
              <div className="flex justify-between">
                <Dialog.Title className="text-2xl">Stats</Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl cursor-pointer hover:text-gray-500 font-extrabold"
                  title="Close stats"
                >
                  &times;
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
                    {pipe(
                      gamesPlayed,
                      O.fromPredicate((n) => n > 0),
                      O.map((gamesPlayed) =>
                        Math.round((wins / gamesPlayed) * 100)
                      ),
                      O.getOrElseW(() => "-")
                    )}
                    %
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
                            className="h-5 bg-gray-700 text-white inline-flex justify-end items-center px-2 text-xs rounded-sm"
                            style={
                              freq > 0
                                ? { width: `${(freq / maxGuessFreq) * 100}%` }
                                : undefined
                            }
                          >
                            {freq}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
