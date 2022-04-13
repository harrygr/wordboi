import { deleteLetter, submitGuess, submitLetter } from "./GameReducers";
import * as utils from "./utils";

describe("submitLetter", () => {
  it("adds a letter to the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: null,
      gameNumber: 1,
    };

    const newState = submitLetter(state, { type: "SubmitLetter", letter: "d" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "food" }));
  });

  it("does not add a letter if the guess is the length of the solution", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "floods",
      errorMessage: null,
      gameNumber: 1,
    };

    const newState = submitLetter(state, { type: "SubmitLetter", letter: "d" });

    expect(newState).toEqual(
      expect.objectContaining({ currentGuess: "floods" })
    );
  });
});

describe("deleteLetter", () => {
  it("deletes a letter from the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: null,
      gameNumber: 1,
    };

    const newState = deleteLetter(state, { type: "DeleteLetter" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "fo" }));
  });

  it("handles an empty string for the current guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "",
      errorMessage: null,
      gameNumber: 1,
    };

    const newState = deleteLetter(state, { type: "DeleteLetter" });

    expect(newState).toEqual(expect.objectContaining({ currentGuess: "" }));
  });

  it("clears any error messages when a letter is deleted", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "foo",
      errorMessage: "Oh no",
      gameNumber: 1,
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
      currentGuess: "floods",
      errorMessage: null,
      gameNumber: 1,
    };

    jest.spyOn(utils, "isValidWord").mockReturnValue(true);
    const newState = submitGuess(state, { type: "SubmitGuess" });

    expect(newState).toEqual(
      expect.objectContaining({
        currentGuess: "",
        errorMessage: null,
        board: ["floods", "", ""],
      })
    );
  });

  it("sets an error message for an invalid guess", () => {
    const state = {
      board: ["", "", ""],
      currentGuess: "floogt",
      errorMessage: null,
      gameNumber: 1,
    };

    jest.spyOn(utils, "isValidWord").mockReturnValue(false);
    const newState = submitGuess(state, { type: "SubmitGuess" });

    expect(newState).toEqual(
      expect.objectContaining({
        currentGuess: "floogt",
        errorMessage: "Not a valid word",
        board: ["", "", ""],
      })
    );
  });
});
