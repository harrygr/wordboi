import { deleteLetter, submitGuess, submitLetter } from "./GameReducers";
import * as utils from "./utils";

describe("submitLetter", () => {
  it("adds a letter to the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: null,
      solution: "floor",
    };

    const newState = submitLetter(state, { type: "SubmitLetter", letter: "d" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "food" }));
  });

  it("does not add a letter if the guess is the length of the solution", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "flood",
      errorMessage: null,
      solution: "floor",
    };

    const newState = submitLetter(state, { type: "SubmitLetter", letter: "d" });

    expect(newState).toEqual(
      expect.objectContaining({ currentGuess: "flood" })
    );
  });
});

describe("deleteLetter", () => {
  it("deletes a letter from the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: null,
      solution: "floor",
    };

    const newState = deleteLetter(state, { type: "DeleteLetter" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "fo" }));
  });

  it("handles an empty string for the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "",
      errorMessage: null,
      solution: "floor",
    };

    const newState = deleteLetter(state, { type: "DeleteLetter" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "" }));
  });

  it("clears any error messages when a letter is deleted", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: "Oh no",
      solution: "floor",
    };

    const newState = deleteLetter(state, { type: "DeleteLetter" });

    expect(newState).toEqual(
      expect.objectContaining({ currentGuess: "fo", errorMessage: null })
    );
  });
});

describe("submitGuess", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits a guess to the board, assuming a valid word", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "flood",
      errorMessage: null,
      solution: "floor",
    };

    jest.spyOn(utils, "isValidWord").mockReturnValue(true);
    const newState = submitGuess(state, { type: "SubmitGuess" });

    expect(newState).toEqual(
      expect.objectContaining({
        currentGuess: "",
        errorMessage: null,
        board: ["flood", "", ""],
      })
    );
  });

  it("sets an error message for an invalid guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "floog",
      errorMessage: null,
      solution: "floor",
    };

    jest.spyOn(utils, "isValidWord").mockReturnValue(false);
    const newState = submitGuess(state, { type: "SubmitGuess" });

    expect(newState).toEqual(
      expect.objectContaining({
        currentGuess: "floog",
        errorMessage: "Not a valid word",
        board: ["", "", ""],
      })
    );
  });
});
