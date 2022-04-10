import { getShareString } from "./shareString";

describe("shareString", () => {
  it("generates a shareable string", () => {
    const board = ["player", "chance", "", "", "", ""];
    const solution = "chance";
    const shareString = getShareString(board, solution, 8);

    expect(shareString).toBe(`Wordboi #8 2/6

⬜️⬜️🟩⬜️🟧⬜️
🟩🟩🟩🟩🟩🟩`);
  });
});
