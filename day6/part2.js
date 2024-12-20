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

async function patrolPositions(map, { x, y }, dir, positions) {
  positions.push({ x, y });

  const inFront = {
    up: y - 1 >= 0 ? map[y - 1][x] : "e",
    right: x + 1 < cols ? map[y][x + 1] : "e",
    down: y + 1 < rows ? map[y + 1][x] : "e",
    left: x - 1 >= 0 ? map[y][x - 1] : "e",
  }[dir];

  if (inFront === "e") {
    return new Promise((resolve) => resolve(positions));
  }

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
        resolve(patrolPositions(map, nextPos[turn[dir]], turn[dir], positions)),
      ),
    );
  }

  return new Promise((resolve) =>
    process.nextTick(() =>
      resolve(patrolPositions(map, nextPos[dir], dir, positions)),
    ),
  );
}

async function patrol(map, { x, y }, dir, collisions) {
  const repeatingCollisions = collisions.some(({ x: _x, y: _y, dir: _dir }) => {
    return x === _x && y === _y && dir === _dir;
  });

  if (collisions.length > 0 && repeatingCollisions) {
    return new Promise((resolve) => resolve("l"));
  }

  const inFront = {
    up: y - 1 >= 0 ? map[y - 1][x] : "e",
    right: x + 1 < cols ? map[y][x + 1] : "e",
    down: y + 1 < rows ? map[y + 1][x] : "e",
    left: x - 1 >= 0 ? map[y][x - 1] : "e",
  }[dir];

  if (inFront === "e") return new Promise((resolve) => resolve("e"));

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
    collisions.push({ x, y, dir });
    return new Promise((resolve) =>
      process.nextTick(() =>
        resolve(patrol(map, nextPos[turn[dir]], turn[dir], collisions)),
      ),
    );
  }

  return new Promise((resolve) =>
    process.nextTick(() => resolve(patrol(map, nextPos[dir], dir, collisions))),
  );
}

const positions = await patrolPositions(map, startingPos, "up", [startingPos]);

const result = positions.map(async ({ x, y }) => {
  if (y === startingPos.y && x === startingPos.x) return false;
  if (map[y][x] === "#") return false;

  let obstacleMap = [...map.map((x) => [...x])];
  obstacleMap[y][x] = "#";

  const res = await patrol(obstacleMap, startingPos, "up", []);

  if (res === "l") return true;

  return false;
});

console.log(
  (await Promise.all(result.flatMap((x) => x))).filter((x) => !!x).length,
);
