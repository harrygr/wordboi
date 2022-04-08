const fs = require("fs");

const words = fs
  .readFileSync("words_alpha.txt")
  .toString()
  .split("\n")
  .map((word) => word.trim())
  .filter((word) => word.length === 6)
  .sort(() => Math.random() - Math.random());

fs.writeFileSync("six_letter_words.js", JSON.stringify(words));
