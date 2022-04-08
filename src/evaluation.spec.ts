import { getEvaluations } from "./evaluation";

describe("evaluating the letter states for a guess", () => {
  it("evaluates a guess for a letter that does not exist", () => {
    const solution = "scare";
    const guess = "might";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[2]).toEqual({ letter: "g", evaluation: "absent" });
  });

  it("evaluates a guess for a letter in the correct position", () => {
    const solution = "scare";
    const guess = "plant";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[2]).toEqual({ letter: "a", evaluation: "correct" });
  });

  it("evaluates a guess for a letter that's present but in the wrong position", () => {
    const solution = "scare";
    const guess = "saint";
    const index = 1;
    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[1]).toEqual({ letter: "a", evaluation: "present" });
  });

  it("evaluates a guess for a letter that occurs more than once in the guess where the first occurrance is correct", () => {
    const solution = "scare";
    const guess = "slush";
    const index = 3;

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[3]).toEqual({ letter: "s", evaluation: "absent" });
  });

  it("evaluates a guess for a letter that occurs more than once in the solution", () => {
    const solution = "abbey";
    const guess = "babes";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[0]).toEqual({ letter: "b", evaluation: "present" });
    expect(evaluation[2]).toEqual({ letter: "b", evaluation: "correct" });
  });

  it("evaluates a guess for a letter that occurs more times in the guess than in the solution", () => {
    const solution = "abbey";
    const guess = "blobb";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation[4]).toEqual({ letter: "b", evaluation: "absent" });
  });
});
