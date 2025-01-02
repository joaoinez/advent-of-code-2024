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

  let area = 1;
  let perimeter = 4;

  if (up === type) {
    perimeter -= 1;

    if (!checkedPos[`${i - 1},${j}`]) {
      const region = genRegion(i - 1, j);

      area += region.area;
      perimeter += region.perimeter;
    }
  }
  if (right === type) {
    perimeter -= 1;

    if (!checkedPos[`${i},${j + 1}`]) {
      const region = genRegion(i, j + 1);

      area += region.area;
      perimeter += region.perimeter;
    }
  }
  if (down === type) {
    perimeter -= 1;

    if (!checkedPos[`${i + 1},${j}`]) {
      const region = genRegion(i + 1, j);

      area += region.area;
      perimeter += region.perimeter;
    }
  }
  if (left === type) {
    perimeter -= 1;

    if (!checkedPos[`${i},${j - 1}`]) {
      const region = genRegion(i, j - 1);

      area += region.area;
      perimeter += region.perimeter;
    }
  }

  return { area, perimeter };
};

let regions = [];
let price = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    const key = `${i},${j}`;

    if (checkedPos[key]) continue;

    const region = genRegion(i, j);

    regions.push(region);
    price += region.area * region.perimeter;
  }
}

console.log(regions);
console.log(price);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
