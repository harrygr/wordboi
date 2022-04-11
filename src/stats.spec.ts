import { getGuessDistribution, getStreaks } from "./stats";
import { GameResults } from "./useStats";

describe("Guess distribution", () => {
  it("calculates the guess distribution from a list of results", () => {
    const result = getGuessDistribution([1, 4, 2, 3, 6, 3, 3, 3]);

    expect(result).toEqual([
      ["1", 1],
      ["2", 1],
      ["3", 4],
      ["4", 1],
      ["5", 0],
      ["6", 1],
    ]);
  });
});

describe("Longest streak", () => {
  it("returns a streak of 0 for no games played", () => {
    expect(getStreaks({})).toEqual({ currentStreak: 0, maxStreak: 0 });
  });

  it("returns a streak of 1 for 1 game played", () => {
    expect(getStreaks({ "4": 5 })).toEqual({ currentStreak: 1, maxStreak: 1 });
  });

  it("gets the longest streak for a run of results", () => {
    const results = {
      "1": 3,
      "2": 3,
      "3": 3,
      "5": 3,
    };

    expect(getStreaks(results)).toEqual({ currentStreak: 1, maxStreak: 3 });
  });

  it("resets the streak when a game is missed", () => {
    const results = {
      "1": 3,
      "2": 3,
      "3": 3,
      "5": 3,
      "6": 3,
      "7": 3,
      "8": 3,
    };

    expect(getStreaks(results)).toEqual({ currentStreak: 4, maxStreak: 4 });
  });

  it("resets the streak when a game is lost", () => {
    const results: GameResults = {
      "1": 3,
      "2": 3,
      "3": 3,
      "4": 3,
      "5": "x",
      "6": 3,
      "7": 3,
      "8": 3,
    };

    expect(getStreaks(results)).toEqual({ currentStreak: 3, maxStreak: 4 });
  });
});
