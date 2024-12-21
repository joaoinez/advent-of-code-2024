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

const turn = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

const getInFront = (map, x, y, dir) =>
  ({
    up: y - 1 >= 0 ? map[y - 1][x] : "e",
    right: x + 1 < cols ? map[y][x + 1] : "e",
    down: y + 1 < rows ? map[y + 1][x] : "e",
    left: x - 1 >= 0 ? map[y][x - 1] : "e",
  })[dir];

const getNextPos = (map, x, y, dir, collisions = []) => {
  const nextPos = {
    up: { x, y: y - 1, dir },
    right: { x: x + 1, y, dir },
    down: { x, y: y + 1, dir },
    left: { x: x - 1, y, dir },
  }[dir];

  if (map[nextPos.y][nextPos.x] === "#") {
    collisions.push({ x, y, dir });

    const inFront = getInFront(map, x, y, turn[dir]);

    if (inFront === "e") return null;

    return getNextPos(map, x, y, turn[dir], collisions);
  }

  return nextPos;
};

const getPatrolPath = () => {
  let x = startingPos.x;
  let y = startingPos.y;
  let dir = "up";
  let patrolPath = [];

  while (true) {
    map[y][x] = "X";

    if (x === 0 && y === 0) continue;

    if (!patrolPath.some(({ x: _x, y: _y }) => x === _x && y === _y)) {
      patrolPath.push({ x, y });
    }

    const inFront = getInFront(map, x, y, dir);

    if (inFront === "e") break;

    const nextPos = getNextPos(map, x, y, dir);

    if (!nextPos) break;

    x = nextPos.x;
    y = nextPos.y;
    dir = nextPos.dir;
  }

  return patrolPath;
};

const patrolPath = getPatrolPath();

map.map((n) => console.log(n.join("")));

let count = 0;

const getStuckPaths = () => {
  const stuckPaths = patrolPath.map(({ x: col, y: row }) => {
    let x = startingPos.x;
    let y = startingPos.y;
    let dir = "up";
    let collisions = [];

    let obstacleMap = [...map.map((n) => [...n])];
    obstacleMap[row][col] = "#";

    let looped = false;

    while (true) {
      const repeatingCollisions = collisions.some(
        ({ x: _x, y: _y, dir: _dir }) => x === _x && y === _y && dir === _dir,
      );

      if (repeatingCollisions) {
        looped = true;
        count += 1;

        break;
      }

      const inFront = getInFront(obstacleMap, x, y, dir);

      if (inFront === "e") break;

      const nextPos = getNextPos(obstacleMap, x, y, dir, collisions);

      if (!nextPos) break;

      x = nextPos.x;
      y = nextPos.y;
      dir = nextPos.dir;
    }

    return looped;
  });

  return stuckPaths;
};

getStuckPaths();

console.log(count);
