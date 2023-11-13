import { EvalutionResult, getEvaluations } from "./evaluation";
import { describe, it, expect } from "vitest";

describe("evaluating the letter states for a guess", () => {
  it("evaluates a guess for a letter that does not exist", () => {
    const solution = "scare";
    const guess = "might";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toSatisfy<EvalutionResult[]>((result) =>
      result.every((v) => v.evaluation == "absent")
    );
  });

  it("evaluates a guess for a letter in the correct position", () => {
    const solution = "scare";
    const guess = "plant";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toMatchInlineSnapshot(`
      [
        {
          "evaluation": "absent",
          "letter": "p",
        },
        {
          "evaluation": "absent",
          "letter": "l",
        },
        {
          "evaluation": "correct",
          "letter": "a",
        },
        {
          "evaluation": "absent",
          "letter": "n",
        },
        {
          "evaluation": "absent",
          "letter": "t",
        },
      ]
    `);
  });

  it("evaluates a guess for a letter that's present but in the wrong position", () => {
    const solution = "scare";
    const guess = "saint";
    const index = 1;
    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toMatchInlineSnapshot(`
      [
        {
          "evaluation": "correct",
          "letter": "s",
        },
        {
          "evaluation": "present",
          "letter": "a",
        },
        {
          "evaluation": "absent",
          "letter": "i",
        },
        {
          "evaluation": "absent",
          "letter": "n",
        },
        {
          "evaluation": "absent",
          "letter": "t",
        },
      ]
    `);
  });

  it("evaluates a guess for a letter that occurs more than once in the guess where the first occurrance is correct", () => {
    const solution = "scare";
    const guess = "slush";
    const index = 3;

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toMatchInlineSnapshot(`
      [
        {
          "evaluation": "correct",
          "letter": "s",
        },
        {
          "evaluation": "absent",
          "letter": "l",
        },
        {
          "evaluation": "absent",
          "letter": "u",
        },
        {
          "evaluation": "absent",
          "letter": "s",
        },
        {
          "evaluation": "absent",
          "letter": "h",
        },
      ]
    `);
  });

  it("evaluates a guess for a letter that occurs more than once in the solution", () => {
    const solution = "abbey";
    const guess = "babes";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toMatchInlineSnapshot(`
      [
        {
          "evaluation": "present",
          "letter": "b",
        },
        {
          "evaluation": "present",
          "letter": "a",
        },
        {
          "evaluation": "correct",
          "letter": "b",
        },
        {
          "evaluation": "correct",
          "letter": "e",
        },
        {
          "evaluation": "absent",
          "letter": "s",
        },
      ]
    `);
  });

  it("evaluates a guess for a letter that occurs more times in the guess than in the solution", () => {
    const solution = "abbey";
    const guess = "blobb";

    const evaluation = getEvaluations(solution, guess);

    expect(evaluation).toMatchInlineSnapshot(`
      [
        {
          "evaluation": "present",
          "letter": "b",
        },
        {
          "evaluation": "absent",
          "letter": "l",
        },
        {
          "evaluation": "absent",
          "letter": "o",
        },
        {
          "evaluation": "present",
          "letter": "b",
        },
        {
          "evaluation": "absent",
          "letter": "b",
        },
      ]
    `);
  });
});
