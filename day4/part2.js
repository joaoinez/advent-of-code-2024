import input, { test } from "./input.js";

const lines = input.split("\n");

const found = lines.reduce((total, line, i) => {
  const found = line.split("").reduce((acc, char, j) => {
    if (char !== "A") return acc;

    // Pattern 1
    const diagonal1 =
      i < lines.length - 1 && j < line.length - 1
        ? lines[i + 1][j + 1] === "S"
        : false;

    const diagonal2 = i > 0 && j > 0 ? lines[i - 1][j - 1] === "M" : false;

    const diagonal3 =
      i < lines.length - 1 && j > 0 ? lines[i + 1][j - 1] === "M" : false;

    const diagonal4 =
      i > 0 && j < line.length - 1 ? lines[i - 1][j + 1] === "S" : false;

    // Pattern 2
    const diagonal5 =
      i < lines.length - 1 && j < line.length - 1
        ? lines[i + 1][j + 1] === "M"
        : false;

    const diagonal6 = i > 0 && j > 0 ? lines[i - 1][j - 1] === "S" : false;

    const diagonal7 =
      i < lines.length - 1 && j > 0 ? lines[i + 1][j - 1] === "S" : false;

    const diagonal8 =
      i > 0 && j < line.length - 1 ? lines[i - 1][j + 1] === "M" : false;

    return (
      acc +
      +(
        (diagonal1 &&
          diagonal2 &&
          ((diagonal3 && diagonal4) || (diagonal7 && diagonal8))) ||
        (diagonal5 &&
          diagonal6 &&
          ((diagonal3 && diagonal4) || (diagonal7 && diagonal8)))
      )
    );
  }, 0);

  return total + found;
}, 0);

console.log(found);
