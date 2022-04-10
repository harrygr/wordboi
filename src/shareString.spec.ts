import { getShareString } from "./shareString";

describe("shareString", () => {
  it("generates a shareable string", () => {
    const board = ["player", "chance", "", "", "", ""];
    const solution = "chance";
    const shareString = getShareString(board, solution, 8);

    expect(shareString).toBe(`Wordboi #8 2/6 🎉

⬜️⬜️🟩⬜️🟧⬜️
🟩🟩🟩🟩🟩🟩

http://localhost`);
  });

  it("generates a shareable string for failure", () => {
    const board = ["player", "chance", "change", "stance", "glance", "france"];
    const solution = "places";
    const shareString = getShareString(board, solution, 8);

    expect(shareString).toBe(`Wordboi #8 X/6 💩

🟩🟩🟩⬜️🟩⬜️
🟧⬜️🟩⬜️⬜️🟧
🟧⬜️🟩⬜️⬜️🟧
🟧⬜️🟩⬜️🟧🟧
⬜️🟩🟩⬜️🟧🟧
⬜️⬜️🟩⬜️🟧🟧

http://localhost`);
  });
});
