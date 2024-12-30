import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8").trim();

const map = input.split("\n").map((x) => x.split("").map((x) => +x));

map.map((x) => console.log(x.join("")));

let acc = 0;
const findTrails = ({ row, col }, foundTrails = {}) => {
  const point = map[row][col];

  if (point === 9) {
    acc += 1;
    foundTrails[`${row}${col}`] = true;

    return foundTrails;
  }

  const up = row - 1 >= 0 ? map[row - 1][col] : null;
  const right = col + 1 < map[row].length ? map[row][col + 1] : null;
  const down = row + 1 < map.length ? map[row + 1][col] : null;
  const left = col - 1 >= 0 ? map[row][col - 1] : null;

  if (up && up - point === 1) {
    foundTrails = findTrails({ row: row - 1, col }, foundTrails);
  }
  if (right && right - point === 1) {
    foundTrails = findTrails({ row, col: col + 1 }, foundTrails);
  }
  if (down && down - point === 1) {
    foundTrails = findTrails({ row: row + 1, col }, foundTrails);
  }
  if (left && left - point === 1) {
    foundTrails = findTrails({ row, col: col - 1 }, foundTrails);
  }

  return foundTrails;
};

let score = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    const position = map[i][j];

    if (position === 0) {
      const trailScore = findTrails({ row: i, col: j });

      score += Object.keys(trailScore).length;
    }
  }
}

console.log(score);
console.log(acc);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
