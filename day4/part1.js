import input, { test } from "./input.js";

const lines = input.split("\n");

const found = lines.reduce((total, line, i) => {
  const found = line.split("").reduce((acc, char, j) => {
    if (char !== "X") return acc;

    const horizontal =
      j < line.length - 3
        ? line[j + 1] === "M" && line[j + 2] === "A" && line[j + 3] === "S"
        : false;

    const reverseHorizontal =
      j > 2
        ? line[j - 1] === "M" && line[j - 2] === "A" && line[j - 3] === "S"
        : false;

    const vertical =
      i < lines.length - 3
        ? lines[i + 1][j] === "M" &&
          lines[i + 2][j] === "A" &&
          lines[i + 3][j] === "S"
        : false;

    const reverseVertical =
      i > 2
        ? lines[i - 1][j] === "M" &&
          lines[i - 2][j] === "A" &&
          lines[i - 3][j] === "S"
        : false;

    const diagonal1 =
      i < lines.length - 3 && j < line.length - 3
        ? lines[i + 1][j + 1] === "M" &&
          lines[i + 2][j + 2] === "A" &&
          lines[i + 3][j + 3] === "S"
        : false;

    const diagonal2 =
      i > 2 && j > 2
        ? lines[i - 1][j - 1] === "M" &&
          lines[i - 2][j - 2] === "A" &&
          lines[i - 3][j - 3] === "S"
        : false;

    const diagonal3 =
      i < lines.length - 3 && j > 2
        ? lines[i + 1][j - 1] === "M" &&
          lines[i + 2][j - 2] === "A" &&
          lines[i + 3][j - 3] === "S"
        : false;

    const diagonal4 =
      i > 2 && j < line.length - 3
        ? lines[i - 1][j + 1] === "M" &&
          lines[i - 2][j + 2] === "A" &&
          lines[i - 3][j + 3] === "S"
        : false;

    return (
      acc +
      +horizontal +
      +reverseHorizontal +
      +vertical +
      +reverseVertical +
      +diagonal1 +
      +diagonal2 +
      +diagonal3 +
      +diagonal4
    );
  }, 0);

  return total + found;
}, 0);

console.log(found);
