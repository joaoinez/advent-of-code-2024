import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").split("\n");

const map = input.slice(0, input.length - 1).map((x) => x.split(""));

const rows = map.length;

const cols = map[0].length;

const startingPos = map.reduce(
  (pos, row, i) => {
    const xPos = row.findIndex((x) => x === "^");

    return xPos > 0 ? { x: xPos, y: i } : pos;
  },
  { x: null, y: null },
);

async function patrol(map, { x, y }, dir) {
  map[y][x] = "X";

  const inFront = {
    up: y - 1 >= 0 ? map[y - 1][x] : "e",
    right: x + 1 < cols ? map[y][x + 1] : "e",
    down: y + 1 < rows ? map[y + 1][x] : "e",
    left: x - 1 >= 0 ? map[y][x - 1] : "e",
  }[dir];

  if (inFront === "e") return new Promise((resolve) => resolve(map));

  const turn = {
    up: "right",
    right: "down",
    down: "left",
    left: "up",
  };

  const nextPos = {
    up: { x, y: y - 1 },
    right: { x: x + 1, y },
    down: { x, y: y + 1 },
    left: { x: x - 1, y },
  };

  if (inFront === "#") {
    return new Promise((resolve) =>
      process.nextTick(() =>
        resolve(patrol(map, nextPos[turn[dir]], turn[dir])),
      ),
    );
  }

  return new Promise((resolve) =>
    process.nextTick(() => resolve(patrol(map, nextPos[dir], dir))),
  );
}

const result = await patrol(map, startingPos, "up");

// map.map((x) => console.log(x.join("")));
console.log(result.flatMap((x) => x).filter((x) => x === "X").length);
