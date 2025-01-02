import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8")
  .trim()
  .split("\n")
  .map((x) => x.split(""));

let checkedPos = {};

const genRegion = (i, j) => {
  const key = `${i},${j}`;

  checkedPos[key] = true;

  const type = input[i][j];
  const up = i - 1 >= 0 ? input[i - 1][j] : null;
  const right = j + 1 < input[i].length ? input[i][j + 1] : null;
  const down = i + 1 < input.length ? input[i + 1][j] : null;
  const left = j - 1 >= 0 ? input[i][j - 1] : null;

  const adjacentUp = up === type;
  const adjacentRight = right === type;
  const adjacentDown = down === type;
  const adjacentLeft = left === type;

  const adjacentSides = [
    adjacentUp,
    adjacentRight,
    adjacentDown,
    adjacentLeft,
  ].filter((x) => x).length;

  let area = 1;
  let perimeter = 4;
  let points = 4;

  if (adjacentSides === 1) {
    points = 2;
  } else if (adjacentSides === 2) {
    if ((adjacentUp && adjacentDown) || (adjacentRight && adjacentLeft)) {
      points = 0;
    } else {
      if (
        input[i + (adjacentUp ? -1 : 1)][j + (adjacentRight ? 1 : -1)] === type
      ) {
        points = 1;
      } else {
        points = 2;
      }
    }
  } else if (adjacentSides === 3) {
    const corners = {
      up: () => [input[i + 1][j + 1] === type, input[i + 1][j - 1] === type],
      right: () => [input[i - 1][j - 1] === type, input[i + 1][j - 1] === type],
      down: () => [input[i - 1][j + 1] === type, input[i - 1][j - 1] === type],
      left: () => [input[i - 1][j + 1] === type, input[i + 1][j + 1] === type],
    };

    points =
      2 -
      corners[
        adjacentUp === false
          ? "up"
          : adjacentRight === false
            ? "right"
            : adjacentDown === false
              ? "down"
              : "left"
      ]().filter((x) => x).length;
  } else if (adjacentSides === 4) {
    points =
      4 -
      [
        input[i + 1][j + 1] === type,
        input[i - 1][j + 1] === type,
        input[i + 1][j - 1] === type,
        input[i - 1][j - 1] === type,
      ].filter((x) => x).length;
  }

  if (up === type) {
    perimeter -= 1;

    if (!checkedPos[`${i - 1},${j}`]) {
      const region = genRegion(i - 1, j);

      area += region.area;
      perimeter += region.perimeter;
      points += region.points;
    }
  }
  if (right === type) {
    perimeter -= 1;

    if (!checkedPos[`${i},${j + 1}`]) {
      const region = genRegion(i, j + 1);

      area += region.area;
      perimeter += region.perimeter;
      points += region.points;
    }
  }
  if (down === type) {
    perimeter -= 1;

    if (!checkedPos[`${i + 1},${j}`]) {
      const region = genRegion(i + 1, j);

      area += region.area;
      perimeter += region.perimeter;
      points += region.points;
    }
  }
  if (left === type) {
    perimeter -= 1;

    if (!checkedPos[`${i},${j - 1}`]) {
      const region = genRegion(i, j - 1);

      area += region.area;
      perimeter += region.perimeter;
      points += region.points;
    }
  }

  return { area, perimeter, points };
};

let regions = [];
let price = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    const key = `${i},${j}`;

    if (checkedPos[key]) continue;

    const region = genRegion(i, j);

    regions.push(region);
    price += region.area * region.points;
  }
}

console.log(regions);
console.log(price);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
